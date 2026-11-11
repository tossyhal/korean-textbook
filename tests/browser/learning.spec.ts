import { expect, test } from "@playwright/test";

const key = "korean-textbook-progress-v1";
const lesson = "#/lesson/day-01";
const progress = (page: import("@playwright/test").Page) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), key);

test("回答の保存、再挑戦と答え閲覧後の区別", async ({ page }) => {
  await page.goto(lesson);
  const q = page.locator("#day-01-ex-01");
  await q.getByLabel("回答").fill("ㅓ");
  await q.getByRole("button", { name: "答え合わせ" }).click();
  await expect(q.getByRole("status")).toContainText("初回");
  await page.reload();
  await q.getByLabel("回答").fill("ㅏ");
  await q.getByRole("button", { name: "答え合わせ" }).click();
  await expect(q.getByRole("status")).toContainText("答え閲覧後");
  const attempts = (await progress(page)).attempts.filter(
    (a: { questionId: string }) => a.questionId === "day-01-ex-01",
  );
  expect(attempts.map((a: { result: string; stage: string }) => [a.result, a.stage])).toEqual([
    ["incorrect", "first"],
    ["correct", "after-answer"],
  ]);
  const q2 = page.locator("#day-01-ex-02");
  await q2.getByRole("button", { name: "答えを見る" }).click();
  await page.reload();
  await q2.getByLabel("回答").fill("가");
  await q2.getByRole("button", { name: "答え合わせ" }).click();
  await expect(q2.getByRole("status")).toContainText("答え閲覧後");
});

test("IME変換中は採点せず、確定後の入力・修正・削除を保持する", async ({ page }) => {
  await page.goto(lesson);
  const q = page.locator("#day-01-ex-01");
  const input = q.getByLabel("回答");
  await input.fill("ㅏ");
  await input.dispatchEvent("compositionstart");
  await expect(q.getByRole("button", { name: "答え合わせ" })).toBeDisabled();
  await input.dispatchEvent("keydown", { key: "Enter", isComposing: true });
  await q.getByRole("button", { name: "答え合わせ" }).dispatchEvent("click");
  expect((await progress(page)).attempts).toHaveLength(0);
  await input.dispatchEvent("compositionend");
  await input.fill("가나");
  await input.fill("가");
  await input.fill("");
  await input.fill("ㅏ");
  await q.getByRole("button", { name: "答え合わせ" }).click();
  await expect(q.getByRole("status")).toContainText("正解");
});

test("作文と自己評価を保存する", async ({ page }) => {
  await page.goto(lesson);
  await page.getByLabel("自分の文章").fill("안녕하세요");
  await page.getByText("模範例と自己確認").click();
  const rubric = page.locator("#production details input").first();
  await rubric.check();
  await page.getByLabel("作文を自己評価した").check();
  await page.reload();
  await expect(page.getByLabel("自分の文章")).toHaveValue("안녕하세요");
  await page.getByText("模範例と自己確認").click();
  await expect(rubric).toBeChecked();
  await expect(page.getByLabel("作文を自己評価した")).toBeChecked();
});

test("JSON書き出し、取消、適用と破損拒否", async ({ page }) => {
  await page.goto(lesson);
  await page.getByLabel("自分の文章").fill("저장");
  await page.goto("#/settings");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "バックアップを書き出す" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  await page.goto(lesson);
  await page.getByLabel("自分の文章").fill("変更");
  await page.goto("#/settings");
  const before = await progress(page);
  const file = page.locator("input[type=file]");
  await file.setInputFiles(path!);
  await expect(page.getByText("読み込み内容の確認")).toBeVisible();
  await page.getByRole("button", { name: "取消" }).click();
  expect(await progress(page)).toEqual(before);
  await file.setInputFiles({
    name: "broken.json",
    mimeType: "application/json",
    buffer: Buffer.from("{broken"),
  });
  await expect(page.getByRole("alert")).toContainText("変更していません");
  expect(await progress(page)).toEqual(before);
  await file.setInputFiles(path!);
  await page.getByRole("button", { name: "この内容を適用" }).click();
  await page.goto(lesson);
  await expect(page.getByLabel("自分の文章")).toHaveValue("저장");
});

for (const width of [390, 1280])
  test(`${width}pxで横にはみ出さない`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [lesson, "#/keyboard", "#/settings", "#/review"]) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  });

test("先取り後に復習を日付変更して再開する", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-11-12T12:00:00") });
  await page.goto(lesson);
  await page.locator("#day-01-ex-01 input").fill("ㅓ");
  await page.locator("#day-01-ex-01").getByRole("button", { name: "答え合わせ" }).click();
  await page.goto("#/lesson/day-02");
  await expect(page.getByRole("heading", { name: /第2課/ })).toBeVisible();
  await page.goto("#/review");
  await expect(
    page.getByRole("button", { name: "答えを見る前に思い出せた" }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "答えを見る前に思い出せた" }).first().click();
  const updated = await progress(page);
  expect(updated.reviews.some((r: { due: string }) => r.due > "2026-11-12")).toBeTruthy();
  await page.clock.setFixedTime(new Date("2026-11-20T12:00:00"));
  await page.reload();
  await expect(
    page.getByRole("button", { name: "答えを見る前に思い出せた" }).first(),
  ).toBeVisible();
});

test("出口テストの初回誤答は後の正答で上書きされない", async ({ page }) => {
  await page.goto(lesson);
  const exit = page.locator("#exit");
  const question = exit.locator(".question").first();
  await question.getByLabel("回答").fill("가");
  await question.getByRole("button", { name: "答え合わせ" }).click();
  await expect(exit.getByText(/初回の自力正答：0\/1問/)).toBeVisible();
  await question.getByLabel("回答").fill("바");
  await question.getByRole("button", { name: "答え合わせ" }).click();
  await expect(question.getByRole("status")).toContainText("答え閲覧後");
  await expect(exit.getByText(/初回の自力正答：0\/1問/)).toBeVisible();
  await page.reload();
  await expect(exit.getByText(/初回の自力正答：0\/1問/)).toBeVisible();
});
