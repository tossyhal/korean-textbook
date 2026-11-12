import { useState } from "react";
import { SpeakableText } from "../audio/SpeakableText";

const initials = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");
const vowels = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");
const basicInitials = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ";
const basicVowels = "ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ";
const finals = [
  ["なし", 0],
  ["ㄱ", 1],
  ["ㄴ", 4],
  ["ㄷ", 7],
  ["ㄹ", 8],
  ["ㅁ", 16],
  ["ㅂ", 17],
  ["ㅇ", 21],
] as const;

/** Unicode 3.12.3: modern Hangul syllable composition. */
export function composeHangul(initial: number, vowel: number, final: number) {
  return String.fromCodePoint(0xac00 + (initial * 21 + vowel) * 28 + final);
}

export function HangulBuilder({ day }: { day: number }) {
  const [initial, setInitial] = useState(0);
  const [vowel, setVowel] = useState(0);
  const [final, setFinal] = useState(0);
  const syllable = composeHangul(initial, vowel, final);
  const finalLetter = finals.find((item) => item[1] === final)?.[0];
  const horizontal = "ㅗㅛㅜㅠㅡ".includes(vowels[vowel]);
  const compound = "ㅘㅙㅚㅝㅞㅟㅢ".includes(vowels[vowel]);
  return (
    <section id="hangul-builder">
      <h2>文字を組み立てる</h2>
      <p>字母を選んで、一つの音節になる形を見てみましょう。入力の練習には下の練習欄を使います。</p>
      <div className="hangul-builder">
        <div className="hangul-builder-controls">
          <label>
            初声（最初の子音）
            <select value={initial} onChange={(e) => setInitial(Number(e.target.value))}>
              {initials.map(
                (letter, index) =>
                  (day > 1 || basicInitials.includes(letter)) && (
                    <option key={letter} value={index} lang="ko">
                      {letter}
                    </option>
                  ),
              )}
            </select>
          </label>
          <label>
            中声（母音）
            <select value={vowel} onChange={(e) => setVowel(Number(e.target.value))}>
              {vowels.map(
                (letter, index) =>
                  (day > 1 || basicVowels.includes(letter)) && (
                    <option key={letter} value={index} lang="ko">
                      {letter}
                    </option>
                  ),
              )}
            </select>
          </label>
          {day >= 3 && (
            <label>
              終声（パッチム）
              <select value={final} onChange={(e) => setFinal(Number(e.target.value))}>
                {finals.map(([letter, index]) => (
                  <option key={letter} value={index} lang={index === 0 ? undefined : "ko"}>
                    {letter}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div className="hangul-builder-result" aria-live="polite">
          <figure
            className={`hangul-parts ${horizontal ? "horizontal" : ""} ${compound ? "compound" : ""}`}
            aria-label={`初声 ${initials[initial]}、中声 ${vowels[vowel]}${final ? `、終声 ${finalLetter}` : ""}`}
          >
            <span lang="ko">{initials[initial]}</span>
            <span lang="ko">{vowels[vowel]}</span>
            {final > 0 && (
              <span lang="ko" className="hangul-final">
                {finalLetter}
              </span>
            )}
          </figure>
          <span className="hangul-equals" aria-hidden="true">
            →
          </span>
          <output className="hangul-syllable" aria-label={`組み立てた音節 ${syllable}`}>
            <SpeakableText text={syllable} />
          </output>
        </div>
        <p>
          初声と中声を組み合わせ{final ? "、下に終声を置き" : ""}、一つの音節にします。
          {compound
            ? "この複合母音は上下と左右を組み合わせた形です。"
            : horizontal
              ? "この母音は初声の下に置きます。"
              : "この母音は初声の右に置きます。"}
        </p>
        <p>
          初声の<span lang="ko">ㅇ</span>は音を出さず、母音から始めます。終声の
          <span lang="ko">ㅇ</span>は鼻に抜ける音です。
        </p>
      </div>
    </section>
  );
}
