import { expect, test } from "@playwright/test";

test("変換確定後のinputを保存し、再読み込み後に採点できる", async ({ page }) => {
  await page.goto("#/lesson/day-01");
  const question = page.locator("#day-01-ex-01");
  const input = question.getByLabel("回答");
  await input.focus();
  await input.evaluate((element: HTMLInputElement) => {
    element.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    setValue.call(element, "ㅏ");
    element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        data: "ㅏ",
        inputType: "insertCompositionText",
        isComposing: true,
      }),
    );
    element.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true, data: "ㅏ" }));
    element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        data: "ㅏ",
        inputType: "insertText",
        isComposing: false,
      }),
    );
  });
  await expect(input).toHaveValue("ㅏ");
  await page.reload();
  await expect(input).toHaveValue("ㅏ");
  await question.getByRole("button", { name: "答え合わせ" }).click();
  await expect(question.getByRole("status")).toContainText("正解");
});
