type ReferenceHeaderProps = { active: 'parts' | 'hints' };

export function ReferenceHeader({ active }: ReferenceHeaderProps) {
  return <header className="reference-header">
    <a className="reference-back" href="#/">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12" /></svg>
      マップに戻る
    </a>
    <a className="reference-brand" href="#/">都市課題マップ<span aria-hidden="true">.</span></a>
    <nav className="reference-nav" aria-label="ワークショップの資料">
      <a href="#/parts" aria-current={active === 'parts' ? 'page' : undefined}>センサ一覧</a>
      <a href="#/hints" aria-current={active === 'hints' ? 'page' : undefined}>ヒント</a>
    </nav>
  </header>;
}
