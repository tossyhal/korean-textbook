import { expect, test } from "@playwright/test";

test("遅延検出、同一URI、再生の成功と停止・エラーを区別する", async ({ page }) => {
  await page.addInitScript(() => {
    type MockState = {
      voices: { lang: string; voiceURI: string; name: string }[];
      change?: () => void;
      current?: SpeechSynthesisUtterance;
    };
    const state: MockState = {
      voices: [
        { lang: "ko-KR", voiceURI: "a", name: "声A" },
        { lang: "ko-KR", voiceURI: "a", name: "重複" },
      ],
    };
    (window as unknown as { mockState: MockState }).mockState = state;
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: class {
        constructor(public text: string) {}
      },
    });
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        getVoices: () => state.voices,
        addEventListener: (_: string, fn: () => void) => {
          state.change = fn;
        },
        removeEventListener() {},
        cancel() {},
        speak: (u: SpeechSynthesisUtterance) => {
          state.current = u;
        },
      },
    });
  });
  await page.goto("tests/browser/fixtures/voice-transfer.html");
  await expect(page.getByText(/この練習は未実施・得点なし/)).toBeVisible();
  await page.evaluate(() => {
    const state = (
      window as unknown as {
        mockState: {
          voices: { lang: string; voiceURI: string; name: string }[];
          change: () => void;
        };
      }
    ).mockState;
    state.voices.push({ lang: "ko-KR", voiceURI: "b", name: "声B" });
    state.change();
  });
  await page.getByLabel("手本の声").selectOption("a");
  await page.getByLabel("別の合成音声").selectOption("a");
  await expect(page.getByText(/同じ声は別の合成音声/)).toBeVisible();
  await expect(page.getByRole("button", { name: "手本を聞く" })).toBeDisabled();
  await page.getByLabel("別の合成音声").selectOption("b");
  await expect(page.getByText("ありがとうございます")).toBeHidden();
  const fire = async (kind: "end" | "error") =>
    page.evaluate((event) => {
      const u = (window as unknown as { mockState: { current: SpeechSynthesisUtterance } })
        .mockState.current;
      if (event === "end") u.onend?.({} as SpeechSynthesisEvent);
      else u.onerror?.({} as SpeechSynthesisErrorEvent);
    }, kind);
  await page.getByRole("button", { name: "手本を聞く" }).click();
  await fire("end");
  await page.getByRole("button", { name: "別の声で同じ文を聞く" }).click();
  await page.getByRole("button", { name: "停止", exact: true }).click();
  await fire("end");
  await expect(page.getByText(/今回の別の合成音声の練習は未実施/)).toBeVisible();
  await page.getByRole("button", { name: "別の声で同じ文を聞く" }).click();
  await fire("error");
  await expect(page.getByText(/再生できませんでした/)).toBeVisible();
  await page.getByRole("button", { name: "別の声で同じ文を聞く" }).click();
  await fire("end");
  await page.getByRole("button", { name: "別の声で別の文を聞く" }).click();
  await fire("end");
  await expect(page.getByText(/3つの再生が終了/)).toBeVisible();
  await page.getByRole("button", { name: "原文と訳を見て照合" }).click();
  await expect(page.getByText("ありがとうございます")).toBeVisible();
  await page.getByRole("button", { name: "照合と復唱を自己確認した" }).click();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("voice-transfer-test")!)),
  ).toMatchObject({ modelURI: "a", alternateURI: "b", selfChecked: true });
});
