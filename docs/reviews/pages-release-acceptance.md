# Pages公開記録の独立受入レビュー

2026年11月13日、`docs/pages-live-verification`の基準`32f29847c661cabc79bb1909635127f99f98f956`からのREADME、配信・改訂・タスク・利用手順、新規`VERIFICATION-pages.md`の文書差分を確認した。対象は現在の配信状態と検証記録の整合性であり、全56節の言語監査や新たなUI実装ではない。レビュー担当はアプリの変更、コミット、push、GitHubへの書き込み、ブラウザーテストの再実行を行っていない。

## 指摘

- P1: 0件。
- P2: 0件。
- P3: 0件。

## 規約との整合

言語的照合、ソフトウェアの動作検証、実音声・実機の確認を区別している。全56節の言語・音声、全文の母語話者照合、端末TTSの実聴、録音品質、実IME、iPhone・Windows実機は未確認のまま保たれている。390×844と1280×800はheadless Chromiumの表示領域として記載され、実機の確認とは扱われていない。今回の変更文書に配信準備中という古い現状記載は残っておらず、相対リンクの参照先は存在する。

## 依頼範囲と証拠の整合

- [初回成功のDeploy Pages](https://github.com/tossyhal/korean-textbook/actions/runs/43260590013)は`main`へのpushで自動起動し、対象SHAは`32f29847c661cabc79bb1909635127f99f98f956`。`gh run view`でCI、build、deployの成功を確認した。生ログの単体191件、Chromium123件、本番プレビュー63件成功・1件スキップは文書と一致する。
- スキップ1件は既存の開発サーバー専用教材差し替えfixtureで、`tests/browser/curriculum.spec.ts`の条件と本番プレビュー設定に一致する。今回テストを削除したものではなく、成功件数にも含めていない。
- GitHubのdeployment `7743496241`は同じSHAの`github-pages`環境で、状態は`success`、公開先は[教材URL](https://tossyhal.github.io/korean-textbook/)。レビュー時にも公開HTMLのHTTP 200を確認した。
- 初回develop CIと手動Deploy Pagesの60000msサーバー起動待ち失敗は保存ログと一致する。その後の[develop CI](https://github.com/tossyhal/korean-textbook/actions/runs/43260613026)初回実行では本番プレビュー第5課が30000msでタイムアウトし、62件成功・1件失敗・1件スキップだった。失敗したbrowser jobだけのattempt 2は同一SHAで成功し、生ログもChromium123件、本番プレビュー63件成功・1件スキップだった。文書は初回失敗を保持し、再実行成功から原因解消を断定していない。
- 公開URLの操作確認は独立QA担当の記録に基づく。練習の正解判定と再読み込み後の保存、最終節の直接表示、単語帳検索、表示領域、APIの存在を記録する範囲にとどまり、全機能・全端末の実証とはしていない。サイトルート`/favicon.ico`のHTTP 404も記録されている。

## 受入と残る確認

今回の文書差分は受入可能。`VERIFICATION-pages.md`は初回成功SHAの履歴であり、今後の文書コミットの配信成功を先取りしていない。文書を取り込んだ後のpushと自動配信の結果は親担当が別途確認する必要がある。全56節の言語・音声と実機の未確認事項は、この受入によって解消されない。
