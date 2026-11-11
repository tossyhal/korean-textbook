# 結果画面と文字組立の修正確認

2026-11-12。出口テストの技能別初回回答を未実施・回答不足・8割未満・8割以上に分け、収録済みの課と練習を提案する。5問未満でも対象問題をすべて初回回答済みなら割合を使う。作文と発話の課題チェックは別々に数え、自動得点に加算しない。期限到来の復習先は初出課または問題の所属課に絞り、最大5課を表示する。第43課以降は収録された課のみ案内する。

文字組立の名前をfigureとoutputに付け、韓国語の字母選択肢に言語を指定した。音声診断の端末設定案内は別途[調査記録](../research/audio-setup.md)に記載した。

## 動作確認

- `mise run test -- src/features/assessment/results.test.ts src/features/learning/HangulBuilder.test.ts`：3件成功。未実施、回答不足、8割境界と自己評価の独立を検証。
- `mise run test:browser -- tests/browser/hangul-builder.spec.ts`：1件成功。
- `mise run typecheck`、`mise run lint`：成功。
- agent-browserのChromiumで未実施の結果画面を確認。第3課で作文チェックを入れ、結果画面を再読込して作文1件・発話0件の表示を確認。
- 第3課の文字組立をaxe-core 4.12.1で検査：違反0、要手動確認1（装飾矢印の色対比）。aria-prohibited-attrは再現しなかった。

## 未確認

実機、スクリーンリーダーの読み上げ、実音声と言語的照合は未実施。ブラウザー検査はこれらを保証しない。
