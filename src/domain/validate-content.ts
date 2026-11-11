import { lessonSchema, type Lesson } from "./content";

export function validateContent(input: unknown[], strict = false): string[] {
  const errors: string[] = [];
  const lessons: Lesson[] = [];
  for (const [i, item] of input.entries()) {
    const parsed = lessonSchema.safeParse(item);
    if (!parsed.success)
      errors.push(
        `教材${i + 1}: ${parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ")}`,
      );
    else lessons.push(parsed.data);
  }
  const ids = new Set<string>();
  const add = (id: string) => {
    if (ids.has(id)) errors.push(`ID重複: ${id}`);
    ids.add(id);
  };
  const lessonIds = new Set(lessons.map((l) => l.id));
  const terms = new Map<string, number>();
  for (const l of lessons) {
    add(l.id);
    for (const q of [...l.recall, ...l.exercises, ...l.exitTest]) add(q.id);
    for (const term of [...l.vocabulary, ...l.grammar]) {
      const previous = terms.get(term.id);
      if (previous !== undefined && previous !== term.firstDay)
        errors.push(`初出日の不一致: ${term.id}`);
      terms.set(term.id, term.firstDay);
      if (term.firstDay > l.day) errors.push(`未習事項: ${l.id} ${term.id}`);
    }
  }
  for (const l of lessons) {
    for (const id of l.prerequisites)
      if (!lessonIds.has(id)) errors.push(`前提課がありません: ${l.id} ${id}`);
    for (const id of l.reviewTargets)
      if (!terms.has(id) && !ids.has(id)) errors.push(`復習対象がありません: ${l.id} ${id}`);
    for (const q of [...l.recall, ...l.exercises, ...l.exitTest])
      for (const id of q.tags)
        if (!terms.has(id) && !ids.has(id)) errors.push(`問題タグがありません: ${q.id} ${id}`);
    if (!l.sources.length) errors.push(`出典がありません: ${l.id}`);
  }
  if (strict)
    for (let day = 1; day <= 56; day++)
      if (!lessons.some((l) => l.day === day)) errors.push(`第${day}課がありません`);
  const days = new Set<number>();
  for (const l of lessons) {
    if (days.has(l.day)) errors.push(`課番号重複: ${l.day}`);
    days.add(l.day);
  }
  return errors;
}

export function contentIds(lessons: Lesson[]) {
  const lessonIds = new Set<string>();
  const questions = new Set<string>();
  const reviews = new Set<string>();
  for (const lesson of lessons) {
    lessonIds.add(lesson.id);
    for (const question of [...lesson.recall, ...lesson.exercises, ...lesson.exitTest]) {
      questions.add(question.id);
      reviews.add(question.id);
    }
    for (const item of [...lesson.vocabulary, ...lesson.grammar]) reviews.add(item.id);
  }
  return { lessons: lessonIds, questions, reviews };
}
