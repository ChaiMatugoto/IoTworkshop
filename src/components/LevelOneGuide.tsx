import { levelOneSections } from '../data/levelOneGuide';

export function LevelOneGuide() {
  return <div className="level-one-guide">
    <p className="guide-lead">やりたい動きを言葉で整理し、ChatGPTでプログラムを作ります。できたコードをArduino IDEに貼り付けて、基板で動かしてみましょう。</p>
    <ol className="guide-route" aria-label="取り組みの流れ"><li>項目を整理</li><li>コードを生成</li><li>基板で実行</li></ol>
    <section className="guide-step">
      <h3><span aria-hidden="true">1</span>ChatGPTに伝える項目を整理する</h3>
      <p>課題を読んで、チームで動きを決めましょう。「センサ一覧」で、それぞれの部品に何ができるかを見てみると、使う部品や仕組みを考える手助けになります。下の4項目を開くと、各欄に何を書くか確認できます。</p>
      <div className="guide-sections">
        {levelOneSections.map(section => <details className="guide-fields" key={section.title}>
          <summary><span><strong>{section.title}</strong><small>{section.purpose}</small></span><span className="guide-toggle" aria-hidden="true">＋</span></summary>
          {section.title==='処理'&&<aside className="guide-note"><strong>「暗い」「暑い」だけでは、基板は判断できません。</strong><p>数値で判断する場合は、シリアルモニターなどで実際の値を見て、条件を決めましょう。CdSの「3000」は説明用の値です。暗いときに値が増えるか減るかも確かめてから、「未満」「以上」を選びます。</p></aside>}
          <dl>{section.fields.map(field => <div className="guide-field" key={field.name}><dt>{field.name}</dt><dd><p>{field.description}</p>{field.example && <p className="guide-field-example"><span>書き方の例</span>{field.example}</p>}</dd></div>)}</dl>
        </details>)}
      </div>
      <p className="guide-connection-note">使う部品と接続欄は同じ名前に揃えます。CdSを使うなら、接続欄にもCdSと書きましょう。</p>
    </section>
    <section className="guide-step">
      <h3><span aria-hidden="true">2</span>ChatGPTに送ってコードを作る</h3>
      <p>整理した項目を入力して送信します。確認の質問が来たら、分かる範囲で答えて、動作と接続を揃えていきましょう。</p>
      <ul><li>分からない欄には「分からない」、指定しない欄には「未指定」と書いて大丈夫です。</li><li>停止・復帰の特別な条件がいらない場合は「なし」と書きます。</li><li>情報が揃い、コードが生成されたら、プログラム全体をコピーします。</li></ul>
      <blockquote className="guide-prompt-note">未記入項目は未指定として扱い、不足事項があれば確認してからプログラムを生成してください。</blockquote>
      <p className="guide-small">上の一文を入力内容の最後に添えると、不足した項目を確認してもらいやすくなります。</p>
    </section>
    <section className="guide-step">
      <h3><span aria-hidden="true">3</span>Arduino IDEで基板に書き込む</h3>
      <ol className="guide-upload"><li>基板をUSBでパソコンにつなぎ、Arduino IDEを開きます。</li><li>新しいスケッチを開き、最初に入っているコードを、生成されたコード全体に置き換えます。コードを囲む記号や説明文は貼り付けません。</li><li>画面左上の「✓」ボタンでコードを確認します。エラーが出なければ、その隣にある「→」ボタンを押して書き込みます。書き込みが終わると、基板でプログラムが動き始めます。</li><li>センサに手を近づける、光を遮るなどして、狙った動作になるか確認します。違う動きになったら、実際の動きと困っていることをChatGPTに伝えて直していきましょう。</li></ol>
    </section>
  </div>;
}
