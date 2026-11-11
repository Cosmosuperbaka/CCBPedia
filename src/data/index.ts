// 数据入口：赛事列表、系列信息，以及从赛事数据聚合出的选手档案。
import type { Award, Lobby, Match, Placement, SeriesId, Tournament } from './types';
import { resolvePlayer } from './players';
import { seasons } from './rankings';
import { tournaments2025 } from './t2025';
import { tournaments2026 } from './t2026';

/** 全部赛事，按时间倒序 */
export const tournaments: Tournament[] = [...tournaments2025, ...tournaments2026].sort((a, b) =>
  b.start.localeCompare(a.start),
);

export const yearOf = (t: Tournament): number => Number(t.start.slice(0, 4));

export function getTournament(id: string | undefined): Tournament | undefined {
  return tournaments.find((t) => t.id === id);
}

export interface SeriesInfo {
  id: SeriesId;
  name: string;
  desc: string;
}

export const SERIES: Record<SeriesId, SeriesInfo> = {
  major: { id: 'major', name: 'Major', desc: '最高规格的旗舰赛事' },
  lbc: { id: 'lbc', name: 'LBC', desc: '老鸨杯，由老鸨赞助的邀请赛' },
  rookie: { id: 'rookie', name: '新人杯', desc: '面向新选手的入门赛事' },
  msi: { id: 'msi', name: 'MSI', desc: '少数顶尖选手的季中邀请赛' },
  tianhong: { id: 'tianhong', name: '天虹杯', desc: '三人组队的周末联赛' },
  solo: { id: 'solo', name: 'Solo 杯', desc: '自由约战的 1v1 单挑赛' },
  other: { id: 'other', name: '其它', desc: '其它赛事' },
};

// ───────────────────────── 选手档案 ─────────────────────────

export interface PlayerEntry {
  tournament: Tournament;
  /** 最终名次（没有名次则为 undefined） */
  placement?: Placement;
  /** 团队赛所在队伍 */
  team?: string;
  teammates: string[];
  awards: Award[];
}

export interface DuelRecord {
  tournament: Tournament;
  date: string;
  division: string;
  opponent: string;
  own: number;
  opp: number;
  win: boolean;
}

export interface PlayerProfile {
  name: string;
  /** 参赛记录，按时间倒序 */
  entries: PlayerEntry[];
  /** 仅以工作人员身份出现的赛事 */
  staff: { tournament: Tournament; role: string }[];
  duels: DuelRecord[];
  titles: number;
  podiums: number;
  /** 各年度积分榜名次与分数 */
  seasons: { year: number; rank: number; points: number; bestRank?: number }[];
}

/** 一场对阵里某一方的选手 */
function sidePlayers(t: Tournament, m: Match, key: 'a' | 'b'): string[] {
  const s = m[key];
  return s.players ?? (t.mode === 'solo' ? [s.name] : []);
}

function lobbyPlayers(t: Tournament, l: Lobby): string[] {
  return l.rows.flatMap((r) => r.team ?? (t.mode === 'solo' ? [r.name] : []));
}

/** 一届赛事里出现过的全部参赛选手（原始写法） */
function participantsOf(t: Tournament): string[] {
  const out: string[] = [...(t.participants ?? [])];
  for (const team of t.teams ?? []) out.push(...team.players);
  const fromMatches = (ms: Match[]) => {
    for (const m of ms) out.push(...sidePlayers(t, m, 'a'), ...sidePlayers(t, m, 'b'));
  };
  for (const s of t.stages) {
    switch (s.kind) {
      case 'lobbies':
        for (const l of s.lobbies) out.push(...lobbyPlayers(t, l));
        break;
      case 'matches':
        fromMatches(s.matches);
        break;
      case 'roundRobin':
        fromMatches(s.matches);
        for (const side of s.teams) out.push(...(side.players ?? (t.mode === 'solo' ? [side.name] : [])));
        break;
      case 'bracket':
        for (const tr of s.tracks) for (const r of tr.rounds) fromMatches(r.matches);
        break;
      case 'swiss':
        for (const r of s.rounds) {
          for (const p of r.pools) for (const l of p.lobbies) out.push(...lobbyPlayers(t, l));
          for (const o of r.outcomes ?? []) out.push(...o.rows.map((x) => x.name));
        }
        break;
      case 'ladder':
        for (const day of s.days) for (const [a, , b] of day.duels) out.push(a, b);
        for (const div of s.divisions) out.push(...(div.idle ?? []));
        break;
    }
  }
  for (const p of t.placements) out.push(...p.players);
  for (const a of t.awards ?? []) out.push(a.player);
  return out;
}

/** 选手在某届赛事中所属的队伍与队友 */
function teamOf(t: Tournament, name: string): { team?: string; teammates: string[] } {
  const hit = (players: string[]) => players.some((p) => resolvePlayer(p) === name);
  const mates = (players: string[]) => players.map(resolvePlayer).filter((p) => p !== name);
  for (const p of t.placements) if (p.team && hit(p.players)) return { team: p.team, teammates: mates(p.players) };
  for (const team of t.teams ?? []) if (hit(team.players)) return { team: team.name, teammates: mates(team.players) };
  return { teammates: [] };
}

function build(): Map<string, PlayerProfile> {
  const map = new Map<string, PlayerProfile>();
  const get = (raw: string): PlayerProfile => {
    const name = resolvePlayer(raw);
    let p = map.get(name);
    if (!p) {
      p = { name, entries: [], staff: [], duels: [], titles: 0, podiums: 0, seasons: [] };
      map.set(name, p);
    }
    return p;
  };

  // 按时间正序处理，保证「首次出现的写法」稳定
  const ordered = [...tournaments].reverse();
  for (const t of ordered) {
    const seen = new Set(participantsOf(t).map(resolvePlayer));
    for (const name of seen) {
      const profile = get(name);
      const placement = t.placements.find((pl) => pl.players.some((x) => resolvePlayer(x) === name));
      const awards = (t.awards ?? []).filter((a) => resolvePlayer(a.player) === name).map((a) => a.award);
      profile.entries.unshift({ tournament: t, placement, awards, ...teamOf(t, name) });
      if (placement?.rank === 1) profile.titles++;
      if (placement && placement.rank <= 3) profile.podiums++;
    }
    for (const group of t.staff ?? []) {
      for (const raw of group.names) {
        const profile = get(raw);
        if (!seen.has(profile.name)) profile.staff.unshift({ tournament: t, role: group.role });
      }
    }
    for (const s of t.stages) {
      if (s.kind !== 'ladder') continue;
      for (const day of s.days) {
        for (const [a, sa, b, sb] of day.duels) {
          const base = { tournament: t, date: day.date, division: day.division };
          get(a).duels.push({ ...base, opponent: resolvePlayer(b), own: sa, opp: sb, win: sa > sb });
          get(b).duels.push({ ...base, opponent: resolvePlayer(a), own: sb, opp: sa, win: sb > sa });
        }
      }
    }
  }

  for (const season of seasons) {
    for (const row of season.board) {
      get(row.player).seasons.push({ year: season.year, rank: row.rank, points: row.points });
    }
    season.bestPlayers.list.forEach((raw, i) => {
      const profile = get(raw);
      const hit = profile.seasons.find((s) => s.year === season.year);
      if (hit) hit.bestRank = i + 1;
      else profile.seasons.push({ year: season.year, rank: 0, points: 0, bestRank: i + 1 });
    });
  }
  return map;
}

const profiles = build();

/** 全部选手：按冠军数 → 领奖台 → 参赛数 → 名字排序 */
export const players: PlayerProfile[] = [...profiles.values()].sort(
  (a, b) =>
    b.titles - a.titles ||
    b.podiums - a.podiums ||
    b.entries.length - a.entries.length ||
    a.name.localeCompare(b.name, 'zh'),
);

export function getPlayer(raw: string | undefined): PlayerProfile | undefined {
  return raw ? profiles.get(resolvePlayer(raw)) : undefined;
}

// ───────────────────────── 全站统计 ─────────────────────────

/** 一届赛事的对局数：BO 系列按小局计，多人房间按房间计，单挑按场计 */
export function countGames(t: Tournament): number {
  let n = 0;
  const fromMatches = (ms: Match[]) => {
    for (const m of ms) n += Math.max(1, m.games.length);
  };
  for (const s of t.stages) {
    switch (s.kind) {
      case 'lobbies':
        n += s.lobbies.filter((l) => l.rows.some((r) => r.score != null)).length;
        break;
      case 'matches':
      case 'roundRobin':
        fromMatches(s.matches);
        break;
      case 'bracket':
        for (const tr of s.tracks) for (const r of tr.rounds) fromMatches(r.matches);
        break;
      case 'swiss':
        for (const r of s.rounds) for (const p of r.pools) n += p.lobbies.length;
        break;
      case 'ladder':
        for (const day of s.days) n += day.duels.length;
        break;
    }
  }
  return n;
}

export const siteStats = {
  tournaments: tournaments.length,
  players: players.filter((p) => p.entries.length > 0).length,
  games: tournaments.reduce((sum, t) => sum + countGames(t), 0),
  years: [...new Set(tournaments.map(yearOf))].sort((a, b) => b - a),
};

/** 冠军（团队赛为多人） */
export function championOf(t: Tournament): Placement | undefined {
  return t.placements.find((p) => p.rank === 1);
}
