// 对阵树：每条赛道（胜者组 / 败者组）一行，每一轮一列，列内的对阵纵向居中排开。
import type { BracketStage } from '../../data/types';
import { Reveal } from '../ui';
import { MatchCard } from './MatchCard';
import './BracketView.css';

export interface BracketViewProps {
  stage: BracketStage;
  mode: 'solo' | 'team';
}

export function BracketView({ stage, mode }: BracketViewProps) {
  return (
    <div className="bracket">
      {stage.tracks.map((track, ti) => (
        <section key={ti} className="bracket__track">
          {track.name && (
            <h4 className="bracket__track-name">
              <span>{track.name}</span>
            </h4>
          )}
          <div className="bracket__scroll">
            <div className="bracket__rounds" style={{ ['--rounds' as string]: track.rounds.length }}>
              {track.rounds.map((round, ri) => (
                <div key={ri} className="bracket__round">
                  <p className="bracket__round-title">
                    <span className="bracket__step num">{ri + 1}</span>
                    {round.title}
                    {ri < track.rounds.length - 1 && <span className="bracket__arrow" aria-hidden />}
                  </p>
                  <div className="bracket__matches">
                    {round.matches.map((m, mi) => (
                      <Reveal key={m.id} delay={ri * 0.08 + mi * 0.04} className="bracket__match">
                        <MatchCard match={m} mode={mode} compact />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
