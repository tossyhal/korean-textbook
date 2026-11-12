# 選択肢の表示順の修正

問題IDを種に選択肢のコピーを並べ替える。元の教材データ、許容解、採点、保存データは変更しない。同じ問題は再描画や再読み込み後も同じ順序になる。

## 動作確認

- Day56の読解8問と聴解8問で、正答位置は先頭5問、2番目7問、3番目4問。先頭のみ選んだ場合の正答率は5/16。
- 単体テストで選択肢集合、元配列と許容解の非破壊、順序の安定性、選択した正答の採点を確認。
- `pnpm run test -- src/features/assessment/options.test.ts`は全31ファイル143テスト成功（この呼び方では全単体テストが実行された）。
- `pnpm run typecheck`、`pnpm run lint`、対象2ファイルの`pnpm run format:check -- src/features/assessment/options.ts src/features/assessment/options.test.ts`成功。
- 共通QuestionViewに適用。ChromiumのDay56確認テストで読解の正答を選択して正解と判定され、採点後と再読み込み後も順序と選択が維持されること、聴解の選択肢も並べ替わることを確認。

言語内容や音声の確認はこの変更の検証に含まない。
