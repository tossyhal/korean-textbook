import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { AudioEngine, koreanVoices, sentences } from "./engine";
import type { AudioData, PlayOptions } from "./engine";
export type { AudioData, PlayOptions } from "./engine";

type AudioContextValue = {
  voices: SpeechSynthesisVoice[];
  selected: string;
  select: (uri: string) => void;
  refresh: () => void;
  play: (text: string, audio?: AudioData, options?: PlayOptions) => Promise<boolean>;
  stop: () => void;
  registerExternalStop: (stop: () => void) => () => void;
  beginRecording: () => boolean;
  endRecording: () => void;
  beginExternalPlayback: () => boolean;
  supported: boolean;
};
const Context = createContext<AudioContextValue | null>(null);
export function AudioProvider({ children }: { children: ReactNode }) {
  const synth =
    typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selected, setSelected] = useState(() => {
    try {
      return localStorage.getItem("korean-voice-uri") ?? "";
    } catch {
      return "";
    }
  });
  const voicesRef = useRef(voices);
  voicesRef.current = voices;
  const selectedRef = useRef(selected);
  const externalStops = useRef(new Set<() => void>());
  const recording = useRef(false);
  selectedRef.current = selected;
  const engine = useMemo(
    () =>
      new AudioEngine(
        synth,
        () =>
          voicesRef.current.find((v) => v.voiceURI === selectedRef.current) ?? voicesRef.current[0],
      ),
    [synth],
  );
  const refresh = useCallback(() => setVoices(koreanVoices(synth?.getVoices() ?? [])), [synth]);
  useEffect(() => {
    refresh();
    synth?.addEventListener("voiceschanged", refresh);
    return () => {
      synth?.removeEventListener("voiceschanged", refresh);
      engine.stop();
    };
  }, [synth, refresh, engine]);
  const select = useCallback((uri: string) => {
    setSelected(uri);
    try {
      localStorage.setItem("korean-voice-uri", uri);
    } catch {
      /* storage is optional */
    }
  }, []);
  const stop = useCallback(() => {
    engine.stop();
    externalStops.current.forEach((stopExternal) => stopExternal());
  }, [engine]);
  const registerExternalStop = useCallback((stopExternal: () => void) => {
    externalStops.current.add(stopExternal);
    return () => {
      externalStops.current.delete(stopExternal);
    };
  }, []);
  const beginRecording = useCallback(() => {
    if (recording.current) return false;
    stop();
    recording.current = true;
    return true;
  }, [stop]);
  const endRecording = useCallback(() => {
    recording.current = false;
  }, []);
  const beginExternalPlayback = useCallback(() => {
    if (recording.current) return false;
    stop();
    return true;
  }, [stop]);
  const play = useCallback(
    (text: string, audio?: AudioData, options?: PlayOptions) => {
      if (recording.current) return Promise.resolve(false);
      stop();
      return engine.play(text, audio, options);
    },
    [engine, stop],
  );
  const value = useMemo(
    () => ({
      voices,
      selected,
      select,
      refresh,
      play,
      stop,
      registerExternalStop,
      beginRecording,
      endRecording,
      beginExternalPlayback,
      supported: !!synth,
    }),
    [
      voices,
      selected,
      select,
      refresh,
      play,
      stop,
      registerExternalStop,
      beginRecording,
      endRecording,
      beginExternalPlayback,
      synth,
    ],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAudio() {
  const value = useContext(Context);
  if (!value) throw new Error("AudioProviderが必要です");
  return value;
}
export function AudioButton({
  text,
  audio,
  onPlaybackComplete,
  allowFallback = true,
}: {
  text: string;
  audio?: AudioData;
  onPlaybackComplete?: () => void;
  allowFallback?: boolean;
}) {
  const player = useAudio();
  const [rate, setRate] = useState(1);
  const [repeat, setRepeat] = useState(1);
  const [error, setError] = useState(false);
  const [source, setSource] = useState<"file" | "tts" | null>(null);
  const request = useRef(0);
  useEffect(
    () => () => {
      request.current++;
      player.stop();
    },
    [player.stop],
  );
  const play = async (value: string, data?: AudioData, complete = false) => {
    const id = ++request.current;
    setError(false);
    setSource(null);
    const success = await player.play(value, data, {
      rate,
      repeat,
      allowFallback,
      onSource: setSource,
    });
    if (id !== request.current) return;
    if (success && complete) onPlaybackComplete?.();
    if (!success) setError(true);
  };
  return (
    <div>
      <button type="button" onClick={() => void play(text, audio, true)}>
        音声を再生
      </button>{" "}
      <button
        type="button"
        onClick={() => {
          request.current++;
          player.stop();
          setError(false);
        }}
      >
        停止
      </button>{" "}
      <label>
        速度{" "}
        <select value={rate} onChange={(e) => setRate(Number(e.target.value))}>
          <option value={1}>通常</option>
          <option value={0.75}>ゆっくり</option>
        </select>
      </label>{" "}
      <label>
        繰り返し{" "}
        <select value={repeat} onChange={(e) => setRepeat(Number(e.target.value))}>
          <option value={1}>1回</option>
          <option value={2}>2回</option>
          <option value={3}>3回</option>
        </select>
      </label>
      {sentences(text).length > 1 && (
        <div>
          {sentences(text).map((s, i) => (
            <button type="button" key={`${i}-${s}`} onClick={() => void play(s)}>
              文{i + 1}を再生
            </button>
          ))}
        </div>
      )}
      <small>
        {source === "tts"
          ? "端末の韓国語合成音声を再生しました。音声の内容は未確認です。"
          : source === "file" && audio
            ? `再生した音声：${audio.source}（${audio.status === "checked" ? "確認済み" : "未確認"}）。`
            : audio?.path
              ? `音声：${audio.source}（${audio.status === "checked" ? "確認済み" : "未確認"}）。${allowFallback ? "利用できない場合は合成音声を使用します。" : "合成音声への切り替えは行いません。"}`
              : "端末の韓国語合成音声を使用します。音声の内容は未確認です。"}
      </small>
      {error && (
        <p role="status">音声を再生できませんでした。音声診断で韓国語の声を確認してください。</p>
      )}
    </div>
  );
}
export function AudioDiagnostics() {
  const { voices, selected, select, refresh, play, stop, supported } = useAudio();
  return (
    <section>
      <h2>音声診断</h2>
      <p>端末の合成音声を使用します。発音の品質は未確認です。</p>
      {!supported ? (
        <p>このブラウザーは読み上げに対応していません。</p>
      ) : (
        <>
          <label>
            韓国語の声{" "}
            <select
              value={
                voices.some((v) => v.voiceURI === selected) ? selected : (voices[0]?.voiceURI ?? "")
              }
              onChange={(e) => select(e.target.value)}
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </label>
          {voices.length === 0 && (
            <p>
              韓国語の声を取得中、または利用できません。端末の韓国語音声を追加して再検出してください。
            </p>
          )}
          <button type="button" onClick={refresh}>
            再検出
          </button>
          <button type="button" onClick={() => void play("안녕하세요.")}>
            試聴
          </button>
          <button type="button" onClick={stop}>
            停止
          </button>
        </>
      )}
    </section>
  );
}
