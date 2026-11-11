# バックアップ学習位置修正の限定受入

2026-11-12。`final-spec-audit.md`のFS-01と`backup-position-fix.md`を対象に独立確認した。

## 判定

FS-01は解消。対象範囲に追加指摘なし。第1〜3課の実在する`hangul-builder`位置を許可し、同位置を含む正規バックアップを復元できる。第4〜56課と任意の存在しない位置は引き続き拒否される。

- 実際の変更は`src/domain/validate-content.ts`、`src/domain/progress.test.ts`、ホームリンク部分の`src/App.tsx`。依頼時に示された`src/storage/backup.test.ts`は存在しない。
- `contentIds`の追加条件`lesson.day <= 3`は、課内目次と文字組み立て表示の条件に一致する。許可位置の拡張は実在する節だけに限られる。
- `parseBackup`と進捗スキーマは今回変更されていない。教材参照、下書き、履歴等の検証経路を迂回する変更はない。既存の不正日付・参照・位置・JSON拒否テストも成功した。
- ホームの診断と技能別結果リンクは、それぞれ独立した`p`要素となっている。リンク先と文言を維持したことを差分で確認した。

## 実行した検証

- `mise run test -- src/domain/progress.test.ts src/domain/validate-content.test.ts`：2ファイル、21テスト成功。第1〜3課それぞれの往復、任意位置と第4課の組み立て位置の拒否を含む。
- `mise exec -- pnpm exec tsx -e '…'`による読み取り専用のインメモリ確認：全56課を読み込み、許可集合が第1〜3課だけに`hangul-builder`を含むこと、第1〜3課の位置・各課の下書き・最終課IDを同時に書き出して復元すると元の進捗と一致すること、第4〜56課の同位置と全56課の任意位置を拒否することを`node:assert/strict`で確認した。利用者の保存領域は変更していない。
- `mise run format:check -- src/domain/validate-content.ts src/domain/progress.test.ts src/App.tsx`：対象3ファイル成功。

## 未確認・対象外

ブラウザーでの実際のファイル書き出し・取込・確認画面からの適用、ホームリンクの見た目と操作、全56課の最終統合ブラウザー検証は親の統合検証へ委ねる。このレビューでは全テスト、build、lint、全体format、秘密情報検査を再実行していない。

`App.tsx`の`productionSpeakingModel`関連差分は別レビュー担当のため判定対象外。教材の言語・音声品質、実機、公開後の動作も本受入の保証に含めない。コード変更・コミット・push・公開は行っていない。
