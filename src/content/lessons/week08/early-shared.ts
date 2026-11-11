import type { Lesson, Question } from "../../../domain/content";

export function addWriting(lesson: Lesson, prompt: string, model: string, section: number) {
  const question: Question = {
    id: `day-${lesson.day}-ex-self`,
    type: "self",
    prompt,
    answers: [],
    explanation: `例：${model}`,
    tags: [lesson.grammar[section].id],
    skill: "writing",
    assessmentKind: "practice",
    normalization: "standard",
    rubric: ["求められた情報を伝えたか", "時や順序を保ったか", "助詞と分かち書きを見直したか"],
  };
  lesson.exercises.push(question);
}
export function addInput(
  lesson: Lesson,
  prompt: string,
  answers: string[],
  explanation: string,
  section: number,
) {
  lesson.exercises.push({
    id: `day-${lesson.day}-ex-input`,
    type: "input",
    prompt,
    answers,
    explanation,
    tags: [lesson.grammar[section].id],
    skill: "typing",
    assessmentKind: "practice",
    normalization: "standard",
  });
}
