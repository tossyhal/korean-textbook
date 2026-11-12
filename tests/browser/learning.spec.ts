import { expect, test } from "@playwright/test";

const key = "korean-textbook-progress-v1";
const lesson = "#/lesson/day-01";
const progress = (page: import("@playwright/test").Page) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), key);

test("回答の保存、再挑戦と答え閲覧後の区別", async ({ page }) => {
  await page.goto(lesson);
  await page.getByRole("tab", { name: "練習" }).click();
  const q = page.locator("#day-01-ex-01");
  await q.getByLabel("回答").fill("ㅓ");
  await q.getByRole("button", { name: "答え合わせ" }).click();
  await expect(q.getByRole("status")).toContainText("初回");
  await expect(q.getByRole("status")).not.toContainText("答え：");
  await page.reload();
  await q.getByLabel("回答").fill("ㅏ");
  await q.getByRole("button", { name: "答え合わせ" }).click();
  await expect(q.getByRole("status")).toContainText("再挑戦");
  const attempts = (await progress(page)).attempts.filter(
    (a: { questionId: string }) => a.questionId === "day-01-ex-01",
  );
  expect(attempts.map((a: { result: string; stage: string }) => [a.result, a.stage])).toEqual([
    ["incorrect", "first"],
    ["correct", "retry"],
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
  await page.getByRole("tab", { name: "練習" }).click();
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
  await page.getByRole("tab", { name: "実践" }).click();
  await page.getByLabel("入力した文字").fill("안녕하세요");
  const rubric = page.locator("#production input[type=checkbox]").first();
  await rubric.check();
  await page.getByLabel("文字入力を自己評価した").check();
  await page.reload();
  await expect(page.getByLabel("入力した文字")).toHaveValue("안녕하세요");
  await expect(rubric).toBeChecked();
  await expect(page.getByLabel("文字入力を自己評価した")).toBeChecked();
});

test("JSON書き出し、取消、適用と破損拒否", async ({ page }) => {
  await page.goto(lesson);
  await page.getByRole("tab", { name: "実践" }).click();
  await page.getByLabel("入力した文字").fill("저장");
  await page.goto("#/home");
  await page.getByText("データ管理", { exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "バックアップを書き出す" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  await page.goto(lesson);
  await page.getByRole("tab", { name: "実践" }).click();
  await page.getByLabel("入力した文字").fill("変更");
  await page.goto("#/home");
  await page.getByText("データ管理", { exact: true }).click();
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
  await expect(page.getByLabel("入力した文字")).toHaveValue("저장");
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
  await page.getByRole("tab", { name: "練習" }).click();
  await page.locator("#day-01-ex-01 input").fill("ㅓ");
  await page.locator("#day-01-ex-01").getByRole("button", { name: "答え合わせ" }).click();
  await page.goto("#/lesson/day-02");
  await expect(page.getByRole("heading", { name: /第1章第2節/ })).toBeVisible();
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
  await page.getByRole("tab", { name: "確認テスト" }).click();
  const exit = page.locator("#exit");
  const skills = exit.locator(":scope > ul");
  await expect(skills.getByRole("listitem").filter({ hasText: /^入力：/ })).toContainText(
    "実践の自己評価",
  );
  await expect(skills.getByRole("listitem").filter({ hasText: /^聴解：/ })).toHaveCount(0);
  await expect(skills.getByRole("listitem").filter({ hasText: /^作文：/ })).toHaveCount(0);
  const question = exit.locator(".question").first();
  await question.getByLabel("回答").fill("가");
  await question.getByRole("button", { name: "答え合わせ" }).click();
  await expect(exit.getByText(/初回の自力正答：0\/1問/)).toBeVisible();
  await question.getByLabel("回答").fill("바");
  await question.getByRole("button", { name: "答え合わせ" }).click();
  await expect(question.getByRole("status")).toContainText("再挑戦");
  await expect(exit.getByText(/初回の自力正答：0\/1問/)).toBeVisible();
  await page.reload();
  await expect(exit.getByText(/初回の自力正答：0\/1問/)).toBeVisible();
});

test("節のタブを上下キーとHome・Endで操作する", async ({ page }) => {
  await page.goto(lesson);
  await expect(page.getByRole("tablist", { name: "節の内容" })).toHaveAttribute(
    "aria-orientation",
    "vertical",
  );
  const text = page.getByRole("tab", { name: "本文" });
  const practice = page.getByRole("tab", { name: "練習" });
  const last = page.getByRole("tab", { name: "確認テスト" });
  await text.focus();
  await page.keyboard.press("ArrowDown");
  await expect(practice).toBeFocused();
  await expect(practice).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(last).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(text).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(last).toBeFocused();
  await page.keyboard.press("Home");
  await expect(text).toBeFocused();
});

for (const width of [390, 1280]) {
  test(`${width}pxで学習ナビゲーションを閉じて再開できる`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(lesson);
    const close = page.getByRole("button", { name: "学習ナビゲーションを閉じる" });
    await page.evaluate(() => window.scrollTo(0, 1000));
    await expect(close).toBeInViewport();
    const toolbar = page.locator(".reader-toolbar");
    for (const state of ["open", "closed"]) {
      if (state === "closed") await close.click();
      const bounds = await toolbar.evaluate((element) => {
        const bar = element.getBoundingClientRect();
        const main = element.parentElement!.getBoundingClientRect();
        const button = element.querySelector("button")!.getBoundingClientRect();
        return {
          top: bar.top,
          background: getComputedStyle(element).backgroundColor,
          width: bar.width,
          mainWidth: main.width,
          buttonLeft: button.left - bar.left,
          buttonRight: bar.right - button.right,
        };
      });
      expect(bounds.top).toBe(0);
      expect(bounds.background).toBe("rgb(255, 255, 255)");
      expect(bounds.width).toBeCloseTo(bounds.mainWidth - 40, 0);
      expect(bounds.buttonLeft).toBeGreaterThanOrEqual(0);
      expect(bounds.buttonRight).toBeGreaterThanOrEqual(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
    await page.locator("#section-1").evaluate((element) => element.scrollIntoView());
    const headingTop = await page
      .locator("#section-1 h2")
      .evaluate((element) => element.getBoundingClientRect().top);
    const toolbarBottom = await toolbar.evaluate(
      (element) => element.getBoundingClientRect().bottom,
    );
    expect(headingTop).toBeGreaterThanOrEqual(toolbarBottom);
    await page.evaluate(() => window.scrollTo(0, 1000));
    await expect(page.getByRole("button", { name: "学習ナビゲーションを開く" })).toBeInViewport();
    await page.getByRole("button", { name: "学習ナビゲーションを開く" }).click();
    await page.getByRole("tab", { name: "練習" }).click();
    const answer = page.locator("#day-01-ex-01").getByLabel("回答");
    await page.evaluate(() => window.scrollTo(0, 0));
    await answer.focus();
    const answerTop = await answer.evaluate((element) => element.getBoundingClientRect().top);
    expect(answerTop).toBeGreaterThanOrEqual(
      await toolbar.evaluate((element) => element.getBoundingClientRect().bottom),
    );
    await close.click();
    const open = page.getByRole("button", { name: "学習ナビゲーションを開く" });
    await expect(open).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("tablist", { name: "節の内容" })).toBeHidden();
    await page.reload();
    await expect(open).toBeVisible();
    await open.click();
    const practice = page.getByRole("tab", { name: "練習" });
    await expect(practice).toHaveAttribute("aria-selected", "true");
    await practice.focus();
    await page.keyboard.press("Escape");
    await expect(open).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
  });
}

test("回答欄と選択肢のグループ名にそれぞれの設問を含む", async ({ page }) => {
  await page.goto("#/lesson/day-01?exercises");
  const first = page.locator("#day-01-ex-01");
  const second = page.locator("#day-01-ex-02");
  const firstPrompt = await first.locator("strong").first().innerText();
  const secondPrompt = await second.locator("strong").first().innerText();
  await expect(first.getByRole("textbox")).toHaveAccessibleName(`${firstPrompt} 回答`);
  await expect(second.getByRole("textbox")).toHaveAccessibleName(`${secondPrompt} 回答`);
  expect(firstPrompt).not.toBe(secondPrompt);
  await page.getByRole("tab", { name: "確認テスト" }).click();
  const choice = page.locator("#day-01-exit-03");
  await expect(choice.getByRole("group")).toHaveAccessibleName(
    "初声に音がない音節を選ぶ 回答を選ぶ",
  );
  await expect(choice.getByRole("radio", { name: "우" })).toBeVisible();
});
