import { describe, expect, it } from "vitest";
import { letterName } from "./SpeakableText";

describe("字母の名前", () => {
  it("子音と母音の名前を返す", () => {
    expect(letterName("ㄱ")).toBe("기역");
    expect(letterName("ㅏ")).toBe("아");
    expect(letterName("ㅢ")).toBe("의");
    expect(letterName("안녕")).toBeUndefined();
  });
});
