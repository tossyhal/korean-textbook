# 配信

GitHub Pagesで[教材を公開](https://tossyhal.github.io/korean-textbook/)している。初回の成功した配信と公開URLの確認は[配信検証記録](VERIFICATION-pages.md)を参照。現在の制作状態は[教材の確認状態](CONTENT_STATUS.md)を参照。

GitHub Pagesの公開元にGitHub Actionsを選択する。`main`へのpushまたは`main`を選択した手動実行でDeploy Pagesが起動し、同じコミットのCIを呼び出す。整形、lint、型、単体、厳格教材、ビルド、Chromiumの全ブラウザーテストと本番ビルドのプレビュー検査が成功すると、`dist`をPages artifactとして`github-pages`環境へ配信する。プルリクエストと`main`以外のpushではCIのみ実行する。手動配信も`main`に限定する。GitHubの[公開元設定](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)と[カスタムworkflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)を参照。

Viteのbaseは`/korean-textbook/`で、リポジトリ名に対応する。リポジトリ名やカスタムドメインを変更する場合はbaseを見直す。HTTPSのURLで開き、マイク許可、録音、合成音声、入力、保存を実機で確認する。PagesのHTTPS設定は[GitHubの説明](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)を参照。ローカルHTTPSおよびiPhone・Windowsの実機確認は未実施。

CIとPages workflowはNode.js 24.22.1、pnpm 12.11.2を指定している。miseの固定バージョンを更新するときは両workflowも合わせて更新する。過去の検査結果は[最終検証記録](VERIFICATION-final.md)と[改訂後の検証記録](VERIFICATION-external-review.md)を参照し、今回の配信結果とは区別する。
