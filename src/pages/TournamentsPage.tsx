// 赛事列表：按系列筛选，按年份分组
import { useId, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SERIES, tournaments, yearOf } from '../data';
import type { SeriesId } from '../data/types';
import { TournamentCard } from '../components/TournamentCard';
import { Tabs, type TabItem } from '../components/ui';
import './TournamentsPage.css';

type Filter = SeriesId | 'all';

export function TournamentsPage() {
  const [params, setParams] = useSearchParams();
  const tabsId = useId();
  const reduce = useReducedMotion();

  const raw = params.get('series');
  const filter: Filter = raw && raw in SERIES ? (raw as SeriesId) : 'all';

  const items = useMemo<TabItem<Filter>[]>(() => {
    const used = [...new Set(tournaments.map((t) => t.series))];
    // 系列按首次举办时间排序
    used.sort((a, b) => {
      const first = (s: SeriesId) => tournaments.filter((t) => t.series === s).at(-1)!.start;
      return first(a).localeCompare(first(b));
    });
    return [
      { id: 'all', label: '全部', hint: tournaments.length },
      ...used.map((s) => ({
        id: s as Filter,
        label: SERIES[s].name,
        hint: tournaments.filter((t) => t.series === s).length,
      })),
    ];
  }, []);

  const groups = useMemo(() => {
    const list = filter === 'all' ? tournaments : tournaments.filter((t) => t.series === filter);
    const years = [...new Set(list.map(yearOf))].sort((a, b) => b - a);
    return years.map((y) => ({ year: y, list: list.filter((t) => yearOf(t) === y) }));
  }, [filter]);

  const setFilter = (f: Filter) => setParams(f === 'all' ? {} : { series: f }, { replace: true });

  return (
    <div className="page container">
      <header className="page-head">
        <p className="eyebrow page-head__eyebrow">TOURNAMENTS</p>
        <h1 className="page-title">赛事</h1>
        <p className="page-lead">
          {filter === 'all'
            ? '从 2025 年 6 月第一届 Major 至今的全部赛事。每届赛制都不太一样，点进去可以看到完整的赛程与比分。'
            : `${SERIES[filter].name}：${SERIES[filter].desc}。`}
        </p>
      </header>

      <div className="toolbar">
        <Tabs items={items} value={filter} onChange={setFilter} layoutId={tabsId} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={filter}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {groups.map((g) => (
            <section key={g.year} className="t-year">
              <h2 className="t-year__title">
                <span className="num">{g.year}</span>
                <small>{g.list.length} 届</small>
              </h2>
              <div className="grid grid--2">
                {g.list.map((t) => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
