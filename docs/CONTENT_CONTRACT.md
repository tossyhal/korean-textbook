# 教材データ契約

正本は`src/domain/content.ts`のZodスキーマ。各課は`Lesson`型に従うオブジェクトとして課別ファイルからexportする。IDは課・問題・語彙・文法を通じて安定させる。課IDは`day-01`の形式、問題IDは`day-01-ex-01`等、語彙・文法は`vocab-`・`grammar-`接頭辞を使う。

- `sections`は見出しと段落の配列。`examples`と`dialogue`は韓国語、日本語訳、必要な注記と音声参照。
- `recall`、`exercises`、`exitTest`はそれぞれ別問題。問題の`answers`は許容解すべて、`explanation`は正誤の理由、`tags`は弱点と復習の対象ID。自己評価問題は`type: 'self'`、空の`answers`と`rubric`を使う。
- `vocabulary`は辞書形、品詞、意味、初出日を持つ。`grammar`も初出日を持つ。既習の参照も含め、`reviewTargets`はそれらのIDを使う。
- `modes`の60・90・120はその時間で取り組む教材部分の説明。`production`は自由作文・発話の模範例と自己評価基準。
- `sources`には実際に確認した資料のみを記載し、確認日と確認事項を記録する。未確認の場合は`languageStatus`と`audioStatus`を`unverified`にする。音声は合成音声等の出典、利用条件、声、確認状況を記録する。
- 通常課は例文6〜10、演習12以上、出口テスト5問程度を目安とする。文字学習・総合試験は目的に応じて調整する。
