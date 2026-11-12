import type { GrammarBinding } from "./types";

export const bindingsLate: Record<string, GrammarBinding> = {
  "grammar-vowel-mouth": {
    paragraphIndices: [1],
    prompt: "어・오・우の唇と舌の位置を説明しましょう。",
  },
  "grammar-ae-e-variation": {
    paragraphIndices: [0, 1],
    prompt: "ㅐとㅔの発音にはどんな話者差があり、綴りをどう確認しますか。",
  },
  "grammar-three-stops": {
    paragraphIndices: [1, 2],
    prompt: "平音・激音・濃音の特徴と、平音の位置による変化を説明しましょう。",
  },
  "grammar-pronunciation-practice": {
    paragraphIndices: [0, 1],
    prompt: "불・풀・뿔の違いを観察するとき、どの順序で比較しますか。",
  },
  "grammar-final-sounds": {
    paragraphIndices: [1],
    prompt: "終声の七つの代表音と、[ㄱ ㄷ ㅂ]の終わり方を説明しましょう。",
  },
  "grammar-linking-sounds": {
    paragraphIndices: [0, 1],
    prompt: "옷이と꽃을の連音を、綴りと発音の違いに注意して説明しましょう。",
  },
  "grammar-nasal-tense": {
    paragraphIndices: [0, 1, 2],
    prompt: "국물と먹다を例に、鼻音化と濃音化を説明しましょう。",
  },
  "grammar-record-final": {
    paragraphIndices: [2],
    prompt: "읽어요と읽고の発音表示を比べ、続く部分と音の変化を確認しましょう。",
  },
  "grammar-question-focus": {
    paragraphIndices: [0, 1],
    prompt: "어디에・어디에서・누구・언제・무엇はそれぞれ何を尋ねますか。",
  },
  "grammar-number-unit-listen": {
    paragraphIndices: [0, 1],
    prompt: "두 시・세 명・네 개・이십 분の意味と数詞の形を説明しましょう。",
  },
  "grammar-listening-strategy": {
    paragraphIndices: [0],
    prompt: "聴解では質問と数字をどの順に確認し、推測をどう扱いますか。",
  },
  "grammar-confirm-listening": { questionId: "day-45-ex-12" },
  "grammar-w7-46-0": { questionId: "day-46-ex-1" },
  "grammar-w7-46-1": {
    paragraphIndices: [0],
    prompt: "会話を初めて聞くとき、原文を確認するまでの手順を説明しましょう。",
  },
  "grammar-w7-46-2": {
    paragraphIndices: [0, 1],
    prompt: "친구와 공원에 가요を書き取るとき、助詞と空白をどう確認しますか。",
  },
  "grammar-w7-46-3": {
    paragraphIndices: [0, 1],
    prompt: "短い部分を照合した後、復唱と再聴をどう進めますか。",
  },
  "grammar-w7-47-0": {
    paragraphIndices: [0],
    prompt: "오늘 집에서 공부해요の時・場所・行動を分けましょう。",
  },
  "grammar-w7-47-1": {
    paragraphIndices: [0],
    prompt: "내일 학교에 가요の時・行き先・行動を分け、에と에서の役割を説明しましょう。",
  },
  "grammar-w7-47-2": {
    paragraphIndices: [0],
    prompt: "同じ文と別の文を聞く追加練習では、何を聞き取れるか試しますか。",
  },
  "grammar-w7-47-3": {
    paragraphIndices: [0, 1],
    prompt: "친구와 책을 읽어요を書き取る際の分かち書きと、照合後の手順を説明しましょう。",
  },
  "grammar-w7-48-0": { questionId: "day-48-ex-1" },
  "grammar-w7-48-1": {
    paragraphIndices: [0, 1],
    prompt: "먼저と그다음에は行動の順序をどう示し、会う時と場所はどう整理しますか。",
  },
  "grammar-w7-48-2": {
    paragraphIndices: [0],
    prompt: "聴解の答えの根拠は、原文を開く前後でどう確かめますか。",
  },
  "grammar-w7-48-3": {
    paragraphIndices: [0, 1],
    prompt: "가족과 가요の語と助詞を分け、書取と復唱の手順を説明しましょう。",
  },
  "grammar-w7-49-review": {
    paragraphIndices: [0, 1],
    prompt: "時・場所の混同、書取、予定の聞き取り、音のつながりに迷ったら、どの節へ戻りますか。",
  },
  "grammar-w7-50-0": {
    paragraphIndices: [1],
    prompt: "친구가 오늘 안 와요の人・時・否定された行動を説明しましょう。",
  },
  "grammar-w7-50-1": {
    paragraphIndices: [0, 1],
    prompt: "例文の-아서/어서と-고は、それぞれ理由と順序をどうつなぎますか。",
  },
  "grammar-w7-50-2": {
    paragraphIndices: [0, 2],
    prompt: "산 책と좋아하는 노래で、名詞を説明する部分はそれぞれどれですか。",
  },
  "grammar-w7-50-3": {
    paragraphIndices: [1],
    prompt: "週末の短文で、写真を撮った理由とその後の行動を説明しましょう。",
  },
  "grammar-w7-51-0": {
    paragraphIndices: [0, 1],
    prompt: "日記の例で時・出来事・感想をどうつなぎ、過去をどう示しますか。",
  },
  "grammar-w7-51-1": {
    paragraphIndices: [0, 1],
    prompt: "待ち合わせの連絡にはどんな情報を入れ、変更やおわびをどう添えますか。",
  },
  "grammar-w7-51-2": {
    paragraphIndices: [0, 1],
    prompt: "質問と返答を組にし、못 가요と안 가요の意味を区別しましょう。",
  },
  "grammar-w7-51-3": {
    paragraphIndices: [1],
    prompt: "日記とメッセージを見直す際、それぞれ何を確認しますか。",
  },
  "grammar-w7-52-0": {
    paragraphIndices: [0, 1],
    prompt: "原文を開く前に質問と音声をどう確認し、聞こえない情報をどう扱いますか。",
  },
  "grammar-w7-52-1": {
    paragraphIndices: [1],
    prompt: "사과 두 개를 안 사요を言い換える際、何を保ち何を付け足さないようにしますか。",
  },
  "grammar-w7-52-2": {
    paragraphIndices: [0, 1],
    prompt: "書取と復唱の順序と、確認する点を説明しましょう。",
  },
  "grammar-w7-52-3": { questionId: "day-52-ex-4" },
  "grammar-w8-53-0": { questionId: "day-53-ex-4" },
  "grammar-w8-53-1": { questionId: "day-53-ex-5" },
  "grammar-w8-53-2": { questionId: "day-53-ex-6" },
  "grammar-w8-53-3": {
    paragraphIndices: [1, 2],
    prompt: "品や時を尋ねられたとき、また聞き取れなかったときの返答例を説明しましょう。",
  },
  "grammar-w8-54-0": {
    paragraphIndices: [0, 1],
    prompt: "週末に友達と映画を見る例文の各部分の意味を説明しましょう。",
  },
  "grammar-w8-54-1": {
    paragraphIndices: [0, 1],
    prompt: "週末の例文を家族と散歩する内容や、家で休む内容に替えましょう。",
  },
  "grammar-w8-54-2": {
    paragraphIndices: [0, 1],
    prompt: "今日は忙しいが明日は大丈夫、または好きなものと理由を短く伝えましょう。",
  },
  "grammar-w8-54-3": {
    paragraphIndices: [0, 1],
    prompt: "予定について答えた後、相手に何を尋ね返せますか。",
  },
  "grammar-w8-55-0": {
    paragraphIndices: [0, 1],
    prompt: "復習する項目を一つ選ぶとき、結果をどう区別し、どこに戻りますか。",
  },
  "grammar-w8-55-1": {
    paragraphIndices: [0, 1],
    prompt: "어디에서 공부해요?に家で勉強すると答え、学校で本を読む文の助詞を確認しましょう。",
  },
  "grammar-w8-55-2": {
    paragraphIndices: [0, 1],
    prompt: "聴解と入力に迷ったら何を見直し、내일 가요の空白をどう確認しますか。",
  },
  "grammar-w8-55-3": {
    paragraphIndices: [0, 1],
    prompt: "作文と発話に迷ったとき、例文を使ってどう練習しますか。",
  },
  "grammar-w8-55-4": {
    paragraphIndices: [0, 1],
    prompt: "復習項目がある場合とない場合、それぞれどう思い出す練習をしますか。",
  },
  "grammar-w8-final-reading": {
    paragraphIndices: [0, 1],
    prompt: "例文の지만による対比と면による条件を説明しましょう。",
  },
  "grammar-w8-final-listening": {
    paragraphIndices: [2],
    prompt: "会話の時と場所を聞くとき、質問と返答をどう結び付けますか。",
  },
  "grammar-w8-final-input": { questionId: "day-56-ex-07" },
};
