# korean-textbook

日本語話者向け8週間の韓国語学習Web教材です。全56課の完成を目指して制作中です。収録状況は[教材の制作状況](docs/CONTENT_REPORT.md)、言語・音声・動作の確認状況は[教材の確認状態](docs/CONTENT_STATUS.md)を参照してください。

## 始める

[mise](https://mise.jdx.dev/)を用意し、リポジトリのルートで実行します。Node.jsとpnpmのバージョンはmiseで固定しています。

```sh
mise install --locked
pnpm install --frozen-lockfile
mise run dev
```

表示されたURLの`/korean-textbook/`を開きます。次回からは`mise run dev`で起動できます。学習、入力、音声、バックアップや検査の詳しい手順は[利用と検証の手引き](docs/USAGE.md)を参照してください。タスク一覧は`mise tasks`で確認できます。

進捗はブラウザーの配信元（プロトコル・ホスト・ポート）ごとに保存され、同じ配信元のハッシュ移動では共有されます。端末間の自動同期はなく、ブラウザーのデータ削除で消えるため、設定画面からJSONをバックアップしてください。録音は含まれません。

GitHub Pagesへの公開は未実施です。[配信手順](docs/DEPLOYMENT.md)に準備と未実施事項を記録しています。
