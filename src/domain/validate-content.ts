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
  const terms = new Map<string, { firstDay: number; definition: string }>();
  for (const l of lessons) {
    add(l.id);
    for (const q of [...l.recall, ...l.exercises, ...l.exitTest]) add(q.id);
  }
  for (const l of lessons) {
    for (const [kind, items] of [
      ["vocab", l.vocabulary],
      ["grammar", l.grammar],
    ] as const) {
      for (const term of items) {
        if (!term.id.startsWith(`${kind}-`)) errors.push(`ID接頭辞が不正: ${term.id}`);
        const definition = JSON.stringify(term);
        const previous = terms.get(term.id);
        if (ids.has(term.id)) errors.push(`ID重複: ${term.id}`);
        if (previous && previous.definition !== definition)
          errors.push(`定義または初出日の不一致: ${term.id}`);
        else terms.set(term.id, { firstDay: term.firstDay, definition });
        if (term.firstDay > l.day) errors.push(`未習事項: ${l.id} ${term.id}`);
      }
    }
  }
  for (const [id, term] of terms) {
    const first = lessons.find((l) => l.day === term.firstDay);
    if (first && ![...first.vocabulary, ...first.grammar].some((item) => item.id === id))
      errors.push(`初出課に定義がありません: ${id}`);
  }
  for (const l of lessons) {
    for (const id of l.prerequisites)
      if (!lessonIds.has(id)) errors.push(`前提課がありません: ${l.id} ${id}`);
    const checkReference = (id: string, context: string) => {
      const term = terms.get(id);
      if (!term && !ids.has(id)) errors.push(`参照先がありません: ${context} ${id}`);
      if (term && term.firstDay > l.day) errors.push(`未習事項の参照: ${context} ${id}`);
    };
    for (const id of l.reviewTargets) checkReference(id, l.id);
    for (const [kind, questions] of [
      ["practice", l.recall],
      ["practice", l.exercises],
      ["exit", l.exitTest],
    ] as const) {
      for (const q of questions) {
        if (!q.skill) errors.push(`技能がありません: ${q.id}`);
        if (
          !q.assessmentKind ||
          (kind === "practice"
            ? q.assessmentKind !== "practice"
            : !["exit", "transfer"].includes(q.assessmentKind))
        )
          errors.push(`評価区分が不正: ${q.id}`);
        if (q.requiresVerifiedAudio && !q.audio) errors.push(`重要音声がありません: ${q.id}`);
        for (const id of q.tags) checkReference(id, q.id);
      }
    }
    const fingerprint = (q: Lesson["exercises"][number]) =>
      JSON.stringify([
        q.prompt.normalize("NFC").trim(),
        [...q.answers].map((a) => a.normalize("NFC").trim()).sort(),
      ]);
    const practice = new Set(l.exercises.map(fingerprint));
    for (const q of l.exitTest)
      if (practice.has(fingerprint(q))) errors.push(`練習と出口テストが同一: ${q.id}`);
    if (!l.exercises.length) errors.push(`演習がありません: ${l.id}`);
    if (!l.exitTest.length) errors.push(`出口テストがありません: ${l.id}`);
    if (!l.examples.length) errors.push(`例文がありません: ${l.id}`);
    if (!l.lessonKind || l.lessonKind === "normal") {
      if (l.examples.length < 6) errors.push(`通常課の例文が不足: ${l.id}`);
      if (l.exercises.length < 12) errors.push(`通常課の演習が不足: ${l.id}`);
      if (l.exitTest.length < 5) errors.push(`通常課の出口テストが不足: ${l.id}`);
    }
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
  const positions = new Map(
    lessons.map((lesson) => [
      lesson.id,
      new Set([
        "objectives",
        "recall",
        ...lesson.sections.map((_, i) => `section-${i}`),
        "examples",
        "dialogue",
        "exercises",
        "production",
        "exit",
        "sources",
      ]),
    ]),
  );
  return { lessons: lessonIds, questions, reviews, positions };
}
