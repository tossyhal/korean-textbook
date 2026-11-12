import { base, example, source, questions, listening, tagTopics } from "./shared";
export const day06 = base(
  6,
  "動作と丁寧な現在形",
  ["動詞の基本的な해요体を作る", "目的語と動作の場所・時点を表す"],
  [
    {
      heading: "辞書形から丁寧形へ",
      paragraphs: [
        "動詞は行く・食べるのような動作を表します。辞書で探す形を辞書形といい、가다（行く）や먹다（食べる）のように다で終わります。다を取って残る部分が語幹です。먹다なら먹が語幹です。",
        "基本の作り方は、語幹の最後の母音を調べ、ㅏ・ㅗなら아요、それ以外なら어요を付けることです。먹の母音はㅓなので먹＋어요→먹어요（食べます）です。最後の子音の有無だけで選ぶのではありません。하다は하여요となり、縮めた해요をよく使います。",
        "語幹が母音で終わると形が縮まることがあります。가다→가＋아요→가요、오다→오＋아요→와요、마시다→마시＋어요→마셔요です。마시어요も使えます。ここではこれらの基本的な例を扱い、不規則な変化は後で学びます。現在形は今の動作だけでなく習慣にも使えます。",
      ],
    },
    {
      heading: "何を、どこで、いつ",
      paragraphs: [
        "動作の対象を示す助詞が을／를です。何を食べるかを示す밥을では、밥にパッチムがあるため을を付けます。물もㄹのパッチムがあるので물을です。커피は母音で終わるため커피를です。",
        "場所に「いる」ときは에、場所で「勉強する」ときは에서を使います。학교에 있어요は学校にいる、학교에서 공부해요は学校で勉強するという違いです。移動先にも에を使い、학교에 가요は学校へ行くという意味です。",
        "時点を示す세 시에は「3時に」です。一方、오늘（今日）には通常에を付けません。助詞の訳を機械的に決める前に、その言葉が対象・場所・時点のどれを表すか考えましょう。",
      ],
    },
  ],
  [
    example("밥을 먹어요.", "ご飯を食べます。"),
    example("물을 마셔요.", "水を飲みます。"),
    example("학교에 가요.", "学校へ行きます。"),
    example("집에 와요.", "家に来ます。"),
    example("학교에서 공부해요.", "学校で勉強します。"),
    example("오늘 집에서 공부해요.", "今日は家で勉強します。"),
    example("세 시에 와요.", "3時に来ます。", "세 시は3時という時刻表現として扱う"),
  ],
  [
    example("오늘 학교에 가요?", "今日は学校へ行きますか。"),
    example("네, 학교에서 공부해요.", "はい、学校で勉強します。"),
  ],
  [
    ["먹다の丁寧形", "먹어요", "語幹먹に어요を付けます。"],
    ["가다の丁寧形", "가요", "가아요から縮約します。"],
    ["오다の丁寧形", "와요", "오아요が縮約します。"],
    ["마시다の丁寧形", "마셔요|마시어요", "마시어요が縮約します。"],
    ["공부하다の丁寧形", "공부해요|공부하여요", "하다は하여요にもなり、해요に縮約します。"],
    ["밥に付く目的語助詞", "을", "パッチムの後は을です。"],
    ["커피に付く目的語助詞", "를", "母音終わりの後は를です。"],
    ["물に付く目的語助詞", "을", "ㄹのパッチムがあるため을です。"],
    ["学校で勉強する時の助詞", "에서", "動作の場所を表します。"],
    ["学校にいる時の助詞", "에", "存在する場所を表します。"],
    [
      "水を飲みます。分かち書きも含め入力",
      "물을 마셔요|물을 마시어요",
      "물には을、마시다は마셔요または마시어요です。",
      "writing",
    ],
    [
      "오늘に時間の에を通常付けるか",
      "付けない",
      "오늘は通常에を伴いません。",
      "reading",
      ["付ける", "付けない"],
    ],
  ],
  [
    [
      "ご飯を食べます。分かち書きも含め入力",
      "밥을 먹어요",
      "パッチムのある밥に을を付けます。",
      "writing",
    ],
    [
      "家で勉強します。分かち書きも含め入力",
      "집에서 공부해요",
      "動作場所に에서、하다は해요です。",
      "writing",
    ],
    ["家にいます。分かち書きも含め入力", "집에 있어요", "所在を示す場所には에です。", "writing"],
    ["来るの丁寧形", "와요", "오다の縮約形です。"],
    ["時点「3時に」を入力", "세 시에", "時点に에を付けます。", "typing"],
  ],
  [
    source(
      "国立国語院学習辞典：아요",
      "https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=86568",
      "語幹末母音ㅏ・ㅗとの対応と丁寧な終結",
    ),
    source(
      "国立国語院学習辞典：에서",
      "https://krdict.korean.go.kr/m/jpn/searchResultView?ParaWordNo=68853&currentPage=1&exaType=&font_size=12&mainSearchWord=%EC%97%90%EC%84%9C&nation=jpn&nationCode=7&proverbType=&searchType=W&sort=&viewType=A&wordMatchFlag=N",
      "行動が行われる場所の用法",
    ),
  ],
  [
    {
      id: "vocab-gada",
      korean: "가다",
      meaning: "行く",
      partOfSpeech: "動詞",
      dictionaryForm: "가다",
      firstDay: 6,
    },
    {
      id: "vocab-oda",
      korean: "오다",
      meaning: "来る",
      partOfSpeech: "動詞",
      dictionaryForm: "오다",
      firstDay: 6,
    },
    {
      id: "vocab-meokda",
      korean: "먹다",
      meaning: "食べる",
      partOfSpeech: "動詞",
      dictionaryForm: "먹다",
      firstDay: 6,
    },
    {
      id: "vocab-masida",
      korean: "마시다",
      meaning: "飲む",
      partOfSpeech: "動詞",
      dictionaryForm: "마시다",
      firstDay: 6,
    },
    {
      id: "vocab-gongbu",
      korean: "공부하다",
      meaning: "勉強する",
      partOfSpeech: "動詞",
      dictionaryForm: "공부하다",
      firstDay: 6,
    },
    {
      id: "vocab-extra-3-1",
      korean: "밥",
      meaning: "ご飯",
      partOfSpeech: "名詞",
      dictionaryForm: "밥",
      firstDay: 3,
    },
    {
      id: "vocab-mul",
      korean: "물",
      meaning: "水",
      partOfSpeech: "名詞",
      dictionaryForm: "물",
      firstDay: 6,
    },
  ],
);

day06.production = {
  prompt: "自分の日常の動作とその場所を二文で書き、声に出して伝える。",
  model: "오늘 집에서 공부해요. 물을 마셔요.",
  rubric: ["動詞の丁寧形を使ったか", "目的語と動作場所の助詞を確認したか", "語尾まで声に出したか"],
};
day06.recall = questions(6, "recall", [
  ["所在する場所に付く助詞", "에", "所在の場所には에を使います。"],
]);
day06.exercises.push({
  ...listening(
    6,
    "ex",
    1,
    "학교에서 공부해요.",
    "音声ではどこで勉強しますか。",
    "学校",
    "학교에서は学校で、です。",
  ),
  options: ["学校", "家"],
});
day06.exitTest.push(
  listening(
    6,
    "exit",
    2,
    "물을 마셔요.",
    "音声を書き取る。分かち書きも含め入力",
    "물을 마셔요",
    "물を目的語にして飲みます。",
  ),
);

tagTopics(day06);
day06.vocabulary.push({
  id: "vocab-extra-6-0",
  korean: "커피",
  meaning: "コーヒー",
  partOfSpeech: "名詞",
  dictionaryForm: "커피",
  firstDay: 6,
});
day06.vocabulary.push({
  id: "vocab-extra-6-1",
  korean: "오늘",
  meaning: "今日",
  partOfSpeech: "名詞",
  dictionaryForm: "오늘",
  firstDay: 6,
});
day06.sections[1].paragraphs.push(
  "移動の行き先にも에を使います。학교에 가요は学校へ行く、집에 와요は家に来るという移動先です。세 시は세（「三」を表す셋が시の前で取る形）＋시（時）で3時。세 시에はその時点を示します。数字の体系は後の課で学びます。",
);
day06.vocabulary.push(
  {
    id: "vocab-object",
    korean: "을/를",
    meaning: "動作の対象を示す",
    partOfSpeech: "助詞",
    dictionaryForm: "을/를",
    firstDay: 6,
  },
  {
    id: "vocab-action-place",
    korean: "에서",
    meaning: "動作の場所を示す",
    partOfSpeech: "助詞",
    dictionaryForm: "에서",
    firstDay: 6,
  },
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
);
day06.exitTest = questions(6, "exit", [
  [
    "오늘 학교에서 물을 마셔요。動作はどこで行われますか",
    "学校",
    "학교에서は学校でです。",
    "reading",
    ["学校", "家"],
  ],
  ["学校へ行き、学校で勉強します。移動先を示す助詞", "에", "移動先に에を使います。"],
  [
    "コーヒーを飲みます。커피를で始めて入力",
    "커피를 마셔요|커피를 마시어요",
    "母音終わりの커피に를、未縮約形も使えます。",
    "writing",
  ],
  ["세 시に来ます。時点を示す助詞を補う：세 시＿ 와요", "에", "具体的な時点に에を付けます。"],
  [
    "집에 있어요と집에서 먹어요の違い",
    "所在と動作",
    "前者は所在、後者は動作です。",
    "reading",
    ["所在と動作", "肯定と否定"],
  ],
]);
day06.exitTest.push({
  ...listening(
    6,
    "exit",
    3,
    "집에서 커피를 마셔요.",
    "音声では何を飲みますか。",
    "コーヒー",
    "커피はコーヒーです。",
  ),
  options: ["コーヒー", "水"],
});
day06.sections[0].paragraphs.push(
  "가다は行く、오다は来る、먹다は食べる、마시다は飲む、공부하다は勉強するという動詞です。물は水、커피はコーヒー、오늘は今日という名詞です。밥はDay3の『ご飯』です。마시어요・공부하여요は、それぞれ마셔요・공부해요と縮める前の形です。",
);
