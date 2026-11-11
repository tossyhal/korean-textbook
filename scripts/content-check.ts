import { lessons } from "../src/content";
import { validateContent } from "../src/domain/validate-content";
import { validateAudioPaths } from "./audio-paths";

const errors = [
  ...validateContent(lessons, !process.argv.includes("--partial")),
  ...validateAudioPaths(lessons),
];
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else console.log(`${lessons.length}課の教材検証に成功しました`);
