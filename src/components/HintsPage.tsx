import { hints } from '../data/hints';
import '../parts.css';
import '../hints.css';

export default function HintsPage() {
  return <div className="parts-page hints-page">
    <header className="parts-header">
      <a className="parts-back" href="#/">← マップへ戻る</a>
      <a className="brand" href="#/">都市課題マップ</a>
    </header>
    <main className="parts-main hints-main">
      <section className="parts-intro">
        <span className="parts-eyebrow">考えるための手がかり</span>
        <h1>ヒント</h1>
        <p>取り組んでいるレベルを開いて、ヒントを確認しよう。</p>
      </section>
      <div className="hints-list">
        {hints.map(hint => <details className={`hint-card hint-level-${hint.level}`} key={hint.level}>
          <summary>
            <span className="hint-level">レベル{hint.level}</span>
            <span className="hint-title">{hint.title}</span>
            <span className="hint-chevron" aria-hidden="true" />
          </summary>
          <div className="hint-content"><p>{hint.text}</p></div>
        </details>)}
      </div>
      <p className="parts-caption">現在のヒントは仮の内容です。</p>
    </main>
  </div>;
}
