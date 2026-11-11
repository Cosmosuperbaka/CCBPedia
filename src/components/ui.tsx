// 全站通用的基础组件。赛事视图只允许用这里的组件来展示选手、状态与入场动效。
import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { avatarOf, playerPath, resolvePlayer } from '../data/players';
import type { RowStatus } from '../data/types';
import { STATUS_LABEL } from '../lib/match';
import './ui.css';

/** 没有头像时的占位底色：按名字稳定取色 */
function tintOf(name: string): number {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) % 360;
  return h;
}

interface AvatarProps {
  name: string;
  /** 像素尺寸，默认 28 */
  size?: number;
  className?: string;
}

/** 选手头像；无头像时显示首字占位 */
export function Avatar({ name, size = 28, className = '' }: AvatarProps) {
  const canon = resolvePlayer(name);
  const src = avatarOf(canon);
  const style = { width: size, height: size, fontSize: Math.round(size * 0.42) };
  if (src) {
    return <img className={`avatar ${className}`} style={style} src={src} alt="" loading="lazy" />;
  }
  return (
    <span
      className={`avatar avatar--blank ${className}`}
      style={{ ...style, ['--tint' as string]: tintOf(canon) }}
      aria-hidden
    >
      {[...canon][0]?.toUpperCase()}
    </span>
  );
}

interface PlayerChipProps {
  name: string;
  size?: number;
  /** 不显示头像，仅名字 */
  plain?: boolean;
  /** 弱化显示（负方、淘汰等） */
  dim?: boolean;
  className?: string;
}

/** 头像 + 名字，点击进入选手页。所有出现选手名的地方都用它 */
export function PlayerChip({ name, size = 24, plain, dim, className = '' }: PlayerChipProps) {
  const canon = resolvePlayer(name);
  return (
    <Link
      to={playerPath(canon)}
      className={`player-chip ${dim ? 'player-chip--dim' : ''} ${className}`}
      // 名字被截断时靠 title 看全名；别名则顺带说明原始写法
      title={canon === name.trim() ? canon : `${canon}（记录中写作「${name.trim()}」）`}
    >
      {!plain && <Avatar name={canon} size={size} />}
      <span className="player-chip__name">{canon}</span>
    </Link>
  );
}

/** 一串选手（队伍阵容） */
export function PlayerList({ names, size = 22, dim }: { names: string[]; size?: number; dim?: boolean }) {
  return (
    <span className="player-list">
      {names.map((n) => (
        <PlayerChip key={n} name={n} size={size} dim={dim} />
      ))}
    </span>
  );
}

const STATUS_CLASS: Record<RowStatus, string> = {
  champion: 'tag--gold',
  direct: 'tag--accent',
  advance: 'tag--win',
  out: '',
  absent: 'tag--outline',
  forfeit: 'tag--outline',
};

/** 晋级 / 淘汰 / 缺席 等状态标签 */
export function StatusTag({ status, label }: { status: RowStatus; label?: string }) {
  return <span className={`tag ${STATUS_CLASS[status]}`}>{label ?? STATUS_LABEL[status]}</span>;
}

/** 名次徽章：前三名金银铜，其余为中性数字 */
export function RankBadge({ rank, size = 26 }: { rank: number; size?: number }) {
  const tone = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'plain';
  return (
    <span className={`rank-badge rank-badge--${tone} num`} style={{ width: size, height: size }}>
      {rank}
    </span>
  );
}

interface RevealProps {
  children: ReactNode;
  /** 延迟（秒），用于列表依次出现 */
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section';
}

/** 进入视口时轻微上浮淡入，只播放一次 */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
  /** 标签右侧的小字（数量等） */
  hint?: ReactNode;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** 同页有多组 Tabs 时必须各不相同，用于滑块动画 */
  layoutId: string;
  className?: string;
}

/** 分段切换：选中项下方有一块平滑滑动的底板。全站所有「切换」都用它 */
export function Tabs<T extends string>({ items, value, onChange, layoutId, className = '' }: TabsProps<T>) {
  return (
    <div className={`tabs ${className}`} role="tablist">
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`tabs__item ${active ? 'is-active' : ''}`}
            onClick={() => onChange(it.id)}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="tabs__thumb"
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              />
            )}
            <span className="tabs__label">{it.label}</span>
            {it.hint != null && <span className="tabs__hint num">{it.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

interface ScoreBarProps {
  /** 0–1 */
  ratio: number;
  /** 强调色（领先者） */
  strong?: boolean;
  delay?: number;
}

/** 横向比分条：进入视口时从 0 生长 */
export function ScoreBar({ ratio, strong, delay = 0 }: ScoreBarProps) {
  const reduce = useReducedMotion();
  // 观察外层轨道（它始终有尺寸），而不是缩放到 0 的填充条本身
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const w = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  return (
    <span className="score-bar" aria-hidden ref={ref}>
      {/* 宽度直接写在 style 上，动画只做横向缩放：长度始终正确 */}
      <motion.span
        className={`score-bar__fill ${strong ? 'score-bar__fill--strong' : ''}`}
        style={{ width: w, transformOrigin: 'left center' }}
        initial={false}
        animate={{ scaleX: reduce || inView ? 1 : 0 }}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}
