import { LevelTwoGuide } from './LevelTwoGuide';
import { LevelOneGuide } from './LevelOneGuide';
import { LevelThreeGuide } from './LevelThreeGuide';
import { hints } from '../data/hints';

/** All three levels are available in every location; no task-specific filtering. */
export function HintsList() {
  return <div className="hint-reference">
    <div className="hints-list">
      {hints.map(hint => <details className={`hint-card hint-level-${hint.level}`} key={hint.level}>
        <summary>
          <span className="hint-level">レベル{hint.level}</span>
          <span className="hint-title">{hint.title}</span>
          <span className="hint-chevron" aria-hidden="true" />
        </summary>
        <div className="hint-content">{hint.level===1?<LevelOneGuide/>:hint.level===2?<LevelTwoGuide/>:<LevelThreeGuide/>}</div>
      </details>)}
    </div>
  </div>;
}
