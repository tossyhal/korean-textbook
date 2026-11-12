import { useEffect, useRef, useState } from "react";
import { useAudio } from "../audio";
import { letterSoundData } from "./letterSoundData";
import "./letterSoundGuide.css";

export function LetterSoundGuide({ day }: { day: number }) {
  const audio = useAudio();
  const [playing, setPlaying] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const request = useRef(0);
  useEffect(
    () =>
      audio.registerExternalStop(() => {
        request.current++;
        setPlaying(null);
      }),
    [audio.registerExternalStop],
  );
  useEffect(
    () => () => {
      request.current++;
      audio.stop();
    },
    [audio.stop],
  );

  const play = async (text: string) => {
    setError(false);
    const pending = audio.play(text);
    const id = ++request.current;
    setPlaying(text);
    const success = await pending;
    if (request.current !== id) return;
    setPlaying(null);
    if (!success) setError(true);
  };

  return (
    <section id="letter-sound-guide">
      <h2>字母の音を聞く</h2>
      <p>
        字母を含む音節や単語で聞きます。端末の合成音声は実聴未確認で、微細な音の違いの採点には使いません。
      </p>
      <button
        type="button"
        onClick={() => {
          audio.stop();
          setError(false);
        }}
      >
        停止
      </button>
      <p role="status">
        {error ? (
          "再生できませんでした。音声設定で韓国語の声を確認してください。"
        ) : playing ? (
          <>
            再生中：<span lang="ko">{playing}</span>
          </>
        ) : (
          ""
        )}
      </p>
      {letterSoundData[day]?.map((group) => (
        <div key={group.title}>
          <h3>{group.title}</h3>
          <ul className="letter-sound-list">
            {group.samples.map((sample, index) => (
              <li key={`${sample.letter}-${sample.text}-${index}`}>
                <span lang="ko" className="letter-sound-letter">
                  {sample.letter}
                </span>
                <span lang="ko" className="letter-sound-example">
                  {sample.text}
                </span>
                <span>{sample.note}</span>
                <button
                  type="button"
                  aria-label={`${sample.letter}の見本 ${sample.text}を聞く`}
                  onClick={() => void play(sample.text)}
                >
                  聞く
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
