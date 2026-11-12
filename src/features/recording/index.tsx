import { useEffect, useRef, useState } from "react";
import { useAudio } from "../audio";
import type { AudioData } from "../audio";
import { RecordingSession, recordingError, cancelUnlessFinalizing } from "./recorder";

export function Recorder({ sampleText, audio }: { sampleText: string; audio?: AudioData }) {
  const player = useAudio();
  const session = useRef<RecordingSession | null>(null);
  const [status, setStatus] = useState<"idle" | "requesting" | "recording" | "finalizing">("idle");
  const [url, setUrl] = useState("");
  const [mime, setMime] = useState("");
  const [error, setError] = useState("");
  const mounted = useRef(false);
  const selfAudio = useRef<HTMLAudioElement | null>(null);
  const startingSelfAudio = useRef(false);
  const sequence = useRef(0);
  useEffect(() => {
    mounted.current = true;
    const current = new RecordingSession();
    session.current = current;
    return () => {
      mounted.current = false;
      sequence.current++;
      current.dispose();
      selfAudio.current?.pause();
      player.stop();
    };
  }, [player.stop]);
  useEffect(
    () =>
      player.registerExternalStop(() => {
        cancelUnlessFinalizing(session.current, () => {
          sequence.current++;
          if (!startingSelfAudio.current) selfAudio.current?.pause();
          session.current?.dispose();
          player.endRecording();
          if (mounted.current) setStatus("idle");
        });
      }),
    [player.registerExternalStop, player.endRecording],
  );
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  const start = async () => {
    setError("");
    if (!player.beginRecording()) return;
    setStatus("requesting");
    const id = ++sequence.current;
    try {
      await session.current?.start((blob) => {
        if (!mounted.current) return;
        setMime(blob.type);
        setUrl(URL.createObjectURL(blob));
        setStatus("idle");
        player.endRecording();
      });
      if (mounted.current && id === sequence.current) setStatus("recording");
    } catch (err) {
      if (mounted.current && id === sequence.current) {
        player.endRecording();
        setError(
          err instanceof Error &&
            (err.message.includes("HTTPS") || err.message.includes("対応していません"))
            ? err.message
            : recordingError(err),
        );
        setStatus("idle");
      }
    }
  };
  const compare = async () => {
    ++sequence.current;
    selfAudio.current?.pause();
    const playback = player.play(sampleText, audio);
    const id = sequence.current;
    if (!(await playback) || id !== sequence.current || !selfAudio.current) {
      if (id === sequence.current)
        setError("手本を再生できませんでした。音声設定を確認してください。");
      return;
    }
    try {
      if (!player.beginExternalPlayback()) return;
      selfAudio.current.currentTime = 0;
      await selfAudio.current.play();
    } catch {
      setError("録音を再生できませんでした。");
    }
  };
  const stop = () => {
    sequence.current++;
    if (status === "recording") {
      setStatus("finalizing");
      session.current?.stop();
    } else player.stop();
  };
  const extension = mime.includes("mp4")
    ? "m4a"
    : mime.includes("ogg")
      ? "ogg"
      : mime.includes("webm")
        ? "webm"
        : "bin";
  return (
    <section>
      <h3>録音して比べる</h3>
      <p>録音はこの画面のメモリに保持され、送信されません。自動採点は行いません。</p>
      <p>
        {audio?.path
          ? "手本は音声ファイル、または再生できない場合は端末の韓国語合成音声を使います。音声内容と発音の品質は未確認です。"
          : "手本は端末の韓国語合成音声です。音声内容と発音の品質は未確認です。"}
      </p>
      <button type="button" disabled={status !== "idle"} onClick={() => void start()}>
        録音開始
      </button>
      <button type="button" disabled={status !== "recording"} onClick={stop}>
        録音停止
      </button>
      {status === "requesting" && <p>マイクの許可を待っています。</p>}
      {status === "recording" && <p>録音中</p>}
      {status === "finalizing" && <p>録音を保存しています。</p>}
      {error && <p role="alert">{error}</p>}
      {url && (
        <>
          <audio
            ref={selfAudio}
            controls
            src={url}
            onPlay={(event) => {
              startingSelfAudio.current = true;
              const allowed = player.beginExternalPlayback();
              startingSelfAudio.current = false;
              if (!allowed) event.currentTarget.pause();
            }}
          />
          <button type="button" disabled={status !== "idle"} onClick={() => void compare()}>
            手本と録音を順に再生
          </button>
          <button type="button" onClick={stop}>
            再生を停止
          </button>
          <a href={url} download={`recording.${extension}`}>
            録音をダウンロード
          </a>
        </>
      )}
      <fieldset>
        <legend>自分で確認</legend>
        <label>
          <input type="checkbox" />
          母音を余計に足していない
        </label>
        <label>
          <input type="checkbox" />
          語尾まで言えた
        </label>
        <label>
          <input type="checkbox" />
          今回の発音の注意を意識できた
        </label>
      </fieldset>
    </section>
  );
}
