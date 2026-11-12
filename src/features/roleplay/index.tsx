import { KoreanText } from "../../components/KoreanText";
import type { Lesson } from "../../domain/content";
import type { Progress } from "../../domain/progress";
import { AudioButton } from "../audio";
import { SpeakableText } from "../audio/SpeakableText";
import { Recorder } from "../recording";

type Roleplay = NonNullable<Lesson["roleplay"]>;

export function RoleplayView({
  lessonId,
  roleplay,
  progress,
  update,
}: {
  lessonId: string;
  roleplay: Roleplay;
  progress: Progress;
  update: (fn: (progress: Progress) => Progress) => void;
}) {
  const saved = progress.roleplay[lessonId];
  const turnIndex = saved && saved.turn < roleplay.turns.length ? saved.turn : 0;
  const turn = roleplay.turns[turnIndex];
  const setTurn = (index: number) =>
    update((p) => ({
      ...p,
      roleplay: {
        ...p.roleplay,
        [lessonId]: { turn: index, drafts: p.roleplay[lessonId]?.drafts ?? [] },
      },
    }));
  return (
    <section id="roleplay">
      <h2>ロールプレイ</h2>
      <p>
        <KoreanText text={roleplay.scenario} />
      </p>
      <p>
        相手の音声を聞き、返答を考えて録音します。次の発話へは自分で進みます。音声や録音が使えない場合は未実施のまま先に進めます。AIによる自動評価はありません。
      </p>
      <div key={turnIndex}>
        <h3>
          やり取り {turnIndex + 1}/{roleplay.turns.length}
        </h3>
        <AudioButton text={turn.partner.korean} audio={turn.partner.audio} />
        <details>
          <summary>相手の原文と訳を見る</summary>
          <p lang="ko">{turn.partner.korean}</p>
          <p>
            <KoreanText text={turn.partner.japanese} />
          </p>
          {turn.partner.note && (
            <p>
              <KoreanText text={turn.partner.note} />
            </p>
          )}
        </details>
        <p>
          返答の条件：
          <KoreanText text={turn.goal} />
        </p>
        <label>
          返答の下書き
          <textarea
            value={saved?.drafts[turnIndex] ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              update((p) => {
                const drafts = [...(p.roleplay[lessonId]?.drafts ?? [])];
                while (drafts.length <= turnIndex) drafts.push("");
                drafts[turnIndex] = value;
                return {
                  ...p,
                  roleplay: { ...p.roleplay, [lessonId]: { turn: turnIndex, drafts } },
                };
              });
            }}
          />
        </label>
        <Recorder
          sampleText={turn.responseExamples[0].korean}
          audio={turn.responseExamples[0].audio}
        />
        <details>
          <summary>回答例を見る</summary>
          {turn.responseExamples.map((example, index) => (
            <div key={index}>
              <p>
                <SpeakableText text={example.korean} audio={example.audio} />
              </p>
              <p>
                <KoreanText text={example.japanese} />
              </p>
              {example.note && (
                <p>
                  <KoreanText text={example.note} />
                </p>
              )}
            </div>
          ))}
        </details>
        <h4>自己確認</h4>
        <ul>
          {turn.rubric.map((item, index) => (
            <li key={index}>
              <KoreanText text={item} />
            </li>
          ))}
        </ul>
      </div>
      <div className="actions">
        <button type="button" disabled={turnIndex === 0} onClick={() => setTurn(turnIndex - 1)}>
          前のやり取り
        </button>
        <button
          type="button"
          disabled={turnIndex === roleplay.turns.length - 1}
          onClick={() => setTurn(turnIndex + 1)}
        >
          次のやり取り
        </button>
      </div>
    </section>
  );
}
