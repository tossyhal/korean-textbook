import { expect, test } from "@playwright/test";

test("単語帳を検索・品詞で絞り、意味を隠して復習に登録する", async ({ page }) => {
  await page.goto("#/reference");
  await page.getByLabel("検索").fill("가깝다");
  const entry = page.locator(".wordbook-entry").filter({ hasText: "가깝다" });
  await expect(entry).toContainText("近い");
  await page.getByLabel("品詞").selectOption({ label: "形容詞" });
  await expect(entry).toBeVisible();
  await page.getByLabel("意味を隠す").check();
  await expect(entry).not.toContainText("近い");
  await entry.getByRole("button", { name: "復習に追加" }).click();
  await expect(entry.getByRole("button", { name: "復習から外す" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.reload();
  await page.getByRole("link", { name: "復習", exact: true }).click();
  await expect(page.getByRole("heading", { name: "復習", exact: true })).toBeVisible();
  await expect(page.locator(".question").filter({ hasText: "가깝다" })).toBeVisible();
});

test("単語帳をページ移動し、全件から検索できる", async ({ page }) => {
  await page.goto("#/reference");
  await expect(page.locator(".wordbook-entry")).toHaveCount(40);
  await expect(page.getByText(/1〜40語を表示/)).toBeVisible();
  await page.getByRole("button", { name: "次へ" }).click();
  await expect(page.getByText(/41〜80語を表示/)).toBeVisible();
  await page.getByLabel("検索").fill("가깝다");
  await expect(page.locator(".wordbook-entry").filter({ hasText: "가깝다" })).toBeVisible();
  await expect(page.getByText(/1〜1語を表示/)).toBeVisible();
  await page.getByLabel("検索").fill("存在しない単語xyz");
  await expect(page.getByText("該当する単語はありません。")).toBeVisible();
});

test("文法を切り替えて本文の説明で検索する", async ({ page }) => {
  await page.goto("#/reference");
  await page.getByRole("button", { name: "文法", exact: true }).click();
  const first = page.locator(".grammar-entry").first();
  await first.locator("summary").click();
  const description = await first.locator("details p").first().textContent();
  expect(description).toBeTruthy();
  await expect(first.getByRole("link", { name: /本文を読む/ })).toBeVisible();
  await page.getByLabel("検索").fill(description!.slice(0, 10));
  await expect(page.locator(".grammar-entry").first()).toBeVisible();
  await expect(page.getByText(/教科書順/)).toBeVisible();
});

test("文法に同じ節の例文と意味を表示し、音声を再生できない場合も伝える", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: class {
        constructor(public text: string) {}
      },
    });
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        getVoices: () => [{ lang: "ko-KR", voiceURI: "ko", name: "test" }],
        addEventListener() {},
        removeEventListener() {},
        cancel() {},
        speak(utterance: SpeechSynthesisUtterance) {
          (window as unknown as { spoken: string }).spoken = utterance.text;
          utterance.onerror?.(new Event("error") as SpeechSynthesisErrorEvent);
        },
      },
    });
  });
  const example = { korean: "책을 읽을 수 있어요.", japanese: "本を読めます。" };
  await page.goto("#/reference");
  await page.getByRole("button", { name: "文法", exact: true }).click();
  await page.getByLabel("検索").fill("可能");
  const entry = page.locator(".grammar-entry").filter({ hasText: "可能" }).first();
  await entry.locator("summary").click();
  await expect(entry).toContainText(`同じ節の例文：${example.korean}：${example.japanese}`);
  await entry.getByRole("button", { name: `${example.korean}を聞く` }).click();
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { spoken: string }).spoken))
    .toBe(example.korean);
  await expect(page.getByRole("status")).toHaveText(
    "音声を再生できません。音声設定を確認してください。",
  );
});

test("ページ移動後は表示範囲と先頭の単語に戻る", async ({ page }) => {
  await page.goto("#/reference");
  await page.getByLabel("品詞").selectOption({ label: "名詞" });
  await page.getByLabel("意味を隠す").check();
  const firstWord = await page.locator(".wordbook-entry").first().getAttribute("id");
  await page.getByRole("button", { name: "次へ" }).click();
  await expect(page.getByText(/41〜80語を表示/)).toBeFocused();
  await expect(page.locator(".wordbook-entry").first()).toBeInViewport();
  await expect(page.getByLabel("品詞")).toHaveValue("名詞");
  await expect(page.getByLabel("意味を隠す")).toBeChecked();
  await page.getByRole("button", { name: "前へ" }).click();
  await expect(page.getByText(/1〜40語を表示/)).toBeFocused();
  await expect(page.locator(".wordbook-entry").first()).toHaveAttribute("id", firstWord!);
  await expect(page.locator(".wordbook-entry").first()).toBeInViewport();
});
