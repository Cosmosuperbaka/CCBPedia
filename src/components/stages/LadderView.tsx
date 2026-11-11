// 自由约战视图（Solo 杯）：组别切换 → 战绩表（点行筛选选手）→ 按比赛日分组的对局记录。
// 统计全部来自 ladderTables()，这里只负责展示与筛选；比较选手一律先 resolvePlayer() 归一。
import { useId, useMemo, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { resolvePlayer } from '../../data/players';
import type { Duel, LadderStage } from '../../data/types';
import { ladderTables, type LadderDivisionTable, type LadderRecord } from '../../lib/ladder';
import { formatDate } from '../../lib/match';
import { PlayerChip, Reveal, ScoreBar, Tabs } from '../ui';
import './LadderView.css';

export interface LadderViewProps {
  stage: LadderStage;
}

/** 一场单挑，附带归一后的双方名字（用于筛选） */
interface DuelItem {
  duel: Duel;
  a: string;
  b: string;
}

/** 一个比赛日（只含某个组别） */
interface DayItem {
  key: string;
  date: string;
  division: string;
  duels: DuelItem[];
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** 数据里的日期可能是「6.13」这样的简写，也可能是 ISO 格式 */
function dayLabel(date: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? formatDate(date) : date;
}

// ───────────────────────── 战绩表 ─────────────────────────

interface RecordTableProps {
  table: LadderDivisionTable;
  selected: string | null;
  onToggle: (name: string) => void;
}

function RecordTable({ table, selected, onToggle }: RecordTableProps) {
  // 点击行内的选手链接时只做跳转，不触发筛选
  const onRowClick = (e: MouseEvent<HTMLTableRowElement>, name: string) => {
    if (e.target instanceof Element && e.target.closest('a')) return;
    onToggle(name);
  };
  const onRowKey = (e: KeyboardEvent<HTMLTableRowElement>, name: string) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(name);
    }
  };

  return (
    <div className="ladder-view__scroll">
      <table className="ladder-view__table">
        <thead>
          <tr>
            <th scope="col" className="ladder-view__col-rank">
              #
            </th>
            <th scope="col" className="ladder-view__col-player">
              选手
            </th>
            <th scope="col" className="ladder-view__col-record">
              胜 - 负
            </th>
            <th scope="col" className="ladder-view__col-rate">
              胜率
            </th>
            <th scope="col" className="ladder-view__col-points">
              积分
            </th>
            <th scope="col" className="ladder-view__col-diff">
              小分
            </th>
            <th scope="col" className="ladder-view__col-reward">
              奖金
            </th>
          </tr>
        </thead>
        <tbody>
          {table.records.map((r, i) => {
            const isSel = r.name === selected;
            const games = r.win + r.loss;
            const ratio = games > 0 ? r.win / games : 0;
            return (
              <tr
                key={r.name}
                className={`ladder-view__row ${isSel ? 'ladder-view__row--selected' : ''}`}
                tabIndex={0}
                aria-selected={isSel}
                title={isSel ? '再次点击取消筛选' : '点击只看该选手的对局'}
                onClick={(e) => onRowClick(e, r.name)}
                onKeyDown={(e) => onRowKey(e, r.name)}
              >
                <td className="ladder-view__col-rank">
                  <span className="ladder-view__idx num">{i + 1}</span>
                </td>
                <td className="ladder-view__col-player">
                  <PlayerChip name={r.name} size={22} />
                </td>
                <td className="ladder-view__col-record">
                  <span className="ladder-view__record num" aria-label={`${r.win} 胜 ${r.loss} 负`}>
                    <span className="ladder-view__wins">{r.win}</span>
                    <span className="ladder-view__dash">-</span>
                    <span className="ladder-view__losses">{r.loss}</span>
                  </span>
                </td>
                <td className="ladder-view__col-rate">
                  <span className="ladder-view__rate">
                    <span className="ladder-view__rate-bar">
                      <ScoreBar ratio={ratio} strong={isSel} />
                    </span>
                    <span className="ladder-view__rate-pct num">{Math.round(ratio * 100)}%</span>
                  </span>
                </td>
                <td className="ladder-view__col-points">
                  <span className="ladder-view__points num">{r.points}</span>
                </td>
                <td className="ladder-view__col-diff">
                  <span className="ladder-view__diff num">
                    {r.scored}
                    <span className="ladder-view__colon">:</span>
                    {r.conceded}
                  </span>
                </td>
                <td className="ladder-view__col-reward">
                  {r.reward != null ? (
                    <span className="ladder-view__reward num">¥{r.reward}</span>
                  ) : (
                    <span className="ladder-view__none">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ───────────────────────── 对局记录 ─────────────────────────

/** 一行单挑：[头像] A    9 : 8    B [头像] */
function DuelRow({ item }: { item: DuelItem }) {
  const [a, sa, b, sb] = item.duel;
  const aWin = sa > sb;
  const sideA = aWin ? 'win' : 'lose';
  const sideB = aWin ? 'lose' : 'win';
  return (
    <li className="ladder-view__duel">
      <span className={`ladder-view__side ladder-view__side--a ladder-view__side--${sideA}`}>
        <PlayerChip name={a} size={20} />
      </span>
      <span className="ladder-view__score num" aria-label={`${sa} 比 ${sb}`}>
        <span className={`ladder-view__pt ladder-view__pt--${sideA}`}>{sa}</span>
        <span className="ladder-view__colon">:</span>
        <span className={`ladder-view__pt ladder-view__pt--${sideB}`}>{sb}</span>
      </span>
      <span className={`ladder-view__side ladder-view__side--b ladder-view__side--${sideB}`}>
        <PlayerChip name={b} size={20} />
      </span>
    </li>
  );
}

/** 选中选手时，在对局列表上方显示其本组战绩摘要 */
function FocusSummary({ record }: { record: LadderRecord }) {
  return (
    <div className="ladder-view__focus">
      <PlayerChip name={record.name} size={28} className="ladder-view__focus-chip" />
      <span className="ladder-view__focus-stats">
        <span className="ladder-view__stat">
          <span className="ladder-view__stat-num num ladder-view__stat-num--strong">{record.win}</span> 胜
          <span className="ladder-view__stat-num num">{record.loss}</span> 负
        </span>
        <span className="ladder-view__stat">
          积分 <span className="ladder-view__stat-num num ladder-view__stat-num--strong">{record.points}</span>
        </span>
        <span className="ladder-view__stat ladder-view__stat--faint">
          小分{' '}
          <span className="ladder-view__stat-num num">
            {record.scored}
            <span className="ladder-view__colon">:</span>
            {record.conceded}
          </span>
        </span>
      </span>
    </div>
  );
}

// ───────────────────────── 主体 ─────────────────────────

/** 自由约战阶段：分组别的战绩表 + 对局记录，点选选手即可筛选 */
export function LadderView({ stage }: LadderViewProps) {
  const tables = useMemo(() => ladderTables(stage), [stage]);
  const tabsId = useId();
  const reduce = useReducedMotion();

  const [divName, setDivName] = useState<string>(() => tables[0]?.name ?? '');
  // 选中的选手（归一后的名字）
  const [selected, setSelected] = useState<string | null>(null);

  const table = tables.find((t) => t.name === divName) ?? tables[0];

  // 预先归一全部对局里的名字，筛选时不再重复计算
  const allDays = useMemo<DayItem[]>(
    () =>
      stage.days.map((d, i) => ({
        key: `${i}-${d.date}-${d.division}`,
        date: d.date,
        division: d.division,
        duels: d.duels.map((duel) => ({ duel, a: resolvePlayer(duel[0]), b: resolvePlayer(duel[2]) })),
      })),
    [stage],
  );

  const days = useMemo(() => {
    const own = allDays.filter((d) => d.division === table?.name);
    if (!selected) return own;
    return own
      .map((d) => ({ ...d, duels: d.duels.filter((x) => x.a === selected || x.b === selected) }))
      .filter((d) => d.duels.length > 0);
  }, [allDays, table, selected]);

  if (!table) return <p className="ladder-view__empty faint">暂无对局记录</p>;

  const selectedRecord = selected ? table.records.find((r) => r.name === selected) : undefined;
  const shown = days.reduce((n, d) => n + d.duels.length, 0);

  const switchDivision = (name: string) => {
    if (name === divName) return;
    setDivName(name);
    setSelected(null);
  };
  const toggle = (name: string) => setSelected((cur) => (cur === name ? null : name));

  // 筛选切换时，列表做一次轻微淡入
  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.24, ease: EASE_OUT },
      };

  return (
    <div className="ladder-view">
      {tables.length > 1 && (
        <Tabs
          className="ladder-view__tabs"
          items={tables.map((t) => ({ id: t.name, label: t.name, hint: t.games }))}
          value={table.name}
          onChange={switchDivision}
          layoutId={tabsId}
        />
      )}

      {/* 战绩表 */}
      <section className="ladder-view__block card">
        <div className="ladder-view__head">
          <div className="ladder-view__head-main">
            <h3 className="ladder-view__eyebrow eyebrow">战绩</h3>
            <span className="ladder-view__legend faint">胜 2 分 · 负 1 分 · 点选选手筛选对局</span>
          </div>
          <AnimatePresence initial={false}>
            {selected && (
              <motion.span
                key="filter"
                className="ladder-view__filter"
                initial={reduce ? false : { opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: 4 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                <span className="ladder-view__filter-text">
                  只看 <PlayerChip name={selected} plain /> 的对局
                </span>
                <button
                  type="button"
                  className="ladder-view__filter-clear"
                  aria-label="取消筛选"
                  onClick={() => setSelected(null)}
                >
                  ✕
                </button>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {table.records.length > 0 ? (
          <RecordTable table={table} selected={selected} onToggle={toggle} />
        ) : (
          <p className="ladder-view__empty faint">本组暂无对局</p>
        )}

        {table.idle.length > 0 && (
          <p className="ladder-view__idle">
            <span className="ladder-view__idle-label">报名未出场：</span>
            {table.idle.map((n, i) => (
              <span key={n} className="ladder-view__idle-item">
                {i > 0 && <span className="ladder-view__sep">、</span>}
                <PlayerChip name={n} plain />
              </span>
            ))}
          </p>
        )}
      </section>

      {/* 对局记录 */}
      <section className="ladder-view__block card">
        <div className="ladder-view__head">
          <div className="ladder-view__head-main">
            <h3 className="ladder-view__eyebrow eyebrow">对局记录</h3>
            <span className="ladder-view__legend faint">单场先得 9 分者胜</span>
          </div>
          <span className="ladder-view__count faint">
            {selected ? (
              <>
                <span className="num">{shown}</span> / <span className="num">{table.games}</span> 场
              </>
            ) : (
              <>
                共 <span className="num">{table.games}</span> 场
              </>
            )}
          </span>
        </div>

        {selectedRecord && (
          <motion.div key={`focus-${selectedRecord.name}`} {...fade}>
            <FocusSummary record={selectedRecord} />
          </motion.div>
        )}

        {days.length === 0 ? (
          <p className="ladder-view__empty faint">没有找到对局</p>
        ) : (
          <div className="ladder-view__days">
            {days.map((d) => (
              <Reveal key={`${table.name}-${d.key}`} as="section" className="ladder-view__day">
                <header className="ladder-view__day-head">
                  <span className="ladder-view__day-date num">{dayLabel(d.date)}</span>
                  <span className="ladder-view__day-count">
                    <span className="num">{d.duels.length}</span> 场
                  </span>
                </header>
                <motion.ul key={selected ?? 'all'} className="ladder-view__duels" {...fade}>
                  {d.duels.map((x, i) => (
                    <DuelRow key={i} item={x} />
                  ))}
                </motion.ul>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
