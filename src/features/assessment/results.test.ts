import { expect, it } from "vitest";
import { lessons } from "../../content";
import { newProgress } from "../../domain/progress";
import { makeRecommendations, recommendationState } from "./results";

it("未実施、回答不足、8割の境界を区別する", () => {
  expect(recommendationState({ firstAttempted: 0, firstCorrect: 0, total: 0 })).toBe("unattempted");
  expect(recommendationState({ firstAttempted: 2, firstCorrect: 0, total: 5 })).toBe("more");
  expect(recommendationState({ firstAttempted: 5, firstCorrect: 3, total: 5 })).toBe("review");
  expect(recommendationState({ firstAttempted: 5, firstCorrect: 4, total: 5 })).toBe("transfer");
});
it("作文と発話のチェックを別々に集計し、自動得点へ混ぜない", () => {
  const progress = newProgress();
  const lesson = lessons[3];
  progress.productionChecks[lesson.id] = Array(lesson.production.rubric.length)
    .fill(true)
    .concat([true, false]);
  const result = makeRecommendations(lessons, progress);
  expect(result.production).toEqual({ writing: 1, typing: 0, speaking: 0 });
  expect(result.result.firstAttempted).toBe(0);
  expect(result.skills.every((skill) => skill.state === "unattempted")).toBe(true);
});

it("文字入力の旧チェックを作文に含めず発話は集計する", () => {
  const progress = newProgress();
  const lesson = lessons[0];
  progress.productionChecks[lesson.id] = Array(lesson.production.rubric.length)
    .fill(true)
    .concat([true, true]);
  expect(makeRecommendations(lessons, progress, [lesson]).production).toEqual({
    writing: 0,
    typing: 1,
    speaking: 1,
  });
});

it("聴解の第4〜6課を初回回答後、未初回回答の課を優先する", () => {
  const progress = newProgress();
  const firstLessons = lessons.filter((lesson) => lesson.day >= 4 && lesson.day <= 6);
  const answered = firstLessons.flatMap((lesson) =>
    lesson.exitTest.filter((question) => question.skill === "listening"),
  );
  expect(answered).toHaveLength(3);
  progress.attempts = answered.map((question) => ({
    questionId: question.id,
    answer: "",
    result: "correct",
    stage: "first",
    at: "2026-11-12",
  }));
  const listening = makeRecommendations(lessons, progress).skills.find(
    (item) => item.skill === "listening",
  )!;
  expect(listening.state).toBe("more");
  expect(listening.recommended.length).toBeGreaterThan(0);
  expect(listening.recommended.every((lesson) => !firstLessons.includes(lesson))).toBe(true);
});

it("未実施や答えを見た後の回答は初回回答済みとみなさない", () => {
  const progress = newProgress();
  const initial = makeRecommendations(lessons, progress).skills.find(
    (item) => item.skill === "listening",
  )!;
  expect(initial.state).toBe("unattempted");
  expect(initial.recommended.length).toBeGreaterThan(0);
  const question = initial.recommended[0].exitTest.find((q) => q.skill === "listening")!;
  progress.attempts.push({
    questionId: question.id,
    answer: "",
    result: "correct",
    stage: "after-answer",
    at: "2026-11-12",
  });
  const after = makeRecommendations(lessons, progress).skills.find(
    (item) => item.skill === "listening",
  )!;
  expect(after.state).toBe("unattempted");
  expect(after.recommended[0].id).toBe(initial.recommended[0].id);
});

it("初回正答8割未満は誤答課、8割以上は後半の未回答課を優先する", () => {
  const progress = newProgress();
  const questions = lessons.flatMap((lesson) =>
    lesson.exitTest.filter((q) => q.skill === "listening"),
  );
  expect(questions.length).toBeGreaterThan(5);
  progress.attempts = questions.slice(0, 5).map((q, index) => ({
    questionId: q.id,
    answer: "",
    result: index < 3 ? "correct" : "incorrect",
    stage: "first",
    at: "2026-11-12",
  }));
  const review = makeRecommendations(lessons, progress).skills.find(
    (item) => item.skill === "listening",
  )!;
  expect(review.state).toBe("review");
  expect(review.recommended[0].id).toBe(review.missed[0].id);
  progress.attempts[3].result = "correct";
  const transfer = makeRecommendations(lessons, progress).skills.find(
    (item) => item.skill === "listening",
  )!;
  expect(transfer.state).toBe("transfer");
  expect(transfer.recommended[0].day).toBeGreaterThan(review.recommended[0].day);
  expect(
    transfer.recommended[0].exitTest.some(
      (q) => q.skill === "listening" && !progress.attempts.some((a) => a.questionId === q.id),
    ),
  ).toBe(true);
});

it("選択した確認テストだけを評価し、推薦先は全教材から解決する", () => {
  const progress = newProgress();
  const first = lessons.find((lesson) => lesson.day === 7)!;
  const later = lessons.find((lesson) => lesson.day === 14)!;
  const oldQuestion = first.exitTest.find((q) => q.skill === "reading" && q.type !== "self")!;
  const newQuestions = later.exitTest.filter((q) => q.skill === "reading" && q.type !== "self");
  expect(newQuestions.length).toBeGreaterThan(0);
  progress.attempts = [oldQuestion, ...newQuestions].map((question, index) => ({
    questionId: question.id,
    answer: "",
    result: index === 0 ? "incorrect" : "correct",
    stage: "first",
    at: "2026-11-12",
  }));
  const all = makeRecommendations(lessons, progress);
  const selected = makeRecommendations(lessons, progress, [later]);
  expect(all.result.bySkill.reading.firstCorrect).toBe(newQuestions.length);
  expect(all.result.bySkill.reading.firstAttempted).toBe(newQuestions.length + 1);
  expect(selected.result.bySkill.reading.firstAttempted).toBe(newQuestions.length);
  expect(selected.result.bySkill.reading.firstCorrect).toBe(newQuestions.length);
  expect(selected.skills.find((s) => s.skill === "reading")!.missed).toEqual([]);
  expect(
    selected.skills
      .find((s) => s.skill === "reading")!
      .recommended.every((l) => lessons.includes(l)),
  ).toBe(true);
});

it("自己確認と未実施を選択範囲ごとに独立して数える", () => {
  const progress = newProgress();
  const first = lessons.find((lesson) => lesson.day === 7)!;
  const later = lessons.find((lesson) => lesson.day === 14)!;
  progress.productionChecks[first.id] = Array(first.production.rubric.length)
    .fill(false)
    .concat([true, false]);
  const result = makeRecommendations(lessons, progress, [later]);
  expect(result.production).toEqual({ writing: 0, typing: 0, speaking: 0 });
  expect(result.result.firstAttempted).toBe(0);
  expect(result.result.unattempted).toBe(result.result.total);
});
