export { SpeakableText } from "./SpeakableText";
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
import { AudioEngine, koreanVoices, preferredVoice, sentences } from "./engine";
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
      new AudioEngine(synth, (uri) =>
        uri !== undefined
          ? voicesRef.current.find((v) => v.voiceURI === uri)
          : (voicesRef.current.find((v) => v.voiceURI === selectedRef.current) ??
            preferredVoice(voicesRef.current)),
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
  const request = useRef(0);
  useEffect(() => {
    const unregister = player.registerExternalStop(() => {
      request.current++;
      setError(false);
    });
    return () => {
      request.current++;
      unregister();
    };
  }, [player.registerExternalStop]);
  const play = async (value: string, data?: AudioData, complete = false) => {
    setError(false);
    const pending = player.play(value, data, { rate, repeat, allowFallback });
    const id = ++request.current;
    let success = false;
    try {
      success = await pending;
    } catch {
      // Interrupted requests are discarded below.
    }
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
      <details className="audio-options">
        <summary>再生オプション</summary>
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
      </details>
      {error && <p role="status">音声を再生できませんでした。端末の音声設定を確認してください。</p>}
    </div>
  );
}
export function AudioDiagnostics() {
  const { voices, selected, select, refresh, play, stop, supported } = useAudio();
  const [error, setError] = useState(false);
  const request = useRef(0);
  const previewing = useRef(false);
  useEffect(
    () => () => {
      request.current++;
      if (previewing.current) stop();
    },
    [stop],
  );
  const active = voices.find((voice) => voice.voiceURI === selected) ?? preferredVoice(voices);
  const preview = async (uri: string) => {
    const id = ++request.current;
    previewing.current = true;
    setError(false);
    const success = await play("안녕하세요. 만나서 반갑습니다.", undefined, { voiceURI: uri });
    if (id === request.current) {
      previewing.current = false;
      if (!success) setError(true);
    }
  };
  return (
    <section>
      <p>
        端末やブラウザーで使える韓国語の合成音声を自動で選びます。声が複数ある場合は聞き比べて選べます。
      </p>
      {!supported ? (
        <p>このブラウザーは読み上げに対応していません。</p>
      ) : (
        <>
          {selected && !voices.some((voice) => voice.voiceURI === selected) && (
            <p>保存した声は現在利用できません。利用可能な声を一時的に使用します。</p>
          )}
          {active && (
            <p>
              現在の声：{active.name}（{active.localService ? "端末" : "ネットワーク"}）
            </p>
          )}
          {voices.length > 0 && (
            <>
              <label>
                韓国語の声{" "}
                <select value={active?.voiceURI ?? ""} onChange={(e) => select(e.target.value)}>
                  {voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang}・{voice.localService ? "端末" : "ネットワーク"})
                    </option>
                  ))}
                </select>
              </label>
              <p>
                試聴文：<span lang="ko">안녕하세요. 만나서 반갑습니다.</span>
              </p>
              <ul>
                {voices.map((voice) => (
                  <li key={voice.voiceURI}>
                    {voice.name}（{voice.localService ? "端末" : "ネットワーク"}）{" "}
                    <button
                      type="button"
                      aria-label={`${voice.name}の声を試聴`}
                      onClick={() => void preview(voice.voiceURI)}
                    >
                      この声を試聴
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {voices.length === 0 && (
            <p>
              韓国語の声を取得中、または利用できません。iPhoneでは設定の「アクセシビリティ」→「リーダーと読み上げ」（旧版では「読み上げコンテンツ」）→「声」、Windowsでは言語の設定で韓国語の読み上げ音声を確認してください。ブラウザーを再起動し、再検出して試聴します。音量と出力先も確認してください。端末に声を追加してもブラウザーで使えるとは限りません。手順は実機未確認です。
            </p>
          )}
          <button type="button" onClick={refresh}>
            再検出
          </button>
          <button
            type="button"
            onClick={() => {
              request.current++;
              previewing.current = false;
              stop();
              setError(false);
            }}
          >
            停止
          </button>
          {error && <p role="status">試聴できませんでした。声や音量、出力先を確認してください。</p>}
        </>
      )}
    </section>
  );
}
