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

test("本文の読み上げは行送りを広げずクリックとEnterで再生できる", async ({ page }) => {
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
        speak: (utterance: SpeechSynthesisUtterance) => {
          (window as any).spoken.push(utterance.text);
          queueMicrotask(() => utterance.onend?.({} as SpeechSynthesisEvent));
        },
      },
    });
  });
  await page.goto("#/lesson/day-22");
  const paragraph = page
    .locator("p")
    .filter({ has: page.locator(".speakable-text-inline") })
    .first();
  const token = paragraph.locator(".speakable-text-inline").first();
  await expect(token).toBeVisible();
  const geometry = await token.evaluate((button) => {
    const paragraph = button.closest("p")!;
    const style = getComputedStyle(button);
    const parentStyle = getComputedStyle(paragraph);
    const before = paragraph.getBoundingClientRect().height;
    const clone = paragraph.cloneNode(true) as HTMLElement;
    for (const item of clone.querySelectorAll("button")) item.replaceWith(item.textContent ?? "");
    paragraph.after(clone);
    const plainHeight = clone.getBoundingClientRect().height;
    clone.remove();
    return {
      height: button.getBoundingClientRect().height,
      lineHeight: parseFloat(parentStyle.lineHeight),
      buttonLineHeight: parseFloat(style.lineHeight),
      minHeight: style.minHeight,
      border: style.borderBottomWidth,
      decoration: style.textDecorationLine,
      before,
      plainHeight,
    };
  });
  expect(geometry.minHeight).toBe("0px");
  expect(geometry.border).toBe("0px");
  expect(geometry.decoration).toContain("underline");
  expect(geometry.buttonLineHeight).toBeCloseTo(geometry.lineHeight, 1);
  expect(geometry.height).toBeLessThanOrEqual(geometry.lineHeight + 1);
  expect(geometry.before).toBeCloseTo(geometry.plainHeight, 1);
  const spoken = await token.textContent();
  await token.click();
  await token.focus();
  await page.keyboard.press("Enter");
  await expect.poll(() => page.evaluate(() => (window as any).spoken)).toEqual([spoken, spoken]);
  await expect(token).toHaveAttribute("lang", "ko");
});

async function mockControlledSpeech(page: Page) {
  await page.addInitScript(() => {
    const synth = new EventTarget() as any;
    synth.items = [];
    synth.getVoices = () => [{ name: "Mock Korean", lang: "ko-KR", voiceURI: "mock" }];
    synth.speak = (utterance: SpeechSynthesisUtterance) => synth.items.push(utterance);
    synth.cancel = () => {};
    Object.defineProperty(window, "speechSynthesis", { value: synth });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: class {
        constructor(public text: string) {}
      },
    });
    (window as any).controlledSpeech = synth;
  });
}

test("聴解の停止と再生の競合は失敗扱いせず、完了済みの回答資格を保つ", async ({ page }) => {
  await mockControlledSpeech(page);
  await page.goto("#/lesson/day-04?exercises");
  const q = page.locator("#day-04-ex-listen-1");
  const play = q.getByRole("button", { name: "問題の音声を再生" });
  const check = q.getByRole("button", { name: "答え合わせ" });
  const error = q.getByText("再生できませんでした。端末の音声設定を確認してください。");
  await q.getByRole("radio", { name: "医師" }).check();
  await expect(check).toBeDisabled();
  await play.click();
  await q.getByRole("button", { name: "停止", exact: true }).click();
  await page.evaluate(() => (window as any).controlledSpeech.items[0].onerror?.());
  await expect(error).toHaveCount(0);
  await expect(check).toBeDisabled();
  await play.click();
  await page.evaluate(() => (window as any).controlledSpeech.items[1].onend?.());
  await expect(check).toBeEnabled();
  await play.click();
  await q.getByRole("button", { name: "停止", exact: true }).click();
  await page.evaluate(() => (window as any).controlledSpeech.items[2].onerror?.());
  await expect(error).toHaveCount(0);
  await expect(check).toBeEnabled();
  await play.click();
  await play.click();
  await page.evaluate(() => (window as any).controlledSpeech.items[3].onerror?.());
  await expect(error).toHaveCount(0);
  await expect(check).toBeEnabled();
  await page.evaluate(() => (window as any).controlledSpeech.items[4].onerror?.());
  await expect(error).toBeVisible();
  await expect(check).toBeEnabled();
  await play.click();
  await expect(error).toHaveCount(0);
  await page.getByRole("tab", { name: "本文" }).click();
  await page.evaluate(() => (window as any).controlledSpeech.items[5].onerror?.());
  await page.getByRole("tab", { name: "練習" }).click();
  await expect(error).toHaveCount(0);
});

test("別の文字の再生は聴解を中断し、以前の文字のエラーを消す", async ({ page }) => {
  await mockControlledSpeech(page);
  await page.goto("#/lesson/day-04?exercises");
  const q = page.locator("#day-04-ex-listen-1");
  await q.getByRole("button", { name: "問題の音声を再生" }).click();
  await page.getByRole("tab", { name: "本文" }).click();
  const word = page.locator(".speakable-text").first();
  await word.click();
  await page.evaluate(() => (window as any).controlledSpeech.items[0].onerror?.());
  await page.evaluate(() => (window as any).controlledSpeech.items[1].onerror?.());
  const message = page.getByText("音声を再生できません。音声設定を確認してください。");
  await expect(message).toBeVisible();
  await page.locator(".speakable-text").nth(1).click();
  await expect(message).toHaveCount(0);
  await page.getByRole("tab", { name: "練習" }).click();
  await expect(q.getByText("再生できませんでした。端末の音声設定を確認してください。")).toHaveCount(
    0,
  );
});

test("選択肢の音声は選択や回答履歴を変えず、答えと解説も発音できる", async ({ page }) => {
  await mockControlledSpeech(page);
  await page.goto("#/lesson/day-01?exit");
  const q = page.locator("#day-01-exit-03");
  const group = q.getByRole("group", { name: /初声に音がない音節を選ぶ.*回答を選ぶ/ });
  await expect(group).toBeVisible();
  const before = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("korean-textbook-progress-v1")!),
  );
  await q.getByRole("button", { name: "우を聞く" }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).controlledSpeech.items.map((u: any) => u.text)))
    .toContain("우");
  await expect(group.getByRole("radio", { name: "우" })).not.toBeChecked();
  const after = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("korean-textbook-progress-v1")!),
  );
  expect(after.drafts).toEqual(before.drafts);
  expect(after.attempts).toEqual(before.attempts);
  expect(after.answerViewedQuestionIds).toEqual(before.answerViewedQuestionIds);
  await group.getByRole("radio", { name: "우" }).check();
  await expect(group.getByRole("radio", { name: "우" })).toBeChecked();
  await q.getByRole("button", { name: "答えを見る" }).click();
  const revealed = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("korean-textbook-progress-v1")!),
  );
  const spoken = q.getByRole("status").locator("p").nth(1).locator(".speakable-text").first();
  await expect(spoken).toHaveText("ㅇ");
  await spoken.click();
  await expect
    .poll(() => page.evaluate(() => (window as any).controlledSpeech.items.at(-1).text))
    .toBe("이응");
  const afterSpeech = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("korean-textbook-progress-v1")!),
  );
  expect(afterSpeech.drafts).toEqual(revealed.drafts);
  expect(afterSpeech.attempts).toEqual(revealed.attempts);
});

test("字母の選択肢は名前を再生し、選択とは独立する", async ({ page }) => {
  await mockControlledSpeech(page);
  await page.goto("#/lesson/day-01?exercises");
  const q = page.locator("#day-01-ex-08");
  const radio = q.getByRole("radio", { name: "ㅜ" });
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("korean-textbook-progress-v1")))
    .not.toBeNull();
  const before = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("korean-textbook-progress-v1")!),
  );
  await q.getByRole("button", { name: "ㅜの名前우を聞く" }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).controlledSpeech.items.at(-1).text))
    .toBe("우");
  await expect(radio).not.toBeChecked();
  const after = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("korean-textbook-progress-v1")!),
  );
  expect(after.drafts).toEqual(before.drafts);
  expect(after.attempts).toEqual(before.attempts);
  expect(after.answerViewedQuestionIds).toEqual(before.answerViewedQuestionIds);
  await radio.check();
  await expect(radio).toBeChecked();
  await expect(q.locator("label button")).toHaveCount(0);
});

test("選択肢の音声生成が拒否されても案内して再試行できる", async ({ page }) => {
  await page.addInitScript(() => {
    let first = true;
    (window as any).spoken = [];
    (window as any).rejections = [];
    window.addEventListener("unhandledrejection", (event) =>
      (window as any).rejections.push(String(event.reason)),
    );
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
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        getVoices: () => [{ lang: "ko-KR", voiceURI: "ko", name: "test" }],
        addEventListener() {},
        removeEventListener() {},
        cancel() {},
        speak: (u: SpeechSynthesisUtterance) => {
          (window as any).spoken.push(u.text);
          queueMicrotask(() => u.onend?.({} as SpeechSynthesisEvent));
        },
      },
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("#/lesson/day-01?exercises");
  const q = page.locator("#day-01-ex-08");
  const button = q.getByRole("button", { name: "ㅜの名前우を聞く" });
  await button.click();
  await expect(q.getByText("音声を再生できません。音声設定を確認してください。")).toBeVisible();
  await button.click();
  await expect.poll(() => page.evaluate(() => (window as any).spoken)).toEqual(["우"]);
  await expect(q.getByText("音声を再生できません。音声設定を確認してください。")).toHaveCount(0);
  await expect(q.getByRole("radio", { name: "ㅜ" })).not.toBeChecked();
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => (window as any).rejections)).toEqual([]);
});

test("角括弧付き字母の選択肢も字母名を再生する", async ({ page }) => {
  await mockControlledSpeech(page);
  await page.goto("#/lesson/day-44?exit");
  const q = page.locator(".question").filter({ hasText: "表記꽃の終声はどの音で終わる？" });
  await q.getByRole("button", { name: "[ㄷ]の名前디귿を聞く" }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).controlledSpeech.items.at(-1).text))
    .toBe("디귿");
  await expect(q.getByRole("radio", { name: "[ㄷ]" })).not.toBeChecked();
});

test("同じ画面の別の再生で聴解が中断されても回答資格を保つ", async ({ page }) => {
  await mockControlledSpeech(page);
  await page.goto("#/lesson/day-04?exercises");
  const q = page.locator("#day-04-ex-listen-1");
  const play = q.getByRole("button", { name: "問題の音声を再生" });
  await q.getByRole("radio", { name: "医師" }).check();
  await play.click();
  await page.evaluate(() => (window as any).controlledSpeech.items[0].onend?.());
  const check = q.getByRole("button", { name: "答え合わせ" });
  await expect(check).toBeEnabled();
  await play.click();
  await page.getByRole("button", { name: "아니에요を聞く" }).first().click();
  await page.evaluate(() => (window as any).controlledSpeech.items[1].onerror?.());
  await expect(q.getByText("再生できませんでした。端末の音声設定を確認してください。")).toHaveCount(
    0,
  );
  await expect(check).toBeEnabled();
});

test("聴解の原文は答えを見るまで隠され、公開後は発音できる", async ({ page }) => {
  await mockControlledSpeech(page);
  await page.goto("#/lesson/day-04?exercises");
  const q = page.locator("#day-04-ex-listen-1");
  await expect(q.getByText("저는 의사예요.")).toHaveCount(0);
  await q.getByRole("button", { name: "答えを見る" }).click();
  await q.getByText("音声の原文を確認").click();
  const original = q.getByRole("button", { name: "의사예요を聞く" });
  await original.click();
  await expect
    .poll(() => page.evaluate(() => (window as any).controlledSpeech.items.at(-1).text))
    .toBe("의사예요");
});

test("復習に登録した語彙の韓国語を実際に発音できる", async ({ page }) => {
  await mockControlledSpeech(page);
  await page.goto("#/reference");
  const word = page.locator(".wordbook-entry").first();
  const value = await word.locator("[lang=ko]").first().innerText();
  await word.getByRole("button", { name: "復習に追加" }).click();
  await page.goto("#/review");
  const review = page.locator(".question").filter({ hasText: value });
  const spoken = review.locator(".speakable-text").first();
  const text = await spoken.innerText();
  await spoken.click();
  await expect
    .poll(() => page.evaluate(() => (window as any).controlledSpeech.items.at(-1).text))
    .toBe(text);
});
