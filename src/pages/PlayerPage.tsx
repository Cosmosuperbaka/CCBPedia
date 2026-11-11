// 选手详情页：页头档案 + 赛事履历时间线 + 单挑战绩 + 工作人员记录
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SERIES, getPlayer, yearOf, type PlayerEntry, type PlayerProfile } from '../data';
import { aliasesOf } from '../data/players';
import { formatDate } from '../lib/match';
import { Avatar, PlayerChip, PlayerList, RankBadge, Reveal } from '../components/ui';
import type { Tournament } from '../data/types';
import './PlayerPage.css';

const tournamentPath = (t: Tournament) => `/tournaments/${t.id}`;

/** 赛事日期：有说明文字时优先显示说明 */
const dateOf = (t: Tournament) => t.dateNote ?? formatDate(t.start, t.end);

function BackLink() {
  return (
    <Link to="/players" className="link player-page__back">
      ← 全部选手
    </Link>
  );
}

// ───────────────────────── 页头 ─────────────────────────

function Stat({ value, label }: { value: ReactNode; label: ReactNode }) {
  return (
    <div className="stat">
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

function Hero({ p }: { p: PlayerProfile }) {
  const aliases = aliasesOf(p.name);
  // 取最近一个年度的积分榜数据
  const season = [...p.seasons].sort((a, b) => b.year - a.year)[0];

  return (
    <header className="player-page__hero">
      <Avatar name={p.name} size={96} className="player-page__avatar" />
      <div className="player-page__intro">
        <p className="eyebrow">PLAYER</p>
        <h1 className="page-title player-page__name">{p.name}</h1>
        {aliases.length > 0 && <p className="player-page__aliases">记录中也写作：{aliases.join('、')}</p>}
        <div className="player-page__stats">
          <Stat value={p.titles} label="冠军" />
          <Stat value={p.podiums} label="领奖台" />
          <Stat value={p.entries.length} label="参赛届数" />
          {season && season.rank > 0 && (
            <Stat
              value={season.points}
              label={
                <>
                  {season.year} 积分 · 年度第 <span className="num">{season.rank}</span>
                </>
              }
            />
          )}
          {season?.bestRank != null && <Stat value={`TOP ${season.bestRank}`} label={`${season.year} 年度最佳`} />}
        </div>
      </div>
    </header>
  );
}

// ───────────────────────── 赛事履历 ─────────────────────────

function EntryItem({ e, delay }: { e: PlayerEntry; delay: number }) {
  const t = e.tournament;
  const pl = e.placement;
  return (
    <Reveal as="li" delay={delay} className="player-page__entry">
      <div className="player-page__place">
        {pl ? (
          <>
            <RankBadge rank={pl.rank} size={32} />
            <span className={`player-page__place-label ${pl.rank <= 3 ? 'is-podium' : ''}`}>{pl.label}</span>
          </>
        ) : (
          <>
            <span className="player-page__dot" aria-hidden />
            <span className="player-page__place-label">参赛</span>
          </>
        )}
      </div>

      <div className="player-page__main">
        <div className="player-page__line">
          <Link to={tournamentPath(t)} className="player-page__event serif">
            {t.name}
          </Link>
          {t.status === 'aborted' && <span className="tag tag--warn">中途终止</span>}
        </div>
        <div className="player-page__line player-page__meta">
          <span className="player-page__date">{dateOf(t)}</span>
          <span className="tag">{SERIES[t.series].name}</span>
          {e.awards.map((a) => (
            <span key={a} className={`tag ${a === 'MVP' ? 'tag--gold' : 'tag--accent'}`}>
              {a}
            </span>
          ))}
        </div>
        {e.team && (
          <div className="player-page__line player-page__team">
            <span className="player-page__team-name">{e.team}</span>
            {e.teammates.length > 0 && (
              <>
                <span className="player-page__team-sep">· 队友：</span>
                <PlayerList names={e.teammates} size={20} />
              </>
            )}
          </div>
        )}
        {pl?.note && <p className="player-page__note">{pl.note}</p>}
      </div>

      <div className="player-page__score">
        {pl?.score != null && (
          <>
            <span className="num">{pl.score}</span>
            <span className="player-page__unit">分</span>
          </>
        )}
      </div>
    </Reveal>
  );
}

function History({ entries }: { entries: PlayerEntry[] }) {
  // entries 已按时间倒序，顺序分组即可
  const groups: { year: number; items: PlayerEntry[] }[] = [];
  for (const e of entries) {
    const y = yearOf(e.tournament);
    const last = groups[groups.length - 1];
    if (last && last.year === y) last.items.push(e);
    else groups.push({ year: y, items: [e] });
  }

  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">赛事履历</h2>
        <span className="section__desc">
          共 <span className="num">{entries.length}</span> 届
        </span>
      </div>
      <div className="player-page__years">
        {groups.map((g) => (
          <div key={g.year} className="player-page__year">
            <h3 className="player-page__year-label num">{g.year}</h3>
            <ol className="player-page__entries">
              {g.items.map((e, i) => (
                <EntryItem key={e.tournament.id} e={e} delay={Math.min(i * 0.04, 0.3)} />
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────────────────────── 单挑战绩 ─────────────────────────

function Duels({ p }: { p: PlayerProfile }) {
  const wins = p.duels.filter((d) => d.win).length;
  const losses = p.duels.filter((d) => !d.win && d.own < d.opp).length;
  const decided = wins + losses;
  const rate = decided > 0 ? Math.round((wins / decided) * 100) : 0;
  // 最近的对局在前，与履历一致
  const list = [...p.duels].reverse();

  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">单挑战绩</h2>
        <span className="section__desc">
          共 <span className="num">{p.duels.length}</span> 场
        </span>
      </div>
      <div className="player-page__stats player-page__duel-sum">
        <Stat value={`${wins}-${losses}`} label="胜 - 负" />
        <Stat value={`${rate}%`} label="胜率" />
      </div>
      <Reveal>
        <ul className="card player-page__duels">
          {list.map((d, i) => {
            const draw = d.own === d.opp;
            return (
              <li key={i} className="player-page__duel">
                <span className="player-page__duel-when">
                  <span className="num">{d.date}</span>
                  <span className="player-page__duel-div"> · {d.division}</span>
                </span>
                <span className="player-page__duel-opp">
                  <PlayerChip name={d.opponent} size={22} />
                </span>
                <span className={`player-page__duel-score num ${d.win ? 'is-win' : draw ? '' : 'is-lose'}`}>
                  {d.own} : {d.opp}
                </span>
                <span className="player-page__duel-result">
                  {d.win ? (
                    <span className="tag tag--win">胜</span>
                  ) : draw ? (
                    <span className="player-page__duel-flat">平</span>
                  ) : (
                    <span className="player-page__duel-lose">负</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}

// ───────────────────────── 工作人员 ─────────────────────────

function Staff({ p }: { p: PlayerProfile }) {
  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">工作人员</h2>
      </div>
      <ul className="player-page__staff">
        {p.staff.map((s) => (
          <li key={`${s.tournament.id}|${s.role}`}>
            <Link to={tournamentPath(s.tournament)} className="link">
              {s.tournament.name}
            </Link>
            <span className="faint"> · {s.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ───────────────────────── 页面 ─────────────────────────

export function PlayerPage() {
  const { name } = useParams();
  const p = getPlayer(name);

  if (!p) {
    return (
      <div className="page container">
        <div className="empty">
          <p>没有找到这位选手的记录</p>
          <p className="player-page__empty-back">
            <BackLink />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <Hero p={p} />
      {p.entries.length > 0 && <History entries={p.entries} />}
      {p.duels.length > 0 && <Duels p={p} />}
      {p.staff.length > 0 && <Staff p={p} />}
      <footer className="player-page__foot">
        <BackLink />
      </footer>
    </div>
  );
}
