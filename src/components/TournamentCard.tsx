// 赛事卡片：首页与赛事列表共用
import { Link } from 'react-router-dom';
import { SERIES, championOf } from '../data';
import type { Tournament } from '../data/types';
import { formatDate } from '../lib/match';
import { Avatar } from './ui';
import { resolvePlayer } from '../data/players';
import './TournamentCard.css';

export function tournamentDate(t: Tournament): string {
  return t.dateNote ?? formatDate(t.start, t.end);
}

export function TournamentCard({ tournament: t }: { tournament: Tournament }) {
  const champ = championOf(t);
  return (
    <Link to={`/tournaments/${t.id}`} className="t-card card card--hover">
      <div className="t-card__top">
        <span className="tag tag--accent">{SERIES[t.series].name}</span>
        <span className="tag">{t.mode === 'team' ? '团队赛' : '个人赛'}</span>
        <span className="t-card__date num">{tournamentDate(t)}</span>
      </div>

      <h3 className="t-card__name serif">{t.name}</h3>
      <p className="t-card__tagline">{t.tagline}</p>

      <div className="t-card__foot">
        {champ ? (
          <>
            <span className="t-card__avatars">
              {champ.players.map((p) => (
                <Avatar key={p} name={p} size={26} />
              ))}
            </span>
            <span className="t-card__champ">
              <span className="t-card__champ-label">冠军</span>
              <span className="t-card__champ-name">
                {champ.team ? `${champ.team} · ` : ''}
                {champ.players.map(resolvePlayer).join('、')}
              </span>
            </span>
          </>
        ) : (
          <span className="t-card__champ">
            <span className="t-card__champ-label">{t.status === 'aborted' ? '中途终止' : '不设冠军'}</span>
            <span className="t-card__champ-name t-card__champ-name--none">
              {t.status === 'aborted' ? '未决出名次' : '只记战绩'}
            </span>
          </span>
        )}
        <span className="t-card__go" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}
