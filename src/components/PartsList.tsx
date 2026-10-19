import { parts } from '../data/parts';

/** The same sensor reference is used on its page and inside every task. */
export function PartsList() {
  return <div className="sensor-reference">
    <div className="task-parts-list">
      {parts.map(part => <details key={part.id} className="task-part-item">
        <summary>
          <img src={`${import.meta.env?.BASE_URL ?? '/'}parts/${part.image}`} alt="" width="72" height="56" loading="lazy" />
          <span><strong>{part.name}</strong><code>{part.boardLabel}</code></span>
          <span className="task-part-chevron" aria-hidden="true">＋</span>
        </summary>
        <div className="sensor-description"><span>基板の表記：<code>{part.boardLabel}</code></span><p>{part.description}</p></div>
      </details>)}
    </div>
    <p className="parts-caption">イラストは部品のイメージです。実際の部品とは形や色が異なる場合があります。</p>
  </div>;
}
