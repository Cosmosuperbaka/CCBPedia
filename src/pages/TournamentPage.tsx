// 赛事详情页：概况 → 最终名次 → 赛制 → 各阶段 → 赛评 → 名单
import { useEffect, useId, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SERIES, getTournament, tournaments } from '../data';
import type { Placement, Tournament } from '../data/types';
import { formatDate } from '../lib/match';
import { tournamentDate } from '../components/TournamentCard';
import { STAGE_KIND_LABEL, StageView } from '../components/stages/StageView';
import { PlayerChip, PlayerList, RankBadge, Reveal, Tabs, type TabItem } from '../components/ui';
import './TournamentPage.css';

const BASE = import.meta.env.BASE_URL;

/** 页内导航：点击滚动到对应区块，滚动时高亮当前区块 */
function useSectionSpy(ids: string[]): [string, (id: string) => void] {
  const [active, setActive] = useState(ids[0] ?? '');
  const key = ids.join('|');

  useEffect(() => {
    const list = key.split('|').filter(Boolean);
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = list[0] ?? '';
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  const go = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return [active, go];
}

function PlacementCard({ p, mode }: { p: Placement; mode: Tournament['mode'] }) {
  return (
    <div className={`podium__card card podium__card--${p.rank}`}>
      <div className="podium__rank">
        <RankBadge rank={p.rank} size={34} />
        <span className="podium__label">{p.label}</span>
        {p.score != null && (
          <span className="podium__score num">
            {p.score}
            <small>分</small>
          </span>
        )}
      </div>
      {mode === 'team' ? (
        <>
          {p.team && <p className="podium__team serif">{p.team}</p>}
          <PlayerList names={p.players} size={24} />
        </>
      ) : (
        <p className="podium__solo serif">
          {p.players.map((n) => (
            <PlayerChip key={n} name={n} size={40} />
          ))}
        </p>
      )}
      {p.note && <p className="podium__note">{p.note}</p>}
    </div>
  );
}

function Standings({ t }: { t: Tournament }) {
  const top = t.placements.filter((p) => p.rank <= 3);
  const rest = t.placements.filter((p) => p.rank > 3);

  if (t.placements.length === 0) {
    return (
      <div className="t-notice card">
        <p className="t-notice__title serif">{t.status === 'aborted' ? '比赛中途终止，未决出名次' : '本赛事不设最终名次'}</p>
        {t.notes?.map((n, i) => (
          <p key={i} className="muted">
            {n}
          </p>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="podium">
        {top.map((p, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <PlacementCard p={p} mode={t.mode} />
          </Reveal>
        ))}
      </div>

      {rest.length > 0 && (
        <Reveal className={`rest card ${rest.length === 1 ? 'rest--single' : ''}`} delay={0.1}>
          {rest.map((p, i) => (
            <div key={i} className="rest__row">
              <span className="rest__rank num">{p.rank}</span>
              <span className="rest__label">{p.label}</span>
              <span className="rest__who">
                {t.mode === 'team' && p.team && <strong className="rest__team">{p.team}</strong>}
                <PlayerList names={p.players} size={22} />
                {p.note && <span className="rest__note">{p.note}</span>}
              </span>
              {p.score != null && <span className="rest__score num">{p.score}</span>}
            </div>
          ))}
        </Reveal>
      )}

      {t.awards && t.awards.length > 0 && (
        <Reveal className="awards" delay={0.14}>
          {(['MVP', 'EVP'] as const).map((kind) => {
            const list = t.awards!.filter((a) => a.award === kind);
            if (list.length === 0) return null;
            return (
              <div key={kind} className="awards__group">
                <span className={`tag ${kind === 'MVP' ? 'tag--gold' : 'tag--accent'}`}>{kind}</span>
                <PlayerList names={list.map((a) => a.player)} size={24} />
              </div>
            );
          })}
        </Reveal>
      )}
    </>
  );
}

export function TournamentPage() {
  const { id } = useParams();
  const t = getTournament(id);
  const tabsId = useId();

  const sections = useMemo<TabItem<string>[]>(() => {
    if (!t) return [];
    const list: TabItem<string>[] = [{ id: 'sec-result', label: '最终名次' }];
    if (t.rules?.length || t.teams?.length) list.push({ id: 'sec-format', label: t.teams?.length ? '赛制与队伍' : '赛制' });
    t.stages.forEach((s, i) => list.push({ id: `sec-stage-${i}`, label: s.title }));
    if (t.reviews?.length) list.push({ id: 'sec-reviews', label: '赛评' });
    if (t.participants?.length || t.staff?.length) list.push({ id: 'sec-people', label: '名单' });
    return list;
  }, [t]);

  const [active, go] = useSectionSpy(sections.map((s) => s.id));

  if (!t) {
    return (
      <div className="page container">
        <div className="empty">
          <p>没有找到这届赛事。</p>
          <Link className="link" to="/tournaments">
            ← 返回全部赛事
          </Link>
        </div>
      </div>
    );
  }

  // 同系列的上一届 / 下一届
  const siblings = tournaments.filter((x) => x.series === t.series).sort((a, b) => a.edition - b.edition);
  const idx = siblings.findIndex((x) => x.id === t.id);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];

  return (
    <div className="page container t-page">
      <Link className="t-page__back link" to="/tournaments">
        ← 全部赛事
      </Link>

      <header className={`t-hero ${t.cover ? 't-hero--cover' : ''}`}>
        <div className="t-hero__text">
          <p className="t-hero__tags">
            <span className="tag tag--accent">{SERIES[t.series].name}</span>
            <span className="tag">{t.mode === 'team' ? '团队赛' : '个人赛'}</span>
            {t.status === 'aborted' && <span className="tag tag--warn">中途终止</span>}
          </p>
          <h1 className="t-hero__title serif">{t.name}</h1>
          <p className="t-hero__date num">{tournamentDate(t)}</p>
          <p className="t-hero__tagline">{t.tagline}</p>
          <ul className="t-hero__format">
            {t.formatTags.map((f) => (
              <li key={f} className="tag tag--outline">
                {f}
              </li>
            ))}
          </ul>
        </div>
        {t.cover && (
          <a className="t-hero__cover" href={`${BASE}${t.cover}`} target="_blank" rel="noreferrer" title="查看海报大图">
            <img src={`${BASE}${t.cover}`} alt={`${t.name} 冠军海报`} loading="lazy" />
          </a>
        )}
      </header>

      {sections.length > 1 && (
        <nav className="t-nav" aria-label="页内导航">
          <Tabs items={sections} value={active} onChange={go} layoutId={tabsId} />
        </nav>
      )}

      <section id="sec-result" className="section t-section">
        <div className="section__head">
          <h2 className="section__title">最终名次</h2>
        </div>
        <Standings t={t} />
        {t.placements.length > 0 &&
          t.notes?.map((n, i) => (
            <p key={i} className="t-footnote">
              {n}
            </p>
          ))}
      </section>

      {(t.rules?.length || t.teams?.length) && (
        <section id="sec-format" className="section t-section">
          <div className="section__head">
            <h2 className="section__title">{t.teams?.length ? '赛制与队伍' : '赛制'}</h2>
          </div>
          <div className={`t-format ${t.rules?.length && t.teams?.length ? 't-format--split' : ''}`}>
            {t.rules && t.rules.length > 0 && (
              <Reveal className="card t-rules">
                <ol>
                  {t.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ol>
              </Reveal>
            )}
            {t.teams && t.teams.length > 0 && (
              <Reveal className="card t-teams" delay={0.06}>
                {t.teams.map((team) => (
                  <div key={team.name} className="t-teams__row">
                    <span className="t-teams__name">
                      {team.name}
                      {team.alias && <small>{team.alias}</small>}
                    </span>
                    <PlayerList names={team.players} size={22} />
                  </div>
                ))}
              </Reveal>
            )}
          </div>
        </section>
      )}

      {t.stages.map((s, i) => (
        <section key={i} id={`sec-stage-${i}`} className="section t-section">
          <div className="section__head">
            <h2 className="section__title">
              <span className="t-stage-no num">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </h2>
            <span className="section__desc">
              {STAGE_KIND_LABEL[s.kind]}
              {s.date ? ` · ${formatDate(s.date)}` : ''}
            </span>
          </div>
          {/* 单循环视图自己会显示说明文字 */}
          {s.desc && s.kind !== 'roundRobin' && <p className="t-stage-desc">{s.desc}</p>}
          <StageView stage={s} mode={t.mode} />
        </section>
      ))}

      {t.reviews && t.reviews.length > 0 && (
        <section id="sec-reviews" className="section t-section">
          <div className="section__head">
            <h2 className="section__title">赛评</h2>
            <span className="section__desc">来自主办方的场次点评</span>
          </div>
          <div className="t-reviews">
            {t.reviews.map((r, i) => (
              <Reveal key={i} className="card t-review" delay={Math.min(i * 0.05, 0.2)}>
                <p className="t-review__head">
                  <strong className="serif">{r.title}</strong>
                  {r.score && <span className="num">{r.score}</span>}
                </p>
                <p className="t-review__body">{r.body}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {(t.participants?.length || t.staff?.length) && (
        <section id="sec-people" className="section t-section">
          <div className="section__head">
            <h2 className="section__title">名单</h2>
          </div>
          <Reveal className="card t-people">
            {t.staff?.map((g) => (
              <div key={g.role} className="t-people__group">
                <p className="eyebrow">{g.role}</p>
                <PlayerList names={g.names} size={24} />
              </div>
            ))}
            {t.participants && t.participants.length > 0 && (
              <div className="t-people__group">
                <p className="eyebrow">报名名单 · {t.participants.length} 人</p>
                <PlayerList names={t.participants} size={24} />
              </div>
            )}
          </Reveal>
        </section>
      )}

      {(prev || next) && (
        <nav className="t-siblings" aria-label="同系列赛事">
          {prev ? (
            <Link to={`/tournaments/${prev.id}`} className="t-siblings__link card card--hover">
              <span className="faint">← 上一届</span>
              <strong className="serif">{prev.name}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/tournaments/${next.id}`} className="t-siblings__link t-siblings__link--next card card--hover">
              <span className="faint">下一届 →</span>
              <strong className="serif">{next.name}</strong>
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
