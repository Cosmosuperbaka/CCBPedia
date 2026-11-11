// 自由约战（Solo 杯）的战绩统计
import { resolvePlayer } from '../data/players';
import type { LadderStage } from '../data/types';

export interface LadderRecord {
  /** 归一后的选手名 */
  name: string;
  win: number;
  loss: number;
  /** 积分：胜 2 负 1 */
  points: number;
  /** 小分：得分合计 / 失分合计 */
  scored: number;
  conceded: number;
  /** 官方统计表里的奖金 */
  reward?: number;
}

export interface LadderDivisionTable {
  name: string;
  records: LadderRecord[];
  /** 报名但未出场 */
  idle: string[];
  games: number;
}

/** 按组别统计战绩，按积分 → 胜场 → 净胜分排序 */
export function ladderTables(stage: LadderStage): LadderDivisionTable[] {
  return stage.divisions.map((div) => {
    const map = new Map<string, LadderRecord>();
    const get = (raw: string) => {
      const name = resolvePlayer(raw);
      let r = map.get(name);
      if (!r) {
        r = { name, win: 0, loss: 0, points: 0, scored: 0, conceded: 0 };
        map.set(name, r);
      }
      return r;
    };
    let games = 0;
    for (const day of stage.days) {
      if (day.division !== div.name) continue;
      for (const [a, sa, b, sb] of day.duels) {
        games++;
        const ra = get(a);
        const rb = get(b);
        ra.scored += sa;
        ra.conceded += sb;
        rb.scored += sb;
        rb.conceded += sa;
        if (sa > sb) {
          ra.win++;
          rb.loss++;
        } else {
          rb.win++;
          ra.loss++;
        }
      }
    }
    for (const [raw, reward] of Object.entries(div.rewards ?? {})) {
      const r = map.get(resolvePlayer(raw));
      if (r) r.reward = reward;
    }
    const records = [...map.values()];
    for (const r of records) r.points = r.win * 2 + r.loss;
    records.sort(
      (x, y) =>
        y.points - x.points || y.win - x.win || y.scored - y.conceded - (x.scored - x.conceded) || x.name.localeCompare(y.name, 'zh'),
    );
    return { name: div.name, records, idle: div.idle ?? [], games };
  });
}
