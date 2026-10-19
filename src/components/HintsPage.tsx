import { ReferenceHeader } from './ReferenceHeader';
import { HintsList } from './HintsList';

export default function HintsPage() {
  return <div className="parts-page hints-page">
    <ReferenceHeader active="hints" />
    <main className="parts-main hints-main">
      <section className="parts-intro">
        <span className="parts-eyebrow"><i aria-hidden="true" />考えるための手がかり</span>
        <h1>ヒント</h1>
        <p>取り組んでいるレベルを開いて、ヒントを確認しよう。</p>
      </section>
      <HintsList />
    </main>
  </div>;
}
