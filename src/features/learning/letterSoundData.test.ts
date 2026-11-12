import { describe, expect, it } from "vitest";
import { letterSoundData } from "./letterSoundData";

const letters = (day: number, group: number) =>
  letterSoundData[day][group].samples.map((sample) => sample.letter).join("");

describe("字母の音声見本", () => {
  it("第1節に基本母音10字と基本子音14字を表示する", () => {
    expect(letters(1, 0)).toBe("ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ");
    expect(letters(1, 1)).toBe("ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ");
  });
  it("第2節に複合母音、濃音と同母音の対立を収録する", () => {
    expect(letters(2, 0)).toBe("ㅐㅒㅔㅖㅘㅙㅚㅝㅞㅟㅢ");
    expect(letters(2, 1)).toBe("ㄲㄸㅃㅆㅉ");
    expect(letterSoundData[2][2].samples.map((sample) => sample.text)).toEqual([
      "가",
      "카",
      "까",
      "다",
      "타",
      "따",
      "바",
      "파",
      "빠",
      "자",
      "차",
      "짜",
      "사",
      "싸",
    ]);
  });
  it("第3節に代表終声と複数子音の実例を収録する", () => {
    expect(letters(3, 0)).toBe("ㄱㄴㄷㄹㅁㅂㅇ");
    expect(letterSoundData[3][1].samples.map((sample) => sample.text)).toEqual([
      "없다",
      "없어요",
      "읽다",
      "읽어요",
    ]);
  });
  it("없어요の綴りと濃音化した発音を区別する", () => {
    const sample = letterSoundData[3][1].samples.find((item) => item.text === "없어요");
    expect(sample?.letter).toBe("ㅄ");
    expect(sample?.text).toBe("없어요");
    expect(sample?.note).toContain("濃音ㅆ");
    expect(sample?.note).toContain("[업써요]");
  });
  it("すべて音節か単語を読み、口の注意を添える", () => {
    for (const group of Object.values(letterSoundData).flat()) {
      for (const sample of group.samples) {
        expect(sample.text).toMatch(/^[가-힣]+$/u);
        expect(sample.note.length).toBeGreaterThan(0);
      }
    }
  });
});
