import type { Lesson, Question } from "../../../domain/content";
import { base, example, source } from "../week02/shared";

export { example };
export function makeLesson(
  day: number,
  title: string,
  objectives: string[],
  sections: Lesson["sections"],
  examples: [string, string][],
  dialogue: [string, string][],
): Lesson {
  const lesson = base(
    day,
    title,
    objectives,
    sections,
    examples.map((x) => example(...x)),
    dialogue.map((x) => example(...x)),
    [],
    [],
    [
      source(
        "国立国語院 韓国語基礎辞典 언제",
        "https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=17860&nation=eng",
        "언제が主に疑問文で未知の時を尋ねる用法を確認",
      ),
      source(
        "国立国語院 韓国語基礎辞典 어디",
        "https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=60319",
        "어디が未知の場所を尋ね、어디에서の用例があることを確認",
      ),
    ],
  );
  lesson.grammar = sections.map((s, i) => ({
    id: `grammar-w8-${day}-${i}`,
    name: s.heading,
    firstDay: day,
    sectionId: `section-${i}`,
  }));
  lesson.reviewTargets = lesson.grammar.map((g) => g.id);
  return lesson;
}
export function self(
  lesson: Lesson,
  group: "recall" | "ex" | "exit",
  n: number,
  prompt: string,
  explanation: string,
  section: number,
  skill: "writing" | "speaking" = "speaking",
  rubric: string[] = [],
): Question {
  return {
    id: `day-${lesson.day}-${group}-${n}`,
    type: "self",
    prompt,
    answers: [],
    explanation,
    tags: [lesson.grammar[section].id],
    skill,
    assessmentKind: group === "exit" ? "exit" : "practice",
    rubric,
  };
}
export function choice(
  lesson: Lesson,
  group: "ex" | "exit",
  n: number,
  prompt: string,
  answer: string,
  options: string[],
  explanation: string,
  section: number,
): Question {
  return {
    id: `day-${lesson.day}-${group}-${n}`,
    type: "choice",
    prompt,
    answers: [answer],
    options,
    explanation,
    tags: [lesson.grammar[section].id],
    skill: "reading",
    assessmentKind: group === "exit" ? "exit" : "practice",
  };
}
