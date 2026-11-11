import type { Lesson } from "../../../domain/content";
import { base, example, listening, questions, source, vocabulary } from "../week02/shared";

type Item = [string, string, string, string?, string[]?];
type Pair = [string, string];
type Turn = [Pair, string, [string, string, string], [string, string, string], string[]];
type Data = {
  day: number;
  title: string;
  objectives: string[];
  sections: Lesson["sections"];
  examples: Pair[];
  dialogue: Pair[];
  recall: Item[];
  exercises: Item[];
  exit: Item[];
  listen: [string, string, string, string, string[]];
  exitListen: [string, string, string, string, string[]];
  vocab: [string, string, string, string][];
  production: Lesson["production"];
  scenario: string;
  turns: Turn[];
  source: [string, string, string];
};
export function makeLesson(d: Data): Lesson {
  const lesson = base(
    d.day,
    d.title,
    d.objectives,
    d.sections,
    d.examples.map(([k, j]) => example(k, j)),
    d.dialogue.map(([k, j]) => example(k, j)),
    d.exercises,
    d.exit,
    [source(...d.source)],
    vocabulary(d.day, d.vocab),
  );
  lesson.recall = questions(d.day, "recall", d.recall);
  const addListen = (group: "ex" | "exit", data: Data["listen"]) => ({
    ...listening(d.day, group, 1, data[0], data[1], data[2], data[3]),
    options: data[4],
  });
  lesson.exercises.push(addListen("ex", d.listen));
  lesson.exitTest.push(addListen("exit", d.exitListen));
  const labels =
    d.day === 29
      ? ["料理と注文", "数量と追加", "味と希望", "会計"]
      : d.day === 30
        ? ["品と色", "サイズと試着", "値段と支払い", "選択と袋"]
        : ["行き先と乗り場", "路線と乗り換え", "切符と時刻", "乗り降り"];
  const exerciseTopics =
    d.day === 29
      ? [0, 1, 1, 2, 2, 1, 3, 3, 1, 1, 1, 0, 1]
      : d.day === 30
        ? [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 3, 2, 2]
        : [0, 0, 1, 1, 2, 2, 2, 1, 3, 2, 0, 2, 2];
  const exitTopics =
    d.day === 29
      ? [1, 2, 1, 1, 2, 2, 1]
      : d.day === 30
        ? [2, 1, 1, 2, 2, 2, 1]
        : [1, 2, 2, 0, 3, 2, 1];
  lesson.grammar = labels.map((name, i) => ({
    id: `grammar-day-${d.day}-${i}`,
    name,
    firstDay: d.day,
    sectionId: `section-${i}`,
  }));
  lesson.reviewTargets = lesson.grammar.map((g) => g.id);
  const recallTopics =
    d.day === 29
      ? ["grammar-request", "grammar-count-price"]
      : d.day === 30
        ? ["grammar-existence", "grammar-count-price"]
        : ["grammar-location", "grammar-time-date"];
  lesson.recall.forEach((q, i) => {
    q.tags = [recallTopics[i]];
  });
  lesson.exercises.forEach((q, i) => {
    q.tags = [lesson.grammar[exerciseTopics[i]].id];
  });
  lesson.exitTest.forEach((q, i) => {
    q.tags = [lesson.grammar[exitTopics[i]].id];
  });
  lesson.production = d.production;
  lesson.roleplay = {
    scenario: d.scenario,
    turns: d.turns.map(([partner, goal, a, b, rubric]) => ({
      partner: example(...partner),
      goal,
      responseExamples: [example(...a), example(...b)],
      rubric,
    })),
  };
  return lesson;
}
