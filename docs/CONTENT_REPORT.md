# 教材の制作状況（自動集計）

`mise run content:report`で収録データから再生成します。この集計は構造と記録値を示し、教材の完成判定ではありません。

収録課: 21/56課。固定解問題: 447問、自己評価問題: 0問、例文: 150件。語彙は辞書形の異なり数181、語彙IDの異なり数182。

問題数は想起・演習・出口テストの合計で、selfを自己評価、それ以外を固定解として数えます。例文はexamplesのみです。語彙は収録課のvocabulary全体を対象に辞書形またはIDで重複を除き、活用形を別途追加しません。課別の新語はfirstDayがその課と一致する語彙ID数です。本文文字数はsectionsのparagraphsの文字数（UTF-16コード単位）で、見出しを含みません。

構造項目の数は存在量であり、品質や検査成功を意味しません。教材検査の結果は実行時に確認してください。言語全文の照合、実音声の聴取、実機確認は別の作業です。編集レビューの結果はファイルの存在から判定しません。[手動の確認状態](CONTENT_STATUS.md)と[ブラウザー検証記録](VERIFICATION-browser.md)を参照してください。

| 課  | 収録・元ファイル                                                   | 本文節 | 本文文字 | 例文 | 対話 | 演習 | 出口 | 新語ID | 言語       | 音声       | 音声データ                | 出典 |
| --- | ------------------------------------------------------------------ | -----: | -------: | ---: | ---: | ---: | ---: | -----: | ---------- | ---------- | ------------------------- | ---- |
| 1   | [ハングルの組み立てと入力](../src/content/lessons/week01/day01.ts) |      3 |     1034 |    6 |    1 |   12 |    5 |      0 | unverified | unverified | checked 0 / unverified 7  | 2件  |
| 2   | [複合母音と子音の対立](../src/content/lessons/week01/day02.ts)     |      3 |      981 |    6 |    1 |   12 |    5 |      0 | unverified | unverified | checked 0 / unverified 7  | 1件  |
| 3   | [パッチムと音の変化](../src/content/lessons/week01/day03.ts)       |      2 |      829 |    6 |    1 |   12 |    5 |      3 | unverified | unverified | checked 0 / unverified 7  | 1件  |
| 4   | [自己紹介と名詞の文](../src/content/lessons/week01/day04.ts)       |      3 |      699 |    6 |    3 |   13 |    6 |      8 | unverified | unverified | checked 0 / unverified 11 | 2件  |
| 5   | [存在と場所](../src/content/lessons/week01/day05.ts)               |      2 |      489 |    6 |    2 |   13 |    6 |      9 | unverified | unverified | checked 0 / unverified 10 | 2件  |
| 6   | [動作と丁寧な現在形](../src/content/lessons/week01/day06.ts)       |      2 |      662 |    7 |    2 |   13 |    6 |     12 | unverified | unverified | checked 0 / unverified 11 | 2件  |
| 7   | [第1週の確認](../src/content/lessons/week01/day07.ts)              |      1 |      160 |    1 |    1 |    1 |   20 |      0 | unverified | unverified | checked 0 / unverified 6  | 1件  |
| 8   | [しない・できない](../src/content/lessons/week02/day08.ts)         |      5 |      733 |    8 |    4 |   13 |    7 |     14 | unverified | unverified | checked 0 / unverified 14 | 3件  |
| 9   | [過去の出来事](../src/content/lessons/week02/day09.ts)             |      5 |      710 |    8 |    4 |   13 |    7 |      8 | unverified | unverified | checked 0 / unverified 14 | 3件  |
| 10  | [これからの予定](../src/content/lessons/week02/day10.ts)           |      5 |      623 |    8 |    4 |   13 |    7 |     10 | unverified | unverified | checked 0 / unverified 14 | 1件  |
| 11  | [数と時刻・日付](../src/content/lessons/week02/day11.ts)           |      3 |      814 |    8 |    6 |   13 |    6 |     34 | unverified | unverified | checked 0 / unverified 16 | 4件  |
| 12  | [尋ねる・頼む](../src/content/lessons/week02/day12.ts)             |      2 |      844 |   13 |    9 |   17 |   11 |     11 | unverified | unverified | checked 0 / unverified 24 | 2件  |
| 13  | [希望と可能](../src/content/lessons/week02/day13.ts)               |      2 |      515 |    8 |    6 |   13 |    6 |      1 | unverified | unverified | checked 0 / unverified 16 | 2件  |
| 14  | [第2週の確認](../src/content/lessons/week02/day14.ts)              |      1 |      200 |    1 |    1 |    1 |   20 |      0 | unverified | unverified | checked 0 / unverified 6  | 1件  |
| 15  | [動作をつなげる -고](../src/content/lessons/week03/day15.ts)       |      4 |      702 |    8 |   10 |   13 |    7 |     11 | unverified | unverified | checked 0 / unverified 20 | 1件  |
| 16  | [理由と順序 -아서/어서](../src/content/lessons/week03/day16.ts)    |      4 |      837 |    8 |   10 |   13 |    7 |     13 | unverified | unverified | checked 0 / unverified 20 | 2件  |
| 17  | [対比と理由を伝える](../src/content/lessons/week03/day17.ts)       |      4 |      715 |    8 |   11 |   13 |    7 |     11 | unverified | unverified | checked 0 / unverified 21 | 2件  |
| 18  | [範囲・追加・限定](../src/content/lessons/week03/day18.ts)         |      4 |      825 |   10 |    4 |   13 |    7 |     14 | unverified | unverified | checked 0 / unverified 16 | 1件  |
| 19  | [性質を説明する](../src/content/lessons/week03/day19.ts)           |      4 |      766 |   12 |    4 |   13 |    7 |     12 | unverified | unverified | checked 0 / unverified 18 | 3件  |
| 20  | [頻出形を整理する](../src/content/lessons/week03/day20.ts)         |      4 |      680 |   11 |    4 |   14 |    7 |     11 | unverified | unverified | checked 0 / unverified 17 | 3件  |
| 21  | [第3週の確認](../src/content/lessons/week03/day21.ts)              |      1 |      144 |    1 |    1 |    1 |   20 |      0 | unverified | unverified | checked 0 / unverified 6  | 1件  |
| 22  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 23  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 24  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 25  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 26  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 27  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 28  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 29  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 30  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 31  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 32  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 33  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 34  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 35  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 36  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 37  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 38  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 39  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 40  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 41  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 42  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 43  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 44  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 45  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 46  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 47  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 48  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 49  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 50  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 51  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 52  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 53  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 54  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 55  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |
| 56  | 未収録                                                             |      — |        — |    — |    — |    — |    — |      — | —          | —          | —                         | —    |

## 出典の記録

各課のデータに記録されたstatus、確認日、確認事項を表示します。これらは本文全体の照合を意味しません。

### 第1課

- [Apple：iPhoneのキーボードを追加する／変更する](https://support.apple.com/ja-jp/guide/iphone/-iph73b71eb/ios) — checked、2026-11-12：キーボードの追加と切替の一般手順
- [Microsoft：言語とキーボード設定](https://support.microsoft.com/ja-jp/windows/hardware/input-devices/manage-the-language-and-keyboard-input-layout-settings-in-windows) — checked、2026-11-12：言語追加と表示言語設定が別であること

### 第2課

- [オンライン世宗学堂カリキュラム](https://www.iksi.or.kr/lms/main/curriculum.do) — checked、2026-11-12：入門と初級の区分

### 第3課

- [国立国語院：標準発音法](https://www.korean.go.kr/common/download.do?c_file_name=fa64499d-d020-44e9-895c-6116a37a58e4_0.pdf&file_path=etcData&o_file_name=%EB%B0%94%EB%A5%B8+%EA%B5%AD%EC%96%B4+%EC%83%9D%ED%99%9C+-+%EA%B5%AD%EC%96%B4%EB%AC%B8%ED%99%94%ED%95%99%EA%B5%90.pdf) — checked、2026-11-12：終声の代表音と鼻音前の同化例

### 第4課

- [国立国語院：이에요・예요・아니에요](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=306190) — checked、2026-11-12：縮約形と未縮約形、아니에요の形
- [国立国語院学習辞典：는](https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=85851) — checked、2026-11-12：母音終わりの名詞に付き話題や対照を示すこと

### 第5課

- [国立国語院学習辞典：있다](https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=68797) — checked、2026-11-12：存在、所在の文型と所有の意味
- [国立国語院学習辞典：없다](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=89917) — checked、2026-11-12：存在しない意味と活用表示

### 第6課

- [国立国語院学習辞典：아요](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=86568) — checked、2026-11-12：語幹末母音ㅏ・ㅗとの対応と丁寧な終結
- [国立国語院学習辞典：에서](https://krdict.korean.go.kr/m/jpn/searchResultView?ParaWordNo=68853&currentPage=1&exaType=&font_size=12&mainSearchWord=%EC%97%90%EC%84%9C&nation=jpn&nationCode=7&proverbType=&searchType=W&sort=&viewType=A&wordMatchFlag=N) — checked、2026-11-12：行動が行われる場所の用法

### 第7課

- [国立国語院学習辞典：있다](https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=68797) — checked、2026-11-12：存在・所在と所有の用法

### 第8課

- [国立国語院学習辞典：아니](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=65980) — checked、2026-11-12：動詞・形容詞の前に置く否定副詞と縮約形안
- [国立国語院学習辞典：않다](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=71583) — checked、2026-11-12：-지 않다の否定用法
- [国立国語院学習辞典：못](https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=17254&nation=jpn) — checked、2026-11-12：動詞の前で動作の不可能を表す用法

### 第9課

- [国立国語院：오다の活用](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=318662) — checked、2026-11-12：오다の아系列の活用は縮約形のみを認める
- [国立国語院学習辞典：-았-](https://krdict.korean.go.kr/m/eng/searchResultView?ParaWordNo=66954&nation=eng) — checked、2026-11-12：母音ㅏ・ㅗの語幹と過去
- [国立国語院学習辞典：-었-](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=68719) — checked、2026-11-12：その他の母音の語幹と過去

### 第10課

- [国立国語院学習辞典：것](https://krdict.korean.go.kr/spa/dicSearch/SearchView?ParaWordNo=62835) — checked、2026-11-12：-을 것이다による未実現の予定・予想・推量

### 第11課

- [国立国語院：初級韓国語読解の指導資料](https://www.korean.go.kr/common/download.do?book_seq=294&c_file_name=48c417c6-047f-48f4-88a7-959f28e5e0ad_0.pdf&downGubun=bookDataView&file_path=bookData&o_file_name=%ED%95%9C%EA%B5%AD%EC%96%B4%EC%A7%84%ED%9D%A5-02-17.pdf) — checked、2026-11-12：時は固有数詞、分は漢数詞、30分は반とも表すこと
- [国立国語院：数量を数える語](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=331063) — checked、2026-11-12：하나〜넷に対応する数冠形詞と11〜14の形
- [国立国語院：月名と日付の分かち書き](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=329930) — checked、2026-11-12：月名の綴り、日付と時刻の原則・許容表記
- [国立国語院：分かち書き](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=307291) — checked、2026-11-12：数と単位の分かち書きと金額表記の慣例

### 第12課

- [国立国語院：補助用言주다の分かち書き](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=305961) — checked、2026-11-12：補助用言주다は分かち書きが原則、場合により続け書きも許容
- [国立国語院学習辞典：주다](https://krdict.korean.go.kr/m/jpn/searchResultView?ParaWordNo=77245&nation=jpn) — checked、2026-11-12：補助動詞주다が他人のための行動を表す用法

### 第13課

- [国立国語院学習辞典：-ㄹ 수 있다](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=86664) — checked、2026-11-12：母音・ㄹ語幹後の可能・能力
- [国立国語院学習辞典：-을 수 있다](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=86661) — checked、2026-11-12：ㄹ以外の子音語幹後の可能・能力

### 第14課

- [国立国語院学習辞典：-을 수 있다](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=86661) — checked、2026-11-12：子音語幹後の可能・能力

### 第15課

- [国立国語院学習辞典：-고](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=78583) — checked、2026-11-12：並列と順序の用法

### 第16課

- [国立国語院学習辞典：-어서](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=80215) — checked、2026-11-12：順序と理由の用法
- [国立国語院：韓国語教育文法表現研究](https://korean.go.kr/common/download.do?c_file_name=5a2db2bc-a7ad-49f4-84a4-34b20ad33ffc_0.pdf&file_path=reportData&o_file_name=%ED%95%9C%EA%B5%AD%EC%96%B4%EA%B5%90%EC%9C%A1+%EB%AC%B8%EB%B2%95%ED%91%9C%ED%98%84+%EB%82%B4%EC%9A%A9%EA%B0%9C%EB%B0%9C+%EC%97%B0%EA%B5%AC_3%EB%8B%A8%EA%B3%84.pdf) — checked、2026-11-12：으니까が命令の根拠に使われること

### 第17課

- [国立国語院学習辞典：-지만](https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=78637&nation=jpn) — checked、2026-11-12：前の事実を認めて異なる事実を加える用法と時制
- [国立国語院学習辞典：-어서](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=80215) — checked、2026-11-12：理由の用法

### 第18課

- [国立国語院・世宗韓国語2教員用指針](https://www.korean.go.kr/common/download.do?c_file_name=b29c6837-dee9-4f2a-918e-3f8edbb3c46a_0.pdf&file_path=reportData&o_file_name=%EC%84%B8%EC%A2%85%ED%95%9C%EA%B5%AD%EC%96%B4+2+%EA%B5%90%EC%9B%90%EC%9A%A9+%EC%A7%80%EC%B9%A8%EC%84%9C.pdf) — checked、2026-11-12：教員用指針の助詞と初級文法の説明

### 第19課

- [国立国語院：작은の形](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=323959) — checked、2026-11-12：작은は작다の語幹と連体形語尾の結合
- [国立国語院学習辞典：좋아하다](https://krdict.korean.go.kr/eng/dicMarinerSearch/search?mainSearchWord=%EC%A2%8B%EC%95%84%ED%95%98%EB%8B%A4&nation=eng&nationCode=6) — checked、2026-11-12：좋아하다は好むことを表す動詞
- [国立国語院学習辞典：좋다](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=79033) — checked、2026-11-12：좋다は形容詞で、좋은の用例がある

### 第20課

- [国立国語院：不規則活用の規範](https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=309030) — checked、2026-11-12：ㄷ・ㅂ・르・ㅡと規則形の対照
- [国立国語院：縮約形と元の形](https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325129) — checked、2026-11-12：正書法35・38項では本形と縮約形の両方を使える
- [国立国語院：오다の過去](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=318662) — checked、2026-11-12：오았다は認めず왔다を使う

### 第21課

- [国立国語院：不規則活用の規範](https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=309030) — checked、2026-11-12：듣다などの活用と規則活用の対照
