import { expect, test } from "@playwright/test";

test("相手の再生後に返答し、ターン移動で録音を止めて復元する", async ({ page }) => {
  await page.addInitScript(() => {
    let active = false;
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: class {
        onend: (() => void) | null = null;
      },
    });
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        getVoices: () => [{ lang: "ko-KR", voiceURI: "ko", name: "test" }],
        addEventListener() {},
        removeEventListener() {},
        cancel() {},
        speak(utterance: SpeechSynthesisUtterance) {
          utterance.onend?.(new Event("end") as SpeechSynthesisEvent);
        },
      },
    });
    Object.defineProperty(navigator, "mediaDevices", {
      value: {
        getUserMedia: async () => ({
          getTracks: () => [
            {
              stop: () => {
                (window as unknown as { stopped: boolean }).stopped = true;
              },
            },
          ],
        }),
      },
    });
    class MockRecorder {
      static isTypeSupported() {
        return true;
      }
      state = "inactive";
      mimeType = "audio/webm";
      ondataavailable: ((event: { data: Blob }) => void) | null = null;
      onstop: (() => void) | null = null;
      start() {
        this.state = "recording";
        active = true;
      }
      stop() {
        if (active) {
          active = false;
          this.state = "inactive";
          this.onstop?.();
        }
      }
    }
    Object.defineProperty(window, "MediaRecorder", { value: MockRecorder });
  });
  await page.goto("tests/browser/fixtures/roleplay.html");
  await expect(
    page.getByText("手本は端末の韓国語合成音声です。音声内容と発音の品質は未確認です。"),
  ).toBeVisible();
  await expect(page.getByText("行きますか")).toBeHidden();
  await expect(
    page.getByText("端末の韓国語合成音声を使用します。音声の内容は未確認です。").first(),
  ).toBeVisible();
  await expect(page.getByText("相手の音声：確認済み")).toHaveCount(0);
  await page.getByRole("button", { name: "音声を再生" }).first().click();
  await expect(page.getByText("やり取り 1/2")).toBeVisible();
  await expect(
    page.getByText("端末の韓国語合成音声を再生しました。音声の内容は未確認です。"),
  ).toBeVisible();
  await page.getByLabel("返答の下書き").fill("네");
  await page.getByRole("button", { name: "録音開始" }).click();
  await expect(page.getByText("録音中", { exact: true })).toBeVisible();
  await page.getByText("回答例を見る").click();
  await expect(page.getByText("いいえ", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "次のやり取り" }).click();
  await expect(page.getByText("やり取り 2/2")).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { stopped: boolean }).stopped)).toBe(true);
  await page.reload();
  await expect(page.getByText("やり取り 2/2")).toBeVisible();
  await page.getByRole("button", { name: "前のやり取り" }).click();
  await expect(page.getByLabel("返答の下書き")).toHaveValue("네");
});
