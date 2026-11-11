import { useState } from "react";
import { createRoot } from "react-dom/client";
import { AudioProvider } from "../../../src/features/audio";
import { RoleplayView } from "../../../src/features/roleplay";
import { newProgress, type Progress } from "../../../src/domain/progress";

const roleplay = {
  scenario: "テスト場面",
  turns: [
    {
      partner: {
        korean: "가요?",
        japanese: "行きますか",
        audio: {
          text: "가요?",
          source: "テスト音声",
          license: "test",
          voice: "test",
          status: "checked" as const,
        },
      },
      goal: "答える",
      responseExamples: [
        { korean: "네", japanese: "はい" },
        { korean: "아니요", japanese: "いいえ" },
      ],
      rubric: ["意思を伝えたか"],
    },
    {
      partner: { korean: "언제요?", japanese: "いつですか" },
      goal: "時間を伝える",
      responseExamples: [
        { korean: "내일", japanese: "明日" },
        { korean: "오늘", japanese: "今日" },
      ],
      rubric: ["時間を伝えたか"],
    },
  ],
};
function Fixture() {
  const [progress, setProgress] = useState<Progress>(
    () => JSON.parse(localStorage.getItem("roleplay-test") ?? "null") ?? newProgress(),
  );
  const update = (fn: (p: Progress) => Progress) =>
    setProgress((p) => {
      const next = fn(p);
      localStorage.setItem("roleplay-test", JSON.stringify(next));
      return next;
    });
  return (
    <AudioProvider>
      <RoleplayView lessonId="day-29" roleplay={roleplay} progress={progress} update={update} />
    </AudioProvider>
  );
}
createRoot(document.getElementById("root")!).render(<Fixture />);
