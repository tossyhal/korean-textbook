import { day17 } from "../week03/day17";
import { vocabulary } from "../week02/shared";
import { base, example, listening, questions, source, setTopics } from "../week02/shared";

export const day26 = base(
  26,
  "名詞を詳しく説明する",
  ["動詞の現在・過去・予定を名詞の前で区別する", "形容詞の連体形と対比する"],
  [
    {
      heading: "形容詞で名詞を説明する",
      paragraphs: [
        "第3週の形容詞の連体形を思い出しましょう。큰 방は大きい部屋、작은 방は小さい部屋です。形容詞の-(으)ㄴは通常、その名詞の現在の性質を示します。",
        "좋은 책はよい本です。述語の책이 좋아요と違い、좋은は名詞の直前に置きます。形容詞の-(으)ㄴを動詞の過去と一律に同じ意味で扱わないようにします。",
      ],
    },
    {
      heading: "動詞の現在",
      paragraphs: [
        "動詞の語幹に-는を付け、後ろの名詞を修飾できます。읽는 책は「読む本／読んでいる本」、먹는 음식は「食べる食べ物」です。進行中か習慣かは文脈から判断します。",
        "ㄹ語幹ではㄹが落ち、살다→사는 사람、만들다→만드는 음식です。名詞と修飾部分を分かち書きします。",
      ],
    },
    {
      heading: "動詞の過去",
      paragraphs: [
        "過去の動作には-(으)ㄴを使います。읽다→읽은 책、보다→본 영화、만들다→만든 음식です。パッチムがあれば은、なければㄴ、ㄹ語幹はㄹを落としてㄴです。",
        "어제 읽은 책は昨日読んだ本です。動作が先行・完了したことを表す用法で、形容詞の좋은 책は過去を表しません。時間の関係は文脈で考えます。",
      ],
    },
    {
      heading: "これからの予定",
      paragraphs: [
        "これから行う予定などには-(으)ㄹを使います。읽을 책は読む予定の本、볼 영화は見る予定の映画です。母音の後にはㄹ、子音の後には을を使い、ㄹ語幹は살 집のようにㄹを保ちます。",
        "읽는 책、읽은 책、읽을 책を時間と一緒に比べましょう。未来形には推量など別の用法もありますが、ここでは予定に限ります。",
      ],
    },
  ],
  [
    example("좋은 책이 있어요.", "よい本があります。"),
    example("지금 읽는 책이 재미있어요.", "今読んでいる本は面白いです。"),
    example("어제 읽은 책이 좋아요.", "昨日読んだ本が好きです。"),
    example("내일 읽을 책이 있어요.", "明日読む本があります。"),
    example("친구가 보는 영화예요.", "友人が見ている映画です。"),
    example("어제 본 영화가 재미있었어요.", "昨日見た映画は面白かったです。"),
    example("내일 볼 영화예요.", "明日見る映画です。"),
    example("친구가 만든 음식이에요.", "友人が作った料理です。"),
  ],
  [
    example("지금 읽는 책이 재미있어요?", "今読んでいる本は面白いですか。"),
    example("네, 재미있어요.", "はい、面白いです。"),
    example("내일 읽을 책도 있어요?", "明日読む本もありますか。"),
    example("네, 친구가 준 책이에요.", "はい、友人がくれた本です。"),
  ],
  [
    ["좋다で「よい本」", "좋은 책", "形容詞は좋은です。", "typing"],
    ["읽다で「今読む本」", "읽는 책", "動詞の現在は는です。", "typing"],
    ["읽다で「昨日読んだ本」", "읽은 책", "읽には은を付けます。", "typing"],
    ["읽다で「明日読む本」", "읽을 책", "읽には을を付けます。", "typing"],
    ["보다で「見た映画」", "본 영화", "보にㄴを付けます。", "typing"],
    ["보다で「見る予定の映画」", "볼 영화", "보にㄹを付けます。", "typing"],
    ["살다で「住む人」", "사는 사람", "ㄹを落として는を付けます。", "typing"],
    ["만들다で「作った料理」", "만든 음식", "ㄹを落としてㄴを付けます。", "typing"],
    ["살다で「住む予定の家」", "살 집", "ㄹ語幹はㄹを保ちます。", "typing"],
    [
      "「읽는 책」の意味",
      "読んでいる本",
      "는は現在の動作です。",
      "reading",
      ["読んでいる本", "読んだ本", "読む予定の本"],
    ],
    [
      "「좋은 책」の좋은が示すもの",
      "現在の性質",
      "形容詞の連体形です。",
      "reading",
      ["現在の性質", "過去の動作", "未来の動作"],
    ],
    ["「어제 본 영화」の時間", "昨日", "어제は昨日です。", "reading", ["昨日", "今日", "明日"]],
  ],
  [
    [
      "「지금 친구가 읽는 책은 재미있어요. 내일 볼 영화도 있어요.」今読んでいるもの",
      "本",
      "읽는 책です。",
      "reading",
      ["本", "映画", "料理"],
    ],
    [
      "同じ文章で明日の予定",
      "映画を見る",
      "내일 볼 영화は明日見る映画です。",
      "reading",
      ["映画を見る", "本を買う", "料理を作る"],
    ],
    [
      "어제、보다、영화をこの順で「昨日見た映画」",
      "어제 본 영화",
      "보다の過去連体形は본です。",
      "writing",
    ],
    [
      "내일、먹다、음식をこの順で「明日食べる料理」",
      "내일 먹을 음식",
      "먹을はこれからの予定です。",
      "writing",
    ],
    [
      "「어제 친구가 만든 음식을 오늘 먹어요.」料理を作った人",
      "友人",
      "친구가 만든は友人が作ったです。",
      "reading",
      ["友人", "先生", "話し手"],
    ],
    ["만들다で「今作る料理」", "만드는 음식", "ㄹを落として는を付けます。", "typing"],
  ],
  [
    source(
      "国立国語院：連体形と時制",
      "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=306800",
      "現在の-는の辞書記述と時制・相について諸説があること",
    ),
  ],
);
day26.recall = questions(26, "recall", [
  ["크다で「大きい部屋」", "큰 방", "語幹크にㄴを付けて큰になります。", "typing"],
  ["작다で「小さい部屋」", "작은 방", "パッチム後は은です。", "typing"],
]);
day26.exercises.push({
  ...listening(
    26,
    "ex",
    1,
    "어제 본 영화는 재미있었어요. 내일 읽을 책도 있어요.",
    "昨日したことは？",
    "映画を見た",
    "어제 본 영화は昨日見た映画です。",
  ),
  options: ["映画を見た", "本を読んだ", "料理を作った"],
});
day26.exitTest.push({
  ...listening(
    26,
    "exit",
    1,
    "지금 먹는 음식은 친구가 만들었어요. 내일 볼 영화도 친구가 좋아해요.",
    "友人が作ったものは？",
    "今食べている料理",
    "먹는 음식は今食べる料理です。",
  ),
  options: ["今食べている料理", "明日見る映画", "昨日読んだ本"],
});
day26.production = {
  prompt: "今読んでいるもの、過去に見たもの、これからする予定について3文以上書き話す。",
  model: "지금 읽는 책이 재미있어요. 어제 본 영화도 좋았어요. 내일 볼 영화가 있어요.",
  rubric: [
    "現在・過去・予定を区別したか",
    "各連体形と名詞を分かち書きしたか",
    "内容を3文以上で伝えたか",
    "声に出して時間の関係を確認したか",
  ],
};
setTopics(day26, [
  ["grammar-verb-modifier-present", "動詞の現在連体形", 1],
  ["grammar-verb-modifier-past", "動詞の過去連体形", 2],
  ["grammar-verb-modifier-future", "動詞の予定の連体形", 3],
  ["grammar-modifier-comparison", "形容詞との対比", 0],
]);
const day26ExerciseTags = [
  "comparison",
  "present",
  "past",
  "future",
  "past",
  "future",
  "present",
  "past",
  "future",
  "present",
  "comparison",
  "past",
  "past",
];
const day26ExitTags = ["present", "future", "past", "future", "past", "present", "past"];
const modifierTag = (tag: string) =>
  tag === "comparison" ? "grammar-modifier-comparison" : `grammar-verb-modifier-${tag}`;
for (const q of day26.recall) q.tags = [modifierTag("comparison")];
day26.exercises.forEach((q, i) => {
  q.tags = [modifierTag(day26ExerciseTags[i])];
});
day26.exitTest.forEach((q, i) => {
  q.tags = [modifierTag(day26ExitTags[i])];
});

day26.sections.push({
  heading: "修飾する対象を広げる",
  paragraphs: [
    "기사（記事）、안내（案内）、장소（場所）、선물（贈り物）、이야기（話）は、動作の対象や場所として説明できます。읽는 기사は今読んでいる記事、갈 장소はこれから行く場所です。",
    "지도（地図）、가게（店）、그림（絵）、이름（名前）、문제（問題）も、名詞の前に詳しい情報を置けます。찾는 가게は探している店、친구가 그린 그림は友人が描いた絵です。그리다は描くという意味です。",
  ],
});
day26.examples.push(
  example("지금 읽는 기사가 재미있어요.", "今読んでいる記事は面白いです。"),
  example("어제 받은 선물이에요.", "昨日もらった贈り物です。", "받다は受け取る"),
  example("내일 갈 장소예요.", "明日行く場所です。"),
  example("친구가 그린 그림이에요.", "友人が描いた絵です。"),
  example("지금 찾는 가게예요.", "今探している店です。"),
);
day26.vocabulary = vocabulary(26, [
  ["gisa", "기사", "記事", "名詞"],
  ["annae", "안내", "案内", "名詞"],
  ["jangso", "장소", "場所", "名詞"],
  ["seonmul", "선물", "贈り物", "名詞"],
  ["iyagi", "이야기", "話", "名詞"],
  ["jido", "지도", "地図", "名詞"],
  ["ireum", "이름", "名前", "名詞"],
  ["munje", "문제", "問題", "名詞"],
  ["gage", "가게", "店", "名詞"],
  ["geurida", "그리다", "描く", "動詞"],
  ["batda", "받다", "受け取る", "動詞"],
]);

day26.vocabulary.push(...day17.vocabulary.filter((v) => v.id === "vocab-geurim"));

// 時間表現ではなく、設問で問う連体形を復習先にする。
day26.exitTest[0].tags = ["grammar-verb-modifier-present"];
day26.exercises[1] = {
  ...day26.exercises[1],
  prompt: "「지금 친구가 읽는 책이에요.」今読んでいる人は？",
  type: "choice",
  skill: "reading",
  options: ["友人", "先生", "話し手"],
  answers: ["友人"],
  explanation: "친구가 읽는は友人が読んでいるという意味です。",
  tags: ["grammar-verb-modifier-present"],
};
day26.exercises[2] = {
  ...day26.exercises[2],
  prompt: "「어제 만든 음식이에요.」料理を作ったのはいつ？",
  type: "choice",
  skill: "reading",
  options: ["昨日", "今日", "明日"],
  answers: ["昨日"],
  explanation: "어제 만든は昨日作ったことを示します。",
  tags: ["grammar-verb-modifier-past"],
};

import { vocabulary as supplementalVocabulary } from "../week02/shared";
day26.vocabulary.push(...supplementalVocabulary(26, [["mandeulda", "만들다", "作る", "動詞"]]));
