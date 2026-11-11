import { createRoot } from "react-dom/client";
import { AudioProvider } from "../../../src/features/audio";
import { ListeningTransfer } from "../../../src/features/listening-transfer";

createRoot(document.getElementById("root")!).render(
  <AudioProvider>
    <ListeningTransfer
      onSelfCheck={(run) => localStorage.setItem("voice-transfer-test", JSON.stringify(run))}
      transfer={{
        sameSentence: { korean: "안녕하세요", japanese: "こんにちは" },
        newSentence: { korean: "감사합니다", japanese: "ありがとうございます" },
      }}
    />
  </AudioProvider>,
);
