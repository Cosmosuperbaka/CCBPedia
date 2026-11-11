// 首页：站点简介与统计 → 最新赛事 → 系列赛 → 年度前列 → 冠军名录
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { SERIES, championOf, siteStats, tournaments } from '../data';
import { seasons } from '../data/rankings';
import type { SeriesId } from '../data/types';
import { TournamentCard, tournamentDate } from '../components/TournamentCard';
import { Avatar, PlayerChip, PlayerList, RankBadge, Reveal } from '../components/ui';
import './HomePage.css';

const BASE = import.meta.env.BASE_URL;

/** 进入视口时从 0 数到目标值 */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="stat__value">
      {shown}
    </span>
  );
}

export function HomePage() {
  const latest = tournaments.slice(0, 3);
  const season = seasons[0];
  const poster = tournaments.find((t) => t.cover);

  const seriesList = (Object.keys(SERIES) as SeriesId[])
    .map((id) => {
      const list = tournaments.filter((t) => t.series === id);
      return { info: SERIES[id], list, latest: list[0] };
    })
    .filter((s) => s.list.length > 0)
    .sort((a, b) => a.list.at(-1)!.start.localeCompare(b.list.at(-1)!.start));

  const champions = tournaments.filter((t) => championOf(t));

  return (
    <div className="page container home">
      {/* ── 开篇 ── */}
      <section className="hero">
        <div className="hero__text">
          <p className="eyebrow">CCB Tournament Encyclopedia</p>
          <h1 className="hero__title serif">
            猜猜呗
            <br />
            赛事百科
          </h1>
          <p className="hero__lead">
            记录「二刺猿笑传之猜猜呗」每一届赛事的赛程、比分与选手——从多人混战、瑞士轮到 BO3 对阵，都按各自的赛制原样呈现。
          </p>
          <div className="hero__actions">
            <Link to="/tournaments" className="btn btn--primary">
              浏览全部赛事
            </Link>
            <Link to="/rankings" className="btn">
              {season.year} 年度榜单
            </Link>
          </div>
          <dl className="hero__stats">
            <div className="stat">
              <CountUp value={siteStats.tournaments} />
              <dt className="stat__label">届赛事</dt>
            </div>
            <div className="stat">
              <CountUp value={siteStats.players} />
              <dt className="stat__label">位选手</dt>
            </div>
            <div className="stat">
              <CountUp value={siteStats.games} />
              <dt className="stat__label">场对局</dt>
            </div>
          </dl>
        </div>

        {poster && (
          <Link to={`/tournaments/${poster.id}`} className="hero__poster" aria-label={`${poster.name} 冠军海报`}>
            <img src={`${BASE}${poster.cover}`} alt="" />
            <span className="hero__poster-cap">
              <strong className="serif">{poster.name}</strong>
              <span>冠军海报 →</span>
            </span>
          </Link>
        )}
      </section>

      {/* ── 最新赛事 ── */}
      <section className="section">
        <div className="section__head">
          <h2 className="section__title">最新赛事</h2>
          <Link to="/tournaments" className="link section__desc">
            全部 {tournaments.length} 届 →
          </Link>
        </div>
        <div className="grid grid--3">
          {latest.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.07}>
              <TournamentCard tournament={t} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 系列赛 ── */}
      <section className="section">
        <div className="section__head">
          <h2 className="section__title">系列赛</h2>
          <span className="section__desc">不同系列，赛制各不相同</span>
        </div>
        <div className="grid grid--3">
          {seriesList.map((s, i) => {
            const champ = championOf(s.latest);
            return (
              <Reveal key={s.info.id} delay={Math.min(i * 0.05, 0.25)}>
                <Link to={`/tournaments?series=${s.info.id}`} className="series card card--hover">
                  <p className="series__head">
                    <strong className="series__name serif">{s.info.name}</strong>
                    <span className="series__count num">
                      {s.list.length}
                      <small>届</small>
                    </span>
                  </p>
                  <p className="series__desc">{s.info.desc}</p>
                  <p className="series__latest">
                    <span className="faint">最近一届</span>
                    <span>{s.latest.name}</span>
                    {champ && (
                      <span className="series__champ">
                        {champ.players.slice(0, 3).map((p) => (
                          <Avatar key={p} name={p} size={20} />
                        ))}
                      </span>
                    )}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── 年度前列 ── */}
      <section className="section">
        <div className="section__head">
          <h2 className="section__title">{season.year} 年度积分榜</h2>
          <Link to="/rankings" className="link section__desc">
            完整榜单 →
          </Link>
        </div>
        <Reveal className="card top5">
          {season.board.slice(0, 5).map((row) => (
            <div key={row.player} className="top5__row">
              <RankBadge rank={row.rank} size={30} />
              <PlayerChip name={row.player} size={32} className="top5__player" />
              <span className="top5__bar">
                <span style={{ width: `${(row.points / season.board[0].points) * 100}%` }} />
              </span>
              <span className="top5__pts num">{row.points}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── 冠军名录 ── */}
      <section className="section">
        <div className="section__head">
          <h2 className="section__title">冠军名录</h2>
          <span className="section__desc">每一届的最终赢家</span>
        </div>
        <Reveal className="card roll">
          {champions.map((t) => {
            const c = championOf(t)!;
            return (
              <div key={t.id} className="roll__row">
                <span className="roll__date num">{tournamentDate(t)}</span>
                <Link to={`/tournaments/${t.id}`} className="roll__name serif">
                  {t.name}
                </Link>
                <span className="roll__champ">
                  {c.team && <span className="roll__team">{c.team}</span>}
                  <PlayerList names={c.players} size={22} />
                </span>
              </div>
            );
          })}
        </Reveal>
      </section>
    </div>
  );
}
