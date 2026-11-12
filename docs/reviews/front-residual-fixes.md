# 前半受入の残件修正

2026-11-12。`beginner-front-acceptance.md`のFRONT-01・02に対応した。

- 第8課に읽다[익따]と읽어요[일거요]の対照、못 읽어요を一続きに発音した[몬닐거요]と区切る場合の[모딜거요]、못 해요[모태요]を注記した。[国立国語院教材の二重パッチム表](https://www.korean.go.kr/common/download.do?c_file_name=c4b897e3-3c46-4c8b-bf5d-b28abbe3a789_1.pdf&file_path=etcData&o_file_name=%EC%B2%AB%EA%B1%B8%EC%9D%8C.pdf)、[못 읽어요の回答](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=73&qna_seq=327019)、[못 해요とㅎの回答](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=312021)に照合した。区の発音を唯一の標準形と断定しない。
- 第5課の指示冠形詞と代名詞、第15課の所有助詞と제、第18課の名詞接続助詞を語彙に登録した。저の代名詞と冠形詞は別ID。会話縮約形は別語として数えない。
- 第4課に名前と国籍の名詞文の例と語注を加え、一般名詞사람を登録した。例の固有名は登録しない。
- ブラウザテストの再生エラー文を現在の「音声設定」に更新した。

検証：`pnpm run content:check`（既定の厳密検証）56課成功、`pnpm run test` 34ファイル158件成功、`pnpm run typecheck`・`pnpm run lint`・担当6ファイルの`pnpm exec oxfmt --check`成功、`pnpm exec playwright test tests/browser/media.spec.ts` 8件成功。最初の`pnpm run test:browser -- tests/browser/media.spec.ts`は引数が絞り込みにならず全90件を開始し、45件成功後に中断した。中断した第15課は失敗判定ではなく未完了。

一次資料の記載照合と自動検証は別である。端末音声の実聴、実機確認、母語話者による全文照合は実施していない。
