# ロールプレイの指摘修正

2026-11-12。`docs/reviews/roleplay.md`の2件を修正した。

- 各ターンの回答例を2件以上必須とし、1件の拒否を単体テストで確認した。テストfixtureの全ターンに2件の例を用意した。
- 相手の音声について独自の確認状態表示を削除し、収録ファイルと実際の再生元を区別する共通の音声ボタンの表示を使う。確認済みメタデータにpathがない場合、再生前後とも端末合成音声が未確認と表示されることをブラウザーモックで確認した。

## 動作検証

- `mise run test`：15ファイル68件成功。
- `mise run typecheck`、`mise run lint`、`mise run build`：成功。buildには既存のチャンクサイズ警告がある。
- `mise run test:browser -- tests/browser/roleplay.spec.ts`：Chromiumで1件成功。合成音声と録音はモックを使用。
- `mise run format:check`：担当外の`docs/reviews/week03-acceptance.md`の整形で失敗。

実教材への投入、言語的照合、実機・実音声の確認は実施していない。
