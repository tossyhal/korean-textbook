import { existsSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import type { Lesson } from "../src/domain/content";

export function validateAudioPaths(lessons: Lesson[], publicDir = resolve("public")): string[] {
  const errors: string[] = [];
  const root = resolve(publicDir);
  for (const lesson of lessons) {
    const items = [
      ...lesson.examples,
      ...lesson.dialogue,
      ...lesson.recall,
      ...lesson.exercises,
      ...lesson.exitTest,
    ];
    for (const item of items) {
      const path = item.audio?.path;
      if (!path) continue;
      const file = resolve(root, path.replace(/^\/+/, ""));
      if (!file.startsWith(root + sep) || !existsSync(file) || !statSync(file).isFile())
        errors.push(`音声ファイルがありません: ${lesson.id} ${path}`);
    }
  }
  return errors;
}
