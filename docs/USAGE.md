# 利用と検証の手引き

## 起動

リポジトリのルートで初回に`mise install --locked`、`pnpm install --frozen-lockfile`を実行します。`mise run dev`で起動し、表示されたURLの`/korean-textbook/`を開きます。終了はCtrl+Cです。通常は`mise run dev`だけで再起動できます。

`mise run build`で型検査とビルドを実行し、`dist/`を生成します。`mise run preview`で生成物をローカル確認できます。表示されたURLの`/korean-textbook/`を開き、Ctrl+Cで終了します。公開手順は[配信準備](DEPLOYMENT.md)を参照してください。GitHub Pagesへの公開は未実施です。

## 学習

ホームから課を選び、本文・例文・練習を進め、練習とは別の出口テストに取り組みます。課は自由に開けます。回答の初回、再挑戦、答え閲覧後は区別され、結果画面に初回自力回答と弱点への復習先が表示されます。未実施は0点ではありません。作文・発話は自己評価で、AIによる採点はありません。

先取り診断は文字・入力・基本文の初回自力正答を目安に開始先を提案します。公式認定ではなく、聴解は未実施です。診断問題の独立した言語的照合も未実施です。

語彙や文法は手動で復習に追加・解除できます。復習画面では答えを見る前に思い出せたか、見て理解したか、思い出せなかったかを選びます。期限到来分は1日最大20件で、残りは翌日以降に取り組めます。課自体はいつでも開けます。

キーボード画面にiPhoneとWindows 11の韓国語入力の設定と練習があります。OSの画面や配列名は端末で確認してください。iPhone・Windows実機と実際のIMEは未確認です。

## 音声と録音

設定の音声診断で利用できる韓国語の合成音声を検出・試聴できます。声がない場合はOSの読み上げ音声を確認してブラウザーを再起動し、再検出してください。OSに声を追加してもブラウザーで使えるとは限りません。合成音声の発音・音質とOSの設定手順は実機未確認です。

録音比較ではマイクを許可し、録音を停止して手本と聞き比べます。録音は画面のメモリ内に保持され、必要ならダウンロードできます。画面を離れる前に保存してください。録音は送信・自動採点されず、進捗のバックアップにも含まれません。録音にはHTTPSまたはその端末自身のlocalhostが必要です。PCのlocalhostを別端末からLANのHTTPで開いても安全なコンテキストにはなりません。

ロールプレイは自分で発話を進める自己練習です。音声や録音を使えない場合は未実施のまま進めます。複数の合成音声を使う練習も、必要な声が足りない場合は未実施として扱います。

## 進捗とバックアップ

進捗はブラウザーのlocalStorageに、配信元（プロトコル・ホスト・ポート）単位で保存されます。同じ配信元では画面内のハッシュ移動で共有されます。別端末との自動同期はありません。ブラウザーのデータ削除などで消えるため、設定の「バックアップを書き出す」でJSONを保存してください。復元は「バックアップを選ぶ」で内容を確認してから適用します。適用すると現在の進捗を置き換えます。

## 開発時の検証

```sh
mise run format
mise run format:check
mise run lint
mise run typecheck
mise run test
mise run content:check
mise run content:report
mise run build
```

`format`はファイルを書き換えます。`content:check`は全56課を要求する厳格検査で、教材が不足する制作途中は失敗します。収録済みの範囲だけを確認するには`pnpm run content:check -- --partial`を使います。完成判定の代わりにはなりません。`content:report`は[制作状況](CONTENT_REPORT.md)を再生成します。

Chromiumのブラウザーテストはブラウザーと必要なホストライブラリを用意して実行します。

```sh
pnpm exec playwright install --with-deps chromium
mise run test:browser
```

Desktop WebKitは同様にホストのライブラリが必要です。

```sh
pnpm exec playwright install --with-deps webkit
pnpm exec playwright test --config playwright.webkit.config.ts
```

ホストへの依存導入ができないLinuxでは、依存インストール済みのリポジトリで別ターミナルから`mise run dev -- --host 127.0.0.1`を起動し、公式イメージを使えます。

```sh
docker run --rm --network host --user "$(id -u):$(id -g)" -v "$PWD:/work" -w /work mcr.microsoft.com/playwright:v1.65.0-noble node node_modules/@playwright/test/cli.js test --config playwright.webkit.config.ts
```

このDocker例はLinuxのホストネットワークと起動中の127.0.0.1:5173を前提とします。Desktop WebKitはiPhone実機やiOS Safariの代わりではありません。ブラウザーテストの音声・録音はモックで、実音声・実マイクの品質は確認しません。教材の言語全文の専門家による照合、実音声、iPhone・Windows実機の確認状況は[教材の確認状態](CONTENT_STATUS.md)と各検証記録を参照してください。
