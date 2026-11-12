import { base, example, listening, questions, setTopics, source } from "../week02/shared";
import type { Lesson } from "../../../domain/content";

type Item = [string, string, string, string?, string[]?];
type Pair = [string, string];
type Turn = [string, string, string, Pair, Pair];
export function makeLesson(
  day: number,
  title: string,
  sections: Lesson["sections"],
  examples: Pair[],
  dialogue: Pair[],
  exercises: Item[],
  exit: Item[],
  turns: Turn[],
  model: string,
  topic: string,
  url: string,
  checked: string,
): Lesson {
  const l = base(
    day,
    title,
    [`${title}の状況を理解する`, `${title}について丁寧に伝える`],
    sections,
    examples.map(([k, j]) => example(k, j)),
    dialogue.map(([k, j]) => example(k, j)),
    exercises,
    exit,
    [source("国立国語院 韓国語基礎辞典", url, checked)],
  );
  setTopics(l, [[`grammar-situation-${day}`, title, 0]]);
  l.recall = questions(day, "recall", [
    [
      "前の課で、相手に丁寧に頼むときに使う表現を思い出しましょう。",
      "주세요",
      "주세요は丁寧な依頼です。",
      "typing",
    ],
    [
      "前の課で、場所を尋ねる表現を選びましょう。",
      "어디에 있어요?",
      "어디に場所を尋ねます。",
      "reading",
      ["어디에 있어요?", "언제 가요?", "무엇을 먹어요?"],
    ],
  ]);
  l.recall.forEach((q) => (q.tags = [`grammar-situation-${day}`]));
  l.roleplay = {
    scenario: title,
    turns: turns.map(([k, j, goal, a, b]) => ({
      partner: example(k, j),
      goal,
      responseExamples: [
        example(a[0], a[1], `${a[1]}と答える場合`),
        example(b[0], b[1], `${b[1]}と答える場合`),
      ],
      rubric: [`${goal}ことができたか`, "相手に丁寧な語尾を使ったか"],
    })),
  };
  l.production = {
    prompt: `${title}の場面を想像し、状況と依頼または返答を4文以上書き、声に出しましょう。`,
    model,
    rubric: [
      "状況と必要な情報を伝えたか",
      "相手に合う丁寧な語尾を使ったか",
      "4文以上で分かち書きを確認したか",
      "書いた内容を声に出して伝えたか",
    ],
  };
  return l;
}
export function addListening(
  l: Lesson,
  group: "ex" | "exit",
  text: string,
  prompt: string,
  answer: string,
  options: string[],
  explanation: string,
) {
  const q = listening(l.day, group, 1, text, prompt, answer, explanation);
  q.options = options;
  q.tags = [`grammar-situation-${l.day}`];
  (group === "ex" ? l.exercises : l.exitTest).push(q);
}
