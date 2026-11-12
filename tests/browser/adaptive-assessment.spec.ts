import { expect, test } from "@playwright/test";

test("旧診断URLは目次へ案内する", async ({ page }) => {
  await page.goto("#/diagnostic");
  await expect(page.getByRole("heading", { name: "目次" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "主なメニュー" }).getByText("先取り診断"),
  ).toHaveCount(0);
});

test("復習の閲覧状態と1日20件の上限を再読み込み後も保持する", async ({ page }) => {
  await page.addInitScript(() => {
    const d = new Date();
    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const p = {
      version: 1,
      completedLessons: [],
      positions: {},
      drafts: {},
      attempts: [],
      answerViewedQuestionIds: [],
      reviews: Array.from({ length: 21 }, (_, i) => ({
        id: `diagnostic-${i + 1}`,
        due: day,
        interval: 0,
      })),
      reviewHistory: [],
      notes: {},
      productionChecks: {},
      settings: { mode: 90 },
    };
    if (!localStorage.getItem("korean-textbook-progress-v1"))
      localStorage.setItem("korean-textbook-progress-v1", JSON.stringify(p));
  });
  await page.goto("#/review");
  await page.getByRole("button", { name: "答えを見る" }).first().click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "答えを見る前に思い出せた" }).first(),
  ).toBeDisabled();
  await page.getByRole("button", { name: "答えを見て理解した" }).first().click();
  for (let i = 0; i < 19; i++)
    await page.getByRole("button", { name: "答えを見る前に思い出せた" }).first().click();
  await expect(
    page.getByText("今日の上限に達しました。残りは明日以降に取り組めます。"),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("今日の上限に達しました。残りは明日以降に取り組めます。"),
  ).toBeVisible();
});
