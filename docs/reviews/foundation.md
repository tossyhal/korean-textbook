# 基盤レビュー

2026-11-12。対象は`src/domain`、`src/storage`、`scripts`、package/設定。UI・教材制作は対象外。AGENTS.md、仕様書、docs/ASSESSMENT.md、docs/CONTENT_CONTRACT.mdに照らして確認した。以下はコードまたは独立した実行例で確認した事実。コードの変更・コミットはしていない。

## 指摘

1. **P1: 重要な未確認音声を採点から除外できない** — `src/domain/progress.ts:74`〜88。`type: listening`、`audio.status: unverified`の問題にfirst/correctの履歴を渡すと、`correct:1, attempted:1, total:1, unattempted:0, complete:true`を返す。現状は重要な音対立と通常の意味聴解を区別するメタデータがなく、重要音声が未確認なら除外/未実施とする受け入れ条件を実現できない。`requiresVerifiedAudio`や`purpose: contrast`を追加し、重要音対立の未確認を採点対象から外す。通常の意味聴解は合成音声・未確認の表示と再生成功の記録を前提として扱い、一律に禁止しない。

2. **P1: 回答前の解答閲覧を保存できない** — `src/domain/progress.ts:17`〜28、60〜72。保存スキーマに閲覧状態がなく、nextStageは呼出元の一時的なbooleanか既存のafter-answer回答しか参照しない。回答前に閲覧して再読み込みすると、その事実を保存する場所がなく、次の回答がfirstとなる。`answerViewedQuestionIds`等を永続化し、閲覧操作時点で更新するAPIが必要。回答を捏造して履歴へ追加する形は避ける。

3. **P2: 実施済みの閲覧後回答を未回答として集計する** — `src/domain/progress.ts:77`〜88。after-answer/correctだけの履歴では`attempted:0, unattempted:1, complete:false`となり、完全な未回答と区別できない。初回得点を維持することと実施状態は別。`firstCorrect/firstAttempted`、全段階での実施数、閲覧後回答数、未実施数、完了状態を分ける。自己評価のみ未実施の場合も`total:0, unattempted:0, complete:false`となるため、自己評価実施数を別指標で返す必要がある。

4. **P2: 技能別の分子・分母が得られない** — `src/domain/progress.ts:81`〜88、`src/domain/content.ts:32`。summarizeは全自動採点問題を混ぜ、writing/speakingの自己評価結果も返さない。skillがoptionalなので教材側の欠落も検知しない。問題のskillを必須にし、`bySkill`に自動採点と自己評価の実施数・未実施数・得点を返す。型とAPIをUI実装前に確定する必要がある。

5. **P2: 将来課の語彙・文法が採点へ混入しても検証を通る** — `src/domain/validate-content.ts:37`〜39。Day2でfirstDay=2として定義した語をDay1の問題tagsから参照するとエラーなし。firstDayを比較するのは当該課のvocabulary/grammar配列だけで、問題tagsでは存在確認しかしていない。tagsおよびreviewTargetsの初出日を利用課と比較し、明示した新出・丸ごと表現等の例外がある場合はデータで区別する。

6. **P2: 練習と確認テストの同一問題を検出できない** — `src/domain/validate-content.ts:23`、37〜39。異なるIDで同一prompt/answersをexercisesとexitTestへ置いてもエラーなし。assessmentKindもoptionalで配置との整合を検証しない。正規化した問題文・解答等による同一問題の検知と、practice/exit/transferの配置検証が必要。機械判定に加え、言い換えだけの再利用は教材レビューで確認する。

7. **P2: 音声ファイル欠落を検出できない** — `scripts/content-check.ts:3`、`src/domain/validate-content.ts:3`〜50。`audio.path: /absent-audio.mp3`を指定しても教材検証は成功する。source/voice等の文字列の存在だけでは再生可能性を確認できない。Node側のcontent-checkで例文・対話・各問題のローカル音声パスを列挙し、実ファイルの存在を確認する。実際の音声内容の照合は別記録にする。

8. **P2: 内容のない確認テストを完成した課として検証できる** — `src/domain/content.ts:59`〜69、`src/domain/validate-content.ts:42`〜48。exercisesとexitTestを空配列にした課が部分検証を通る。strictも56個のdayの存在だけを追加確認するため、同様の課を56個並べれば通る。通常課・文字課・総合試験の差は許しつつ、少なくとも必須課の評価問題の存在を検証する。問題数の目安を一律の厳格条件にする必要はない。

9. **P2: バックアップの参照と日付検証が不完全** — `src/storage/backup.ts:13`〜17、`src/domain/progress.ts:13`。`drafts.missing`、`notes.missing`、`positions['day-01']='missing-section'`、`reviews[].due='2026-99-99'`を持つJSONがparseBackupを通る。完了課・位置のキー・回答・復習IDは検証するが、他の参照は未検証。drafts/notes/位置値のID契約を確定し、参照先を検証する。dueは実在する日付を検証する。存在しない復習日を受理すると、文字列比較のdueReviewsで予定が到来しなくなる。

## 検証

- `mise run test`: 2ファイル、8テスト成功。
- `mise run typecheck`: 成功。
- 独立したtsx実行で1、3、5〜9の挙動を再現。2はスキーマとnextStageの保存往復で確認。4は返却APIと型を確認。
- trySaveProgressにsetItemの容量例外を与えると`ok:false`と保存失敗メッセージを返した。この低層処理自体に問題は見つからなかった。
- バックアップ破損JSONとversion不一致の拒否、完了課の不明ID拒否は既存テストで確認されている。
- UIは未実装のため、保存失敗時の表示、失敗後の再試行、破損読込時に空データで上書きしないこと、インポート確認画面、IME、実機音声は未確認。

## 不足する回帰テスト

初回誤答→再挑戦正答で初回が不変、閲覧のみ→保存復元→回答、閲覧後回答の実施集計、未確認聴解、技能別と自己評価、複数許容解と句読点モード、日付変更によるdueReviews、実在しない日付、保存読込例外と元データ保持、語彙/文法のID衝突、将来語タグ、確認問題の重複、空確認テスト、音声パス欠落、出典参照欠落を追加する。既存8テストの成功だけではこれらを保証しない。

## 補足

語彙・文法IDはterms Mapのみで管理し、課/問題と同じ重複検査に入らない（validate-content.ts:24〜28）。同じ語彙の課間参照は正当だが、語彙と文法・問題で同一IDが衝突すると復習対象が曖昧になる。接頭辞と同一IDの定義整合も検証対象に加えるとよい。
