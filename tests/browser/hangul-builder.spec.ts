import { expect, test } from "@playwright/test";

test("課の進行に応じて字母を選び、音節を組み立てる", async ({ page }) => {
  await page.goto("#/lesson/day-01");
  const builder = page.locator("#hangul-builder");
  await expect(builder.getByLabel("終声（パッチム）")).toHaveCount(0);
  await expect(builder.locator("select").first().locator("option")).toHaveCount(14);
  await expect(builder.locator("select").nth(1).locator("option")).toHaveCount(10);
  await page.goto("#/lesson/day-02");
  await builder.getByLabel("初声（最初の子音）").selectOption({ label: "ㄲ" });
  await builder.getByLabel("中声（母音）").selectOption({ label: "ㅘ" });
  await expect(builder.getByLabel("組み立てた音節 꽈")).toBeVisible();
  await page.goto("#/lesson/day-03");
  await builder.getByLabel("初声（最初の子音）").selectOption({ label: "ㅎ" });
  await builder.getByLabel("終声（パッチム）").selectOption({ label: "ㄴ" });
  await expect(builder.getByLabel("組み立てた音節 한")).toBeVisible();
  await expect(
    builder.getByLabel("組み立てた音節 한").getByRole("button", { name: "한を聞く" }),
  ).toHaveText("한");
  await expect(builder.getByRole("button")).toHaveCount(1);
  await expect(builder.getByText("合成音声の発音は未確認です。")).toHaveCount(0);
});
