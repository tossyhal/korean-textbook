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
    await page.goto("#/lesson/day-01?production");
    await expect(page.getByText(/音声内容と発音の品質は未確認/)).toHaveCount(0);
    await expect(page.getByText(/録音はこの画面のメモリに保持され/)).toBeVisible();
    await page.getByRole("button", { name: "録音開始" }).click();
    await expect(page.getByText("録音中", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "録音停止" }).click();
    await expect(page.getByRole("link", { name: "録音をダウンロード" })).toHaveAttribute(
      "download",
      mode === "mp4" ? "recording.m4a" : "recording.webm",
    );
    expect(await page.evaluate(() => (window as any).recordingMock.stops)).toBeGreaterThan(0);
  });

test("発音ガイドの録音にプライバシー説明を表示する", async ({ page }) => {
  await page.goto("#/pronunciation");
  await expect(page.getByText(/音声内容と発音の品質は未確認/)).toHaveCount(0);
  await expect(page.getByText(/録音はこの画面のメモリに保持され/)).toBeVisible();
});

test("録音後に手本と録音を順に再生できる", async ({ page }) => {
  await mockRecording(page, "webm");
  await page.addInitScript(() => {
    (window as any).played = [];
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
        speak: (utterance: SpeechSynthesisUtterance) => {
          (window as any).played.push("model");
          queueMicrotask(() => utterance.onend?.({} as SpeechSynthesisEvent));
        },
      },
    });
    HTMLMediaElement.prototype.play = async function () {
      (window as any).played.push("recording");
    };
  });
  await page.goto("#/lesson/day-01?production");
  await page.getByRole("button", { name: "録音開始" }).click();
  await page.getByRole("button", { name: "録音停止" }).click();
  await page.getByRole("button", { name: "手本と録音を順に再生" }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).played))
    .toEqual(["model", "recording"]);
});

test("組み立てた音節を押して読み上げる", async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).spoken = [];
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
        speak: (utterance: SpeechSynthesisUtterance) => (window as any).spoken.push(utterance.text),
      },
    });
  });
  await page.goto("#/lesson/day-03");
  const builder = page.locator("#hangul-builder");
  await builder.getByLabel("初声（最初の子音）").selectOption({ label: "ㅎ" });
  await builder.getByLabel("終声（パッチム）").selectOption({ label: "ㄴ" });
  await builder.getByRole("button", { name: "한を聞く" }).click();
  await expect.poll(() => page.evaluate(() => (window as any).spoken)).toEqual(["한"]);
  await expect(builder.getByRole("button", { name: "音声を再生" })).toHaveCount(0);
});

test("発音ページで音声の検出と声の選択を確認できる", async ({ page }) => {
  await page.addInitScript(() => {
    const synth = new EventTarget() as EventTarget & {
      voices: unknown[];
      cancels: number;
      spoken: string[];
      getVoices: () => unknown[];
      speak: (utterance: any) => void;
      cancel: () => void;
    };
    synth.voices = [];
    synth.cancels = 0;
    synth.spoken = [];
    synth.getVoices = () => synth.voices;
    synth.speak = (utterance) => synth.spoken.push(utterance.voice?.voiceURI);
    synth.cancel = () => synth.cancels++;
    Object.defineProperty(window, "speechSynthesis", { value: synth });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { value: class {} });
    (window as any).synthMock = synth;
  });
  await page.goto("#/pronunciation");
  await expect(page.getByRole("link", { name: "設定", exact: true })).toHaveCount(0);
  await expect(
    page.getByText("韓国語の声を取得中、または利用できません。", { exact: false }),
  ).toHaveCount(0);
  await page.getByText("音声が出ないとき").click();
  await expect(
    page.getByText("韓国語の声を取得中、または利用できません。", { exact: false }),
  ).toBeVisible();
  await page.evaluate(() => {
    const synth = (window as any).synthMock;
    synth.voices = [
      { name: "Voice A", lang: "ko-KR", voiceURI: "a", localService: true },
      { name: "Voice B", lang: "ko-KR", voiceURI: "b", localService: true },
    ];
    synth.dispatchEvent(new Event("voiceschanged"));
  });
  await page.getByLabel("韓国語の声").selectOption("b");
  await page.getByRole("button", { name: "Voice Bの声を試聴" }).click();
  expect(await page.evaluate(() => (window as any).synthMock.spoken)).toEqual(["b"]);
  const cancels = await page.evaluate(() => (window as any).synthMock.cancels);
  await page.goto("#/home");
  expect(await page.evaluate(() => (window as any).synthMock.cancels)).toBeGreaterThan(cancels);
  await page.goto("#/pronunciation");
  await page.getByText("音声が出ないとき").click();
  await expect(page.getByLabel("韓国語の声")).toHaveValue("b");
});

for (const mode of ["denied", "unsupported"] as const)
  test(`録音${mode}の案内`, async ({ page }) => {
    await mockRecording(page, mode);
    await page.goto("#/lesson/day-01?production");
    await page.getByRole("button", { name: "録音開始" }).click();
    await expect(page.getByRole("alert")).toContainText(
      mode === "denied" ? "許可されませんでした" : "対応していません",
    );
  });

test("遅延した録音許可後、離脱済みならトラック停止", async ({ page }) => {
  await mockRecording(page, "delayed");
  await page.goto("#/lesson/day-01?production");
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
  await page.goto("#/lesson/day-01");
  await page.evaluate(() => {
    const s = (window as any).synthMock;
    s.voices = [{ name: "Mock Korean", lang: "ko-KR", voiceURI: "mock" }];
    s.dispatchEvent(new Event("voiceschanged"));
  });

  const audio = page.getByRole("button", { name: "ㅏの名前아を聞く" }).first();
  await audio.click();
  await expect(
    page.getByText("音声を再生できません。音声設定を確認してください。").first(),
  ).toBeVisible();
  await page.goto("#/home");
  expect(await page.evaluate(() => (window as any).synthMock.cancels)).toBeGreaterThan(1);
});

test("タブを切り替えると録音中のマイクを停止する", async ({ page }) => {
  await mockRecording(page, "webm");
  await page.goto("#/lesson/day-01?production");
  await page.getByRole("button", { name: "録音開始" }).click();
  await expect(page.getByText("録音中", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "本文" }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).recordingMock.stops))
    .toBeGreaterThan(0);
});

test("発音ガイドは音節例を再生し、停止と画面移動で再生を止める", async ({ page }) => {
  await page.addInitScript(() => {
    const synth = new EventTarget() as EventTarget & {
      getVoices: () => unknown[];
      speak: (u: any) => void;
      cancel: () => void;
      spoken: string[];
      cancels: number;
    };
    synth.spoken = [];
    synth.cancels = 0;
    synth.getVoices = () => [{ name: "Mock Korean", lang: "ko-KR", voiceURI: "mock" }];
    synth.speak = (u) => synth.spoken.push(u.text);
    synth.cancel = () => synth.cancels++;
    Object.defineProperty(window, "speechSynthesis", { value: synth });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: class {
        constructor(public text: string) {}
      },
    });
    (window as any).synthMock = synth;
  });
  await page.goto("#/pronunciation");
  const letter = page.getByRole("button", { name: "ㅏの音節・単語例아を聞く" }).first();
  await letter.click();
  expect(await page.evaluate(() => (window as any).synthMock.spoken)).toEqual(["아"]);
  await page.getByRole("button", { name: "ㅏの音節・単語例아を聞く（再生中、停止）" }).click();
  await expect(page.getByText("音声を再生できません。音声設定を確認してください。")).toHaveCount(0);
  await letter.click();
  await page.getByRole("button", { name: "ㅓの音節・単語例어を聞く" }).first().click();
  await expect(page.getByText("音声を再生できません。音声設定を確認してください。")).toHaveCount(0);
  const cancels = await page.evaluate(() => (window as any).synthMock.cancels);
  await page.goto("#/home");
  expect(await page.evaluate(() => (window as any).synthMock.cancels)).toBeGreaterThan(cancels);
});

test("韓国語の声がない場合は文字の近くに案内する", async ({ page }) => {
  await page.addInitScript(() => {
    const synth = new EventTarget() as EventTarget & {
      getVoices: () => unknown[];
      cancel: () => void;
    };
    synth.getVoices = () => [];
    synth.cancel = () => {};
    Object.defineProperty(window, "speechSynthesis", { value: synth });
  });
  await page.goto("#/pronunciation");
  await page.getByRole("button", { name: "ㅏの音節・単語例아を聞く" }).first().click();
  await expect(page.getByText("音声を再生できません。音声設定を確認してください。")).toBeVisible();
  expect(await page.locator("button button").count()).toBe(0);
});

test("音声の生成に失敗した後、再試行できる", async ({ page }) => {
  await page.addInitScript(() => {
    const synth = new EventTarget() as EventTarget & {
      getVoices: () => unknown[];
      speak: (u: any) => void;
      cancel: () => void;
    };
    synth.getVoices = () => [{ name: "Mock Korean", lang: "ko-KR", voiceURI: "mock" }];
    synth.speak = (u) => queueMicrotask(() => u.onend?.());
    synth.cancel = () => {};
    Object.defineProperty(window, "speechSynthesis", { value: synth });
    let first = true;
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: class {
        constructor(public text: string) {
          if (first) {
            first = false;
            throw new Error("constructor failed");
          }
        }
      },
    });
  });
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  await page.goto("#/lesson/day-03");
  const letter = page.getByRole("button", { name: "ㅇの名前이응を聞く", exact: true }).first();
  await letter.click();
  await expect(page.getByText("音声を再生できません。音声設定を確認してください。")).toBeVisible();
  await expect(letter).toHaveAttribute("aria-label", "ㅇの名前이응を聞く");
  await letter.click();
  await expect(page.getByText("音声を再生できません。音声設定を確認してください。")).toHaveCount(0);
  expect(failures).toEqual([]);
});
