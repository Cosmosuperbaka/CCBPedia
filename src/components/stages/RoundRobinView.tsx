// 单循环视图：上方积分榜，下方交叉对阵表（N×N 矩阵）。
// 矩阵的行、列都按积分榜顺序排列；单元格读作「行队得分 : 列队得分」。
import { useMemo, useState } from 'react';
import type { Match, RoundRobinStage, RoundRobinStanding, Side } from '../../data/types';
import { formatDate, gameWinner, matchWinner, seriesScore, type SideKey } from '../../lib/match';
import { PlayerChip, PlayerList, Reveal, StatusTag } from '../ui';
import './RoundRobinView.css';

export interface RoundRobinViewProps {
  stage: RoundRobinStage;
  mode: 'solo' | 'team';
}

/** 单元格结果（站在行队视角） */
type Outcome = 'win' | 'lose' | 'none';

interface CellView {
  /** score：有比分；text：弃赛等文字结果；empty：未找到比赛 */
  kind: 'score' | 'text' | 'empty';
  /** 行队得分 */
  mine?: number;
  /** 列队得分 */
  theirs?: number;
  text?: string;
  outcome: Outcome;
  title?: string;
}

const EMPTY_CELL: CellView = { kind: 'empty', outcome: 'none' };

/** 两队之间的键（有方向：行队 → 列队） */
const pairKey = (r: string, c: string) => `${r}\u0000${c}`;

const flip = (s: SideKey): SideKey => (s === 'a' ? 'b' : 'a');

/** 把一场比赛换算成「行队视角」的单元格内容；side 为行队在该场中的一方 */
function toCell(m: Match, side: SideKey): CellView {
  const w = matchWinner(m);
  const outcome: Outcome = w == null ? 'none' : w === side ? 'win' : 'lose';
  const title = m.date ? formatDate(m.date) : undefined;
  const other = flip(side);

  // 特殊结果：弃赛 / 对手人员不齐
  if (m.result === 'forfeit') {
    const text = outcome === 'win' ? '对手弃赛' : '弃赛';
    return { kind: 'text', text, outcome, title };
  }
  if (m.result === 'walkover') {
    const text = outcome === 'win' ? '不战而胜' : outcome === 'lose' ? '人员不齐' : '未赛';
    return { kind: 'text', text, outcome, title };
  }

  // 单局：直接显示小局比分；多局：显示大比分
  if (m.games.length === 1) {
    const g = m.games[0];
    if (g.a != null && g.b != null) {
      const gw = gameWinner(g);
      const gOutcome: Outcome = w != null ? outcome : gw == null ? 'none' : gw === side ? 'win' : 'lose';
      const ot = g.ot ? `加时 ${side === 'a' ? g.ot[0] : g.ot[1]}:${side === 'a' ? g.ot[1] : g.ot[0]}` : undefined;
      return {
        kind: 'score',
        mine: g[side],
        theirs: g[other],
        outcome: gOutcome,
        title: [title, ot].filter(Boolean).join(' · ') || undefined,
      };
    }
  } else if (m.games.length > 1) {
    const [a, b] = seriesScore(m);
    return { kind: 'score', mine: side === 'a' ? a : b, theirs: side === 'a' ? b : a, outcome, title };
  }

  // 没有比分但已知胜负
  if (outcome !== 'none') return { kind: 'text', text: outcome === 'win' ? '胜' : '负', outcome, title };
  return { kind: 'empty', outcome: 'none', title };
}

/** 建立「行队 → 列队」到单元格内容的索引，两个方向各存一份 */
function buildCells(matches: Match[]): Map<string, CellView> {
  const map = new Map<string, CellView>();
  for (const m of matches) {
    const a = m.a.name;
    const b = m.b.name;
    if (!map.has(pairKey(a, b))) map.set(pairKey(a, b), toCell(m, 'a'));
    if (!map.has(pairKey(b, a))) map.set(pairKey(b, a), toCell(m, 'b'));
  }
  return map;
}

// ───────────────────────── 积分榜 ─────────────────────────

interface StandingsProps {
  standings: RoundRobinStanding[];
  teams: Side[];
  mode: 'solo' | 'team';
}

function Standings({ standings, teams, mode }: StandingsProps) {
  const rosters = useMemo(() => new Map(teams.map((t) => [t.name, t.players])), [teams]);
  const hasStatus = standings.some((s) => s.status != null);
  const hasNote = standings.some((s) => !!s.note);

  return (
    <div className="round-robin__scroll">
      <table className="round-robin__standings">
        <thead>
          <tr>
            <th scope="col" className="round-robin__col-rank">
              名次
            </th>
            <th scope="col" className="round-robin__col-team">
              {mode === 'team' ? '队伍' : '选手'}
            </th>
            <th scope="col" className="round-robin__col-record">
              胜 - 负
            </th>
            {hasStatus && (
              <th scope="col" className="round-robin__col-status">
                状态
              </th>
            )}
            {hasNote && (
              <th scope="col" className="round-robin__col-note">
                备注
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const dim = s.status === 'out';
            const players = rosters.get(s.name);
            const delay = i * 0.04;
            return (
              <tr key={s.name} className={dim ? 'round-robin__row--dim' : undefined}>
                <td className="round-robin__col-rank">
                  <Reveal delay={delay}>
                    <span className="round-robin__rank num">{i + 1}</span>
                  </Reveal>
                </td>
                <td className="round-robin__col-team">
                  <Reveal delay={delay} className="round-robin__who">
                    {mode === 'team' ? (
                      <>
                        <span className="round-robin__team">{s.name}</span>
                        {players && players.length > 0 && <PlayerList names={players} dim={dim} />}
                      </>
                    ) : (
                      <PlayerChip name={s.name} dim={dim} />
                    )}
                    {/* 窄屏时备注列隐藏，改在名字下方显示 */}
                    {s.note && <span className="round-robin__note round-robin__note--inline">{s.note}</span>}
                  </Reveal>
                </td>
                <td className="round-robin__col-record">
                  <Reveal delay={delay}>
                    <span className="round-robin__record num" aria-label={`${s.win} 胜 ${s.loss} 负`}>
                      <span className="round-robin__wins">{s.win}</span>
                      <span className="round-robin__dash">-</span>
                      <span className="round-robin__losses">{s.loss}</span>
                    </span>
                  </Reveal>
                </td>
                {hasStatus && (
                  <td className="round-robin__col-status">
                    <Reveal delay={delay}>{s.status && <StatusTag status={s.status} />}</Reveal>
                  </td>
                )}
                {hasNote && (
                  <td className="round-robin__col-note">
                    <Reveal delay={delay}>{s.note && <span className="round-robin__note">{s.note}</span>}</Reveal>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ───────────────────────── 交叉对阵 ─────────────────────────

interface CrossTableProps {
  names: string[];
  matches: Match[];
  mode: 'solo' | 'team';
}

/** 行头 / 列头里的名字：团队赛是队伍名文本，个人赛是选手 */
function HeadName({ name, mode }: { name: string; mode: 'solo' | 'team' }) {
  if (mode === 'solo') return <PlayerChip name={name} plain />;
  return <span className="round-robin__head-name">{name}</span>;
}

function CrossTable({ names, matches, mode }: CrossTableProps) {
  const cells = useMemo(() => buildCells(matches), [matches]);
  // 悬停的单元格：用于同时提亮对应的行头、列头和镜像格
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

  return (
    <Reveal className="round-robin__scroll">
      <table className="round-robin__matrix" onMouseLeave={() => setHover(null)}>
        <thead>
          <tr>
            <td className="round-robin__corner" />
            {names.map((n, c) => (
              <th
                key={n}
                scope="col"
                className={`round-robin__col-head ${hover?.c === c ? 'round-robin__head--hl' : ''}`}
              >
                <HeadName name={n} mode={mode} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {names.map((rowName, r) => (
            <tr key={rowName}>
              <th scope="row" className={`round-robin__row-head ${hover?.r === r ? 'round-robin__head--hl' : ''}`}>
                <HeadName name={rowName} mode={mode} />
              </th>
              {names.map((colName, c) => {
                if (r === c) {
                  return (
                    <td
                      key={colName}
                      className="round-robin__cell round-robin__cell--self"
                      aria-label="同队"
                      onMouseEnter={() => setHover({ r, c })}
                    >
                      <span className="round-robin__mark" />
                    </td>
                  );
                }
                const v = cells.get(pairKey(rowName, colName)) ?? EMPTY_CELL;
                const mirror = hover != null && hover.r === c && hover.c === r;
                const cls = [
                  'round-robin__cell',
                  `round-robin__cell--${v.outcome}`,
                  `round-robin__cell--${v.kind}`,
                  mirror ? 'round-robin__cell--mirror' : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <td key={colName} className={cls} title={v.title} onMouseEnter={() => setHover({ r, c })}>
                    <span className="round-robin__mark">
                      {v.kind === 'score' && (
                        <span className="num">
                          {v.mine}
                          <span className="round-robin__colon">:</span>
                          {v.theirs}
                        </span>
                      )}
                      {v.kind === 'text' && v.text}
                      {v.kind === 'empty' && <span className="round-robin__none">—</span>}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  );
}

// ───────────────────────── 主体 ─────────────────────────

/** 单循环阶段：积分榜 + 交叉对阵表 */
export function RoundRobinView({ stage, mode }: RoundRobinViewProps) {
  const names = stage.standings.map((s) => s.name);

  return (
    <div className="round-robin">
      <section className="round-robin__block card">
        <h3 className="round-robin__eyebrow eyebrow">积分榜</h3>
        <Standings standings={stage.standings} teams={stage.teams} mode={mode} />
        {stage.desc && <p className="round-robin__desc muted">{stage.desc}</p>}
      </section>

      {names.length > 1 && (
        <section className="round-robin__block card">
          <div className="round-robin__block-head">
            <h3 className="round-robin__eyebrow eyebrow">交叉对阵</h3>
            <span className="round-robin__legend faint">行 对 列 · 比分为「行 : 列」</span>
          </div>
          <CrossTable names={names} matches={stage.matches} mode={mode} />
        </section>
      )}
    </div>
  );
}
