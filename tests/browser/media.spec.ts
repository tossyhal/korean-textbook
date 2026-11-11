import { expect, test, type Page } from "@playwright/test";

async function mockRecording(
  page: Page,
  mode: "webm" | "mp4" | "denied" | "unsupported" | "delayed",
) {
  await page.addInitScript((mode) => {
    const state = { stops: 0, release: null as null | (() => void) };
    (window as any).recordingMock = state;
    const stream = { getTracks: () => [{ stop: () => state.stops++ }] };
    if (mode === "unsupported") {
      Object.defineProperty(navigator, "mediaDevices", { value: undefined });
      return;
    }
    Object.defineProperty(navigator, "mediaDevices", {
      value: {
        getUserMedia: () => {
          if (mode === "denied")
            return Promise.reject(new DOMException("denied", "NotAllowedError"));
          if (mode === "delayed")
            return new Promise((resolve) => {
              state.release = () => resolve(stream);
            });
          return Promise.resolve(stream);
        },
      },
    });
    class Recorder {
      static isTypeSupported(type: string) {
        return mode === "mp4" ? type === "audio/mp4" : type === "audio/webm;codecs=opus";
      }
      state = "inactive";
      mimeType: string;
      ondataavailable: ((e: { data: Blob }) => void) | null = null;
      onstop: (() => void) | null = null;
      constructor(_stream: unknown, options: { mimeType: string }) {
        this.mimeType = options.mimeType;
      }
      start() {
        this.state = "recording";
      }
      stop() {
        this.state = "inactive";
        this.ondataavailable?.({ data: new Blob(["mock"], { type: this.mimeType }) });
        this.onstop?.();
      }
    }
    Object.defineProperty(window, "MediaRecorder", { value: Recorder });
  }, mode);
}

for (const mode of ["webm", "mp4"] as const)
  test(`録音許可、${mode}形式、トラック停止`, async ({ page }) => {
    await mockRecording(page, mode);
    await page.goto("#/lesson/day-01");
    await expect(
      page.getByText("手本は端末の韓国語合成音声です。音声内容と発音の品質は未確認です。"),
    ).toBeVisible();
    await page.getByRole("button", { name: "録音開始" }).click();
    await expect(page.getByText("録音中", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "録音停止" }).click();
    await expect(page.getByRole("link", { name: "録音をダウンロード" })).toHaveAttribute(
      "download",
      mode === "mp4" ? "recording.m4a" : "recording.webm",
    );
    expect(await page.evaluate(() => (window as any).recordingMock.stops)).toBeGreaterThan(0);
  });

test("発音ガイドの録音にも手本の音源と確認状態を表示する", async ({ page }) => {
  await page.goto("#/pronunciation");
  await expect(
    page.getByText("手本は端末の韓国語合成音声です。音声内容と発音の品質は未確認です。"),
  ).toBeVisible();
});

for (const mode of ["denied", "unsupported"] as const)
  test(`録音${mode}の案内`, async ({ page }) => {
    await mockRecording(page, mode);
    await page.goto("#/lesson/day-01");
    await page.getByRole("button", { name: "録音開始" }).click();
    await expect(page.getByRole("alert")).toContainText(
      mode === "denied" ? "許可されませんでした" : "対応していません",
    );
  });

test("遅延した録音許可後、離脱済みならトラック停止", async ({ page }) => {
  await mockRecording(page, "delayed");
  await page.goto("#/lesson/day-01");
  await page.getByRole("button", { name: "録音開始" }).click();
  await expect(page.getByText("マイクの許可を待っています。")).toBeVisible();
  await page.goto("#/settings");
  await page.evaluate(() => (window as any).recordingMock.release());
  await expect
    .poll(() => page.evaluate(() => (window as any).recordingMock.stops))
    .toBeGreaterThan(0);
});

test("遅れて届くvoiceschanged、再生エラーと停止・遷移", async ({ page }) => {
  await page.addInitScript(() => {
    const synth = new EventTarget() as EventTarget & {
      getVoices: () => unknown[];
      speak: (u: any) => void;
      cancel: () => void;
      voices: unknown[];
      cancels: number;
    };
    synth.voices = [];
    synth.cancels = 0;
    synth.getVoices = () => synth.voices;
    synth.speak = (u) => queueMicrotask(() => u.onerror?.({ error: "mock-error" }));
    synth.cancel = () => {
      synth.cancels++;
    };
    Object.defineProperty(window, "speechSynthesis", { value: synth });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { value: class {} });
    (window as any).synthMock = synth;
  });
  await page.goto("#/settings");
  await expect(page.getByText(/韓国語の声を取得中/)).toBeVisible();
  await page.evaluate(() => {
    const s = (window as any).synthMock;
    s.voices = [{ name: "Mock Korean", lang: "ko-KR", voiceURI: "mock" }];
    s.dispatchEvent(new Event("voiceschanged"));
  });
  await expect(page.getByRole("option", { name: /Mock Korean/ })).toBeAttached();
  await page.goto("#/lesson/day-01");
  const audio = page.getByRole("button", { name: "音声を再生" }).first();
  await audio.click();
  await expect(
    page.getByText("音声を再生できませんでした。音声診断で韓国語の声を確認してください。").first(),
  ).toBeVisible();
  const stop = audio.locator("..").getByRole("button", { name: "停止" });
  await stop.click();
  await stop.click();
  await page.goto("#/settings");
  expect(await page.evaluate(() => (window as any).synthMock.cancels)).toBeGreaterThan(1);
});
