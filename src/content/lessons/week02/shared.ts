import type { Lesson } from "../../../domain/content";
import { audio, base, example, listening, questions, source } from "../week01/shared";
export { audio, base, example, listening, questions, source };

export function setTopics(lesson: Lesson, topics: [string, string, number][]) {
  lesson.grammar = topics.map(([id, name, section]) => ({
    id,
    name,
    firstDay: lesson.day,
    sectionId: `section-${section}`,
  }));
  lesson.reviewTargets = topics.map(([id]) => id);
  for (const q of [...lesson.recall, ...lesson.exercises, ...lesson.exitTest])
    q.tags = [topics[0][0]];
}
export function vocabulary(
  day: number,
  entries: [string, string, string, string][],
): Lesson["vocabulary"] {
  return entries.map(([id, korean, meaning, partOfSpeech]) => ({
    id: `vocab-${id}`,
    korean,
    meaning,
    partOfSpeech,
    dictionaryForm: korean,
    firstDay: day,
  }));
}
