// 瑞士轮视图：顶部晋级总览，下方按轮次切换，逐个战绩池展示房间与本轮结束时的去向。
// 阅读顺序：战绩池（左侧徽标）→ 房间（LobbyCard）→ 本轮结束（晋级 / 淘汰卡片）。
import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { SwissOutcome, SwissPool, SwissRound, SwissStage } from '../../data/types';
import { formatDate } from '../../lib/match';
import { PlayerChip, Reveal, Tabs, type TabItem } from '../ui';
import { LobbyCard } from './LobbyCard';
import './SwissView.css';

export interface SwissViewProps {
  stage: SwissStage;
  mode: 'solo' | 'team';
}

type Mode = SwissViewProps['mode'];

/** 「3-1」→ [3, 1]；格式不符时返回 undefined */
function parseRecord(record: string): [number, number] | undefined {
  const m = /^\s*(\d+)\s*[-–—:]\s*(\d+)\s*$/.exec(record);
  return m ? [Number(m[1]), Number(m[2])] : undefined;
}

/**
 * 汇总所有轮次的 outcomes：晋级在前、淘汰在后；
 * 同类内按胜场多、负场少排序（3-0 → 3-1 → 3-2，2-3 → 1-3 → 0-3），无法解析的保持原顺序。
 */
function collectOutcomes(rounds: SwissRound[]): SwissOutcome[] {
  const all = rounds.flatMap((r) => r.outcomes ?? []);
  const keyed = all.map((o, i) => ({ o, i, rec: parseRecord(o.record) }));
  keyed.sort((x, y) => {
    if (x.o.kind !== y.o.kind) return x.o.kind === 'advance' ? -1 : 1;
    if (x.rec && y.rec) {
      if (x.rec[0] !== y.rec[0]) return y.rec[0] - x.rec[0];
      if (x.rec[1] !== y.rec[1]) return x.rec[1] - y.rec[1];
    }
    return x.i - y.i;
  });
  return keyed.map((k) => k.o);
}

/** 战绩数字：胜 - 负，中间的连字符单独排版 */
function RecordText({ record, className = '' }: { record: string; className?: string }) {
  const rec = parseRecord(record);
  if (!rec) return <span className={`num ${className}`}>{record}</span>;
  return (
    <span className={`num ${className}`} aria-label={`${rec[0]} 胜 ${rec[1]} 负`}>
      {rec[0]}
      <span className="swiss__dash" aria-hidden>
        -
      </span>
      {rec[1]}
    </span>
  );
}

// ───────────────────────── 晋级 / 淘汰卡片 ─────────────────────────

function OutcomeCard({ outcome, mode }: { outcome: SwissOutcome; mode: Mode }) {
  const out = outcome.kind === 'out';
  const unit = mode === 'team' ? '队' : '人';
  return (
    <article className={`swiss__outcome swiss__outcome--${outcome.kind}`}>
      <header className="swiss__outcome-head">
        <RecordText record={outcome.record} className="swiss__outcome-record" />
        <span className="swiss__outcome-label">{outcome.label}</span>
        {outcome.rows.length > 0 && (
          <span className="swiss__outcome-count">
            <span className="num">{outcome.rows.length}</span> {unit}
          </span>
        )}
      </header>
      {outcome.rows.length > 0 && (
        <ul className="swiss__outcome-list">
          {outcome.rows.map((row, i) => (
            <li key={`${i}-${row.name}`} className="swiss__outcome-entry">
              {mode === 'team' ? (
                <span className="swiss__team">{row.name}</span>
              ) : (
                <PlayerChip name={row.name} size={22} dim={out} />
              )}
              {row.total != null && <span className="swiss__total num">{row.total}</span>}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function OutcomeGrid({ outcomes, mode, reveal }: { outcomes: SwissOutcome[]; mode: Mode; reveal?: boolean }) {
  return (
    <div className="swiss__outcomes">
      {outcomes.map((o, i) => {
        const key = `${o.kind}-${o.record}-${o.label}-${i}`;
        const card = <OutcomeCard outcome={o} mode={mode} />;
        return reveal ? (
          <Reveal key={key} delay={i * 0.05} className="swiss__outcome-cell">
            {card}
          </Reveal>
        ) : (
          <div key={key} className="swiss__outcome-cell">
            {card}
          </div>
        );
      })}
    </div>
  );
}

// ───────────────────────── 战绩池 ─────────────────────────

function PoolBlock({ pool, mode }: { pool: SwissPool; mode: Mode }) {
  const rooms = pool.lobbies.length;
  const entrants = pool.lobbies.reduce((s, l) => s + l.rows.length, 0);
  const meta = [rooms > 1 ? `${rooms} 个房间` : '', entrants > 0 ? `${entrants} ${mode === 'team' ? '队' : '人'}` : '']
    .filter(Boolean)
    .join(' · ');

  return (
    <section className="swiss__pool">
      <div className="swiss__pool-aside">
        <span className="swiss__badge">
          <span className="swiss__badge-cap">战绩</span>
          <RecordText record={pool.record} className="swiss__badge-record" />
        </span>
        {(meta || pool.note) && (
          <div className="swiss__pool-info">
            {meta && <span className="swiss__pool-meta">{meta}</span>}
            {pool.note && <p className="swiss__pool-note">{pool.note}</p>}
          </div>
        )}
      </div>

      {rooms > 0 && (
        <div className={`swiss__lobbies ${rooms > 1 ? 'swiss__lobbies--multi' : ''}`}>
          {pool.lobbies.map((l, i) => (
            <LobbyCard key={`${i}-${l.name ?? ''}`} lobby={l} mode={mode} />
          ))}
        </div>
      )}
    </section>
  );
}

// ───────────────────────── 单轮内容 ─────────────────────────

function RoundBody({ round, mode }: { round: SwissRound; mode: Mode }) {
  const outcomes = round.outcomes ?? [];
  return (
    <div className="swiss__round">
      {(round.date || round.desc) && (
        <div className="swiss__round-meta">
          {round.date && <span className="swiss__round-date num">{formatDate(round.date)}</span>}
          {round.desc && <p className="swiss__round-desc">{round.desc}</p>}
        </div>
      )}

      {round.pools.length > 0 && (
        <div className="swiss__pools">
          {round.pools.map((p, i) => (
            <PoolBlock key={`${i}-${p.record}`} pool={p} mode={mode} />
          ))}
        </div>
      )}

      {outcomes.length > 0 && (
        <section className="swiss__round-end">
          <h4 className="swiss__eyebrow eyebrow">本轮结束</h4>
          <OutcomeGrid outcomes={outcomes} mode={mode} />
        </section>
      )}
    </div>
  );
}

// ───────────────────────── 主体 ─────────────────────────

/** 瑞士轮阶段：晋级总览 + 轮次切换 */
export function SwissView({ stage, mode }: SwissViewProps) {
  const layoutId = useId();
  const reduce = useReducedMotion();
  const [active, setActive] = useState('r0');

  const summary = useMemo(() => collectOutcomes(stage.rounds), [stage.rounds]);
  const tabs: TabItem<string>[] = stage.rounds.map((r, i) => ({ id: `r${i}`, label: r.title }));

  // 数据变化导致下标越界时回落到第一轮
  const parsed = Number(active.slice(1));
  const index = Number.isInteger(parsed) && parsed >= 0 && parsed < stage.rounds.length ? parsed : 0;
  const round = stage.rounds[index];

  const shift = reduce ? 0 : 8;

  return (
    <div className="swiss">
      {summary.length > 0 && (
        <section className="swiss__summary">
          <h3 className="swiss__eyebrow eyebrow">晋级总览</h3>
          <OutcomeGrid outcomes={summary} mode={mode} reveal />
        </section>
      )}

      {round && (
        <section className="swiss__rounds">
          <div className="swiss__rounds-head">
            <h3 className="swiss__eyebrow eyebrow">逐轮战况</h3>
            <Tabs items={tabs} value={`r${index}`} onChange={setActive} layoutId={layoutId} className="swiss__tabs" />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`r${index}`}
              initial={{ opacity: 0, y: shift }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <RoundBody round={round} mode={mode} />
            </motion.div>
          </AnimatePresence>
        </section>
      )}
    </div>
  );
}
