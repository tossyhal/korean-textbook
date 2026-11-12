# 教材の制作状況（自動集計）

`mise run content:report`で収録データから再生成します。この集計は構造と記録値を示し、教材の完成判定ではありません。

収録節: 56/56節。固定解問題: 1221問、自己評価問題: 39問、例文: 448件。語彙は辞書形の異なり数526、語彙IDの異なり数531。

問題数は復習（内部データのrecall）・演習・出口テストの合計で、selfを自己評価、それ以外を固定解として数えます。作文・発話のproduction課題とロールプレイは問題数に含みません。例文はexamplesのみです。語彙は収録節のvocabulary全体を対象に辞書形またはIDで重複を除き、活用形を別途追加しません。節別の新語はfirstDayがその節の内部day番号と一致する語彙ID数です。本文文字数はsectionsのparagraphsの文字数（UTF-16コード単位）で、見出しを含みません。

構造項目の数は存在量であり、品質や検査成功を意味しません。教材検査の結果は実行時に確認してください。言語全文の照合、実音声の聴取、実機確認は別の作業です。編集レビューの結果はファイルの存在から判定しません。[手動の確認状態](CONTENT_STATUS.md)と[ブラウザー検証記録](VERIFICATION-browser.md)を参照してください。

| 章・節（内部day） | 収録・元ファイル                                                             | 本文項目 | 本文文字 | 例文 | 対話 | 演習 | 出口 | 新語ID | 言語       | 音声       | 音声データ                | 出典 |
| ----------------- | ---------------------------------------------------------------------------- | -------: | -------: | ---: | ---: | ---: | ---: | -----: | ---------- | ---------- | ------------------------- | ---- |
| 第1章 第1節（1）  | [ハングルの組み立てと入力](../src/content/lessons/week01/day01.ts)           |        3 |     1104 |    6 |    1 |   12 |    5 |      1 | unverified | unverified | checked 0 / unverified 7  | 2件  |
| 第1章 第2節（2）  | [複合母音と子音の対立](../src/content/lessons/week01/day02.ts)               |        3 |      981 |    6 |    1 |   12 |    5 |      0 | unverified | unverified | checked 0 / unverified 7  | 1件  |
| 第1章 第3節（3）  | [パッチムと音の変化](../src/content/lessons/week01/day03.ts)                 |        2 |      829 |    6 |    1 |   12 |    5 |      3 | unverified | unverified | checked 0 / unverified 7  | 1件  |
| 第1章 第4節（4）  | [自己紹介と名詞の文](../src/content/lessons/week01/day04.ts)                 |        3 |      872 |    6 |    3 |   13 |    6 |     11 | unverified | unverified | checked 0 / unverified 11 | 2件  |
| 第1章 第5節（5）  | [存在と場所](../src/content/lessons/week01/day05.ts)                         |        2 |      724 |    6 |    2 |   15 |    6 |     15 | unverified | unverified | checked 0 / unverified 10 | 3件  |
| 第1章 第6節（6）  | [動作と丁寧な現在形](../src/content/lessons/week01/day06.ts)                 |        2 |      662 |    7 |    2 |   13 |    6 |     12 | unverified | unverified | checked 0 / unverified 11 | 2件  |
| 第1章 第7節（7）  | [第1週の確認](../src/content/lessons/week01/day07.ts)                        |        1 |      160 |    1 |    1 |    1 |   20 |      0 | unverified | unverified | checked 0 / unverified 6  | 1件  |
| 第2章 第1節（8）  | [しない・できない](../src/content/lessons/week02/day08.ts)                   |        5 |      911 |    8 |    4 |   14 |    7 |     14 | unverified | unverified | checked 0 / unverified 14 | 7件  |
| 第2章 第2節（9）  | [過去の出来事](../src/content/lessons/week02/day09.ts)                       |        5 |      710 |    8 |    4 |   13 |    7 |      8 | unverified | unverified | checked 0 / unverified 14 | 3件  |
| 第2章 第3節（10） | [これからの予定](../src/content/lessons/week02/day10.ts)                     |        5 |      623 |    8 |    4 |   13 |    7 |     10 | unverified | unverified | checked 0 / unverified 14 | 1件  |
| 第2章 第4節（11） | [数と時刻・日付](../src/content/lessons/week02/day11.ts)                     |        3 |      838 |    8 |    6 |   13 |    6 |     34 | unverified | unverified | checked 0 / unverified 16 | 4件  |
| 第2章 第5節（12） | [尋ねる・頼む](../src/content/lessons/week02/day12.ts)                       |        2 |      887 |   13 |    9 |   17 |   11 |     11 | unverified | unverified | checked 0 / unverified 24 | 2件  |
| 第2章 第6節（13） | [希望と可能](../src/content/lessons/week02/day13.ts)                         |        2 |      515 |    8 |    6 |   13 |    6 |      1 | unverified | unverified | checked 0 / unverified 16 | 2件  |
| 第2章 第7節（14） | [第2週の確認](../src/content/lessons/week02/day14.ts)                        |        1 |      200 |    1 |    1 |    1 |   20 |      0 | unverified | unverified | checked 0 / unverified 6  | 1件  |
| 第3章 第1節（15） | [動作をつなげる -고](../src/content/lessons/week03/day15.ts)                 |        4 |      917 |    8 |   10 |   15 |    7 |     14 | unverified | unverified | checked 0 / unverified 20 | 3件  |
| 第3章 第2節（16） | [理由と順序 -아서/어서](../src/content/lessons/week03/day16.ts)              |        4 |      984 |    8 |   10 |   14 |    7 |     13 | unverified | unverified | checked 0 / unverified 20 | 2件  |
| 第3章 第3節（17） | [対比と理由を伝える](../src/content/lessons/week03/day17.ts)                 |        4 |      715 |    8 |   11 |   13 |    7 |     11 | unverified | unverified | checked 0 / unverified 21 | 2件  |
| 第3章 第4節（18） | [範囲・追加・限定](../src/content/lessons/week03/day18.ts)                   |        5 |      993 |   10 |    4 |   15 |    7 |     16 | unverified | unverified | checked 0 / unverified 16 | 2件  |
| 第3章 第5節（19） | [性質を説明する](../src/content/lessons/week03/day19.ts)                     |        4 |      766 |   12 |    4 |   13 |    7 |     12 | unverified | unverified | checked 0 / unverified 18 | 3件  |
| 第3章 第6節（20） | [頻出形を整理する](../src/content/lessons/week03/day20.ts)                   |        4 |      680 |   11 |    4 |   14 |    7 |     12 | unverified | unverified | checked 0 / unverified 17 | 3件  |
| 第3章 第7節（21） | [第3週の確認](../src/content/lessons/week03/day21.ts)                        |        1 |      144 |    1 |    1 |    1 |   20 |      0 | unverified | unverified | checked 0 / unverified 6  | 1件  |
| 第4章 第1節（22） | [今していること](../src/content/lessons/week04/day22.ts)                     |        5 |      840 |   15 |    4 |   13 |    7 |     10 | unverified | unverified | checked 0 / unverified 21 | 1件  |
| 第4章 第2節（23） | [必要なことを伝える](../src/content/lessons/week04/day23.ts)                 |        5 |      847 |   16 |    4 |   13 |    7 |     12 | unverified | unverified | checked 0 / unverified 22 | 1件  |
| 第4章 第3節（24） | [条件を伝える](../src/content/lessons/week04/day24.ts)                       |        5 |      786 |   16 |    4 |   13 |    7 |     12 | unverified | unverified | checked 0 / unverified 22 | 2件  |
| 第4章 第4節（25） | [許可と禁止](../src/content/lessons/week04/day25.ts)                         |        4 |      583 |    8 |    4 |   13 |    7 |      7 | unverified | unverified | checked 0 / unverified 14 | 1件  |
| 第4章 第5節（26） | [名詞を詳しく説明する](../src/content/lessons/week04/day26.ts)               |        5 |      747 |   13 |    4 |   13 |    7 |     12 | unverified | unverified | checked 0 / unverified 19 | 1件  |
| 第4章 第6節（27） | [敬語と丁寧さ](../src/content/lessons/week04/day27.ts)                       |        5 |     1028 |   13 |    4 |   13 |    7 |     12 | unverified | unverified | checked 0 / unverified 19 | 2件  |
| 第4章 第7節（28） | [中間総合確認](../src/content/lessons/week04/day28.ts)                       |        1 |      144 |    1 |    1 |    1 |   24 |      0 | unverified | unverified | checked 0 / unverified 8  | 1件  |
| 第5章 第1節（29） | [飲食店で注文する](../src/content/lessons/week05/day29.ts)                   |        4 |      912 |    8 |    8 |   13 |    7 |     24 | unverified | unverified | checked 0 / unverified 30 | 2件  |
| 第5章 第2節（30） | [買い物で尋ねる](../src/content/lessons/week05/day30.ts)                     |        4 |      933 |    8 |    8 |   13 |    7 |     23 | unverified | unverified | checked 0 / unverified 30 | 1件  |
| 第5章 第3節（31） | [交通機関を使う](../src/content/lessons/week05/day31.ts)                     |        4 |      884 |    8 |    8 |   13 |    7 |     20 | unverified | unverified | checked 0 / unverified 30 | 1件  |
| 第5章 第4節（32） | [場所と道案内](../src/content/lessons/week05/day32.ts)                       |        4 |      772 |   10 |    8 |   15 |    7 |     20 | unverified | unverified | checked 0 / unverified 32 | 1件  |
| 第5章 第5節（33） | [宿泊先で困ったとき](../src/content/lessons/week05/day33.ts)                 |        4 |      822 |   11 |    8 |   16 |    7 |     21 | unverified | unverified | checked 0 / unverified 36 | 1件  |
| 第5章 第6節（34） | [待ち合わせと予定変更](../src/content/lessons/week05/day34.ts)               |        4 |      934 |   10 |    6 |   16 |    7 |     23 | unverified | unverified | checked 0 / unverified 30 | 1件  |
| 第5章 第7節（35） | [場面別の総合確認](../src/content/lessons/week05/day35.ts)                   |        1 |      118 |    1 |    1 |    1 |   24 |      0 | unverified | unverified | checked 0 / unverified 20 | 1件  |
| 第6章 第1節（36） | [趣味と好きなこと](../src/content/lessons/week06/day36.ts)                   |        4 |      902 |    8 |    6 |   14 |    7 |     21 | unverified | unverified | checked 0 / unverified 28 | 1件  |
| 第6章 第2節（37） | [大学・研究・仕事を紹介する](../src/content/lessons/week06/day37.ts)         |        4 |      773 |    8 |    6 |   13 |    7 |     24 | unverified | unverified | checked 0 / unverified 25 | 3件  |
| 第6章 第3節（38） | [家族・友人と人物の紹介](../src/content/lessons/week06/day38.ts)             |        4 |      770 |    8 |    6 |   13 |    7 |     23 | unverified | unverified | checked 0 / unverified 25 | 2件  |
| 第6章 第4節（39） | [感想と比較](../src/content/lessons/week06/day39.ts)                         |        4 |      862 |    8 |    6 |   13 |    7 |     19 | unverified | unverified | checked 0 / unverified 25 | 1件  |
| 第6章 第5節（40） | [過去の出来事と順序](../src/content/lessons/week06/day40.ts)                 |        4 |      796 |    8 |    6 |   14 |    7 |     18 | unverified | unverified | checked 0 / unverified 25 | 2件  |
| 第6章 第6節（41） | [希望と計画、その理由](../src/content/lessons/week06/day41.ts)               |        4 |      911 |    8 |    6 |   14 |    7 |     18 | unverified | unverified | checked 0 / unverified 25 | 1件  |
| 第6章 第7節（42） | [会話の総合確認](../src/content/lessons/week06/day42.ts)                     |        1 |      121 |    1 |    1 |    1 |   24 |      0 | unverified | unverified | checked 0 / unverified 26 | 1件  |
| 第7章 第1節（43） | [母音と平音・激音・濃音を聞き分ける](../src/content/lessons/week07/day43.ts) |        4 |      820 |   16 |    4 |   13 |    7 |      4 | unverified | unverified | checked 0 / unverified 21 | 3件  |
| 第7章 第2節（44） | [パッチムと音のつながり](../src/content/lessons/week07/day44.ts)             |        4 |      845 |   16 |    2 |   13 |    7 |      2 | unverified | unverified | checked 0 / unverified 19 | 5件  |
| 第7章 第3節（45） | [質問と数字を素早く理解する](../src/content/lessons/week07/day45.ts)         |        4 |      595 |    8 |    4 |   17 |   10 |      0 | unverified | unverified | checked 0 / unverified 21 | 1件  |
| 第7章 第4節（46） | [短い会話を聞いて書き取る](../src/content/lessons/week07/day46.ts)           |        4 |      500 |    6 |    2 |   13 |    7 |      0 | unverified | unverified | checked 0 / unverified 15 | 2件  |
| 第7章 第5節（47） | [別の合成音声と別の文で聞く](../src/content/lessons/week07/day47.ts)         |        4 |      489 |    6 |    2 |   13 |    7 |      0 | unverified | unverified | checked 0 / unverified 16 | 2件  |
| 第7章 第6節（48） | [初めて聞く会話から情報を取り出す](../src/content/lessons/week07/day48.ts)   |        4 |      479 |    6 |    2 |   13 |    7 |      0 | unverified | unverified | checked 0 / unverified 15 | 2件  |
| 第7章 第7節（49） | [聴解と弱点の確認](../src/content/lessons/week07/day49.ts)                   |        3 |      407 |    1 |    1 |    1 |   24 |      0 | unverified | unverified | checked 0 / unverified 14 | 2件  |
| 第8章 第1節（50） | [初めて読む短文から情報を取り出す](../src/content/lessons/week08/day50.ts)   |        4 |      765 |    8 |    2 |   14 |    7 |      2 | unverified | unverified | checked 0 / unverified 14 | 2件  |
| 第8章 第2節（51） | [日記とメッセージを書く](../src/content/lessons/week08/day51.ts)             |        4 |      723 |    8 |    2 |   14 |    7 |      2 | unverified | unverified | checked 0 / unverified 14 | 2件  |
| 第8章 第3節（52） | [聞いた内容を自分の言葉で伝える](../src/content/lessons/week08/day52.ts)     |        4 |      670 |    6 |    2 |   14 |    7 |      1 | unverified | unverified | checked 0 / unverified 13 | 2件  |
| 第8章 第4節（53） | [条件を伝える買い物](../src/content/lessons/week08/day53.ts)                 |        4 |      620 |    8 |    4 |   12 |    5 |      3 | unverified | unverified | checked 0 / unverified 27 | 3件  |
| 第8章 第5節（54） | [身近な話題で会話する](../src/content/lessons/week08/day54.ts)               |        4 |      547 |    8 |    5 |   12 |    5 |      0 | unverified | unverified | checked 0 / unverified 25 | 2件  |
| 第8章 第6節（55） | [履歴から弱点を補強する](../src/content/lessons/week08/day55.ts)             |        5 |      791 |    8 |    4 |   12 |    5 |      0 | unverified | unverified | checked 0 / unverified 12 | 2件  |
| 第8章 第7節（56） | [最終総合テストとこれからの復習](../src/content/lessons/week08/day56.ts)     |        3 |      818 |    6 |    2 |   12 |   24 |      0 | unverified | unverified | checked 0 / unverified 28 | 2件  |

## 出典の記録

各節のデータに記録されたstatus、確認日、確認事項を表示します。これらは本文全体の照合を意味しません。

### 第1章 第1節（内部day 1）

- [Apple：iPhoneのキーボードを追加する／変更する](https://support.apple.com/ja-jp/guide/iphone/-iph73b71eb/ios) — checked、2026-11-12：キーボードの追加と切替の一般手順
- [Microsoft：言語とキーボード設定](https://support.microsoft.com/ja-jp/windows/hardware/input-devices/manage-the-language-and-keyboard-input-layout-settings-in-windows) — checked、2026-11-12：言語追加と表示言語設定が別であること

### 第1章 第2節（内部day 2）

- [オンライン世宗学堂カリキュラム](https://www.iksi.or.kr/lms/main/curriculum.do) — checked、2026-11-12：入門と初級の区分

### 第1章 第3節（内部day 3）

- [国立国語院：標準発音法](https://www.korean.go.kr/common/download.do?c_file_name=fa64499d-d020-44e9-895c-6116a37a58e4_0.pdf&file_path=etcData&o_file_name=%EB%B0%94%EB%A5%B8+%EA%B5%AD%EC%96%B4+%EC%83%9D%ED%99%9C+-+%EA%B5%AD%EC%96%B4%EB%AC%B8%ED%99%94%ED%95%99%EA%B5%90.pdf) — checked、2026-11-12：終声の代表音と鼻音前の同化例

### 第1章 第4節（内部day 4）

- [国立国語院：이에요・예요・아니에요](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=306190) — checked、2026-11-12：縮約形と未縮約形、아니에요の形
- [国立国語院学習辞典：는](https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=85851) — checked、2026-11-12：母音終わりの名詞に付き話題や対照を示すこと

### 第1章 第5節（内部day 5）

- [国立国語院：標準発音法の解説](https://m.korean.go.kr/nkview/nknews/199906/11_8.htm) — checked、2026-11-12：設問9：二重パッチムの後項ㅅと母音で始まる語尾
- [国立国語院学習辞典：있다](https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=68797) — checked、2026-11-12：存在、所在の文型と所有の意味
- [国立国語院学習辞典：없다](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=89917) — checked、2026-11-12：存在しない意味と活用表示

### 第1章 第6節（内部day 6）

- [国立国語院学習辞典：아요](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=86568) — checked、2026-11-12：語幹末母音ㅏ・ㅗとの対応と丁寧な終結
- [国立国語院学習辞典：에서](https://krdict.korean.go.kr/m/jpn/searchResultView?ParaWordNo=68853&currentPage=1&exaType=&font_size=12&mainSearchWord=%EC%97%90%EC%84%9C&nation=jpn&nationCode=7&proverbType=&searchType=W&sort=&viewType=A&wordMatchFlag=N) — checked、2026-11-12：行動が行われる場所の用法

### 第1章 第7節（内部day 7）

- [国立国語院学習辞典：있다](https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=68797) — checked、2026-11-12：存在・所在と所有の用法

### 第2章 第1節（内部day 8）

- [国立国語院学習辞典：아니](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=65980) — checked、2026-11-12：動詞・形容詞の前に置く否定副詞と縮約形안
- [国立国語院学習辞典：않다](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=71583) — checked、2026-11-12：-지 않다の否定用法
- [国立国語院：標準発音法の解説](https://m.korean.go.kr/nkview/nknews/199906/11_8.htm) — checked、2026-11-12：設問9：二重パッチムと母音で始まる語尾
- [国立国語院学習辞典：못](https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=17254&nation=jpn) — checked、2026-11-12：動詞の前で動作の不可能を表す用法
- [国立国語院：못 읽어요の発音](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=73&qna_seq=327019) — checked、2026-11-12：一続きと区切る場合の発音
- [国立国語院：못 해요の発音](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=312021) — checked、2026-11-12：ㅎとの激音化
- [国立国語院：韓国語の第一歩](https://www.korean.go.kr/common/download.do?c_file_name=c4b897e3-3c46-4c8b-bf5d-b28abbe3a789_1.pdf&file_path=etcData&o_file_name=%EC%B2%AB%EA%B1%B8%EC%9D%8C.pdf) — checked、2026-11-12：二重パッチムの읽다と읽어요

### 第2章 第2節（内部day 9）

- [国立国語院：오다の活用](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=318662) — checked、2026-11-12：오다の아系列の活用は縮約形のみを認める
- [国立国語院学習辞典：-았-](https://krdict.korean.go.kr/m/eng/searchResultView?ParaWordNo=66954&nation=eng) — checked、2026-11-12：母音ㅏ・ㅗの語幹と過去
- [国立国語院学習辞典：-었-](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=68719) — checked、2026-11-12：その他の母音の語幹と過去

### 第2章 第3節（内部day 10）

- [国立国語院学習辞典：것](https://krdict.korean.go.kr/spa/dicSearch/SearchView?ParaWordNo=62835) — checked、2026-11-12：-을 것이다による未実現の予定・予想・推量

### 第2章 第4節（内部day 11）

- [国立国語院：初級韓国語読解の指導資料](https://www.korean.go.kr/common/download.do?book_seq=294&c_file_name=48c417c6-047f-48f4-88a7-959f28e5e0ad_0.pdf&downGubun=bookDataView&file_path=bookData&o_file_name=%ED%95%9C%EA%B5%AD%EC%96%B4%EC%A7%84%ED%9D%A5-02-17.pdf) — checked、2026-11-12：時は固有数詞、分は漢数詞、30分は반とも表すこと
- [国立国語院：数量を数える語](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=331063) — checked、2026-11-12：하나〜넷に対応する数冠形詞と11〜14の形
- [国立国語院：月名と日付の分かち書き](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=329930) — checked、2026-11-12：月名の綴り、日付と時刻の原則・許容表記
- [国立国語院：分かち書き](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=307291) — checked、2026-11-12：数と単位の分かち書きと金額表記の慣例

### 第2章 第5節（内部day 12）

- [国立国語院：補助用言주다の分かち書き](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=305961) — checked、2026-11-12：補助用言주다は分かち書きが原則、場合により続け書きも許容
- [国立国語院学習辞典：주다](https://krdict.korean.go.kr/m/jpn/searchResultView?ParaWordNo=77245&nation=jpn) — checked、2026-11-12：補助動詞주다が他人のための行動を表す用法

### 第2章 第6節（内部day 13）

- [国立国語院学習辞典：-ㄹ 수 있다](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=86664) — checked、2026-11-12：母音・ㄹ語幹後の可能・能力
- [国立国語院学習辞典：-을 수 있다](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=86661) — checked、2026-11-12：ㄹ以外の子音語幹後の可能・能力

### 第2章 第7節（内部day 14）

- [国立国語院学習辞典：-을 수 있다](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=86661) — checked、2026-11-12：子音語幹後の可能・能力

### 第3章 第1節（内部day 15）

- [国立国語院学習辞典：-고](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=78583) — checked、2026-11-12：並列と順序の用法
- [国立国語院：標準発音法の解説](https://m.korean.go.kr/nkview/nknews/199906/11_8.htm) — checked、2026-11-12：設問6：語幹末ㄺと後続ㄱ
- [国立国語院学習辞典：제](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=75826) — checked、2026-11-12：저의の縮約

### 第3章 第2節（内部day 16）

- [国立国語院学習辞典：-어서](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=80215) — checked、2026-11-12：順序と理由の用法
- [国立国語院：韓国語教育文法表現研究](https://korean.go.kr/common/download.do?c_file_name=5a2db2bc-a7ad-49f4-84a4-34b20ad33ffc_0.pdf&file_path=reportData&o_file_name=%ED%95%9C%EA%B5%AD%EC%96%B4%EA%B5%90%EC%9C%A1+%EB%AC%B8%EB%B2%95%ED%91%9C%ED%98%84+%EB%82%B4%EC%9A%A9%EA%B0%9C%EB%B0%9C+%EC%97%B0%EA%B5%AC_3%EB%8B%A8%EA%B3%84.pdf) — checked、2026-11-12：으니까が命令の根拠に使われること

### 第3章 第3節（内部day 17）

- [国立国語院学習辞典：-지만](https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=78637&nation=jpn) — checked、2026-11-12：前の事実を認めて異なる事実を加える用法と時制
- [国立国語院学習辞典：-어서](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=80215) — checked、2026-11-12：理由の用法

### 第3章 第4節（内部day 18）

- [国立国語院・世宗韓国語2教員用指針](https://www.korean.go.kr/common/download.do?c_file_name=b29c6837-dee9-4f2a-918e-3f8edbb3c46a_0.pdf&file_path=reportData&o_file_name=%EC%84%B8%EC%A2%85%ED%95%9C%EA%B5%AD%EC%96%B4+2+%EA%B5%90%EC%9B%90%EC%9A%A9+%EC%A7%80%EC%B9%A8%EC%84%9C.pdf) — checked、2026-11-12：教員用指針の助詞と初級文法の説明
- [国立国語院学習辞典：과](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=78624&nation=eng) — checked、2026-11-12：パッチム後の과、名詞列挙と同行者

### 第3章 第5節（内部day 19）

- [国立国語院：작은の形](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=323959) — checked、2026-11-12：작은は작다の語幹と連体形語尾の結合
- [国立国語院学習辞典：좋아하다](https://krdict.korean.go.kr/eng/dicMarinerSearch/search?mainSearchWord=%EC%A2%8B%EC%95%84%ED%95%98%EB%8B%A4&nation=eng&nationCode=6) — checked、2026-11-12：좋아하다は好むことを表す動詞
- [国立国語院学習辞典：좋다](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=79033) — checked、2026-11-12：좋다は形容詞で、좋은の用例がある

### 第3章 第6節（内部day 20）

- [国立国語院：不規則活用の規範](https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=309030) — checked、2026-11-12：ㄷ・ㅂ・르・ㅡと規則形の対照
- [国立国語院：縮約形と元の形](https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325129) — checked、2026-11-12：正書法35・38項では本形と縮約形の両方を使える
- [国立国語院：오다の過去](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=318662) — checked、2026-11-12：오았다は認めず왔다を使う

### 第3章 第7節（内部day 21）

- [国立国語院：不規則活用の規範](https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=309030) — checked、2026-11-12：듣다などの活用と規則活用の対照

### 第4章 第1節（内部day 22）

- [国立国語院：-고 있다](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=72238&lang=eng) — checked、2026-11-12：動作の進行と結果状態の継続

### 第4章 第2節（内部day 23）

- [国立国語院：-여야 하다](https://krdict.korean.go.kr/m/eng/searchResultView?ParaWordNo=86259&nation=eng) — checked、2026-11-12：하다に付く必要・義務の表現

### 第4章 第3節（内部day 24）

- [国立国語院：-면](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=80259&nation=eng) — checked、2026-11-12：仮定・条件および母音・ㄹの後の接続
- [国立国語院：-으면](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=80262&lang=eng) — checked、2026-11-12：ㄹ以外のパッチムの後の接続と条件

### 第4章 第4節（内部day 25）

- [国立国語院：韓国語教育資料](https://www.korean.go.kr/common/download.do?book_seq=284&c_file_name=422cb2da-bab2-4e51-b9c1-85ebf185e61b_0.pdf&downGubun=bookDataView&file_path=bookData&o_file_name=한국어진흥-02-7.pdf) — checked、2026-11-12：許可を尋ねる-아/어도 돼요と禁止の-(으)면 안 돼요の対話

### 第4章 第5節（内部day 26）

- [国立国語院：連体形と時制](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=306800) — checked、2026-11-12：現在の-는の辞書記述と時制・相について諸説があること

### 第4章 第6節（内部day 27）

- [国立国語院：길다の活用](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=327855&searchCondition=&searchKeyword=) — checked、2026-11-12：ㄹ語幹にㅂ니다が付くときのㄹ脱落
- [国立国語院：主体を高める語彙](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=325897) — checked、2026-11-12：계시다と드시다など主体尊敬語の扱い

### 第4章 第7節（内部day 28）

- [国立国語院：連体形と時制](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=306800) — checked、2026-11-12：現在の-는の辞書記述と時制・相について諸説があること

### 第5章 第1節（内部day 29）

- [国立国語院：주문하다](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=91768) — checked、2026-11-12：注文する対象と用法
- [国立国語院：계산](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=26229) — checked、2026-11-12：料金を払う意味

### 第5章 第2節（内部day 30）

- [国立国語院：어깨の用例](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=29970) — checked、2026-11-12：サイズを試着する用例

### 第5章 第3節（内部day 31）

- [国立国語院：환승하다](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=89139) — checked、2026-11-12：他路線・交通機関への乗り換え

### 第5章 第4節（内部day 32）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/m/eng/searchResultView?ParaWordNo=53853&currentPage=1&exaType=&font_size=12&mainSearchWord=%EA%B1%B4%EB%84%88%EB%8B%A4&nation=eng&nationCode=6&proverbType=&searchType=W&sort=W&viewType=A&wordMatchFlag=N) — checked、2026-11-12：건너다の「길을 건너다」という用例と目的語を確認

### 第5章 第5節（内部day 33）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=29607) — checked、2026-11-12：장の用例「수건 한 장」を確認

### 第5章 第6節（内部day 34）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=15760&nation=eng) — checked、2026-11-12：미루다の予定を後に延ばす意味と約束の用例を確認

### 第5章 第7節（内部day 35）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=15760&nation=eng) — checked、2026-11-12：미루다の予定を後に延ばす意味を確認

### 第6章 第1節（内部day 36）

- [国立国語院 韓国語基礎辞典「연주하다」](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=67764&lang=eng) — checked、2026-11-12：楽器を目的語にする演奏の意味と用例を確認

### 第6章 第2節（内部day 37）

- [国立国語院 韓国語基礎辞典「전공」](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=70828) — checked、2026-11-12：전공が専門的に研究・勉強する分野または科目を指すことを確認
- [国立国語院 韓国語基礎辞典 회사](https://krdict.korean.go.kr/m/jpn/searchResultView?ParaWordNo=31668&currentPage=1&exaType=&font_size=12&mainSearchWord=%ED%9A%8C%EC%82%AC&nation=jpn&nationCode=7&proverbType=&searchType=W&sort=&viewType=A&wordMatchFlag=N) — checked、2026-11-12：会社の意味と회사에서の用例を確認
- [国立国語院 온라인 가나다](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=306903) — checked、2026-11-12：하여요と縮約形해요の関係を確認

### 第6章 第3節（内部day 38）

- [国立国語院 韓国語基礎辞典「친절하다」](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=72157&nation=eng) — checked、2026-11-12：人に接する態度が優しく柔らかい意味と친절해の形を確認
- [国立国語院 韓国語基礎辞典 자주](https://krdict.korean.go.kr/eng/dicMarinerSearch/search?mainSearchWord=%EC%9E%90%EC%A3%BC&nation=eng) — checked、2026-11-12：副詞자주の頻度の意味を確認

### 第6章 第4節（内部day 39）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=92032) — checked、2026-11-12：제일の副詞としての意味と用例を確認

### 第6章 第5節（内部day 40）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/m/jpn/searchResultView?ParaWordNo=28843&nation=jpn) — checked、2026-11-12：마지막の順序の終わりという意味と마지막으로の用例を確認
- [国立国語院 初級韓国語指導資料](https://www.korean.go.kr/common/download.do?book_seq=295&c_file_name=fbe8dc8b-5b54-46d0-96cb-229db3f23b4f_0.pdf&downGubun=bookDataView&file_path=bookData&o_file_name=%ED%95%9C%EA%B5%AD%EC%96%B4%EC%A7%84%ED%9D%A5-02-18.pdf) — checked、2026-11-12：했어요と하였어요の対応を確認

### 第6章 第6節（内部day 41）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/ara/dicSearch/SearchView?ParaWordNo=23324&nation=ara) — checked、2026-11-12：계획の将来の事柄を考えて定める意味と用例を確認

### 第6章 第7節（内部day 42）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=92032) — checked、2026-11-12：제일の意味と用例を確認

### 第7章 第1節（内部day 43）

- [国立国語院 韓国語発音教材](https://m.korean.go.kr/common/download.do?c_file_name=e05deaf1-1f57-4ed9-b8a2-ea6df1a06910_0.pdf&file_path=etcData&o_file_name=%EB%B0%94%EB%A5%B8+%EA%B5%AD%EC%96%B4+%EC%83%9D%ED%99%9C+%28%EA%B5%90%EC%82%AC+%EC%A7%81%EB%AC%B4+%EC%97%B0%EC%88%98+%EA%B5%90%EC%9E%AC%29.pdf) — checked、2026-11-12：発音の説明を参照。実音声は未確認
- [国立国語院 ㅐとㅔの発音](https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=8415&mn_id=217&pageIndex=4) — checked、2026-11-12：母音の舌の高さと区別の傾向を確認
- [国立国語院 韓国語教師向け講義資料](https://www.korean.go.kr/common/download.do?c_file_name=11fdc7c3-af42-4d08-b772-e4157fe4f0d3_0.pdf&file_path=reportData&o_file_name=%EA%B5%AD%EC%99%B8+%ED%95%9C%EA%B5%AD%EC%96%B4+%EA%B5%90%EC%82%AC%EB%A5%BC+%EC%9C%84%ED%95%9C+%ED%95%9C%EA%B5%AD%EC%96%B4+%EA%B0%95%EC%9D%98+%EC%9E%90%EB%A3%8C%EC%A7%91-%EB%9F%AC%EC%8B%9C%EC%95%84+%EC%82%AC%ED%95%A0%EB%A6%B0+%EC%A7%80%EC%97%AD.pdf) — checked、2026-11-12：平音・激音・濃音と息の観察、平音が有声音の間で有声化する説明を確認

### 第7章 第2節（内部day 44）

- [国立国語院 標準発音法第8・18項](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=2&qna_seq=313220) — checked、2026-11-12：終声と鼻音化を確認
- [国立国語院 標準発音法第13・23項](https://korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=98&pageIndex=1&qna_seq=323814) — checked、2026-11-12：連音と濃音化を確認
- [国立国語院 標準発音法第12項4の解説](https://korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=317352) — checked、2026-11-12：母音始まりの語尾・接尾辞の前でㅎが脱落し놓아を[노아]と発音することを確認
- [国立国語院 韓国語のローマ字表記法](https://www.korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0004) — checked、2026-11-12：같이[가치]、좋고[조코]の例を確認
- [国立国語院 韓国語基礎辞典 연락](https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=14013) — checked、2026-11-12：연락の発音と活用例を確認

### 第7章 第3節（内部day 45）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicMarinerSearch/search?mainSearchWord=%EB%91%90) — checked、2026-11-12：두が둘の連体形であることを確認

### 第7章 第4節（内部day 46）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319) — checked、2026-11-12：어디が疑問文で未知の場所を尋ねる用法と어디에서の例を確認
- [国立国語院 韓国語基礎辞典 언제](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng) — checked、2026-11-12：언제が主に疑問文で未知の時を尋ねる用法を確認

### 第7章 第5節（内部day 47）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319) — checked、2026-11-12：어디が疑問文で未知の場所を尋ねる用法と어디에서の例を確認
- [国立国語院 韓国語基礎辞典 언제](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng) — checked、2026-11-12：언제が主に疑問文で未知の時を尋ねる用法を確認

### 第7章 第6節（内部day 48）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319) — checked、2026-11-12：어디が疑問文で未知の場所を尋ねる用法と어디에서の例を確認
- [国立国語院 韓国語基礎辞典 언제](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng) — checked、2026-11-12：언제が主に疑問文で未知の時を尋ねる用法を確認

### 第7章 第7節（内部day 49）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319) — checked、2026-11-12：어디が疑問文で未知の場所を尋ねる用法と어디에서の例を確認
- [国立国語院 韓国語基礎辞典 언제](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng) — checked、2026-11-12：언제が主に疑問文で未知の時を尋ねる用法を確認

### 第8章 第1節（内部day 50）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319) — checked、2026-11-12：어디が疑問文で未知の場所を尋ねる用法と어디에서の例を確認
- [国立国語院 韓国語基礎辞典 언제](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng) — checked、2026-11-12：언제が主に疑問文で未知の時を尋ねる用法を確認

### 第8章 第2節（内部day 51）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319) — checked、2026-11-12：어디が疑問文で未知の場所を尋ねる用法と어디에서の例を確認
- [国立国語院 韓国語基礎辞典 언제](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng) — checked、2026-11-12：언제が主に疑問文で未知の時を尋ねる用法を確認

### 第8章 第3節（内部day 52）

- [国立国語院 韓国語基礎辞典](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319) — checked、2026-11-12：어디が疑問文で未知の場所を尋ねる用法と어디에서の例を確認
- [国立国語院 韓国語基礎辞典 언제](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng) — checked、2026-11-12：언제が主に疑問文で未知の時を尋ねる用法を確認

### 第8章 第4節（内部day 53）

- [国立国語院 韓国語基礎辞典 언제](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng) — checked、2026-11-12：언제が主に疑問文で未知の時を尋ねる用法を確認
- [国立国語院 韓国語基礎辞典 어디](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319) — checked、2026-11-12：어디が未知の場所を尋ね、어디에서の用例があることを確認
- [国立国語院 韓国語基礎辞典 빵](https://krdict.korean.go.kr/eng/dicMarinerSearch/search?mainSearchWord=%EB%B9%B5&nation=eng) — checked、2026-11-12：食べ物のパンを意味する名詞を確認

### 第8章 第5節（内部day 54）

- [国立国語院 韓国語基礎辞典 언제](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng) — checked、2026-11-12：언제が主に疑問文で未知の時を尋ねる用法を確認
- [国立国語院 韓国語基礎辞典 어디](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319) — checked、2026-11-12：어디が未知の場所を尋ね、어디에서の用例があることを確認

### 第8章 第6節（内部day 55）

- [国立国語院 韓国語基礎辞典 언제](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng) — checked、2026-11-12：언제が主に疑問文で未知の時を尋ねる用法を確認
- [国立国語院 韓国語基礎辞典 어디](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319) — checked、2026-11-12：어디が未知の場所を尋ね、어디에서の用例があることを確認

### 第8章 第7節（内部day 56）

- [国立国語院 韓国語基礎辞典 언제](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng) — checked、2026-11-12：언제が未知の時を尋ねる疑問文で用いられることを確認
- [国立国語院 韓国語基礎辞典 어디](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319) — checked、2026-11-12：어디が未知の場所を尋ねる疑問文で用いられることを確認
