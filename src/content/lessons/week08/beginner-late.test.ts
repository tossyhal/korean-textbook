import { describe, expect, it } from "vitest";
import { gradeAnswer } from "../../../domain/progress";
import { day31 } from "../week05/day31";
import { day32 } from "../week05/day32";
import { day35 } from "../week05/day35";
import { day37 } from "../week06/day37";
import { day38 } from "../week06/day38";
import { day40 } from "../week06/day40";
import { day46 } from "../week07/day46";
import { day47 } from "../week07/day47";
import { day48 } from "../week07/day48";
import { day49 } from "../week07/day49";
import { day53 } from "./day53";
import { day56 } from "./day56";

describe("後半教材の初心者向け確認", () => {
  it("評価前に語彙を導入し、移動した語彙は初出とIDを共有する", () => {
    const early = day31.vocabulary.find((v) => v.korean === "옆")!;
    expect(early.firstDay).toBe(31);
    expect(day32.vocabulary.find((v) => v.korean === "옆")).toEqual(early);
    for (const [lesson, word] of [
      [day37, "회사"],
      [day38, "자주"],
      [day53, "빵"],
    ] as const)
      expect(lesson.vocabulary.some((v) => v.korean === word)).toBe(true);
    expect(JSON.stringify(day35.exitTest)).not.toMatch(/하나뿐|이것보다/);
  });
  it("未縮約の既習形を同じ入力指示で認める", () => {
    for (const [lesson, answer] of [
      [day37, "대학원에서 공부하여요"],
      [day40, "어제 공부하였어요"],
      [day49, "학교에서 공부하여요"],
    ] as const) {
      const q = lesson.exitTest.find((item) => item.answers.includes(answer))!;
      expect(q).toBeDefined();
      expect(gradeAnswer(q, answer)).toBe("correct");
    }
  });
  it("聴解課の出口から操作の知識を除き、未確認音声を隠して出題する", () => {
    for (const lesson of [day46, day47, day48, day49]) {
      for (const q of lesson.exitTest) {
        expect(q.prompt).not.toMatch(/voiceURI|書取の空白|再生できない|原文を見る目的|別文の目的/);
        if (q.type === "listening") {
          expect(q.prompt).not.toContain(q.audio!.text);
          expect(q.audio!.status).toBe("unverified");
        }
      }
    }
  });
  it("最終評価は人数・時刻・価格を含み技能を分ける", () => {
    for (const skill of ["reading", "listening", "typing"])
      expect(day56.exitTest.filter((q) => q.skill === skill)).toHaveLength(8);
    const audio = day56.exitTest
      .filter((q) => q.skill === "listening")
      .map((q) => q.audio!.text)
      .join(" ");
    expect(audio).toContain("세 명");
    expect(audio).toContain("다섯 시");
    expect(audio).toContain("팔천 원");
    expect(day56.production.rubric.some((item) => item.startsWith("作文："))).toBe(true);
    expect(day56.production.rubric.some((item) => item.startsWith("発話："))).toBe(true);
  });
});

import { lessons } from "../../index";
it("全課の音声再生テキストに話者ラベルを含めない", () => {
  for (const lesson of lessons) {
    const texts = [
      ...lesson.examples.map((item) => item.audio?.text),
      ...lesson.dialogue.map((item) => item.audio?.text),
      ...[...lesson.recall, ...lesson.exercises, ...lesson.exitTest].map(
        (item) => item.audio?.text,
      ),
    ];
    for (const text of texts) if (text) expect(text).not.toMatch(/(?:^|\s)[가나다]:/u);
  }
});

const passages = (prompt: string) =>
  [...prompt.matchAll(/「([^」]+)」/gu)].map((match) => match[1]);

const sentences = (text: string) =>
  text
    .normalize("NFC")
    .split(/[。.!！?？\n]+/u)
    .map((sentence) =>
      sentence
        .replace(/^\s*[가나다ABCＡＢＣ]\s*[:：]\s*/u, "")
        .trim()
        .replace(/\s+/gu, " "),
    )
    .filter(Boolean);

const reusedSentences = (previous: string[], current: string[]) => {
  const key = (sentence: string) => sentence.replace(/\s+/gu, "");
  const earlier = new Map<string, number>();
  for (const sentence of previous.flatMap(sentences)) {
    const normalized = key(sentence);
    earlier.set(normalized, Math.max(earlier.get(normalized) ?? 0, sentence.length));
  }
  return current
    .flatMap(sentences)
    .filter((sentence) => {
      const length = earlier.get(key(sentence));
      return length !== undefined && Math.max(length, sentence.length) >= 12;
    })
    .map(key);
};

it("複数文の練習の第一文が確認テストに再出した場合も検出する", () => {
  expect(
    reusedSentences(
      ["가: 은행 앞에 버스 정류장이 있어요. 약국은 옆에 있어요!"],
      ["은행 앞에 버스 정류장이 있어요"],
    ),
  ).toEqual(["은행앞에버스정류장이있어요"]);
  expect(
    reusedSentences(["가: 은행 앞에 버스 정류장이 있어요?"], ["은행 앞에 버스 정류장이 있어요!"]),
  ).toHaveLength(1);
  expect(reusedSentences(["안녕하세요."], ["안녕하세요."])).toEqual([]);
});

it("後半の確認テストの文章は過去の例文・会話・練習の原文を流用しない", () => {
  const reused: { id: string; sentences: string[] }[] = [];
  for (let i = 28; i < lessons.length; i++) {
    const lesson = lessons[i];
    const previous = lessons
      .slice(0, i + 1)
      .flatMap((item) => [
        ...item.examples.flatMap((example) => [example.korean, example.audio?.text]),
        ...item.dialogue.flatMap((line) => [line.korean, line.audio?.text]),
        ...[...item.recall, ...item.exercises].flatMap((question) => [
          ...passages(question.prompt),
          question.audio?.text,
        ]),
      ])
      .filter((text): text is string => Boolean(text));
    for (const question of lesson.exitTest) {
      const current = [...passages(question.prompt), question.audio?.text].filter(
        (text): text is string => Boolean(text),
      );
      const matches = reusedSentences(previous, current);
      if (matches.length) reused.push({ id: question.id, sentences: matches });
    }
  }
  expect(reused).toEqual([]);
});

it("最終評価の必要表現は既習の縮約・未縮約形を採点する", () => {
  const question = day56.exitTest.find((item) => item.id === "day-56-exit-input-3")!;
  for (const answer of [
    "집에서 공부해야 해요",
    "집에서 공부하여야 해요",
    "집에서 공부해야 돼요",
    "집에서 공부해야 되어요",
    "집에서 공부하여야 돼요",
    "집에서 공부하여야 되어요",
  ]) {
    expect(gradeAnswer(question, answer)).toBe("correct");
  }
});
