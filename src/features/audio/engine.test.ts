import { afterEach, describe, expect, it, vi } from "vitest";
import { AudioEngine, isJamoOnly, koreanVoices, preferredVoice, sentences } from "./engine";

afterEach(() => vi.unstubAllGlobals());
describe("音声", () => {
  it("遅れて取得した韓国語音声だけを選ぶ", () => {
    expect(koreanVoices([])).toEqual([]);
    const voices = [{ lang: "en-US" }, { lang: "ko-KR" }, { lang: "ko" }] as SpeechSynthesisVoice[];
    expect(koreanVoices(voices)).toEqual(voices.slice(1));
  });
  it("明示的な品質名を持つ声を優先し、なければ先頭を使う", () => {
    const voices = [{ name: "Standard" }, { name: "Natural" }] as SpeechSynthesisVoice[];
    expect(preferredVoice([])).toBeUndefined();
    expect(preferredVoice(voices)).toBe(voices[1]);
    expect(preferredVoice(voices.slice(0, 1))).toBe(voices[0]);
  });
  it("韓国語音声がない場合と単独字母は読み上げない", async () => {
    const synth = { cancel: vi.fn(), speak: vi.fn() } as unknown as SpeechSynthesis;
    expect(await new AudioEngine(synth, () => undefined).play("안녕하세요")).toBe(false);
    expect(isJamoOnly("ㄱ")).toBe(true);
    expect(
      await new AudioEngine(synth, () => ({ lang: "ko-KR" }) as SpeechSynthesisVoice).play("ㄱ"),
    ).toBe(false);
    expect(synth.speak).not.toHaveBeenCalled();
  });
  it("読み上げエラーと停止を失敗として返し、古い再生を完了させない", async () => {
    class Utterance {
      lang = "";
      voice = null;
      rate = 1;
      onend?: () => void;
      onerror?: () => void;
      constructor(public text: string) {}
    }
    vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
    let current: Utterance | undefined;
    const synth = {
      cancel: vi.fn(),
      speak: (value: Utterance) => {
        current = value;
      },
    } as unknown as SpeechSynthesis;
    const engine = new AudioEngine(synth, () => ({ lang: "ko" }) as SpeechSynthesisVoice);
    const first = engine.play("하나");
    const second = engine.play("둘");
    expect(await first).toBe(false);
    current?.onerror?.();
    expect(await second).toBe(false);
    expect(sentences("하나. 둘!")).toEqual(["하나.", "둘!"]);
  });
  it("同梱音声の失敗後に韓国語音声へ切り替える", async () => {
    class FileAudio {
      playbackRate = 1;
      onended?: () => void;
      onerror?: () => void;
      pause() {}
      play() {
        return Promise.reject(new Error("missing"));
      }
    }
    class Utterance {
      lang = "";
      voice = null;
      rate = 1;
      onend?: () => void;
      constructor(public text: string) {}
    }
    vi.stubGlobal("Audio", FileAudio);
    vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
    const synth = {
      cancel: vi.fn(),
      speak: (u: Utterance) => u.onend?.(),
    } as unknown as SpeechSynthesis;
    const engine = new AudioEngine(synth, () => ({ lang: "ko" }) as SpeechSynthesisVoice);
    expect(
      await engine.play("안녕", {
        text: "안녕",
        path: "/missing",
        source: "test",
        license: "test",
        voice: "test",
        status: "unverified",
      }),
    ).toBe(true);
  });
  it("確認済み音声が必要な場合は失敗後に合成しない", async () => {
    class FileAudio {
      playbackRate = 1;
      pause() {}
      play() {
        return Promise.reject(new Error("missing"));
      }
    }
    vi.stubGlobal("Audio", FileAudio);
    const synth = { cancel: vi.fn(), speak: vi.fn() } as unknown as SpeechSynthesis;
    const engine = new AudioEngine(synth, () => ({ lang: "ko" }) as SpeechSynthesisVoice);
    const source = vi.fn();
    expect(
      await engine.play(
        "안녕",
        {
          text: "안녕",
          path: "/missing",
          source: "test",
          license: "test",
          voice: "test",
          status: "checked",
        },
        { allowFallback: false, onSource: source },
      ),
    ).toBe(false);
    expect(synth.speak).not.toHaveBeenCalled();
    expect(source).not.toHaveBeenCalled();
  });
  it("停止時の古い発話イベントが次の発話を完了させない", async () => {
    class Utterance {
      lang = "";
      voice = null;
      rate = 1;
      onend?: () => void;
      onerror?: () => void;
      constructor(public text: string) {}
    }
    vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
    const utterances: Utterance[] = [];
    const synth = {
      cancel: vi.fn(),
      speak: (u: Utterance) => utterances.push(u),
    } as unknown as SpeechSynthesis;
    const engine = new AudioEngine(synth, () => ({ lang: "ko" }) as SpeechSynthesisVoice);
    const first = engine.play("하나");
    const second = engine.play("둘");
    utterances[0].onend?.();
    expect(await first).toBe(false);
    utterances[1].onend?.();
    expect(await second).toBe(true);
  });
});
