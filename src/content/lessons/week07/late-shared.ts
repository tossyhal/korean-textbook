import { base, example, listening, questions, setTopics, source } from "../week02/shared";
import type { Lesson, Question } from "../../../domain/content";
type Pair = [string, string];
type Item = [string, string, string, string[], number];
export function makeLesson(
  day: number,
  title: string,
  sections: Lesson["sections"],
  examples: Pair[],
  dialogue: Pair[],
  exercise: Item[],
  exit: Item[],
): Lesson {
  const l = base(
    day,
    title,
    ["短い発話から必要な情報を取り出す", "聞き直しと短区間の書取で理解を確かめる"],
    sections,
    examples.map((x) => example(...x)),
    dialogue.map((x) => example(...x)),
    [],
    [],
    [
      source(
        "国立国語院 韓国語基礎辞典",
        "https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319",
        "어디が疑問文で未知の場所を尋ねる用法と어디에서の例を確認",
      ),
      source(
        "国立国語院 韓国語基礎辞典 언제",
        "https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng",
        "언제が主に疑問文で未知の時を尋ねる用法を確認",
      ),
    ],
  );
  setTopics(
    l,
    sections.map((s, i) => [`grammar-w7-${day}-${i}`, s.heading, i]),
  );
  const make = (group: "ex" | "exit", items: Item[]) =>
    items.map(([p, a, e, o, s], i) => {
      const q = questions(day, group, [[p, a, e, "reading", o]])[0];
      q.id = `day-${day}-${group}-${i + 1}`;
      q.tags = [l.grammar[s].id];
      return q;
    });
  l.exercises = make("ex", exercise);
  l.exitTest = make("exit", exit);
  return l;
}
export function addListen(
  l: Lesson,
  group: "ex" | "exit",
  rows: [string, string, string, string[], string, number][],
) {
  const target = group === "ex" ? l.exercises : l.exitTest;
  rows.forEach(([text, p, a, o, e, s], i) => {
    const q = listening(l.day, group, i + 1, text, p, a, e);
    q.options = o;
    q.tags = [l.grammar[s].id];
    target.push(q);
  });
}
export function addDictation(
  l: Lesson,
  group: "ex" | "exit",
  text: string,
  answer: string,
  section: number,
) {
  const q: Question = listening(
    l.day,
    group,
    90,
    text,
    "音声の短い部分を韓国語で書き取ってください。正書法と分かち書きを守り、文末の句点はあってもなくても構いません。",
    answer,
    `正書法は「${answer}」です。語の間の空白を確認します。`,
  );
  q.tags = [l.grammar[section].id];
  target(l, group).push(q);
}
function target(l: Lesson, group: "ex" | "exit") {
  return group === "ex" ? l.exercises : l.exitTest;
}

export function setRecall(l: Lesson, rows: [string, string][]) {
  l.recall = questions(
    l.day,
    "recall",
    rows.map(([prompt, explanation]) => [prompt, "", explanation, "speaking"]),
  );
  for (const q of l.recall) {
    q.type = "self";
    q.answers = [];
    q.tags = [l.grammar[0].id];
    q.rubric = ["答えを見る前に思い出せたか", "不確かな点を前の課で確認したか"];
  }
}
