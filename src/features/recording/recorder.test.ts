import { afterEach, describe, expect, it, vi } from "vitest";
import { RecordingSession, recordingError, supportedMimeType } from "./recorder";

afterEach(() => vi.unstubAllGlobals());
describe("録音", () => {
  it("対応形式を検出する", () => {
    const recorder = {
      isTypeSupported: (type: string) => type === "audio/mp4",
    } as unknown as typeof MediaRecorder;
    expect(supportedMimeType(recorder)).toBe("audio/mp4");
  });
  it("拒否を日本語で説明する", () => {
    expect(recordingError(new DOMException("", "NotAllowedError"))).toContain("許可されません");
  });
  it("許可待ちの画面離脱後に得たトラックを停止する", async () => {
    let deliver!: (stream: MediaStream) => void;
    const getUserMedia = vi.fn(
      () =>
        new Promise<MediaStream>((resolve) => {
          deliver = resolve;
        }),
    );
    vi.stubGlobal("window", { isSecureContext: true });
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } });
    vi.stubGlobal("MediaRecorder", class {});
    const stop = vi.fn();
    const session = new RecordingSession();
    const pending = session.start(vi.fn());
    session.dispose();
    deliver({ getTracks: () => [{ stop }] } as unknown as MediaStream);
    await pending;
    expect(stop).toHaveBeenCalledOnce();
  });
  it("安全でない接続ではマイクを要求しない", async () => {
    vi.stubGlobal("window", { isSecureContext: false });
    await expect(new RecordingSession().start(vi.fn())).rejects.toThrow("HTTPS");
  });
  it("録音停止でトラックを停止し、実際の形式でBlobを作る", async () => {
    const stop = vi.fn();
    const stream = { getTracks: () => [{ stop }] } as unknown as MediaStream;
    class FakeRecorder {
      static isTypeSupported(type: string) {
        return type === "audio/mp4";
      }
      state = "inactive";
      mimeType = "audio/mp4";
      ondataavailable?: (event: { data: Blob }) => void;
      onstop?: () => void;
      start() {
        this.state = "recording";
      }
      stop() {
        this.state = "inactive";
        this.ondataavailable?.({ data: new Blob(["sample"]) });
        this.onstop?.();
      }
    }
    vi.stubGlobal("window", { isSecureContext: true });
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia: async () => stream } });
    vi.stubGlobal("MediaRecorder", FakeRecorder);
    const complete = vi.fn();
    const session = new RecordingSession();
    await session.start(complete);
    session.stop();
    expect(stop).toHaveBeenCalled();
    expect(complete.mock.calls[0][0].type).toBe("audio/mp4");
  });
});
