import { base, example, listening, questions, source } from "../week01/shared";

export const day11 = base(
  11,
  "数と時刻・日付",
  ["固有数詞と漢数詞を場面に応じて使う", "時刻・日付・値段・人数を伝える"],
  [
    {
      heading: "二つの数の数え方",
      paragraphs: [
        "韓国語には固有数詞と漢数詞があります。同じ数でも、何を数えるかで使い分けます。固有数詞は、하나、둘、셋、넷、다섯、여섯、일곱、여덟、아홉、열（1〜10）、스물（20）です。数だけなら셋、物の数なら세 개と言います。하나、둘、셋、넷、스물は助数詞の前で한、두、세、네、스무に変わります。열하나は열한 개、스물하나は스물한 개です。",
        "漢数詞は일、이、삼、사、오、육、칠、팔、구、십（1〜10）、백（100）、천（1000）、만（10000）です。11は십일、20は이십、23は이십삼。日本語に似ていますが、同じ漢字音だと決めつけず形を覚えましょう。例えば2000は이천、12000は만 이천です。",
      ],
    },
    {
      heading: "時刻と日付",
      paragraphs: [
        "時刻の「時」は固有数詞、「分」は漢数詞です。세 시 십 분は3時10分、두 시 삼십 분は2時30分。30分は두 시 반とも言えます。時点を示す에を付けると세 시 십 분에です。三時を삼 시、十分を열 분と混ぜないようにします。時間の長さを表す言い方はここでは扱いません。",
        "月日には漢数詞を使い、6月と10月はそれぞれ유월、시월です。6分の육 분や10日の십 일とは異なります。月名単独では오월、유월のように続けて書き、日付の中の数と単位は오 월 삼 일のように離すのが原則で、오월 삼일のように続ける形も許されます。유월、시월は常に続けます。",
      ],
    },
    {
      heading: "人数、物の数、値段",
      paragraphs: [
        "人は固有数詞＋명、物は固有数詞＋개で数えます。학생 두 명は学生2人、가방 네 개はかばん4個です。人や物の名詞、数、助数詞はそれぞれ離して書きます。助数詞にはほかの種類もあります。本を数える単位は권です。책 네 권は本4冊です。",
        "値段は漢数詞＋원です。삼천 원は3000ウォン、만 원は10000ウォン。数と원を離すのが原則で、金額では続けて書く慣例もあります。この課では区切りが見える原則形で練習します。韓国語の疑問語몇（いくつ・何人）、얼마（いくら）を使い、몇 명、얼마예요?と尋ねられます。",
      ],
    },
  ],
  [
    example("학생이 두 명 있어요.", "学生が2人います。"),
    example("가방이 네 개 있어요.", "かばんが4個あります。"),
    example("세 시 십 분에 와요.", "3時10分に来ます。"),
    example("두 시 반에 공부해요.", "2時半に勉強します。"),
    example("오늘은 오 월 삼 일이에요.", "今日は5月3日です。"),
    example("유월 십 일에 가요.", "6月10日に行きます。"),
    example("커피는 삼천 원이에요.", "コーヒーは3000ウォンです。"),
    example("물이 스무 개 있어요.", "水が20個あります。", "容器などを数えている場面"),
  ],
  [
    example("학생이 몇 명 있어요?", "学生は何人いますか。"),
    example("세 명 있어요.", "3人います。"),
    example("몇 시에 와요?", "何時に来ますか。"),
    example("네 시 삼십 분에 와요.", "4時30分に来ます。"),
    example("커피는 얼마예요?", "コーヒーはいくらですか。"),
    example("이천 원이에요.", "2000ウォンです。"),
  ],
  [
    ["셋の助数詞前の形", "세", "셋は助数詞の前で세になります。"],
    ["스물の助数詞前の形", "스무", "20個は스무 개です。"],
    ["1人を原則の分かち書きで入力", "한 명", "하나は한になり、명と離します。", "typing"],
    ["4個を原則の分かち書きで入力", "네 개", "넷は네になり、개と離します。", "typing"],
    ["7時を原則の分かち書きで入力", "일곱 시", "時は固有数詞を使います。", "typing"],
    ["15分を原則の分かち書きで入力", "십오 분", "分は漢数詞を使います。", "typing"],
    [
      "3時10分の「時」に使う数詞",
      "固有数詞",
      "時は固有数詞です。",
      "reading",
      ["固有数詞", "漢数詞"],
    ],
    ["6月の月名を入力", "유월", "6月は육월ではなく유월です。", "typing"],
    ["10月の月名を入力", "시월", "10月は십월ではなく시월です。", "typing"],
    ["3000ウォンを原則の分かち書きで入力", "삼천 원", "値段には漢数詞を使います。", "typing"],
    [
      "두 시 반は何時ですか",
      "2時30分",
      "반は半、ここでは30分です。",
      "reading",
      ["2時30分", "2時15分", "3時30分"],
    ],
    [
      "학생 두 명の意味",
      "学生2人",
      "명は人数を数えます。",
      "reading",
      ["学生2人", "本2冊", "学生20人"],
    ],
  ],
  [
    [
      "学校には学生が四人います。人数だけを原則の分かち書きで入力",
      "네 명",
      "넷は助数詞前で네になります。",
      "typing",
    ],
    [
      "約束は8時20分です。時刻を原則の分かち書きで入力",
      "여덟 시 이십 분",
      "時は固有数詞、分は漢数詞です。",
      "typing",
    ],
    [
      "コーヒーは10000ウォンです。値段を原則の分かち書きで入力",
      "만 원",
      "10000は만、通貨単位원を離します。",
      "typing",
    ],
    [
      "시월 육 일の日付",
      "10月6日",
      "시월は10月、육 일は6日です。",
      "reading",
      ["10月6日", "6月10日", "10月10日"],
    ],
    [
      "かばんが20個あります。数と助数詞を原則の分かち書きで入力",
      "스무 개",
      "스물は助数詞前で스무になります。",
      "typing",
    ],
  ],
  [
    source(
      "国立国語院：初級韓国語読解の指導資料",
      "https://www.korean.go.kr/common/download.do?book_seq=294&c_file_name=48c417c6-047f-48f4-88a7-959f28e5e0ad_0.pdf&downGubun=bookDataView&file_path=bookData&o_file_name=%ED%95%9C%EA%B5%AD%EC%96%B4%EC%A7%84%ED%9D%A5-02-17.pdf",
      "時は固有数詞、分は漢数詞、30分は반とも表すこと",
    ),
    source(
      "国立国語院：数量を数える語",
      "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=331063",
      "하나〜넷に対応する数冠形詞と11〜14の形",
    ),
    source(
      "国立国語院：月名と日付の分かち書き",
      "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=329930",
      "月名の綴り、日付と時刻の原則・許容表記",
    ),
    source(
      "国立国語院：分かち書き",
      "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=307291",
      "数と単位の分かち書きと金額表記の慣例",
    ),
  ],
);

day11.recall = questions(11, "recall", [
  ["具体的な時点に付ける助詞", "에", "時点には에を使います。"],
  ["세 시の意味", "3時", "세は셋の名詞前の形です。", "reading", ["3時", "3分"]],
]);
day11.exercises.push({
  ...listening(
    11,
    "ex",
    1,
    "학생이 다섯 명 있어요.",
    "学生は何人いますか。",
    "5人",
    "다섯 명は5人です。",
  ),
  options: ["5人", "4人", "10人"],
});
day11.exitTest.push({
  ...listening(
    11,
    "exit",
    1,
    "일곱 시 십오 분에 학교에 가요.",
    "学校へ行く時刻は何時ですか。",
    "7時15分",
    "일곱 시 십오 분は7時15分です。",
  ),
  options: ["7時15分", "7時50分", "5時15分"],
});
day11.production = {
  prompt: "架空の予定を2〜4文で書き、声に出す。日付と時刻、人数または値段を含める。",
  model: "시월 삼 일에 학교에 가요. 두 시에 공부해요. 학생이 세 명 있어요.",
  rubric: [
    "月日を漢数詞で表し、10月を시월と書いたか",
    "時刻の時と分の数詞を使い分けたか",
    "人数または値段の数詞と単位を使えたか",
    "書いた予定を声に出して確認したか",
  ],
};
day11.grammar = [
  { id: "grammar-numbers", name: "固有数詞と漢数詞", firstDay: 11, sectionId: "section-0" },
  { id: "grammar-time-date", name: "時刻と日付", firstDay: 11, sectionId: "section-1" },
  { id: "grammar-count-price", name: "人数・個数・値段", firstDay: 11, sectionId: "section-2" },
];
day11.reviewTargets = day11.grammar.map((item) => item.id);
for (const question of [...day11.recall, ...day11.exercises, ...day11.exitTest]) {
  question.tags = ["grammar-numbers", "grammar-time-date", "grammar-count-price"];
}
const numberWords: [string, string, string][] = [
  ["hana", "하나", "一"],
  ["dul", "둘", "二"],
  ["net", "넷", "四"],
  ["daseot", "다섯", "五"],
  ["yeoseot", "여섯", "六"],
  ["ilgop", "일곱", "七"],
  ["yeodeol", "여덟", "八"],
  ["ahop", "아홉", "九"],
  ["yeol", "열", "十"],
  ["seumul", "스물", "二十"],
  ["il", "일", "一（日にも使う）"],
  ["i", "이", "二"],
  ["sam", "삼", "三"],
  ["sa", "사", "四"],
  ["o", "오", "五"],
  ["yuk", "육", "六"],
  ["chil", "칠", "七"],
  ["pal", "팔", "八"],
  ["gu", "구", "九"],
  ["sip", "십", "十"],
  ["baek", "백", "百"],
  ["cheon", "천", "千"],
  ["man", "만", "万"],
];
day11.vocabulary = numberWords.map(([id, korean, meaning]) => ({
  id: `vocab-number-${id}`,
  korean,
  meaning,
  dictionaryForm: korean,
  partOfSpeech: "数詞",
  firstDay: 11,
}));
day11.vocabulary.push(
  {
    id: "vocab-three",
    korean: "셋",
    meaning: "三（名詞の前では세）",
    partOfSpeech: "数詞",
    dictionaryForm: "셋",
    firstDay: 6,
  },
  {
    id: "vocab-hour",
    korean: "시",
    meaning: "時",
    partOfSpeech: "依存名詞",
    dictionaryForm: "시",
    firstDay: 6,
  },
  ...(
    [
      ["bun", "분", "分", "依存名詞"],
      ["myeong", "명", "人（人数の単位）", "依存名詞"],
      ["gae", "개", "個", "依存名詞"],
      ["gwon", "권", "冊", "依存名詞"],
      ["won", "원", "ウォン", "依存名詞"],
      ["ban", "반", "半分", "名詞"],
      ["yuwol", "유월", "六月", "名詞"],
      ["siwol", "시월", "十月", "名詞"],
      ["wol", "월", "月", "依存名詞"],
      ["myeot", "몇", "いくつの", "冠形詞"],
      ["eolma", "얼마", "いくら", "名詞"],
    ] as [string, string, string, string][]
  ).map(([id, korean, meaning, partOfSpeech]) => ({
    id: `vocab-${id}`,
    korean,
    meaning,
    partOfSpeech,
    dictionaryForm: korean,
    firstDay: 11,
  })),
);
for (const q of [...day11.recall, ...day11.exercises, ...day11.exitTest]) {
  const text = `${q.prompt} ${q.explanation}`;
  q.tags = [
    /時|分|月|日/u.test(text)
      ? "grammar-time-date"
      : /人|個|원|ウォン|명|개/u.test(text)
        ? "grammar-count-price"
        : "grammar-numbers",
  ];
}
