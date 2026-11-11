import type { z } from "zod";
import { audioSchema } from "../../domain/content";

export type AudioData = z.infer<typeof audioSchema>;
export type PlayOptions = {
  rate?: number;
  repeat?: number;
  allowFallback?: boolean;
  onSource?: (source: "file" | "tts") => void;
};
export const isJamoOnly = (text: string) =>
  /^[\s\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff]+$/u.test(text);
export const koreanVoices = (voices: SpeechSynthesisVoice[]) =>
  voices.filter((voice) => /^ko(?:-|$)/i.test(voice.lang));
export const sentences = (text: string) =>
  text
    .match(/[^.!?。！？]+[.!?。！？]*\s*/gu)
    ?.map((s) => s.trim())
    .filter(Boolean) ?? [];

export class AudioEngine {
  private generation = 0;
  private current: HTMLAudioElement | null = null;
  private resolve: ((result: boolean) => void) | null = null;
  constructor(
    private synth: SpeechSynthesis | null,
    private voice: () => SpeechSynthesisVoice | undefined,
  ) {}
  stop() {
    this.generation++;
    this.current?.pause();
    this.current = null;
    this.synth?.cancel();
    this.resolve?.(false);
    this.resolve = null;
  }
  async play(text: string, audio?: AudioData, options: PlayOptions = {}): Promise<boolean> {
    this.stop();
    const generation = this.generation;
    const repeat = Math.max(1, Math.min(10, Math.floor(options.repeat ?? 1)));
    for (let i = 0; i < repeat; i++) {
      if (generation !== this.generation) return false;
      let success = false;
      if (audio?.path) {
        success = await this.playFile(audio.path, options.rate ?? 1, generation);
        if (success) options.onSource?.("file");
      }
      if (!success && generation === this.generation && options.allowFallback !== false) {
        success = await this.speak(text, options.rate ?? 1, generation);
        if (success) options.onSource?.("tts");
      }
      if (!success) return false;
    }
    return true;
  }
  private playFile(path: string, rate: number, generation: number): Promise<boolean> {
    return new Promise((resolve) => {
      const element = new Audio(path);
      this.current = element;
      this.resolve = resolve;
      element.playbackRate = rate;
      let settled = false;
      const finish = (ok: boolean) => {
        if (settled || generation !== this.generation) return;
        settled = true;
        this.current = null;
        this.resolve = null;
        resolve(ok);
      };
      element.onended = () => finish(true);
      element.onerror = () => finish(false);
      void element.play().catch(() => finish(false));
    });
  }
  private speak(text: string, rate: number, generation: number): Promise<boolean> {
    const voice = this.voice();
    if (!this.synth || !voice || !text.trim() || isJamoOnly(text)) return Promise.resolve(false);
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.voice = voice;
      utterance.rate = rate;
      this.resolve = resolve;
      const finish = (ok: boolean) => {
        if (generation !== this.generation) return;
        this.resolve = null;
        resolve(ok);
      };
      utterance.onend = () => finish(true);
      utterance.onerror = () => finish(false);
      try {
        this.synth?.speak(utterance);
      } catch {
        finish(false);
      }
    });
  }
}
