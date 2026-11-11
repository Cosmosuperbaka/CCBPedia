// 按阶段类型分发到对应的视图组件
import type { Stage } from '../../data/types';
import { Reveal } from '../ui';
import { BracketView } from './BracketView';
import { LadderView } from './LadderView';
import { LobbyCard } from './LobbyCard';
import { MatchCard } from './MatchCard';
import { RoundRobinView } from './RoundRobinView';
import { SwissView } from './SwissView';
import './StageView.css';

export interface StageViewProps {
  stage: Stage;
  mode: 'solo' | 'team';
}

export function StageView({ stage, mode }: StageViewProps) {
  switch (stage.kind) {
    case 'lobbies':
      return (
        <div className={`stage-grid stage-grid--lobbies ${stage.lobbies.length === 1 ? 'stage-grid--single' : ''}`}>
          {stage.lobbies.map((l, i) => (
            <Reveal key={i} delay={Math.min(i * 0.06, 0.24)}>
              <LobbyCard lobby={l} mode={mode} />
            </Reveal>
          ))}
        </div>
      );
    case 'matches':
      return (
        <div className="stage-grid">
          {stage.matches.map((m, i) => (
            <Reveal key={m.id} delay={Math.min(i * 0.06, 0.24)}>
              <MatchCard match={m} mode={mode} />
            </Reveal>
          ))}
        </div>
      );
    case 'bracket':
      return <BracketView stage={stage} mode={mode} />;
    case 'roundRobin':
      return <RoundRobinView stage={stage} mode={mode} />;
    case 'swiss':
      return <SwissView stage={stage} mode={mode} />;
    case 'ladder':
      return <LadderView stage={stage} />;
  }
}

/** 阶段类型的中文名，用在阶段标题旁 */
export const STAGE_KIND_LABEL: Record<Stage['kind'], string> = {
  lobbies: '多人房间',
  matches: '对阵',
  bracket: '对阵树',
  roundRobin: '单循环',
  swiss: '瑞士轮',
  ladder: '自由约战',
};
