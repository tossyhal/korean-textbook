# 韓国語の教科書

日本語話者向けの韓国語学習Web教材です。全8章・56節を通して、文字や発音から会話の実践まで学べます。

**[韓国語の教科書を開く](https://tossyhal.github.io/korean-textbook/)**

## 学び方

各節は「本文」「練習」「実践」「確認テスト」の4段階で進みます。確認テストは練習とは別の問題で、結果や弱点から復習できます。途中の節から始めたり、進捗を確認したりすることもできます。

853項目の単語帳や文法の参照画面を用意しています。文字や単語を押して端末の韓国語音声を聞けるほか、録音との聞き比べや韓国語の入力練習もできます。使い方は[利用と検証の手引き](docs/USAGE.md)をご覧ください。

進捗はブラウザーの配信元ごとに保存され、端末間では自動同期されません。ブラウザーのデータを削除すると消えるため、ホームの「データ管理」からJSONでバックアップできます。録音はバックアップに含まれません。

全56節の実装と公開は完了しています。教材の言語と音声は全節で未確認として記録しており、全文の母語話者照合、端末音声の実聴、録音品質、実IME、iPhone・Windows実機での確認は未実施です。詳しくは[教材の確認状態](docs/CONTENT_STATUS.md)をご覧ください。

## ローカルで動かす

[mise](https://mise.jdx.dev/)を用意し、リポジトリのルートで次を実行します。

```sh
mise install --locked
pnpm install --frozen-lockfile
mise run dev
```

表示されたURLの`/korean-textbook/`を開きます。React、TypeScript、Viteで構築し、pnpmとmiseで環境を管理しています。検証にはVitest、oxlint、oxfmtなどを使用します。

## ドキュメント

- [利用と検証の手引き](docs/USAGE.md)
- [保守の手引き](docs/MAINTENANCE.md)
- [教材の確認状態](docs/CONTENT_STATUS.md)
- [出典](docs/SOURCES.md)
