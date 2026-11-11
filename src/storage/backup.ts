import { progressSchema, type Progress } from "../domain/progress";

export const STORAGE_KEY = "korean-textbook-progress-v1";
export function exportBackup(progress: Progress): string {
  return JSON.stringify(progressSchema.parse(progress), null, 2);
}
export function parseBackup(
  json: string,
  validIds: {
    lessons: Set<string>;
    questions: Set<string>;
    reviews: Set<string>;
    positions?: Map<string, Set<string>>;
    drafts?: Set<string>;
  },
): Progress {
  const data = progressSchema.parse(JSON.parse(json));
  if (validIds) {
    const bad =
      (data.lastLessonId !== null && !validIds.lessons.has(data.lastLessonId)) ||
      data.completedLessons.some((id) => !validIds.lessons.has(id)) ||
      Object.keys(data.positions).some((id) => !validIds.lessons.has(id)) ||
      Object.entries(data.positions).some(([id, position]) =>
        validIds.positions
          ? !validIds.positions.get(id)?.has(position)
          : !/^(objectives|recall|examples|dialogue|exercises|production|exit|sources)$/.test(
              position,
            ),
      ) ||
      Object.keys(data.drafts).some(
        (id) =>
          !validIds.lessons.has(id) && !validIds.questions.has(id) && !validIds.drafts?.has(id),
      ) ||
      Object.keys(data.productionChecks).some((id) => !validIds.lessons.has(id)) ||
      Object.keys(data.notes).some((id) => !validIds.lessons.has(id)) ||
      data.answerViewedQuestionIds.some((id) => !validIds.questions.has(id)) ||
      data.attempts.some((a) => !validIds.questions.has(a.questionId)) ||
      data.reviews.some((r) => !validIds.reviews.has(r.id)) ||
      data.reviewHistory.some((r) => !validIds.reviews.has(r.id));
    if (bad) throw new Error("バックアップに存在しない教材への参照があります");
  }
  return data;
}
export function loadProgress(storage: Storage): Progress | null {
  const data = storage.getItem(STORAGE_KEY);
  return data === null ? null : progressSchema.parse(JSON.parse(data));
}
export function saveProgress(storage: Storage, progress: Progress): void {
  storage.setItem(STORAGE_KEY, exportBackup(progress));
}

export type StorageResult<T> = { ok: true; value: T } | { ok: false; error: string };
export function tryLoadProgress(storage: Storage): StorageResult<Progress | null> {
  try {
    return { ok: true, value: loadProgress(storage) };
  } catch {
    return { ok: false, error: "保存データを読み込めませんでした。元のデータは変更していません。" };
  }
}
export function trySaveProgress(storage: Storage, progress: Progress): StorageResult<void> {
  try {
    saveProgress(storage, progress);
    return { ok: true, value: undefined };
  } catch {
    return {
      ok: false,
      error: "保存できませんでした。ブラウザの保存容量や設定を確認してください。",
    };
  }
}
