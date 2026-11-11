import { describe, expect, it } from "vitest";
import { diagnosticQuestions } from "./bank";
import { lessons } from "../../content";
import { questionSchema } from "../../domain/content";
import { contentIds } from "../../domain/validate-content";
import { newProgress, progressSchema } from "../../domain/progress";
import { exportBackup, parseBackup } from "../../storage/backup";

describe("先取り診断と復習履歴", () => {
  it("診断問題の形式、IDと参照を検証する", () => {
    expect(diagnosticQuestions).toHaveLength(15);
    const ids = contentIds(lessons);
    for (const q of diagnosticQuestions) {
      expect(questionSchema.safeParse(q).success).toBe(true);
      expect(ids.questions.has(q.id)).toBe(true);
      expect(q.tags.every((id) => ids.reviews.has(id))).toBe(true);
    }
  });
  it("文字と入力の問題は本文へ戻れ、入力問題に完成形を提示しない", () => {
    for (const q of diagnosticQuestions.slice(0, 10)) {
      expect(
        q.tags.some((id) =>
          lessons.some((lesson) => lesson.grammar.some((g) => g.id === id && g.sectionId)),
        ),
      ).toBe(true);
    }
    for (const q of diagnosticQuestions.slice(5, 10)) {
      expect(q.prompt).not.toContain(q.answers[0]);
    }
    expect(diagnosticQuestions[9].answers).toEqual(["나 다"]);
  });
  it("旧データに履歴を補い、診断と閲覧履歴をバックアップで保持する", () => {
    const progress = newProgress();
    const legacy = { ...progress } as Partial<typeof progress>;
    delete legacy.reviewHistory;
    expect(progressSchema.parse(legacy).reviewHistory).toEqual([]);
    progress.drafts[diagnosticQuestions[0].id] = "ㅓ";
    progress.reviewHistory.push({
      day: "2026-11-12",
      id: diagnosticQuestions[0].id,
      outcome: "viewed",
    });
    expect(parseBackup(exportBackup(progress), contentIds(lessons))).toEqual(progress);
  });
});
