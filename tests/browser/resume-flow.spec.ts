import { expect, test } from "@playwright/test";

const key = "korean-textbook-progress-v1";

test("先取りした最後の課と下書きを再読込やバックアップ後も再開する", async ({ page }) => {
  await page.goto("#/lesson/day-01");
  await page.getByLabel("自分の文章").fill("첫 번째");
  await page.goto("#/lesson/day-10");
  await page.getByLabel("自分の文章").fill("열 번째");
  const beforeBackup = await page.evaluate(
    (storageKey) => JSON.parse(localStorage.getItem(storageKey)!),
    key,
  );
  await page.goto("#/diagnostic");
  await page.goto("#/home");
  await expect(page.getByRole("link", { name: /続きから学ぶ：第10課/ })).toBeVisible();
  await page.reload();
  await page.getByRole("link", { name: /続きから学ぶ：第10課/ }).click();
  await expect(page.getByLabel("自分の文章")).toHaveValue("열 번째");
  await page.goto("#/settings");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "バックアップを書き出す" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  await page.goto("#/lesson/day-01");
  await expect(page.getByLabel("自分の文章")).toHaveValue("첫 번째");
  await page.goto("#/settings");
  await page.locator("input[type=file]").setInputFiles(path!);
  await page.getByRole("button", { name: "この内容を適用" }).click();
  const restored = await page.evaluate(
    (storageKey) => JSON.parse(localStorage.getItem(storageKey)!),
    key,
  );
  expect(restored.positions["day-10"]).toBe(beforeBackup.positions["day-10"]);
  expect(restored.drafts["day-10"]).toBe("열 번째");
  await page.goto("#/home");
  await page.getByRole("link", { name: /続きから学ぶ：第10課/ }).click();
  await expect(page.getByLabel("自分の文章")).toHaveValue("열 번째");
  await page.goto("#/home");
  await page.evaluate((storageKey) => {
    const progress = JSON.parse(localStorage.getItem(storageKey)!);
    progress.completedLessons.push("day-10");
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, key);
  await page.reload();
  await expect(page.getByRole("link", { name: /続きから学ぶ：第11課/ })).toBeVisible();
});
