// 年度榜单页：年度最佳选手、年度积分榜（含积分构成）、积分细则、年度荣誉
import { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { getTournament, SERIES } from '../data';
import { resolvePlayer } from '../data/players';
import { seasons } from '../data/rankings';
import type { Award, SeasonRanking, SeriesId } from '../data/types';
import { Avatar, PlayerChip, RankBadge, Reveal, Tabs, type TabItem } from '../components/ui';
import './RankingsPage.css';

/** 积分构成各段的强调色浓度（按赛事在 events 中的顺序递减） */
const MIX = [85, 70, 56, 44, 34, 26, 20];
const mixOf = (i: number): number => MIX[Math.min(i, MIX.length - 1)];

/** 带有色块浓度变量的内联样式 */
const mixStyle = (i: number): CSSProperties => ({ ['--mix' as string]: `${mixOf(i)}%` });

/** 赛事名：优先取赛事数据；查不到时由 id 推出系列名 */
function eventName(id: string): string {
  const t = getTournament(id);
  if (t) return t.name;
  const [series, edition] = id.split('-');
  if (series in SERIES) {
    const name = SERIES[series as SeriesId].name;
    return edition ? `${name} #${edition}` : name;
  }
  return id;
}

/** 赛事链接：赛事存在时链接到赛事页，否则只输出文本 */
function EventLink({ id, className = '' }: { id: string; className?: string }) {
  const name = eventName(id);
  if (!getTournament(id)) return <span className={className}>{name}</span>;
  return (
    <Link to={`/tournaments/${id}`} className={`link ${className}`}>
      {name}
    </Link>
  );
}

/** 一名选手在某届赛事中的得分 */
interface Part {
  event: string;
  /** 赛事在 events 中的序号，决定色块浓度 */
  index: number;
  points: number;
  label?: string;
  awards?: Award[];
}

/** 名次 + 奖项，如「冠军 +MVP」 */
function partLabel(p: Part): string {
  const award = p.awards?.length ? p.awards.map((a) => `+${a}`).join(' ') : '';
  return [p.label, award].filter(Boolean).join(' ');
}

/** 按选手（归一后的名字）汇总各届赛事得分 */
function partsByPlayer(season: SeasonRanking): Map<string, Part[]> {
  const map = new Map<string, Part[]>();
  season.events.forEach((ev, index) => {
    for (const e of ev.entries) {
      const key = resolvePlayer(e.player);
      const list = map.get(key) ?? [];
      list.push({ event: ev.tournament, index, points: e.points, label: e.label, awards: e.awards });
      map.set(key, list);
    }
  });
  return map;
}

// ───────────────────────── 年度最佳选手 ─────────────────────────

function BestPlayers({ season }: { season: SeasonRanking }) {
  const { title, list } = season.bestPlayers;
  if (list.length === 0) return null;
  const top = list.slice(0, 3);
  const rest = list.slice(3);
  const boardRow = (name: string) => {
    const key = resolvePlayer(name);
    return season.board.find((r) => resolvePlayer(r.player) === key);
  };

  return (
    <section className="section rankings-page__best">
      <Reveal>
        <header className="section__head">
          <div>
            {title && <p className="eyebrow rankings-page__eyebrow">{title}</p>}
            <h2 className="section__title">年度最佳选手 TOP {list.length}</h2>
          </div>
          <p className="section__desc">年度评选结果，与积分榜相互独立</p>
        </header>
      </Reveal>

      <ol className="rankings-page__podium">
        {top.map((name, i) => {
          const row = boardRow(name);
          return (
            <Reveal
              key={name}
              as="li"
              delay={i * 0.06}
              className={`card rankings-page__pick ${i === 0 ? 'rankings-page__pick--first' : ''}`}
            >
              <div className="rankings-page__pick-top">
                <Avatar name={name} size={72} />
                <RankBadge rank={i + 1} size={30} />
              </div>
              <div className="rankings-page__pick-body">
                <PlayerChip name={name} plain className="serif rankings-page__pick-name" />
                {row && (
                  <dl className="rankings-page__pick-stats">
                    <div>
                      <dt>年度积分</dt>
                      <dd className="num">{row.points}</dd>
                    </div>
                    <div>
                      <dt>积分榜</dt>
                      <dd>
                        第 <span className="num">{row.rank}</span> 名
                      </dd>
                    </div>
                  </dl>
                )}
              </div>
            </Reveal>
          );
        })}
      </ol>

      {rest.length > 0 && (
        <Reveal className="card rankings-page__rest">
          <ol className="rankings-page__rest-list">
            {rest.map((name, i) => (
              <li key={name} className="rankings-page__rest-item">
                <span className="num rankings-page__rest-rank">{i + 4}</span>
                <PlayerChip name={name} />
              </li>
            ))}
          </ol>
        </Reveal>
      )}
    </section>
  );
}

// ───────────────────────── 年度积分榜 ─────────────────────────

/** 积分构成横条：进入视口时从左向右生长 */
function PartsBar({ parts, ratio }: { parts: Part[]; ratio: number }) {
  const reduce = useReducedMotion();
  const w = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  return (
    <motion.span
      className="rankings-page__bar"
      initial={reduce ? { width: w } : { width: 0 }}
      whileInView={{ width: w }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {parts.map((p) => (
        <span
          key={p.event}
          className="rankings-page__seg"
          style={{ ...mixStyle(p.index), flexGrow: p.points }}
          title={`${eventName(p.event)} · ${partLabel(p) || '得分'} · +${p.points}`}
        />
      ))}
    </motion.span>
  );
}

function Board({ season }: { season: SeasonRanking }) {
  const parts = useMemo(() => partsByPlayer(season), [season]);
  if (season.board.length === 0) return null;
  const max = Math.max(...season.board.map((r) => r.points), 1);

  return (
    <section className="section">
      <Reveal>
        <header className="section__head">
          <h2 className="section__title">年度积分榜</h2>
          <p className="section__desc">TOP {season.board.length} · 按各届赛事名次与个人奖项累计</p>
        </header>
      </Reveal>

      <Reveal className="card rankings-page__board">
        {season.events.length > 0 && (
          <ul className="rankings-page__legend" aria-label="图例">
            {season.events.map((ev, i) => (
              <li key={ev.tournament} className="rankings-page__legend-item">
                <span className="rankings-page__swatch" style={mixStyle(i)} aria-hidden />
                {eventName(ev.tournament)}
              </li>
            ))}
          </ul>
        )}

        <div className="table-wrap">
          <table className="data-table rankings-page__table">
            <colgroup>
              <col className="rankings-page__col-rank" />
              <col className="rankings-page__col-player" />
              <col className="rankings-page__col-points" />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th className="col-center">#</th>
                <th>选手</th>
                <th className="col-num">积分</th>
                <th className="rankings-page__th-parts">构成</th>
              </tr>
            </thead>
            <tbody>
              {season.board.map((row) => {
                const list = parts.get(resolvePlayer(row.player)) ?? [];
                return (
                  <tr key={row.player}>
                    <td className="col-center">
                      {row.rank <= 3 ? (
                        <RankBadge rank={row.rank} />
                      ) : (
                        <span className="num rankings-page__rank">{row.rank}</span>
                      )}
                    </td>
                    <td className="rankings-page__player">
                      <PlayerChip name={row.player} />
                    </td>
                    <td className="col-num">
                      <span className="num rankings-page__points">{row.points}</span>
                    </td>
                    <td className="rankings-page__parts">
                      {list.length > 0 && (
                        <>
                          <PartsBar parts={list} ratio={row.points / max} />
                          <p className="rankings-page__parts-text">
                            {list.map((p, i) => {
                              const label = partLabel(p);
                              return (
                                <span key={p.event} className="rankings-page__part">
                                  {i > 0 && <span className="rankings-page__dot"> · </span>}
                                  <EventLink id={p.event} />
                                  {label && ` ${label}`} <span className="num">{p.points}</span>
                                </span>
                              );
                            })}
                          </p>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}

// ───────────────────────── 积分细则 ─────────────────────────

function Rules({ season }: { season: SeasonRanking }) {
  if (season.events.length === 0) return null;
  return (
    <section className="section">
      <Reveal>
        <header className="section__head">
          <h2 className="section__title">积分细则</h2>
          <p className="section__desc">共 {season.events.length} 届赛事计入</p>
        </header>
      </Reveal>
      <Reveal>
        <dl className="rankings-page__rules">
          {season.events.map((ev, i) => (
            <div key={ev.tournament} className="rankings-page__rule">
              <dt className="rankings-page__rule-name">
                <span className="rankings-page__swatch" style={mixStyle(i)} aria-hidden />
                <EventLink id={ev.tournament} />
              </dt>
              <dd className="rankings-page__rule-text">{ev.rules}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

// ───────────────────────── 年度荣誉 ─────────────────────────

function Honors({ season }: { season: SeasonRanking }) {
  if (season.honors.length === 0) return null;
  return (
    <section className="section">
      <Reveal>
        <header className="section__head">
          <h2 className="section__title">年度荣誉</h2>
        </header>
      </Reveal>
      <ul className="grid grid--4 rankings-page__honors">
        {season.honors.map((h, i) => (
          <Reveal key={h.title} as="li" delay={i * 0.05} className="card rankings-page__honor">
            <p className="rankings-page__honor-title">{h.title}</p>
            <p className="serif rankings-page__honor-winner">{h.winner}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

// ───────────────────────── 页面 ─────────────────────────

export function RankingsPage() {
  const ordered = useMemo(() => [...seasons].sort((a, b) => b.year - a.year), []);
  const [year, setYear] = useState<string>(() => String(ordered[0]?.year ?? ''));
  const season = ordered.find((s) => String(s.year) === year) ?? ordered[0];
  const reduce = useReducedMotion();

  const items: TabItem<string>[] = ordered.map((s) => ({ id: String(s.year), label: `${s.year} 赛季` }));

  return (
    <div className="page container rankings-page">
      <header className="page-head">
        <p className="eyebrow page-head__eyebrow">RANKINGS</p>
        <h1 className="page-title">年度榜单</h1>
        <p className="page-lead">
          每个赛季的两条主线：由各届赛事名次与个人奖项累计而成的年度积分，以及独立评选的年度最佳选手；另附积分细则与年度荣誉。
        </p>
      </header>

      {season ? (
        <>
          <div className="toolbar">
            <Tabs items={items} value={year} onChange={setYear} layoutId="rankings-year" />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={season.year}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <BestPlayers season={season} />
              <Board season={season} />
              <Rules season={season} />
              <Honors season={season} />
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <p className="empty">暂无榜单数据</p>
      )}
    </div>
  );
}
