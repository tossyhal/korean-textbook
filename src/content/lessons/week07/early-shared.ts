import { base, example, listening, questions, setTopics, source } from "../week02/shared";
import type { Lesson } from "../../../domain/content";
export { base, example, listening, questions, setTopics, source };
export function finish(lesson: Lesson, tags: string[]) {
  lesson.exercises.forEach((q, i) => (q.tags = [tags[i % tags.length]]));
  lesson.exitTest.forEach((q, i) => (q.tags = [tags[i % tags.length]]));
  lesson.recall = questions(lesson.day, "recall", [
    ["前に学んだ「学校」は？", "학교", "학교は学校です。", "typing"],
    ["前に学んだ「水」は？", "물", "물は水です。", "typing"],
  ]);
  lesson.recall.forEach((q) => (q.tags = [tags[0]]));
}
export function critical(lesson: Lesson, text: string, options: string[], tag: string) {
  const q = listening(
    lesson.day,
    "exit",
    1,
    text,
    "音を聞いて、聞こえた語を選びます。確認済み音声が用意されるまで未実施です。",
    options[0],
    "表記と発音を本文で確認しましょう。",
  );
  q.options = options;
  q.requiresVerifiedAudio = true;
  q.tags = [tag];
  lesson.exitTest.push(q);
}
export function choices(
  lesson: Lesson,
  group: "ex" | "exit",
  rows: [string, string, string, string, string][],
) {
  const qs = questions(
    lesson.day,
    group,
    rows.map(([p, a, b, c, e]) => [p, a, e, "reading", [a, b, c]]),
  );
  if (group === "ex") lesson.exercises = qs;
  else lesson.exitTest = qs;
}
