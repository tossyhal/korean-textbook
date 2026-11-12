import { useEffect, useRef, useState } from "react";
import { useAudio } from "./index";
import type { AudioData } from "./engine";
import "./speakableText.css";

const letterNames: Record<string, string> = {
  ㄱ: "기역",
  ㄲ: "쌍기역",
  ㄳ: "기역시옷",
  ㄴ: "니은",
  ㄵ: "니은지읒",
  ㄶ: "니은히읗",
  ㄷ: "디귿",
  ㄸ: "쌍디귿",
  ㄹ: "리을",
  ㄺ: "리을기역",
  ㄻ: "리을미음",
  ㄼ: "리을비읍",
  ㄽ: "리을시옷",
  ㄾ: "리을티읕",
  ㄿ: "리을피읖",
  ㅀ: "리을히읗",
  ㅁ: "미음",
  ㅂ: "비읍",
  ㅃ: "쌍비읍",
  ㅄ: "비읍시옷",
  ㅅ: "시옷",
  ㅆ: "쌍시옷",
  ㅇ: "이응",
  ㅈ: "지읒",
  ㅉ: "쌍지읒",
  ㅊ: "치읓",
  ㅋ: "키읔",
  ㅌ: "티읕",
  ㅍ: "피읖",
  ㅎ: "히읗",
};
const vowels = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";

export function letterName(text: string): string | undefined {
  if (letterNames[text]) return letterNames[text];
  const vowel = vowels.indexOf(text);
  if (text.length === 1 && vowel >= 0) return String.fromCharCode(0xac00 + 11 * 588 + vowel * 28);
  return undefined;
}

export function SpeakableText({
  text,
  audio,
  onPlaybackComplete,
  sampleText,
}: {
  text: string;
  audio?: AudioData;
  onPlaybackComplete?: () => void;
  sampleText?: string;
}) {
  const player = useAudio();
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const request = useRef(0);
  const active = useRef(false);
  const name = letterName(text);
  const example = sampleText ?? name ?? text;
  useEffect(
    () =>
      player.registerExternalStop(() => {
        request.current++;
        active.current = false;
        setPlaying(false);
      }),
    [player.registerExternalStop],
  );
  useEffect(
    () => () => {
      request.current++;
      if (active.current) player.stop();
    },
    [player.stop],
  );
  const play = async () => {
    if (playing) {
      player.stop();
      return;
    }
    setError(false);
    let pending: Promise<boolean>;
    try {
      pending = player.play(example, audio);
    } catch {
      active.current = false;
      setPlaying(false);
      setError(true);
      return;
    }
    const id = ++request.current;
    active.current = true;
    setPlaying(true);
    let success = false;
    try {
      success = await pending;
    } catch {
      // A stopped or replaced request is ignored below.
    }
    if (id !== request.current) return;
    active.current = false;
    setPlaying(false);
    if (success) onPlaybackComplete?.();
    else setError(true);
  };
  const label =
    sampleText && sampleText !== text
      ? `${text}の音節・単語例${sampleText}を聞く`
      : name
        ? `${text}の名前${name}を聞く`
        : `${text}を聞く`;
  return (
    <span className="speakable-wrap">
      <button
        type="button"
        className="speakable-text"
        lang="ko"
        aria-label={playing ? `${label}（再生中、停止）` : label}
        title={label}
        onClick={() => void play()}
      >
        {text}
      </button>
      {error && (
        <span role="status" className="speakable-error">
          音声を再生できません。音声設定を確認してください。
        </span>
      )}
    </span>
  );
}
