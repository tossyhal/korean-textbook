import { expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { day42 } from "../week06/day42";
import { day56 } from "./day56";

it("予定の入力は目的地と方向の助詞および既習の二形を認める", () => {
  const question = day56.exitTest.find((item) => item.id === "day-56-exit-input-7")!;
  for (const particle of ["에", "으로"]) {
    for (const ending of ["갈 거예요", "갈 것이에요"]) {
      expect(gradeAnswer(question, `내일 도서관${particle} ${ending}`)).toBe("correct");
    }
  }
  expect(gradeAnswer(question, "내일 도서관에서 갈 거예요")).toBe("incorrect");
});

it("差し替えた読解の問いと選択肢は新しい情報と一致する", () => {
  const impression = day42.exitTest.find((item) => item.prompt.includes("동생과 영화를 봤어요"))!;
  expect(impression.answers).toEqual(["面白かった"]);
  expect(impression.options).toContain("面白かった");
  expect(impression.explanation).toContain("재미있었어요");
  const departure = day56.exitTest.find((item) => item.prompt.includes("두 시 반에 출발해요"))!;
  expect(departure.answers).toEqual(["二時半"]);
  expect(departure.options).toContain("二時半");
  expect(departure.explanation).toContain("두 시 반");
});
