# 参照ページの正確性レビュー

2026-11-12実施。対象は`src/features/reference/index.tsx`のㅓ・ㅗ・ㅜの説明とWindowsの右Alt案内、`src/features/learning/letterSoundData.ts`のㅓの注記、`docs/research/reference-refinement.md`。この限定範囲では修正必須の指摘はなく、受入とする。コードは変更していない。

## 一次資料との照合

- [国立国語院「標準発音法」第2章・第4項の解説](https://www.korean.go.kr/front/page/pageView.do?page_id=P000098)の単母音表を確認した。ㅓは後舌・非円唇の中母音、ㅗは後舌・円唇の中母音、ㅜは後舌・円唇の高母音である。ㅓの「唇を丸めず、舌を後ろ寄りに」は表に整合し、字母ガイドとの矛盾もない。ㅏは低母音なので「ㅏより口の開きを抑える」は初心者向けの目安として受け入れられる。ㅗを中程度、ㅜをㅗより高くする説明も表の対照に整合する。これは同表に基づく説明の妥当性の確認であり、現代話者全員の調音の実測ではない。
- [Microsoft Learn「Korean IME」](https://learn.microsoft.com/en-us/globalization/input/korean-ime)の「Type Korean text」で、Win＋Spaceによる入力言語の変更、Microsoft IMEのAアイコンから가への変更、右Altによる切替を確認した。「Use the Windows On-Screen Keyboard」でWin＋Ctrl＋Oも確認した。教材はアイコン操作を示したうえで、右Altはキーボードや設定により異なる場合があると留保しており、利用者に動作を保証していない。資料自体は右Altの環境別の適否を列挙していないため、その留保を実機検証済みの事実とは扱わない。
- Appleの案内URLは今回も到達先を確認していない。未確認を根拠に誤リンクと判定せず、研究記録の扱いを受け入れた。
- `letterSoundData.ts`の없어요の綴り、濃音ㅆの説明、発音表記`[업써요]`は変更されていない。既存の受入済み修正を維持している。

## 動作検証と未確認事項

既存の`letterSoundData.test.ts`の5件を確認対象として指定し、`mise exec -- pnpm run test -- src/features/learning/letterSoundData.test.ts`を実行した。この引数の渡し方では対象の絞り込みが効かず、実際には34ファイル・160件が実行され、すべて成功した。対象ファイルの既存5件には없어요の綴り・濃音化表記の検査を含む。説明文をそのまま写すテストは追加していない。

自動テストの成功は言語的な正確性や端末の動作の保証ではない。端末TTSの実聴、IME操作、iPhone・Windows実機、全文の母語話者照合は未実施のままである。教材と研究記録も、この限定照合を実聴・実機確認済みとは記載していない。
