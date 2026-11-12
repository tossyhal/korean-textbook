# Pages配信パイプラインの独立レビュー

2026-11-13、`feature/pages-deployment`の`4da425f`からの未コミット差分を確認した。対象は`.github/workflows/ci.yml`、`.github/workflows/pages.yml`、`AGENTS.md`、`README.md`、`docs/DEPLOYMENT.md`、`docs/REFINEMENT.md`、`docs/TASKS.md`、`docs/USAGE.md`の8ファイル。最新のユーザー指示によるpushとGitHub Pages配信の許可を前提とした。

## 指摘

| 優先度 | 件数 | 結果                                             |
| ------ | ---- | ------------------------------------------------ |
| P1     | 0    | 配信を妨げる重大な問題は見つからなかった         |
| P2     | 0    | 修正を要する動作・権限上の問題は見つからなかった |
| P3     | 0    | 対象差分に具体的な改善指摘はなかった             |

## 確認した事実

- Pagesは`main`へのpushと手動実行で起動し、CI呼び出しjobの条件で`refs/heads/main`に限定する。別ブランチの手動実行ではCIがスキップされ、`needs: ci`のbuildと`needs: build`のdeployもスキップされる。PRと通常の開発ブランチpushには配信経路がない。
- Pagesが呼び出す`./.github/workflows/ci.yml`は呼び出し元と同じコミットを参照する。各checkoutに別refの指定がなく、CI・ビルドの対象コミットをすり替える入力もない。CI失敗・キャンセル・スキップを越えて配信する`always()`条件はない。
- CIは整形、lint、型、単体、厳格教材、ビルドとChromiumのブラウザーテストを保持し、本番プレビュー検査を追加する。`--workers=4`はスクリプトへ直接渡される。既存の本番プレビュー専用スキップ1件を、追加の検査除外として扱っていない。
- CIとbuildは`contents: read`で実行し、deployだけが`pages: write`と`id-token: write`を持つ。PRコードに配信権限を渡すイベントや秘密の継承を追加していない。
- buildが生成する`dist`をPages artifactとしてアップロードし、deployは同じworkflowのbuild完了後に`github-pages`環境へ配信する。Viteのbaseは予定URLの`/korean-textbook/`と一致する。
- 文書は初回配信を準備中とし、過去のローカル検証を今回のGitHub実行成功として記載していない。母語話者照合、音声実聴、実機確認の未実施状態も保持している。

## 検証と限界

レビュー担当が`actionlint 1.7.12`で両workflowを検査し、`git diff --check 4da425f`とともに成功した。ブラウザーテストとビルドは親担当の検証と競合させないため再実行していない。

このレビュー時点ではGitHub上のCI成功、Pages設定、artifactの実配信、公開URLの応答・表示は未確認である。静的なレビュー結果はそれらの成功を保証しない。教材本文の全件言語監査、TTS実聴、実機確認は対象外。

再利用workflowの同一コミット参照は[GitHub公式説明](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)、Pagesの権限・環境・artifact・依存関係は[GitHub公式説明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)と照合した。
