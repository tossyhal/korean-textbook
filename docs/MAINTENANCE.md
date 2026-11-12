# 保守の手引き

## 構成と教材

React・TypeScript・Viteのアプリです。教材は`src/content/lessons/`の週別・節別ファイル、単語帳は`src/content/wordbook/`、教材検証は`src/domain/validate-content.ts`と`scripts/content-check.ts`にあります。各節の出典URLは教材データに記録しています。内部のday1〜56のIDは保存データとの互換性のため維持してください。

文法項目や参照先の段落を変更するときは`src/content/grammar-reference-data/`の対応も確認します。現在の165項目は問題IDまたは段落番号を指定し、必要に応じて例文を指定します。IDと参照先の内容を維持し、対応が欠けた場合に無関係な問題や段落へフォールバックさせないでください。

確認テストは練習とは別の問題とし、許容解、解説、弱点の復習先、初回・再挑戦・答え閲覧後を区別します。自由作文・発話は自己評価であり、AI採点はありません。音声が未確認の細かい音の対立を採点しないでください。音声見本は`production.speakingModel`で指定でき、省略時は`production.model`を使用します。

教材を変更するときは実際に確認した一次資料と事項を記録し、言語的照合とソフトウェアの動作検証を別に扱います。未実施の母語話者照合、実音声や実機の確認を完了扱いにしないでください。現在の制約は[教材の確認状態](CONTENT_STATUS.md)、単語帳の出典は[出典](SOURCES.md)にあります。

## 検証

```sh
mise run format:check
mise run lint
mise run typecheck
mise run test
mise run content:check
mise run build
mise run test:browser
mise run test:preview
```

整形には`mise run format`を使います。`content:check`は全56節を要求する厳格検査です。制作途中の収録範囲だけを調べる`pnpm run content:check --partial`は完成判定の代わりにはなりません。ブラウザーテストにはPlaywrightのブラウザーとホストライブラリが必要です。音声・録音のモックは実機の品質を保証しません。

## 配信

GitHub Pagesの公開元はGitHub Actionsです。`main`へのpushまたは`main`を選んだ手動実行で配信ワークフローが起動し、同じコミットのCIが成功した場合にビルド成果物を配信します。プルリクエストと`main`以外へのpushではCIのみ実行します。[Actions](https://github.com/tossyhal/korean-textbook/actions)で対象コミットの検査と配信を確認してください。

Viteのbaseは`/korean-textbook/`です。リポジトリ名やカスタムドメインを変更するときは見直してください。miseのNode・pnpmの固定バージョンを更新するときは両ワークフローも合わせて更新します。公開後の音声、マイク、入力、保存の確認にはHTTPSと対象端末を使います。
