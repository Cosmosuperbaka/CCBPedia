// 多人房间卡片：展示一个房间 / 一个小组的结果。
// 有分数时为「计分形态」（逐行分数条 + 晋级线），否则为「名单形态」（自动换行的选手列表）。
import { Fragment, type ReactNode } from 'react';
import type { Lobby, LobbyRow, RowStatus } from '../../data/types';
import { formatDate, lobbyHasScores, rowStatus, rowTotal } from '../../lib/match';
import { PlayerChip, PlayerList, ScoreBar, StatusTag } from '../ui';
import './LobbyCard.css';

export interface LobbyCardProps {
  lobby: Lobby;
  /** team 时 row.name 是队伍名、row.team 是队员 */
  mode: 'solo' | 'team';
}

/** 需要整行弱化的状态 */
const DIM_STATUS: ReadonlySet<RowStatus> = new Set<RowStatus>(['absent', 'forfeit', 'out']);

const isDim = (s: RowStatus | undefined) => s != null && DIM_STATUS.has(s);

/** 带符号的数字：+8 / −6（使用真正的减号） */
const signed = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `+${n}`);

/** 分解行的各个片段；没有 carry / bonus / deduct 时返回空数组 */
function breakdownParts(r: LobbyRow): { label: string; value: string }[] {
  if (r.carry == null && r.bonus == null && r.deduct == null) return [];
  const parts: { label: string; value: string }[] = [];
  if (r.carry != null) parts.push({ label: '带入', value: String(r.carry) });
  if (r.score != null) parts.push({ label: '本轮', value: String(r.score) });
  if (r.bonus != null) parts.push({ label: '排名', value: signed(r.bonus) });
  if (r.deduct != null) parts.push({ label: '扣减', value: signed(-Math.abs(r.deduct)) });
  return parts;
}

/** 头部：房间名 + 日期，右侧人数 */
function LobbyHead({ lobby, mode }: LobbyCardProps) {
  const n = lobby.rows.length;
  const members = mode === 'team' ? lobby.rows.reduce((s, r) => s + (r.team?.length ?? 0), 0) : 0;
  const count = mode === 'team' ? (members > 0 ? `${n} 队 · ${members} 人` : `${n} 队`) : `${n} 人`;
  return (
    <header className="lobby-card__head">
      <div className="lobby-card__title">
        {lobby.name && <h3 className="lobby-card__name serif">{lobby.name}</h3>}
        {lobby.date && <span className="lobby-card__date num">{formatDate(lobby.date)}</span>}
      </div>
      <span className="lobby-card__count">{count}</span>
    </header>
  );
}

/** 行内备注（小字） */
function RowNote({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <span className="lobby-card__note">{children}</span>;
}

// ───────────────────────── 计分形态 ─────────────────────────

function ScoredBody({ lobby, mode }: LobbyCardProps) {
  const totals = lobby.rows.map(rowTotal);
  const max = Math.max(0, ...totals.map((t) => t ?? 0));
  const statuses = lobby.rows.map((_, i) => rowStatus(lobby, i));
  const hasStatus = statuses.some((s) => s != null);
  const cutAfter =
    lobby.advance != null && lobby.advance > 0 && lobby.advance < lobby.rows.length ? lobby.advance : undefined;

  return (
    <ol className={`lobby-card__table ${hasStatus ? '' : 'lobby-card__table--plain'}`}>
      {lobby.rows.map((row, i) => {
        const total = totals[i];
        const status = statuses[i];
        const dim = isDim(status);
        const parts = breakdownParts(row);
        const lead = i === 0;
        return (
          <Fragment key={`${i}-${row.name}`}>
            <li
              className={`lobby-card__row ${dim ? 'lobby-card__row--dim' : ''} ${lead ? 'lobby-card__row--lead' : ''}`}
            >
              <span className="lobby-card__rank num">{i + 1}</span>

              <div className="lobby-card__who">
                {mode === 'team' ? (
                  <>
                    <div className="lobby-card__line">
                      <span className="lobby-card__team">{row.name}</span>
                      <RowNote>{row.note}</RowNote>
                    </div>
                    {row.team && row.team.length > 0 && <PlayerList names={row.team} dim={dim} />}
                  </>
                ) : (
                  <div className="lobby-card__line">
                    <PlayerChip name={row.name} dim={dim} />
                    <RowNote>{row.note}</RowNote>
                  </div>
                )}
              </div>

              <span className="lobby-card__bar">
                {total != null && max > 0 && <ScoreBar ratio={total / max} strong={lead} delay={i * 0.04} />}
              </span>

              {total != null ? (
                <span className="lobby-card__score num">{total}</span>
              ) : (
                <span className="lobby-card__score lobby-card__score--none" aria-label="无分数">
                  —
                </span>
              )}

              {hasStatus && <span className="lobby-card__status">{status && <StatusTag status={status} />}</span>}

              {parts.length > 0 && (
                <span className="lobby-card__parts">
                  {parts.map((p, k) => (
                    <span key={p.label} className="lobby-card__part">
                      {k > 0 && <span className="lobby-card__dot"> · </span>}
                      {p.label} <span className="num">{p.value}</span>
                    </span>
                  ))}
                </span>
              )}
            </li>
            {cutAfter === i + 1 && (
              <li className="lobby-card__cut" role="separator" aria-label="晋级线">
                <span className="lobby-card__cut-label">晋级线</span>
              </li>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}

// ───────────────────────── 名单形态 ─────────────────────────

function RosterBody({ lobby, mode }: LobbyCardProps) {
  if (mode === 'team') {
    return (
      <ul className="lobby-card__teams">
        {lobby.rows.map((row, i) => {
          const status = rowStatus(lobby, i);
          const dim = isDim(status);
          return (
            <li key={`${i}-${row.name}`} className={`lobby-card__team-row ${dim ? 'lobby-card__row--dim' : ''}`}>
              <div className="lobby-card__line">
                <span className="lobby-card__team">{row.name}</span>
                {status && <StatusTag status={status} />}
                <RowNote>{row.note}</RowNote>
              </div>
              {row.team && row.team.length > 0 && <PlayerList names={row.team} dim={dim} />}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="lobby-card__roster">
      {lobby.rows.map((row, i) => {
        const status = rowStatus(lobby, i);
        return (
          <li key={`${i}-${row.name}`} className="lobby-card__entry">
            <PlayerChip name={row.name} dim={isDim(status)} />
            {status && <StatusTag status={status} />}
            <RowNote>{row.note}</RowNote>
          </li>
        );
      })}
    </ul>
  );
}

/** 多人房间卡片 */
export function LobbyCard({ lobby, mode }: LobbyCardProps) {
  const scored = lobbyHasScores(lobby);
  return (
    <section className={`lobby-card card ${scored ? 'lobby-card--scored' : 'lobby-card--roster'}`}>
      <LobbyHead lobby={lobby} mode={mode} />
      {scored ? <ScoredBody lobby={lobby} mode={mode} /> : <RosterBody lobby={lobby} mode={mode} />}
      {lobby.note && <p className="lobby-card__foot">{lobby.note}</p>}
    </section>
  );
}
