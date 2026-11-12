# 教材データ契約

正本は`src/domain/content.ts`のZodスキーマ。各課は`Lesson`型に従うオブジェクトとして課別ファイルからexportする。IDは課・問題・語彙・文法を通じて安定させる。課IDは`day-01`の形式、問題IDは`day-01-ex-01`等、語彙・文法は`vocab-`・`grammar-`接頭辞を使う。

- `sections`は見出しと段落の配列。`examples`と`dialogue`は韓国語、日本語訳、必要な注記と音声参照。
- `recall`、`exercises`、`exitTest`はそれぞれ別問題。問題の`answers`は許容解すべて、`explanation`は正誤の理由、`tags`は弱点と復習の対象ID。自己評価問題は`type: 'self'`、空の`answers`と`rubric`を使う。
- `vocabulary`は辞書形、品詞、意味、初出日を持つ。`grammar`も初出日を持つ。既習の参照も含め、`reviewTargets`はそれらのIDを使う。
- `modes`の60・90・120は旧来の時間別学習計画の説明として互換性のため保持する。ホームの時間選択UIは撤去済み。`production`は自由作文・発話の模範例と自己評価基準。
- `sources`には実際に確認した資料のみを記載し、確認日と確認事項を記録する。未確認の場合は`languageStatus`と`audioStatus`を`unverified`にする。音声は合成音声等の出典、利用条件、声、確認状況を記録する。
- 通常課は例文6以上、演習12以上、出口テスト5以上を検証する。文字学習・総合試験は`lessonKind`にそれぞれ`letters`・`exam`を指定して目的に応じて調整する。未指定は通常課として扱う。

- 全問題に`skill`と配置に合う`assessmentKind`を指定する。想起・演習は`practice`、出口は`exit`または`transfer`。重要な音対立を評価する聴解は`requiresVerifiedAudio: true`とし、確認済み音声がなければ未実施となる。通常の意味聴解は再生の成否を画面で確認する。
- 語彙・文法の同一IDの再参照は定義と初出日が一致する場合に限る。問題タグと復習対象は初出日以降に参照する。練習と出口の同一問題、空の演習・出口・例文、欠落したローカル音声を検出する。言い換えだけの再利用や音声の内容は人手で確認する。
- 保存の`answerViewedQuestionIds`は回答前の閲覧も記録する。`drafts`のキーは課IDまたは問題ID、`notes`は課ID、`positions`は課IDから`objectives`、`recall`、`section-0`以降の実在する本文、`examples`、`dialogue`、`exercises`、`production`、`exit`、`sources`などへの対応とする。旧メモと出典位置は保存互換性のため保持するが、現在の画面には表示しない。
