import type { Game, Lobby, LobbyRow, Match, RowStatus } from '../data/types';

export type SideKey = 'a' | 'b';

/** 一小局的胜方：有加时看加时，其次看显式标注，最后比较比分 */
export function gameWinner(g: Game): SideKey | undefined {
  if (g.ot) return g.ot[0] > g.ot[1] ? 'a' : 'b';
  if (g.winner) return g.winner;
  if (g.a == null || g.b == null || g.a === g.b) return undefined;
  return g.a > g.b ? 'a' : 'b';
}

/** 大比分 [a 赢的局数, b 赢的局数] */
export function seriesScore(m: Match): [number, number] {
  let a = 0;
  let b = 0;
  for (const g of m.games) {
    const w = gameWinner(g);
    if (w === 'a') a++;
    else if (w === 'b') b++;
  }
  return [a, b];
}

/** 整场胜方 */
export function matchWinner(m: Match): SideKey | undefined {
  if (m.winner) return m.winner;
  const [a, b] = seriesScore(m);
  if (a === b) return undefined;
  return a > b ? 'a' : 'b';
}

/** 一行的结算分：带入 + 本场 + 加分 - 扣减 */
export function rowTotal(r: LobbyRow): number | undefined {
  if (r.score == null && r.carry == null) return undefined;
  return (r.carry ?? 0) + (r.score ?? 0) + (r.bonus ?? 0) - (r.deduct ?? 0);
}

/** 房间是否带有分数（否则只是一份名单） */
export function lobbyHasScores(l: Lobby): boolean {
  return l.rows.some((r) => r.score != null || r.carry != null);
}

/** 行状态：优先用显式 status，否则按 lobby.advance 推断前 N 行晋级 */
export function rowStatus(l: Lobby, index: number): RowStatus | undefined {
  const r = l.rows[index];
  if (r.status) return r.status;
  if (l.advance != null) return index < l.advance ? 'advance' : undefined;
  return undefined;
}

export const STATUS_LABEL: Record<RowStatus, string> = {
  champion: '冠军',
  direct: '直通决赛',
  advance: '晋级',
  out: '淘汰',
  absent: '缺席',
  forfeit: '弃赛',
};

/** 2025-08-11 → 2025.8.11；带 end 时输出区间 */
export function formatDate(start: string, end?: string): string {
  const f = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return { y, m, d };
  };
  const a = f(start);
  if (!end || end === start) return `${a.y}.${a.m}.${a.d}`;
  const b = f(end);
  if (a.y !== b.y) return `${a.y}.${a.m}.${a.d} – ${b.y}.${b.m}.${b.d}`;
  return `${a.y}.${a.m}.${a.d} – ${b.m}.${b.d}`;
}
