import { base, example, source, questions, listening, tagTopics } from "./shared";
export const day05 = base(
  5,
  "存在と場所",
  ["있어요／없어요で存在や持ち物を伝える", "場所の에と指示語を使う"],
  [
    {
      heading: "ある・ない",
      paragraphs: [
        "있어요は있다の丁寧な形で「あります／います」、없어요は없다の丁寧な形で「ありません／いません」です。책이 있어요は本があること、책이 없어요は本がないことを表します。存在するものには基本的に이／가を付けます。",
        "없다の없には二つの子音ㅂ・ㅅがパッチムとして並びます。없어요の綴りはそのままですが、母音で始まる語尾어요が続くと後ろのㅅが次の音節に移り、濃音となって[업써요]と発音します。角括弧は読み方で、書く形ではありません。",
        "人についてはいます、物についてはありますと日本語を選びますが、韓国語ではどちらも있어요です。文脈によって「持っています」にもなります。저는 책이 있어요は「私は本を持っています」と自然に訳せます。",
      ],
    },
    {
      heading: "場所と指示語",
      paragraphs: [
        "存在する場所には에を付けます。책이 집에 있어요は本が家にあります、저는 학교에 있어요は私は学校にいます、という所在です。後の課では動作の場所を表す에서と比べます。",
        "여기は話し手の近く、거기は聞き手の近くや話題の場所、저기は双方から離れた場所を指します。日本語のここ・そこ・あそこと似ていますが、指し示す場面を想像して使いましょう。ここにあると言うときは여기에 있어요です。",
        "物の名前の前には이 책（この本）、그 책（その本）、저 책（あの本）のように이・그・저を離して置きます。物の名前を言わずに指すときは이것（これ）、그것（それ）、저것（あれ）です。会話では이거・그거・저거とも言います。여기などは場所、이것などは物を指します。",
      ],
    },
  ],
  [
    example("책이 있어요.", "本があります。"),
    example("가방이 없어요.", "かばんがありません。"),
    example("책이 집에 있어요.", "本は家にあります。"),
    example("저는 학교에 있어요.", "私は学校にいます。"),
    example("가방이 여기에 있어요.", "かばんはここにあります。"),
    example("책이 저기에 있어요.", "本はあそこにあります。"),
  ],
  [
    example("책이 있어요?", "本はありますか。"),
    example("네, 책이 여기에 있어요.", "はい、本はここにあります。", "네は「はい」の丸ごと表現"),
  ],
  [
    ["「ない」の丁寧形", "없어요", "없다の丁寧形です。"],
    ["「ある」の丁寧形", "있어요", "있다の丁寧形です。"],
    ["책に付く主語の助詞", "이", "책にはパッチムがあります。"],
    ["가방に付く主語の助詞", "이", "가방にはパッチムがあります。"],
    ["家にいる：집の後の助詞", "에", "所在する場所を表します。"],
    ["話し手の近くを指す語", "여기", "話し手の近くです。"],
    ["双方から離れた場所を指す語", "저기", "双方から離れた場所です。"],
    ["聞き手の近くを指す語", "거기", "聞き手の近くや話題の場所です。"],
    [
      "本がありません。分かち書きも含め入力",
      "책이 없어요",
      "없어요で存在を否定します。",
      "writing",
    ],
    [
      "かばんが家にあります。分かち書きも含め入力",
      "가방이 집에 있어요",
      "所在の場所に에を使います。",
      "writing",
    ],
    [
      "저는 책이 있어요の自然な訳",
      "私は本を持っています",
      "文脈により所有を表します。",
      "reading",
      ["私は本を持っています", "私は本ではありません"],
    ],
    ["場所の에を選ぶ：학교＿ 있어요", "에", "所在には에を使います。", "reading", ["에", "에서"]],
  ],
  [
    [
      "本は学校にあります。分かち書きも含め入力",
      "책이 학교에 있어요",
      "所在の場所に에を付けます。",
      "writing",
    ],
    [
      "かばんがありません。分かち書きも含め入力",
      "가방이 없어요",
      "없어요で存在を否定します。",
      "writing",
    ],
    ["聞き手の手元を指す語", "거기", "聞き手に近い場所を指します。"],
    [
      "저기에 있어요の意味",
      "あそこにあります",
      "저기は双方から離れた場所です。",
      "reading",
      ["あそこにあります", "ここにありません"],
    ],
    [
      "「私は家にいます」を分かち書きも含め入力",
      "저는 집에 있어요",
      "話題と所在を表します。",
      "writing",
    ],
  ],
  [
    source(
      "国立国語院：標準発音法の解説",
      "https://m.korean.go.kr/nkview/nknews/199906/11_8.htm",
      "設問9：二重パッチムの後項ㅅと母音で始まる語尾",
    ),
    source(
      "国立国語院学習辞典：있다",
      "https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=68797",
      "存在、所在の文型と所有の意味",
    ),
    source(
      "国立国語院学習辞典：없다",
      "https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=89917",
      "存在しない意味と活用表示",
    ),
  ],
  [
    {
      id: "vocab-extra-3-0",
      korean: "책",
      meaning: "本",
      partOfSpeech: "名詞",
      dictionaryForm: "책",
      firstDay: 3,
    },
    {
      id: "vocab-gabang",
      korean: "가방",
      meaning: "かばん",
      partOfSpeech: "名詞",
      dictionaryForm: "가방",
      firstDay: 5,
    },
    {
      id: "vocab-jip",
      korean: "집",
      meaning: "家",
      partOfSpeech: "名詞",
      dictionaryForm: "집",
      firstDay: 5,
    },
    {
      id: "vocab-hakgyo",
      korean: "학교",
      meaning: "学校",
      partOfSpeech: "名詞",
      dictionaryForm: "학교",
      firstDay: 5,
    },
    {
      id: "vocab-itda",
      korean: "있다",
      meaning: "ある、いる",
      partOfSpeech: "形容詞",
      dictionaryForm: "있다",
      firstDay: 5,
    },
    {
      id: "vocab-eopda",
      korean: "없다",
      meaning: "ない、いない",
      partOfSpeech: "形容詞",
      dictionaryForm: "없다",
      firstDay: 5,
    },
  ],
);

day05.production = {
  prompt: "身近な物がどこにあるか、ある物とない物を伝える。",
  model: "책이 집에 있어요. 가방이 없어요.",
  rubric: ["存在と不在を区別したか", "所在の場所に에を付けたか", "分かち書きと発音を確かめたか"],
};
day05.recall = questions(5, "recall", [
  ["학생に続く代表的な丁寧形", "이에요", "パッチムのある名詞には이에요です。"],
]);
day05.exercises.push({
  ...listening(
    5,
    "ex",
    1,
    "가방이 집에 있어요.",
    "音声ではかばんはどこにありますか。",
    "家",
    "집は家です。",
  ),
  options: ["家", "学校"],
});
day05.exitTest.push(
  listening(
    5,
    "exit",
    2,
    "책이 없어요.",
    "音声を書き取る。分かち書きも含め入力",
    "책이 없어요",
    "없어요はありません。",
  ),
);

tagTopics(day05);
day05.vocabulary.push({
  id: "vocab-extra-5-0",
  korean: "여기",
  meaning: "ここ",
  partOfSpeech: "代名詞",
  dictionaryForm: "여기",
  firstDay: 5,
});
day05.vocabulary.push({
  id: "vocab-extra-5-1",
  korean: "거기",
  meaning: "そこ",
  partOfSpeech: "代名詞",
  dictionaryForm: "거기",
  firstDay: 5,
});
day05.vocabulary.push({
  id: "vocab-extra-5-2",
  korean: "저기",
  meaning: "あそこ",
  partOfSpeech: "代名詞",
  dictionaryForm: "저기",
  firstDay: 5,
});
day05.vocabulary.push({
  id: "vocab-location-e",
  korean: "에",
  meaning: "存在する場所を示す",
  partOfSpeech: "助詞",
  dictionaryForm: "에",
  firstDay: 5,
});
day05.exitTest = questions(5, "exit", [
  [
    "『책이 학교에 있어요. 가방은 집에 있어요.』学校にある物は何ですか",
    "本",
    "책は本、학교は学校です。",
    "reading",
    ["かばん", "本"],
  ],
  ["話し手も聞き手も遠い場所を指す語", "저기", "双方から遠い場所です。"],
  [
    "『가방이 학교에 있어요. 책이 없어요.』ない物は何ですか",
    "本",
    "책이 없어요は本がないという意味です。",
    "reading",
    ["かばん", "本"],
  ],
  [
    "本はここ、かばんはそこにあります。『かばんがそこにあります』を가방이で始めて入力",
    "가방이 거기에 있어요",
    "거기에はそこにです。",
    "writing",
  ],
  ["학교에 있어요で에が示すもの", "所在", "存在する場所です。", "reading", ["所在", "動作の対象"]],
]);
day05.exitTest.push({
  ...listening(
    5,
    "exit",
    3,
    "가방이 저기에 있어요.",
    "音声ではかばんはどこですか。",
    "あそこ",
    "저기はあそこです。",
  ),
  options: ["あそこ", "ここ"],
});
day05.sections[0].paragraphs.push(
  "가방はかばん、집は家、학교は学校（名詞）です。있다はこの課で扱う存在・所在・所有の意味では形容詞、없다も形容詞です。여기・거기・저기は場所を指す代名詞です。네は『はい』という応答として丸ごと覚えます。",
);

day05.exercises.push(
  ...questions(5, "ex", [
    [
      "ここにある本を指します。『これ』はどれですか",
      "이것",
      "이것は物、여기は場所です。",
      "reading",
      ["이것", "여기"],
    ],
    [
      "없어요の発音を選ぶ",
      "업써요",
      "ㅅが母音語尾の前で次の音節に移り濃音になります。",
      "reading",
      ["업써요", "업서요"],
    ],
  ]).map((q, i) => ({ ...q, id: `day-05-ex-foundation-${i + 1}` })),
);

day05.vocabulary.push(
  ...[
    ["i-determiner", "이", "この", "冠形詞"],
    ["geu-determiner", "그", "その", "冠形詞"],
    ["jeo-determiner", "저", "あの", "冠形詞"],
    ["igeot", "이것", "これ", "代名詞"],
    ["geugeot", "그것", "それ", "代名詞"],
    ["jeogeot", "저것", "あれ", "代名詞"],
  ].map(([id, korean, meaning, partOfSpeech]) => ({
    id: `vocab-${id}`,
    korean,
    meaning,
    partOfSpeech,
    dictionaryForm: korean,
    firstDay: 5,
  })),
);
