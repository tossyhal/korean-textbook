import type { Lesson } from "../domain/content";
import { bindingsEarly } from "./grammar-reference-data/chapter01_03";
import { bindingsMiddle } from "./grammar-reference-data/chapter04_06";
import { bindingsLate } from "./grammar-reference-data/chapter07_08";

type GrammarReference = {
  lesson: Lesson;
  grammar: Lesson["grammar"][number];
  section: Lesson["sections"][number];
  prompt: string;
  answer: string;
  explanation: string;
  example?: Lesson["examples"][number];
};

const bindings = { ...bindingsEarly, ...bindingsMiddle, ...bindingsLate };

export function getGrammarReference(
  lessons: Lesson[],
  grammarId: string,
): GrammarReference | undefined {
  const binding = bindings[grammarId];
  if (!binding) return undefined;
  const grammar = lessons.flatMap((lesson) => lesson.grammar).find((item) => item.id === grammarId);
  if (!grammar) return undefined;
  const lesson = lessons.find((item) => item.day === grammar.firstDay);
  if (!lesson) return undefined;
  const index = Number(grammar.sectionId?.match(/^section-(\d+)$/)?.[1]);
  const section = lesson.sections[index];
  if (!section) return undefined;
  const question = binding.questionId
    ? lesson.exercises.find((item) => item.id === binding.questionId)
    : undefined;
  if (binding.questionId && (!question || !question.answers.length)) return undefined;
  const indices = binding.paragraphIndices;
  if (
    !question &&
    (!indices?.length ||
      indices.some((i) => !Number.isInteger(i) || i < 0 || !section.paragraphs[i]))
  )
    return undefined;
  const example = binding.example
    ? [...lesson.examples, ...lesson.dialogue].find((item) => item.korean === binding.example)
    : undefined;
  if (binding.example && !example) return undefined;
  return {
    lesson,
    grammar,
    section,
    prompt:
      binding.prompt ?? question?.prompt ?? `「${grammar.name}」の意味や使い方を説明しましょう。`,
    answer: question
      ? question.answers.join("／")
      : indices!.map((i) => section.paragraphs[i]).join("\n"),
    explanation: question?.explanation ?? "本文の説明と照らして確認しましょう。",
    example,
  };
}
