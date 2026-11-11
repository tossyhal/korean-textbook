import { expect, it } from "vitest";
import { distinctVoices } from ".";

it("同じURIは別の合成音声として数えない", () => {
  const voices = [
    { voiceURI: "a" },
    { voiceURI: "a" },
    { voiceURI: "b" },
    { voiceURI: "" },
  ] as SpeechSynthesisVoice[];
  expect(distinctVoices(voices)).toEqual([voices[0], voices[2]]);
});

import { newProgress } from "../../domain/progress";
import { exportBackup, parseBackup } from "../../storage/backup";

it("自己確認記録を復元し、不正な声や教材参照を拒否する", () => {
  const ids = {
    lessons: new Set(["day-47"]),
    questions: new Set<string>(),
    reviews: new Set<string>(),
    voiceTransfer: new Set(["day-47"]),
  };
  const run = {
    modelURI: "a",
    alternateURI: "b",
    at: "2026-01-01T00:00:00.000Z",
    selfChecked: true as const,
  };
  const progress = { ...newProgress(), voiceTransferRuns: { "day-47": run } };
  expect(parseBackup(exportBackup(progress), ids).voiceTransferRuns).toEqual(
    progress.voiceTransferRuns,
  );
  expect(() =>
    parseBackup(exportBackup(progress), { ...ids, voiceTransfer: new Set<string>() }),
  ).toThrow();
  expect(() =>
    exportBackup({ ...progress, voiceTransferRuns: { "day-47": { ...run, alternateURI: "a" } } }),
  ).toThrow();
  expect(
    parseBackup(JSON.stringify({ ...newProgress(), voiceTransferRuns: undefined }), ids)
      .voiceTransferRuns,
  ).toEqual({});
});
