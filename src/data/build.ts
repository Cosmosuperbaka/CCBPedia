// 录入数据用的简写工具：让赛事数据文件保持紧凑、接近原始记录的写法。
import type { Game, Lobby, LobbyRow, Match, Side, TeamDef } from './types';

/**
 * 房间行的简写：
 * - '名字'                       仅名单
 * - ['名字', 得分]
 * - ['名字', 得分, 加分]          排名加分
 * - ['名字', 得分, { ...其它 }]
 * - 完整的 LobbyRow 对象
 */
export type RowInput =
  | string
  | [string, number?, (number | Partial<LobbyRow>)?]
  | LobbyRow;

function toRow(input: RowInput): LobbyRow {
  if (typeof input === 'string') return { name: input };
  if (!Array.isArray(input)) return input;
  const [name, score, extra] = input;
  const row: LobbyRow = { name };
  if (score != null) row.score = score;
  if (typeof extra === 'number') row.bonus = extra;
  else if (extra) Object.assign(row, extra);
  return row;
}

/** 房间 */
export function lobby(name: string | undefined, rows: RowInput[], opts: Partial<Lobby> = {}): Lobby {
  return { name, ...opts, rows: rows.map(toRow) };
}

/** 瑞士轮累计行：[名字, 带入, 本轮得分, 排名加分] */
export type CarryInput = [string, number, number?, number?, Partial<LobbyRow>?];

/** 带入积分的房间（瑞士轮第二轮起） */
export function carryLobby(name: string | undefined, rows: CarryInput[], opts: Partial<Lobby> = {}): Lobby {
  return {
    name,
    ...opts,
    rows: rows.map(([n, carry, score, bonus, extra]) => {
      const row: LobbyRow = { name: n, carry };
      if (score != null) row.score = score;
      if (bonus != null) row.bonus = bonus;
      return { ...row, ...extra };
    }),
  };
}

/** 缺席行 */
export const absent = (name: string, carry?: number): LobbyRow =>
  carry == null ? { name, status: 'absent' } : { name, carry, status: 'absent' };

/**
 * 一小局的简写：
 * - [a, b]
 * - [a, b, [加时a, 加时b]]
 * - [a, b, 'a' | 'b']           比分相同或需显式指定胜方
 */
export type GameInput = [number, number, ([number, number] | 'a' | 'b')?];

function toGame([a, b, extra]: GameInput): Game {
  const g: Game = { a, b };
  if (Array.isArray(extra)) g.ot = extra;
  else if (extra) g.winner = extra;
  return g;
}

const toSide = (s: Side | string): Side => (typeof s === 'string' ? { name: s } : s);

let seq = 0;

/** 一场对阵 */
export function match(
  a: Side | string,
  b: Side | string,
  games: GameInput[],
  opts: Partial<Omit<Match, 'a' | 'b' | 'games'>> = {},
): Match {
  return {
    id: `m${++seq}`,
    bestOf: 1,
    ...opts,
    a: toSide(a),
    b: toSide(b),
    games: games.map(toGame),
  };
}

/** 团队一方：队伍名 + 本场阵容 */
export const side = (name: string, ...players: string[]): Side => ({ name, players });

/** 从队伍定义生成 Side */
export const teamSide = (t: TeamDef): Side => ({ name: t.name, players: t.players });

/** 把空格分隔的名单拆成数组（名字本身含空格的不要用它） */
export const names = (s: string): string[] => s.trim().split(/\s+/);
