// 选手列表页：搜索 + 排序 + 卡片网格
import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { players, type PlayerProfile } from '../data';
import { aliasesOf, playerPath } from '../data/players';
import { Avatar, Tabs, type TabItem } from '../components/ui';
import './PlayersPage.css';

type SortKey = 'honor' | 'entries' | 'name';

const SORT_TABS: TabItem<SortKey>[] = [
  { id: 'honor', label: '按荣誉' },
  { id: 'entries', label: '按参赛' },
  { id: 'name', label: '按名字' },
];

/** 名字或任一别名包含关键词（不区分大小写） */
function matches(p: PlayerProfile, q: string): boolean {
  if (!q) return true;
  if (p.name.toLowerCase().includes(q)) return true;
  return aliasesOf(p.name).some((a) => a.toLowerCase().includes(q));
}

function sortPlayers(list: PlayerProfile[], key: SortKey): PlayerProfile[] {
  // players 本身已是「按荣誉」顺序
  if (key === 'honor') return list;
  const out = [...list];
  if (key === 'entries') {
    // 稳定排序：参赛届数相同时保留荣誉顺序
    out.sort((a, b) => b.entries.length - a.entries.length);
  } else {
    out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
  }
  return out;
}

/** 卡片里的一行小字统计 */
function PlayerStats({ p }: { p: PlayerProfile }) {
  if (p.entries.length === 0) {
    const roles = [...new Set(p.staff.map((s) => s.role))];
    return <span className="players-card__role">{roles.join(' / ') || '工作人员'}</span>;
  }
  return (
    <>
      {p.titles > 0 && (
        <span className="tag tag--gold">
          冠军 ×<span className="num">{p.titles}</span>
        </span>
      )}
      {p.podiums > p.titles && (
        <span className="players-card__stat">
          领奖台 ×<span className="num">{p.podiums}</span>
        </span>
      )}
      <span className="players-card__stat">
        参赛 <span className="num">{p.entries.length}</span> 届
      </span>
    </>
  );
}

export function PlayersPage() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('honor');
  // 输入时让列表计算稍稍让位于输入框本身，打字不卡顿
  const deferred = useDeferredValue(query);
  const q = deferred.trim().toLowerCase();

  const list = useMemo(() => sortPlayers(players.filter((p) => matches(p, q)), sort), [q, sort]);

  return (
    <div className="page container">
      <header className="page-head">
        <p className="eyebrow page-head__eyebrow">PLAYERS</p>
        <h1 className="page-title">选手</h1>
        <p className="page-lead">
          所有在赛事记录中出现过的选手与工作人员。默认按冠军数、领奖台次数与参赛届数排序，点开卡片查看完整履历。
        </p>
      </header>

      <div className="toolbar">
        <div className="players-page__find">
          <label className="search">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="7" cy="7" r="4.75" />
              <path d="m10.5 10.5 3 3" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索选手名或别名"
              aria-label="搜索选手"
            />
          </label>
          <span className="players-page__count">
            {q ? '找到' : '共'} <span className="num">{list.length}</span> 位
          </span>
        </div>
        <Tabs items={SORT_TABS} value={sort} onChange={setSort} layoutId="players-sort" />
      </div>

      {list.length === 0 ? (
        <p className="empty">没有找到叫这个名字的选手</p>
      ) : (
        <motion.div
          key={`${sort}|${q}`}
          className="grid grid--4"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {list.map((p) => (
            <Link key={p.name} to={playerPath(p.name)} className="players-card card card--hover">
              <Avatar name={p.name} size={48} />
              <span className="players-card__body">
                <span className="players-card__name">{p.name}</span>
                <span className="players-card__stats">
                  <PlayerStats p={p} />
                </span>
              </span>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}
