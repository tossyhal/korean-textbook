import { KoreanText } from "../../components/KoreanText";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAudio } from "../audio";
import { Recorder } from "../recording";

export type VoiceTransfer = {
  sameSentence: { korean: string; japanese: string };
  newSentence: { korean: string; japanese: string };
};

export function distinctVoices(voices: SpeechSynthesisVoice[]) {
  return voices.filter(
    (voice, index) =>
      voice.voiceURI && voices.findIndex((v) => v.voiceURI === voice.voiceURI) === index,
  );
}

export function ListeningTransfer({
  transfer,
  saved,
  onSelfCheck,
}: {
  transfer: VoiceTransfer;
  saved?: { modelURI: string; alternateURI: string; at: string; selfChecked: true };
  onSelfCheck: (run: {
    modelURI: string;
    alternateURI: string;
    at: string;
    selfChecked: true;
  }) => void;
}) {
  const player = useAudio();
  const voices = useMemo(() => distinctVoices(player.voices), [player.voices]);
  const [model, setModel] = useState("");
  const [alternate, setAlternate] = useState("");
  const [heard, setHeard] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");
  const request = useRef(0);
  const valid =
    !!model &&
    !!alternate &&
    model !== alternate &&
    voices.some((v) => v.voiceURI === model) &&
    voices.some((v) => v.voiceURI === alternate);
  useEffect(
    () => () => {
      request.current++;
      player.stop();
    },
    [player.stop],
  );
  const reset = () => {
    request.current++;
    player.stop();
    setHeard([]);
    setRevealed(false);
    setMessage("");
  };
  const play = async (key: string, text: string, uri: string) => {
    const id = ++request.current;
    setMessage("再生中");
    const success = await player.play(text, undefined, { voiceURI: uri });
    if (request.current !== id) return;
    if (success) setHeard((previous) => (previous.includes(key) ? previous : [...previous, key]));
    setMessage(
      success
        ? "再生が終わりました。"
        : "再生できませんでした。未実施です。音声を確認して再試行できます。",
    );
  };
  const complete = valid && ["model", "same", "new"].every((key) => heard.includes(key));
  return (
    <section id="voice-transfer">
      <h2>別の合成音声で聞く</h2>
      <p>同じ文を2種類の合成音声で聞き比べます。</p>
      <p>
        利用できる声：
        {voices.length ? voices.map((v) => `${v.name} (${v.lang})`).join("、") : "なし"}
      </p>
      {voices.length < 2 && (
        <p role="status">
          異なる声が2つ必要です。この練習は未実施・得点なしです。他の学習は続けられます。
        </p>
      )}
      <button type="button" onClick={player.refresh}>
        声を再検出
      </button>
      <label>
        手本の声
        <select
          value={model}
          onChange={(event) => {
            reset();
            setModel(event.target.value);
          }}
        >
          <option value="">選択してください</option>
          {voices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
      </label>
      <label>
        別の合成音声
        <select
          value={alternate}
          onChange={(event) => {
            reset();
            setAlternate(event.target.value);
          }}
        >
          <option value="">選択してください</option>
          {voices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
      </label>
      {model && alternate && model === alternate && (
        <p>異なる声を選択してください。同じ声は別の合成音声として扱えません。</p>
      )}
      <p>
        手本：{voices.find((v) => v.voiceURI === model)?.name ?? "未選択"}／別の合成音声：
        {voices.find((v) => v.voiceURI === alternate)?.name ?? "未選択"}
      </p>
      <p>手本、別の声による同じ文、別の文を聞き、意味や聞き取った文を書きます。</p>
      <div className="actions">
        <button
          type="button"
          disabled={!valid}
          onClick={() => void play("model", transfer.sameSentence.korean, model)}
        >
          手本を聞く
        </button>
        <button
          type="button"
          disabled={!valid}
          onClick={() => void play("same", transfer.sameSentence.korean, alternate)}
        >
          別の声で同じ文を聞く
        </button>
        <button
          type="button"
          disabled={!valid}
          onClick={() => void play("new", transfer.newSentence.korean, alternate)}
        >
          別の声で別の文を聞く
        </button>
        <button
          type="button"
          onClick={() => {
            request.current++;
            player.stop();
            setMessage("停止しました。再生が終わっていない音声は未実施です。");
          }}
        >
          停止
        </button>
      </div>
      <p role="status">{message}</p>
      <label>
        聞き取った内容
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} />
      </label>
      <button type="button" onClick={() => setRevealed(true)}>
        原文と訳を見て照合
      </button>
      {revealed && (
        <div>
          <p lang="ko">{transfer.sameSentence.korean}</p>
          <p>
            <KoreanText text={transfer.sameSentence.japanese} />
          </p>
          <p lang="ko">{transfer.newSentence.korean}</p>
          <p>
            <KoreanText text={transfer.newSentence.japanese} />
          </p>
          <p>原文を見ながら復唱し、録音と聞き比べましょう。自己確認であり自動採点はありません。</p>
          <Recorder sampleText={transfer.newSentence.korean} />
        </div>
      )}
      {complete && revealed && (
        <button
          type="button"
          onClick={() =>
            onSelfCheck({
              modelURI: model,
              alternateURI: alternate,
              at: new Date().toISOString(),
              selfChecked: true,
            })
          }
        >
          照合と復唱を自己確認した
        </button>
      )}
      {saved && (
        <p>
          別の合成音声での照合と復唱を自己確認済みです（{new Date(saved.at).toLocaleString()}）。
        </p>
      )}
      <p>
        {complete
          ? "3つの再生が終了しました。照合と復唱を自分で確認してください。得点はありません。"
          : "今回の別の合成音声の練習は未実施です。得点はありません。"}
      </p>
    </section>
  );
}
