import { expect, test } from "@playwright/test";
import { lessons } from "../../src/content";
import { newProgress } from "../../src/domain/progress";

const key = "korean-textbook-progress-v1";

for (const day of [43, 44, 47]) {
  test(`第${day}節は利用できない活動を未実施のまま終了できる`, async ({ page }) => {
    const lesson = lessons.find((item) => item.day === day)!;
    const progress = newProgress();
    progress.drafts[lesson.id] = "練習";
    progress.productionChecks[lesson.id] = Array(lesson.production.rubric.length + 2).fill(true);
    progress.attempts = lesson.exitTest
      .filter((q) => !q.requiresVerifiedAudio)
      .map((q) => ({
        questionId: q.id,
        answer: "回答",
        result: "self" as const,
        stage: "first" as const,
        at: "now",
      }));
    await page.addInitScript(
      ({ key, progress }) => {
        if (!sessionStorage.getItem("seeded")) {
          localStorage.setItem(key, JSON.stringify(progress));
          sessionStorage.setItem("seeded", "yes");
        }
      },
      { key, progress },
    );
    await page.goto(`#/lesson/${lesson.id}?exit`);
    if (day === 47)
      await expect(
        page.getByText("別の合成音声での練習は未実施です。", { exact: true }),
      ).toBeVisible();
    else await expect(page.locator("#exit")).toContainText(/未実施の確認テスト：[1-9]/);
    await page.getByRole("button", { name: "未実施を残して学習を終えて次へ" }).click();
    const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
    expect(saved.partiallyFinishedLessons).toContain(lesson.id);
    expect(saved.completedLessons).not.toContain(lesson.id);
    expect(saved.attempts).toEqual(progress.attempts);
    expect(saved.voiceTransferRuns).toEqual({});
    await page.goto("#/lessons");
    await page.reload();
    await expect(page.getByRole("link", { name: new RegExp(lesson.title) })).toContainText(
      "未実施を残して終了",
    );
  });
}

test("自己確認を残したまま終了でき、完了時には復習が登録される", async ({ page }) => {
  const lesson = lessons[0];
  const progress = newProgress();
  progress.drafts[lesson.id] = "가";
  progress.attempts = lesson.exitTest.map((q) => ({
    questionId: q.id,
    answer: "回答",
    result: "correct" as const,
    stage: "first" as const,
    at: "now",
  }));
  await page.addInitScript(
    ({ key, progress }) => {
      if (!sessionStorage.getItem("seeded")) {
        localStorage.setItem(key, JSON.stringify(progress));
        sessionStorage.setItem("seeded", "yes");
      }
    },
    { key, progress },
  );
  await page.goto(`#/lesson/${lesson.id}?exit`);
  await expect(page.getByText(/未確認の実践項目/)).toBeVisible();
  await page.getByRole("button", { name: "未実施を残して学習を終えて次へ" }).click();
  let saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  expect(saved.productionChecks[lesson.id]).toBeUndefined();
  expect(saved.reviews).toEqual([]);
  await page.goto(`#/lesson/${lesson.id}?production`);
  for (const checkbox of await page.locator("#production input[type=checkbox]").all())
    await checkbox.check();
  await page.getByRole("tab", { name: "確認テスト" }).click();
  await page.getByRole("button", { name: "完了して次へ" }).click();
  saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  expect(saved.completedLessons).toContain(lesson.id);
  expect(saved.partiallyFinishedLessons).not.toContain(lesson.id);
  expect(saved.reviews.map((review: { id: string }) => review.id)).toEqual(lesson.reviewTargets);
});
