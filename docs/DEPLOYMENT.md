# 配信準備

GitHubリポジトリは作成済み。公開操作は禁止されており、push、CI実行、Pagesの設定変更と公開は行っていない。公開には別途指示が必要。`pages.yml`は`workflow_dispatch`のみで起動し、対象ブランチが`main`または`develop`の場合だけビルドする。厳格な教材検査を通過しない限り配信しない。現在の制作状態は[教材の確認状態](CONTENT_STATUS.md)を参照。

公開が許可された後、GitHub Pagesの公開元にGitHub Actionsを選択し、対象コミットのCI結果を確認してからActions画面でDeploy Pagesを対象ブランチに対して手動実行する。必要に応じて`github-pages`環境にブランチ制限などの保護を設定する。workflowは`dist`をPages artifactとしてアップロードし、`github-pages`環境へ配信する。GitHubの[公開元設定](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)と[カスタムworkflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)を参照。

Viteのbaseは`/korean-textbook/`で、リポジトリ名に対応する。リポジトリ名やカスタムドメインを変更する場合はbaseを見直す。公開後はHTTPSのURLで開き、マイク許可、録音、合成音声、入力、保存を実機で確認する。PagesのHTTPS設定は[GitHubの説明](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)を参照。ローカルHTTPSおよびiPhone・Windowsの実機確認は未実施。

CIとPages workflowはNode.js 24.22.1、pnpm 12.11.2を指定している。miseの固定バージョンを更新するときは両workflowも合わせて更新する。CIはfrozen install、整形、lint、型、単体、厳格教材、ビルドとChromiumのブラウザーテストを実行する。実際の検査結果は[最終検証記録](VERIFICATION-final.md)を参照する。
