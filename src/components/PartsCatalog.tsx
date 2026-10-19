import { PartsList } from './PartsList';
import { parts } from '../data/parts';
import { ReferenceHeader } from './ReferenceHeader';

export default function PartsCatalog() {
  return <div className="parts-page">
    <ReferenceHeader active="parts" />
    <main className="parts-main">
      <section className="parts-intro">
        <span className="parts-eyebrow"><i aria-hidden="true" />ワークショップの道具箱</span>
        <h1>センサ一覧<span>{parts.length}種類の部品</span></h1>
        <p>できることを知る。動かして、確かめる。</p>
      </section>
      <PartsList />
    </main>
  </div>;
}
