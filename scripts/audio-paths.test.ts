import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import type { Lesson } from "../src/domain/content";
import { validateAudioPaths } from "./audio-paths";

it("音声の存在とpublic領域内のパスを検証する", () => {
  const dir = mkdtempSync(join(tmpdir(), "korean-audio-"));
  try {
    writeFileSync(join(dir, "ok.mp3"), "test");
    const audio = {
      text: "가",
      source: "source",
      license: "license",
      voice: "voice",
      status: "unverified" as const,
      path: "/ok.mp3",
    };
    const lesson = {
      id: "day-01",
      examples: [{ audio }],
      dialogue: [],
      recall: [],
      exercises: [],
      exitTest: [],
    } as unknown as Lesson;
    expect(validateAudioPaths([lesson], dir)).toEqual([]);
    audio.path = "/missing.mp3";
    expect(validateAudioPaths([lesson], dir)).toHaveLength(1);
    audio.path = "/../outside.mp3";
    expect(validateAudioPaths([lesson], dir)).toHaveLength(1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
