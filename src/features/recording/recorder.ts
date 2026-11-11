export const recordingTypes = [
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/ogg;codecs=opus",
  "audio/webm",
];
export function supportedMimeType(recorder: typeof MediaRecorder): string | undefined {
  return recordingTypes.find((type) => recorder.isTypeSupported(type));
}
export function stopTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}
export function recordingError(error: unknown): string {
  if (
    error instanceof Error &&
    (error.name === "NotAllowedError" || error.name === "SecurityError")
  )
    return "マイクの使用が許可されませんでした。ブラウザーの設定を確認してください。";
  return "録音を開始できませんでした。マイクとブラウザーの設定を確認してください。";
}
export class RecordingSession {
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private generation = 0;
  finalizing = false;
  async start(onComplete: (blob: Blob) => void): Promise<void> {
    if (!window.isSecureContext)
      throw new Error("録音にはHTTPSまたはlocalhostの安全な接続が必要です。");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined")
      throw new Error("このブラウザーは録音に対応していません。");
    const generation = ++this.generation;
    this.finalizing = false;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (generation !== this.generation) {
      stopTracks(stream);
      return;
    }
    this.stream = stream;
    try {
      const mimeType = supportedMimeType(MediaRecorder);
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      this.recorder = recorder;
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onstop = () => {
        if (generation === this.generation) this.finalizing = false;
        stopTracks(stream);
        if (generation === this.generation)
          onComplete(
            new Blob(chunks, { type: recorder.mimeType || mimeType || "application/octet-stream" }),
          );
      };
      recorder.start();
    } catch (error) {
      stopTracks(stream);
      this.stream = null;
      throw error;
    }
  }
  stop() {
    if (this.recorder?.state === "recording") {
      this.finalizing = true;
      this.recorder.stop();
    }
    stopTracks(this.stream);
    this.stream = null;
  }
  dispose() {
    this.generation++;
    this.stop();
    this.finalizing = false;
  }
}

export function cancelUnlessFinalizing(session: RecordingSession | null, cancel: () => void) {
  if (!session?.finalizing) cancel();
}
