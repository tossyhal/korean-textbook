# 配信準備の限定レビュー

2026-11-12。新規Solレビュー。README、CI・Pages workflow、配信手順・検証記録、mise・pnpm・Vite・Vitest・Playwright設定を確認した。この範囲で実行を妨げるP1/P2の指摘はない。公開リポジトリの許可とPages公開の実行許可は分け、公開操作は行っていない。

## 確認結果

- Pages workflowは`workflow_dispatch`のみで起動し、対象を`main`と`develop`に制限する。厳格教材検査が失敗するとビルド・配信へ進まない。deployはbuildに依存し、`pages: write`と`id-token: write`をdeployジョブに限定している。`github-pages`環境と配信URLの指定もある。[GitHub公式の要件](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)と整合する。
- [checkoutのv7](https://github.com/actions/checkout/releases/tag/v7)と[setup-nodeのv7](https://github.com/actions/setup-node/releases/tag/v7)は公式リリースページで実在を確認した。Pages関連Actionsの指定は前記公式手順と整合する。
- CIとローカルは同じpackage scriptsを使い、整形、lint、型、単体、厳格教材、ビルド、Chromiumブラウザーテストを実行する。Node.js 24.22.1とpnpm 12.11.2はmise.lockとworkflowで一致する。CIは教材検査が失敗しても他の検査を続行し、失敗自体は保持する。
- Viteのbase、PlaywrightのbaseURL、READMEの起動先は`/korean-textbook/`で一致する。アプリはhashで画面を切り替えるため、画面遷移にPages側のSPAリライトを必要としない。生成したdist/index.htmlのJS・CSS参照も同じbaseを含む。
- READMEと配信手順は未完成の教材、実音声、実機、ローカルHTTPS、GitHub上のworkflow実行を確認済みと扱っていない。厳格教材検査の失敗は全56課が未完成である現状の保護として妥当であり、検査を弱める必要はない。

## 本レビューで実行した検証と限界

`mise run build`は成功し、TypeScript検査とViteビルドを通過した。`git diff --check`は成功した。`gitleaks git --redact --no-banner`は12コミットを検査して検出なし、`gitleaks dir --redact --no-banner .github`も検出なしだった。秘密検査の範囲は履歴とworkflowディレクトリであり、未コミットの全ファイルを網羅した結果ではない。

起動、依存導入、format、lint、単体・ブラウザーテスト、厳格教材検査は本レビューでは再実行していない。それらの実施結果は配信準備の検証記録を参照する。GitHub上の権限設定・環境保護・workflow実行、push、Pages公開、実音声・実機・録音は未検証。公開後の動作を保証するレビューではない。設定やアプリの編集は行っていない。
