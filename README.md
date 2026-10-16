# 都市課題マップ

13のIoT課題を探して解決するワークショップ用アプリ。React + TypeScript + Vite + Tailwind CSSと、共有進捗用のSupabaseを使います。IoT機器・Googleスプレッドシートとの連携は参加者が作る課題です。

## ローカル起動

Node.js 22以上を推奨。

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run build
npm run preview
```

開発URLは http://127.0.0.1:5173 。Supabase未設定でもチーム名入力・街の探索・課題表示ができます。ポイントの獲得と共有には[初回設定](supabase/README.md)が必要です。

矢印キー / WASD・スマホの方向ボタンで移動。近づくと課題名と「Eキーで見る」が表示され、E・クリック・タップで開きます。×・Esc・Eで閉じ、入力中のEは文字入力を優先します。全体マップ・課題・ダイアログ表示中は移動を停止します。

## ポイントと運営

レベル1は7問×10pt、レベル2は4問×25pt、レベル3は2問×40pt、合計250pt。運営から受け取った正しい4桁コードで初回のみ加算します。DB側で検証・集計し、クライアントから得点を送信しません。運営画面 `#/admin` はログイン不要で、チーム名・合計点・完了課題を5秒ごとに更新します。URLを知っている人は全チームの閲覧・リセットができます。

## 編集場所

- `src/data/issues.ts`: 課題ID・位置・レベル・点数・タイトル・説明・使用部品・実装条件・場面。
- `scripts/task-codes.json`: 運営用の課題コード。公開用バンドルには含みません。
- `src/data/map.ts`: 2100×1575の座標、建物・川・橋・道路・通行判定。
- `src/components/CityMap.tsx`, `PixelSprites.tsx`, `BuildingVariants.tsx`, `IssueIllustration.tsx`: 街・主人公・場面別の独立したSVG素材。
- `src/components/IssuePanel.tsx`, `Progress.tsx`, `TeamSetup.tsx`: 課題・得点・参加UI。
- `src/hooks/useMovement.ts`: 時間差ベースの移動とタッチ操作。
- `src/storage.ts`: 端末の位置と旧保存データの復元。
- `src/hooks/useRemoteTeam.ts`, `src/lib/cloud.ts`: 共有サーバーとの接続。
- `src/components/AdminDashboard.tsx`: ログイン不要の運営一覧・自動更新。
- `supabase/migrations/001_workshop.sql`: DB・権限・得点処理。

描画と通行判定は共通の論理座標を使います。装飾の木・池・公園は通行可能。マーカーはLv.1紫、Lv.2青、Lv.3オレンジ。街の面積は当初の約3.5倍です。

## 保存の制限

進捗はSupabase、主人公の位置はlocalStorageの `urban-issue-map:v1` に保存します。匿名ログインのセッションもブラウザ内に保持します。ブラウザデータ削除・別端末ではチームを引き継げません。参加者のメールログインや端末引継ぎはありません。ネットワークが利用できない間はコードを提出できません。未設定時のローカルプレビューでは加点できません。既存の端末内進捗をサーバーへ自動移行しません。

## GitHub Pages

公開先は `ChaiMatugoto/IoTworkshop` です。PagesのSourceをGitHub Actionsにし、[接続用Variables](supabase/README.md)を設定してください。`.github/workflows/deploy.yml` がテスト・ビルド・デプロイします。公開はActionsから手動実行します。Viteは `GITHUB_REPOSITORY` から実際のリポジトリ名に合うbaseを算出し、`ユーザー名.github.io` では `/` を使います。カスタムドメインでは `VITE_BASE_PATH=/` で上書きできます。

## 検証

`npm test` で全13課題の点数・配置・到達可能性、保存復元・破損データ、DBのコード検証・二重加算防止・権限・リセットを確認します。DBテストのAuth・ハッシュ関数は代替実装です。実際のSupabaseログイン・通知・ブラウザでの連携確認はプロジェクト作成後に必要です。

## 管理者の全チームリセット

既存プロジェクトでは `supabase/migrations/002_admin_reset.sql` をSQL Editorで一度実行してください（初回構築でも001の後に002を実行）。管理者画面の「全チームをリセット」から確認欄に「リセット」と入力すると、その開催回のチーム名・得点・完了を全削除します。別開催回・課題・コード・管理者は維持します。参加者は5秒ごとの確認でチーム名入力に戻ります。オフラインの場合は接続復帰後に戻ります。匿名セッション自体は維持し、再登録できます。削除は取り消せません。

参加登録はチーム名のみです。既存のSupabaseでは `supabase/migrations/003_no_join_code.sql` をSQL Editorで実行してください。課題の4桁パスワードは維持します。

運営画面の認証解除には `supabase/migrations/004_public_admin.sql` をSQL Editorで実行します。参加画面には運営画面へのリンクを表示しません。

課題パスワードの `scripts/task-codes.json`、`.env.local`、運営用SQL・コード一覧はGitに含めません。GitHub PagesはActionsの「Deploy to GitHub Pages」から手動で実行します。サイトの予定URLは https://chaimatugoto.github.io/IoTworkshop/ です。

## 結果発表

管理画面の「結果発表を開く」、または `/#/admin/results` で発表画面を開けます。開始画面→下位から順位→チーム名→得点→最終一覧を、クリック・左右矢印・画面ボタンで操作します。Space/Enterでも次へ、Homeで最初へ戻れます。同点は同順位（1位・1位・3位）。取得時点の結果を固定し、開始画面の「結果を再取得」で更新します。全画面表示に対応し、最終一覧は8チームごとにページを分けます。
