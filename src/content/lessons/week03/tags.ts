import type { Lesson } from "../../../domain/content";

export function assignTags(lesson: Lesson, groups: Record<string, string[]>) {
  const assignments = new Map(
    Object.entries(groups).flatMap(([tag, ids]) => ids.map((id) => [id, tag] as const)),
  );
  for (const q of [...lesson.recall, ...lesson.exercises, ...lesson.exitTest]) {
    const tag = assignments.get(q.id);
    if (!tag) throw new Error(`Missing tag for ${q.id}`);
    q.tags = [tag];
  }
}
