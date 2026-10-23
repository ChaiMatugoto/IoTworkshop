export function LevelTwoGuide() {
  return <div className="level-one-guide level-two-guide">
    <p className="guide-lead">レベル2では、スプレッドシートを「離れた場所から指示する画面」や「測定結果を残すノート」として使います。ChatGPTで作った2つのプログラムを、GASとESP32にそれぞれ入れて、インターネットでつなぎます。</p>

    <section className="guide-concept" aria-labelledby="gas-concept-title">
      <h3 id="gas-concept-title">まずは、つながりを知ろう</h3>
      <ol className="gas-flow" aria-label="スプレッドシート、GAS、ESP32のつながり">
        <li><strong>スプレッドシート</strong><span>指示を書く・記録を見る</span></li>
        <li><strong>GAS</strong><span>指示やデータを受け渡す</span></li>
        <li><strong>ESP32</strong><span>部品を動かす・値を測る</span></li>
      </ol>
      <p>GASは、Google Apps Script（グーグル・アップス・スクリプト）の略です。Google側で動くプログラムで、シートの値を読み取ったり、新しい行に記録したりできます。ESP32はWi-FiでGASにアクセスします。</p>
      <dl className="gas-use-cases"><div><dt>街灯を遠隔操作するなら</dt><dd>シートに「ON」と書く → GASがその指示を返す → ESP32が受け取り、LEDをつける。</dd></div><div><dt>温度を記録するなら</dt><dd>ESP32が温度を測る → GASへ送る → GASがシートの新しい行に日時と温度を記録する。</dd></div></dl>
      <p className="guide-small">シートを開いただけでESP32とつながるわけではありません。間に入るGASと、ESP32側のプログラムの両方が必要です。</p>
    </section>

    <section className="guide-step">
      <h3><span aria-hidden="true">1</span>スプレッドシートを開く</h3>
      <p>ブラウザの隣のタブに、ワークショップ用のスプレッドシートを用意しています。そのタブをクリックして開きましょう。</p>
    </section>

    <section className="guide-step">
      <h3><span aria-hidden="true">2</span>ChatGPTで2つのプログラムを作る</h3>
      <p>レベル1と同じように、入力・処理・アウトプット・接続を整理します。さらに、シートで「何を読み取るか」「何を記録するか」「どのセルや列を使うか」「何秒ごとに通信するか」を伝えましょう。</p>
      <p>ChatGPTに表示される項目に沿って答えましょう。下は、課題とは別の「スプレッドシートの文字でブザーを鳴らす」練習例です。書き方の参考にして、自分たちの課題で必要な内容を考えましょう。</p>
      <div className="gas-input-example">
        <div className="guide-fields"><h4>1. 入力（センサ・スイッチなど）</h4><dl>
          <div className="guide-field"><dt>使う部品・データ元</dt><dd>GoogleスプレッドシートのB2セル</dd></div>
          <div className="guide-field"><dt>読み取る情報</dt><dd>「鳴らす」または「止める」という文字</dd></div>
          <div className="guide-field"><dt>読み取る間隔・タイミング</dt><dd>5秒に1回</dd></div>
        </dl></div>
        <div className="guide-fields"><h4>2. 処理（判断・ルール）</h4><dl>
          <div className="guide-field"><dt>判断する条件</dt><dd>B2セルの文字が「鳴らす」か</dd></div>
          <div className="guide-field"><dt>条件に当てはまるときの動作</dt><dd>ブザーを鳴らす</dd></div>
          <div className="guide-field"><dt>条件に当てはまらないときの動作</dt><dd>ブザーを止める</dd></div>
          <div className="guide-field"><dt>動作を止める・元に戻す条件</dt><dd>「止める」に書き換えたら、次の読み取りでブザーを止める。電源を入れた直後や通信に失敗したときも鳴らさない</dd></div>
        </dl></div>
        <div className="guide-fields"><h4>3. アウトプット（動作・表示）</h4><dl>
          <div className="guide-field"><dt>動かす部品・表示先・記録先</dt><dd>ブザー</dd></div>
          <div className="guide-field"><dt>具体的な動作・表示内容</dt><dd>B2セルが「鳴らす」の間は音を鳴らし、それ以外の文字や空欄なら音を止める</dd></div>
        </dl></div>
      </div>
      <p className="guide-small">シートIDなど、追加で聞かれた情報は確認して答えましょう。</p>
      <dl className="gas-code-destinations"><div><dt>GAS用のコード</dt><dd>次の手順で開く、Apps Scriptの画面に貼り付けます。</dd></div><div><dt>Arduino IDE用のコード</dt><dd>ESP32に書き込むコードです。あとでGASのURLやWi-Fiの情報を入れて使います。</dd></div></dl>
      <p className="guide-small">GAS用とArduino IDE用は別のプログラムです。まとめて同じ画面に貼り付けないようにしましょう。</p>
    </section>

    <section className="guide-step">
      <h3><span aria-hidden="true">3</span>GASを開いてコードを貼り付ける</h3>
      <ol className="guide-upload"><li>使うスプレッドシートを開いたまま、上のメニューの「拡張機能」→「Apps Script」をクリックします。別のタブにGASの編集画面が開きます。</li><li>左側の「コード.gs」（または「Code.gs」）を選びます。最初から入っているコードをすべて消し、ChatGPTが生成した「GAS用のコード」全体を貼り付けます。コードを囲む記号や説明文は貼り付けません。</li></ol>
      <p className="guide-small">この段階では、上の「実行」ボタンを押す必要はありません。ESP32からアクセスできるようにするため、次の「デプロイ」を行います。</p>
    </section>

    <section className="guide-step">
      <h3><span aria-hidden="true">4</span>シートIDを確認する</h3>
      <p>生成されたコードにシートIDの設定欄がある場合は、用意されているスプレッドシートのIDを入れます。たとえば、<code>SPREADSHEET_ID</code> という名前で書かれています。</p>
      <div className="gas-sheet-url"><span>スプレッドシートを開いたときのURL</span><code>https://docs.google.com/spreadsheets/d/<mark>ここがシートID</mark>/edit</code></div>
      <dl className="gas-settings"><div><dt>シートID</dt><dd>ブラウザのURLにある <code>/d/</code> と <code>/edit</code> の間の長い文字列です。コードがIDを求めている場合は、URL全部ではなく、この部分だけを入れます。</dd></div><div><dt>セル・列の場所</dt><dd>読み取る場所や記録する列が、シートとコードで一致しているか確認します。街灯の例でB2を読むコードなら、指示もB2に書きます。</dd></div></dl>
      <p className="guide-small">設定欄が見つからないときは、ChatGPTに「このコードでシートID・セルをどこに設定しますか？」と聞いてください。</p>
    </section>

    <section className="guide-step">
      <h3><span aria-hidden="true">5</span>GASを「ウェブアプリ」としてデプロイする</h3>
      <p>「デプロイ」は、作ったGASをESP32から呼び出せる状態にし、接続先のURLを発行する操作です。スプレッドシートの「共有」とは別の設定です。</p>
      <ol className="guide-upload"><li>GASの編集画面の右上にある「デプロイ」→「新しいデプロイ」をクリックします。</li><li>「種類の選択」の横にある歯車のアイコンを押し、「ウェブアプリ」を選びます。</li></ol>
      <dl className="gas-deploy-settings"><div><dt>次のユーザーとして実行</dt><dd><strong>自分</strong><span>シートを操作する権限を、自分のGoogleアカウントで使います。</span></dd></div><div><dt>アクセスできるユーザー</dt><dd><strong>全員</strong><span>ESP32がGoogleへのログインなしでアクセスするための設定です。「Googleアカウントを持つ全員」ではなく、ログイン不要の「全員」を選びます。</span></dd></div></dl>
      <ol className="guide-upload" start={3}><li>設定できたら、右下の「デプロイ」を押します。</li><li>初回は「アクセスを承認」などの画面が出ます。使用するGoogleアカウントを選び、自分で作ったプロジェクト名と求められる権限の内容を確認して、許可します。</li><li>完了画面の「ウェブアプリ」の下に表示されたURLをコピーします。最後が <code>/exec</code> で終わるURLです。「デプロイID」の文字列だけをコピーしないようにしましょう。</li></ol>
      <details className="guide-fields gas-help"><summary><span><strong>承認画面や設定で止まったら</strong></span><span className="guide-toggle" aria-hidden="true">＋</span></summary><div className="gas-help-body"><p>「このアプリはGoogleで確認されていません」と出る場合があります。自分で作成したプロジェクトであることと権限の内容を確認できる場合は、「詳細」→「（プロジェクト名）に移動」から承認へ進めます。自分のものか分からない場合や、「アクセスがブロックされました」と出た場合は、運営に画面を見せてください。</p><p>学校・組織のアカウントでは、管理者の制限で「全員」を選べない場合があります。その場合も運営に相談してください。</p></div></details>
      <p className="guide-small">ログイン不要のURLを知った人は、コードが用意した機能を呼び出せます。ワークショップ用のシートを使い、個人情報などは入れないようにしましょう。シート自体の共有設定を「全員」に変える必要はありません。</p>
    </section>

    <section className="guide-step">
      <h3><span aria-hidden="true">6</span>発行されたURLをESP32側に入れる</h3>
      <p>Arduino IDE用のコードを開き、GASのURLを設定する場所に、コピーした <code>/exec</code> のURLを入れます。たとえば <code>SCRIPT_URL</code> という名前の設定欄です。</p>
      <div className="gas-exec-url"><span>使うのは、この形のURL</span><code>https://script.google.com/macros/s/…/exec</code></div>
      <ol className="guide-upload"><li>コード内のWi-Fi名とパスワードも、会場で使うものに書き換えます。ChatGPTに設定場所を聞くことはできますが、Wi-Fiのパスワードそのものを送る必要はありません。</li><li>Arduino IDEで画面左上の「✓」を押し、エラーが出なければ、その隣の「→」でESP32に書き込みます。</li><li>シートの指示を変えたり、センサを動かしたりして確認します。街灯の例ならB2に「ON」で点灯、「OFF」で消灯します。5秒ごとに読み取る設定なら、変更後は少し待ちましょう。</li></ol>
      <p className="guide-small">GASのURL・シートID・スプレッドシートのURLは、それぞれ別のものです。ESP32の接続先には、GASのウェブアプリURLを使います。</p>
    </section>

    <details className="guide-fields gas-troubleshooting"><summary><span><strong>うまく動かないときの見直し方</strong></span><span className="guide-toggle" aria-hidden="true">＋</span></summary><div className="gas-help-body"><dl className="gas-settings"><div><dt>街灯の例で、URLを開いてもON／OFFが出ない</dt><dd>まずはB2の値とシートIDを確認します。「ERROR」は、GASが期待した指示を返せていない状態です。ログイン画面になるなら、デプロイのアクセス設定も確認します。この確認方法は街灯の例で、記録用などのコードでは応答が異なります。</dd></div><div><dt>記録する課題で、URLを開いても動かない</dt><dd>ESP32からデータを送ったときだけ動くコードもあります。ブラウザで開くだけでは確認できないので、ESP32を動かして、シートに行が増えるか確認します。</dd></div><div><dt>コードを直しても動作が変わらない</dt><dd>GASなら「新しいデプロイ」で発行したURLをESP32側に設定したか、Arduino IDEの「→」で書き込んだかを確かめます。</dd></div><div><dt>ESP32だけ動かない</dt><dd>Wi-Fiの設定、GASのURL、実際に部品をつないだポートを確認します。分からなければ、エラー表示やシリアルモニターの内容、期待する動きと実際の動きをChatGPTに伝えましょう。</dd></div></dl></div></details>
  </div>;
}
