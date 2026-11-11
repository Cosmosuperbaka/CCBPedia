// CCBPedia 数据结构约定
// 所有赛事都用同一套结构描述；不同赛制通过 Stage.kind 区分，由对应的视图组件渲染。
// 约定：数据里出现的选手名一律写「原始写法」，展示与聚合时用 resolvePlayer() 归一。

export type SeriesId = 'major' | 'lbc' | 'rookie' | 'msi' | 'tianhong' | 'solo' | 'other';

export type Award = 'MVP' | 'EVP';

/** 队伍定义（团队赛） */
export interface TeamDef {
  /** 队伍名，如「二组」 */
  name: string;
  /** 别称，如「老鸨组」 */
  alias?: string;
  players: string[];
}

// ───────────────────────── 多人房间（混战计分） ─────────────────────────

/**
 * 行状态：
 * champion 夺冠 / direct 直通决赛 / advance 晋级（或本轮胜出） / out 淘汰 /
 * absent 缺席 / forfeit 弃赛
 */
export type RowStatus = 'champion' | 'direct' | 'advance' | 'out' | 'absent' | 'forfeit';

/** 房间里的一行：一名选手，或团队赛中的一支队伍 */
export interface LobbyRow {
  /** 选手名；团队赛时为队伍名 */
  name: string;
  /** 团队赛时的队员 */
  team?: string[];
  /** 本场得分 */
  score?: number;
  /** 带入积分（瑞士轮累计制） */
  carry?: number;
  /** 排名加分 */
  bonus?: number;
  /** 被扣减的分数（有效分 = score - deduct） */
  deduct?: number;
  status?: RowStatus;
  note?: string;
}

/** 一个房间 / 一个小组 */
export interface Lobby {
  name?: string;
  date?: string;
  note?: string;
  /** 前 N 行视为晋级（未单独写 status 的行据此推断） */
  advance?: number;
  rows: LobbyRow[];
}

// ───────────────────────── 对阵（BO1 / BO3） ─────────────────────────

export interface Side {
  /** 个人赛为选手名；团队赛为队伍名 */
  name: string;
  /** 团队赛时本场的出场阵容 */
  players?: string[];
}

/** 一小局（图） */
export interface Game {
  a?: number;
  b?: number;
  /** 加时比分 [a, b]，有加时则以加时定胜负 */
  ot?: [number, number];
  /** 显式胜方（比分相同或无比分时使用） */
  winner?: 'a' | 'b';
  note?: string;
}

export interface Match {
  id: string;
  date?: string;
  /** 场次说明，如「胜者组第一轮」 */
  label?: string;
  bestOf: number;
  a: Side;
  b: Side;
  games: Game[];
  /** 整场胜方；未填时由各局推断 */
  winner?: 'a' | 'b';
  /** 特殊结果：forfeit 一方弃赛 / walkover 对手人员不齐自动晋级 */
  result?: 'forfeit' | 'walkover';
  note?: string;
}

// ───────────────────────── 阶段 ─────────────────────────

interface StageBase {
  title: string;
  date?: string;
  desc?: string;
}

/** 多人房间阶段：小组赛、淘汰赛房间、决赛房间、仅有名单的分组 */
export interface LobbiesStage extends StageBase {
  kind: 'lobbies';
  lobbies: Lobby[];
}

/** 对阵列表阶段 */
export interface MatchesStage extends StageBase {
  kind: 'matches';
  matches: Match[];
}

export interface BracketRound {
  title: string;
  matches: Match[];
}
export interface BracketTrack {
  /** 如「胜者组」「败者组」；单败时可省略 */
  name?: string;
  rounds: BracketRound[];
}
/** 对阵树阶段：单败 / 双败 */
export interface BracketStage extends StageBase {
  kind: 'bracket';
  tracks: BracketTrack[];
}

export interface RoundRobinStanding {
  name: string;
  win: number;
  loss: number;
  status?: RowStatus;
  note?: string;
}
/** 单循环阶段 */
export interface RoundRobinStage extends StageBase {
  kind: 'roundRobin';
  teams: Side[];
  matches: Match[];
  standings: RoundRobinStanding[];
}

export interface SwissPool {
  /** 战绩分组，如「1-0」 */
  record: string;
  note?: string;
  lobbies: Lobby[];
}
export interface SwissOutcome {
  /** 如「3-0」 */
  record: string;
  kind: 'advance' | 'out';
  /** 如「晋级」「淘汰」「直通决赛」 */
  label: string;
  rows: { name: string; total?: number }[];
}
export interface SwissRound {
  title: string;
  date?: string;
  desc?: string;
  pools: SwissPool[];
  /** 本轮结束后产生的晋级 / 淘汰名单 */
  outcomes?: SwissOutcome[];
}
/** 瑞士轮阶段 */
export interface SwissStage extends StageBase {
  kind: 'swiss';
  rounds: SwissRound[];
}

/** 单挑：[选手A, A得分, 选手B, B得分] */
export type Duel = [string, number, string, number];
export interface LadderDay {
  date: string;
  division: string;
  duels: Duel[];
}
export interface LadderDivision {
  name: string;
  /** 报名但未出场的选手 */
  idle?: string[];
  /** 官方统计表里的奖励数值（按选手原始写法索引） */
  rewards?: Record<string, number>;
}
/** 自由约战阶段（Solo 杯） */
export interface LadderStage extends StageBase {
  kind: 'ladder';
  divisions: LadderDivision[];
  days: LadderDay[];
}

export type Stage =
  | LobbiesStage
  | MatchesStage
  | BracketStage
  | RoundRobinStage
  | SwissStage
  | LadderStage;

// ───────────────────────── 赛事 ─────────────────────────

export interface Placement {
  /** 数字名次，用于排序与奖牌（并列时相同） */
  rank: number;
  /** 展示名，如「冠军」「第五」 */
  label: string;
  /** 团队赛的队伍名 */
  team?: string;
  players: string[];
  score?: number;
  note?: string;
}

export interface Review {
  title: string;
  score?: string;
  body: string;
}

export interface Tournament {
  /** 路由 id，如 major-3 */
  id: string;
  name: string;
  series: SeriesId;
  edition: number;
  mode: 'solo' | 'team';
  /** YYYY-MM-DD */
  start: string;
  end?: string;
  /** 具体日期未知时的说明文字（此时 start 仅用于排序与归年） */
  dateNote?: string;
  status: 'finished' | 'aborted';
  /** 一句话概述 */
  tagline: string;
  /** 赛制标签，如 ['双败淘汰', 'BO3'] */
  formatTags: string[];
  /** 赛制说明 */
  rules?: string[];
  /** 海报（public 下的相对路径） */
  cover?: string;
  teams?: TeamDef[];
  /** 报名 / 参赛名单 */
  participants?: string[];
  staff?: { role: string; names: string[] }[];
  stages: Stage[];
  placements: Placement[];
  awards?: { player: string; award: Award }[];
  notes?: string[];
  reviews?: Review[];
}

// ───────────────────────── 年度榜单 ─────────────────────────

export interface PointsEvent {
  tournament: string;
  rules: string;
  entries: { player: string; points: number; label?: string; awards?: Award[] }[];
}

export interface SeasonRanking {
  year: number;
  /** 官方积分榜顺序 */
  board: { rank: number; player: string; points: number }[];
  events: PointsEvent[];
  /** 年度最佳选手评选 */
  bestPlayers: { title: string; list: string[] };
  honors: { title: string; winner: string }[];
}
