import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("手動登録を保存・バックアップし、解除しても回答履歴を残す", async ({ page }) => {
  await page.goto("#/lesson/day-01?exercises");
  const question = page.locator("#day-01-ex-01");
  await question.getByLabel("回答").fill("ㅏ");
  await question.getByRole("button", { name: "答え合わせ" }).click();
  await expect(question.getByText("正解", { exact: true })).toBeVisible();
  await question.getByRole("button", { name: "復習に追加" }).click();
  await page.goto("#/reference");
  const word = page.locator(".wordbook-entry").first();
  const wordId = await word.getAttribute("id");
  const wordText = await word.locator("[lang=ko]").first().innerText();
  await word.getByRole("button", { name: "復習に追加" }).click();
  await expect(word.getByRole("button", { name: "復習から外す" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.reload();
  await expect(word.getByRole("button", { name: "復習から外す" })).toBeVisible();
  await page.goto("#/review");
  await page
    .locator(".question")
    .filter({ hasText: wordText })
    .getByRole("button", { name: "答えを見る", exact: true })
    .click();
  await page.goto("#/home");
  await page.getByText("データ管理", { exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "バックアップを書き出す" }).click();
  const download = await downloadPromise;
  const data = JSON.parse(await readFile((await download.path())!, "utf8"));
  expect(data.reviews.filter((item: { id: string }) => item.id === wordId)).toHaveLength(1);
  expect(data.reviews.some((item: { id: string }) => item.id === "day-01-ex-01")).toBe(true);
  await page.getByLabel("バックアップを選ぶ").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await page.getByRole("button", { name: "この内容を適用" }).click();
  await page.goto("#/reference");
  await word.getByRole("button", { name: "復習から外す" }).click();
  await expect(word.getByRole("button", { name: "復習に追加" })).toBeVisible();
  await page.reload();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("korean-textbook-progress-v1")!),
  );
  expect(saved.reviews.some((item: { id: string }) => item.id === wordId)).toBe(false);
  expect(
    saved.attempts.some((item: { questionId: string }) => item.questionId === "day-01-ex-01"),
  ).toBe(true);
});

test("旧形式の進捗を復元して復習の上限と間隔を維持する", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-11-12T12:00:00") });
  await page.goto("#/lesson/day-01?exercises");
  const q = page.locator("#day-01-ex-01");
  await q.getByRole("button", { name: "答えを見る" }).click();
  await q.getByRole("button", { name: "復習に追加" }).click();
  await page.evaluate(() => {
    const key = "korean-textbook-progress-v1";
    const saved = JSON.parse(localStorage.getItem(key)!);
    delete saved.voiceTransferRuns;
    delete saved.partiallyFinishedLessons;
    delete saved.lastLessonId;
    saved.reviews[0].due = "2026-11-12";
    saved.reviewHistory = Array.from({ length: 19 }, (_, i) => ({
      day: "2026-11-12",
      id: `old-${i}`,
      outcome: "recalled",
    }));
    localStorage.setItem(key, JSON.stringify(saved));
  });
  await page.reload();
  await page.getByRole("link", { name: "復習", exact: true }).click();
  await expect(page.getByText(/今日あと1件まで/)).toBeVisible();
  await page.getByRole("button", { name: "答えを見る前に思い出せた" }).click();
  await expect(
    page.getByText("今日の上限に達しました。残りは明日以降に取り組めます。"),
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("korean-textbook-progress-v1")!),
  );
  const review = saved.reviews.find((item: { id: string }) => item.id === "day-01-ex-01");
  expect(review.interval).toBeGreaterThan(0);
  expect(review.due > "2026-11-12").toBe(true);
  await page.reload();
  await expect(
    page.getByText("今日の上限に達しました。残りは明日以降に取り組めます。"),
  ).toBeVisible();
});
