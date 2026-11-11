import { base, example, listening, questions, setTopics, source } from "../week02/shared";
import type { Lesson } from "../../../domain/content";
type Pair = [string, string];
type Item = [string, string, string, string, string[]?, number?];
type Turn = [string, string, string, Pair, Pair];
export function lesson(
  day: number,
  title: string,
  sections: Lesson["sections"],
  examples: Pair[],
  dialogue: Pair[],
  exercises: Item[],
  exit: Item[],
  turns: Turn[],
  model: string,
  url: string,
  checked: string,
): Lesson {
  const l = base(
    day,
    title,
    [`${title}を理解する`, `${title}を自分の言葉で伝える`],
    sections,
    examples.map((x) => example(...x)),
    dialogue.map((x) => example(...x)),
    [],
    [],
    [source("国立国語院 韓国語基礎辞典", url, checked)],
  );
  setTopics(
    l,
    sections.map((s, i) => [`grammar-w6-${day}-${i}`, s.heading, i]),
  );
  const make = (group: "ex" | "exit", items: Item[]) =>
    items.map(([prompt, answer, explanation, kind, options, section = 0], i) => {
      const q = questions(day, group, [[prompt, answer, explanation, kind, options]])[0];
      q.id = `day-${day}-${group}-${i + 1}`;
      q.tags = [l.grammar[section].id];
      return q;
    });
  l.exercises = make("ex", exercises);
  l.exitTest = make("exit", exit);
  const recalls: Record<number, [string, string][]> = {
    39: [
      ["友達の性格を一つ説明しましょう。", "前の課で人物の特徴を表す語を確認します。"],
      ["家族や友達について丁寧に一文話しましょう。", "人物を紹介する表現を振り返ります。"],
    ],
    40: [
      [
        "二つの好みを比べるとき、比較の基準に付く形を思い出しましょう。",
        "보다を比較の基準に付けます。",
      ],
      ["一番好きなものを伝える表現を一つ話しましょう。", "제일を使えます。"],
    ],
    41: [
      ["昨日したことを過去形で一つ話しましょう。", "過去の丁寧形を振り返ります。"],
      ["先にしたこととその次を順に話しましょう。", "먼저と그다음에を使えます。"],
    ],
  };
  l.recall = questions(
    day,
    "recall",
    (recalls[day] ?? []).map(([p, e]) => [p, "", e, "speaking"]),
  );
  for (const q of l.recall) {
    q.type = "self";
    q.answers = [];
    q.rubric = ["答えを見ずに表現を思い出せたか", "不確かな場合は前の課を確認したか"];
    q.tags = [
      day === 39 ? "grammar-person-character" : day === 40 ? "grammar-w6-39-1" : "grammar-w6-40-0",
    ];
  }
  l.roleplay = {
    scenario: title,
    turns: turns.map(([k, j, goal, a, b]) => ({
      partner: example(k, j),
      goal,
      responseExamples: [example(...a), example(...b)],
      rubric: [`${goal}ことができたか`],
    })),
  };
  l.production = {
    prompt: `作文：${title}について${day === 39 ? "対象・比較・理由" : day === 40 ? "出来事・順序・過去・感想" : "希望・時または場所を含む計画・理由"}を含め4文以上書く。発話：別の例で同じ内容を含め4文以上話す。`,
    model: `作文：${model} 発話：${day === 39 ? "저는 차를 좋아해요. 커피보다 차가 더 좋아요. 이 차는 맛있어요. 향기가 좋아서 좋아요." : day === 40 ? "지난주에 공원에 갔어요. 먼저 친구를 만났어요. 그다음에 차를 마셨어요. 정말 좋았어요." : "주말에 공원에 가고 싶어요. 친구와 같이 갈 거예요. 토요일에 만날 거예요. 조용해서 가고 싶어요."}`,
    rubric: [
      `作文：${day === 39 ? "対象と比較" : day === 40 ? "出来事と順序" : "希望と時または場所を含む計画"}を伝えたか`,
      `作文：${day === 40 ? "過去の形と感想" : "理由"}を伝えたか`,
      "作文：4文以上で分かち書きを確認したか",
      `発話：別の例で${day === 39 ? "対象と比較" : day === 40 ? "出来事と順序" : "希望と時または場所を含む計画"}を伝えたか`,
      `発話：${day === 40 ? "過去の形と感想" : "理由"}を伝えたか`,
      "発話：語尾まで話せたか",
    ],
  };
  return l;
}
export function listen(
  l: Lesson,
  group: "ex" | "exit",
  text: string,
  prompt: string,
  answer: string,
  options: string[],
  explanation: string,
  section: number,
) {
  const q = listening(l.day, group, 1, text, prompt, answer, explanation);
  q.options = options;
  q.tags = [l.grammar[section].id];
  (group === "ex" ? l.exercises : l.exitTest).push(q);
}
