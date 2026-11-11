// 对阵卡片：把一场 BO1 / BO3 排成记分牌——每方一行，大比分一列，每一图一列。
import type { CSSProperties } from 'react';
import type { Game, Match, Side } from '../../data/types';
import { formatDate, gameWinner, matchWinner, seriesScore, type SideKey } from '../../lib/match';
import { PlayerChip, PlayerList } from '../ui';
import './MatchCard.css';

export interface MatchCardProps {
  match: Match;
  /** solo 时 side.name 是选手名；team 时 side.name 是队伍名、side.players 是阵容 */
  mode: 'solo' | 'team';
  /** 紧凑排版：用于对阵树的窄列 */
  compact?: boolean;
}

const MAP_LABEL = ['图一', '图二', '图三', '图四', '图五'];

const RESULT_TEXT: Record<NonNullable<Match['result']>, { win: string; lose: string }> = {
  forfeit: { win: '对手弃赛', lose: '弃赛' },
  walkover: { win: '自动晋级', lose: '人员不齐' },
};

function scoreOf(g: Game | undefined, key: SideKey): number | undefined {
  return g?.[key];
}

interface RowProps {
  match: Match;
  side: Side;
  sideKey: SideKey;
  mode: 'solo' | 'team';
  compact: boolean;
  /** 每局列数 */
  cols: number;
  showSeries: boolean;
}

function Row({ match, side, sideKey, mode, compact, cols, showSeries }: RowProps) {
  const winner = matchWinner(match);
  const won = winner === sideKey;
  const lost = winner != null && !won;
  const series = seriesScore(match)[sideKey === 'a' ? 0 : 1];
  const result = match.result ? RESULT_TEXT[match.result] : undefined;

  return (
    <div className={`match-card__row ${won ? 'is-won' : ''} ${lost ? 'is-lost' : ''}`}>
      <div className="match-card__side">
        {mode === 'team' ? (
          <>
            <span className="match-card__team">{side.name}</span>
            {side.players && side.players.length > 0 && (
              <span className="match-card__lineup">
                {compact ? (
                  side.players.map((p) => <PlayerChip key={p} name={p} plain dim={lost} />)
                ) : (
                  <PlayerList names={side.players} size={20} dim={lost} />
                )}
              </span>
            )}
          </>
        ) : (
          <PlayerChip name={side.name} size={compact ? 24 : 28} dim={lost} className="match-card__solo" />
        )}
      </div>

      {result ? (
        <span className="match-card__result">
          <span className={`tag ${won ? 'tag--win' : 'tag--outline'}`}>{won ? result.win : result.lose}</span>
        </span>
      ) : (
        <>
          {showSeries && <span className="match-card__series num">{series}</span>}
          {Array.from({ length: cols }, (_, i) => {
            const g = match.games[i];
            const value = scoreOf(g, sideKey);
            const gw = g ? gameWinner(g) : undefined;
            const tie = g != null && g.a != null && g.a === g.b && !g.ot;
            return (
              <span
                key={i}
                className={`match-card__cell num ${gw === sideKey ? 'is-game-won' : ''} ${g ? '' : 'is-empty'}`}
              >
                <span className="match-card__score">
                  {value ?? '—'}
                  {tie && gw === sideKey && <i className="match-card__dot" title="同分，先猜中者胜" />}
                </span>
                {g?.ot && <span className="match-card__ot">加时 {g.ot[sideKey === 'a' ? 0 : 1]}</span>}
              </span>
            );
          })}
        </>
      )}
    </div>
  );
}

export function MatchCard({ match, mode, compact = false }: MatchCardProps) {
  const isSeries = match.bestOf > 1;
  const hasResult = match.result != null;
  // BO3 固定画满三列；BO1 只有一列
  const cols = hasResult ? 0 : isSeries ? Math.max(match.bestOf, match.games.length) : Math.min(1, match.games.length);
  const showSeries = isSeries && !hasResult;
  const hasOt = match.games.some((g) => g.ot);
  const hasHead = match.label != null || match.date != null || isSeries;

  // repeat() 的次数不能为 0，网格至少留一列
  const style = { '--cols': Math.max(cols, 1) } as CSSProperties;
  const cls = [
    'match-card',
    'card',
    compact ? 'match-card--compact' : '',
    isSeries ? 'match-card--series' : 'match-card--single',
  ].join(' ');

  return (
    <article className={cls} style={style}>
      {hasHead && (
        <header className="match-card__head">
          <span className="match-card__meta">
            {match.label && <strong>{match.label}</strong>}
            {match.date && <span>{formatDate(match.date)}</span>}
          </span>
          <span className="match-card__tags">
            {hasOt && <span className="tag tag--warn">加时</span>}
            <span className="tag">BO{match.bestOf}</span>
          </span>
        </header>
      )}

      <div className={`match-card__board ${showSeries ? 'has-series' : ''} ${hasResult ? 'is-result' : ''}`}>
        {showSeries && (
          <div className="match-card__row match-card__row--labels" aria-hidden>
            <span />
            <span className="match-card__label">大比分</span>
            {Array.from({ length: cols }, (_, i) => (
              <span key={i} className="match-card__label">
                {MAP_LABEL[i] ?? `图${i + 1}`}
              </span>
            ))}
          </div>
        )}
        <Row match={match} side={match.a} sideKey="a" mode={mode} compact={compact} cols={cols} showSeries={showSeries} />
        <Row match={match} side={match.b} sideKey="b" mode={mode} compact={compact} cols={cols} showSeries={showSeries} />
      </div>

      {match.note && <p className="match-card__note">{match.note}</p>}
    </article>
  );
}
