import { describe, expect, it } from "vitest";
import { composeHangul } from "./HangulBuilder";

describe("ハングル音節の合成", () => {
  it("基本音節、濃音と複合母音、終声を合成する", () => {
    expect(composeHangul(0, 0, 0)).toBe("가");
    expect(composeHangul(1, 9, 0)).toBe("꽈");
    expect(composeHangul(18, 0, 4)).toBe("한");
    expect(composeHangul(11, 20, 21)).toBe("잉");
  });
});
