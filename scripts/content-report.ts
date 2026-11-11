import { existsSync, writeFileSync } from "node:fs";
import { lessons } from "../src/content";
import { renderReport } from "./content-report-data";

const report = renderReport(lessons, (day) => {
  const week = String(Math.ceil(day / 7)).padStart(2, "0");
  const number = String(day).padStart(2, "0");
  const path = `src/content/lessons/week${week}/day${number}.ts`;
  return existsSync(path) ? `../${path}` : undefined;
});
writeFileSync("docs/CONTENT_REPORT.md", report);
