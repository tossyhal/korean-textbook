import { useEffect, useRef, useState } from "react";
import { KoreanText } from "./components/KoreanText";
import { productionSpeakingModel } from "./domain/content";
import { lessons } from "./content";
import type { Lesson, Question } from "./domain/content";
import { contentIds } from "./domain/validate-content";
import {
  dueReviews,
  gradeAnswer,
  newProgress,
  nextStage,
  resumeLesson,
  scheduleReview,
  summarize,
  summarizeProduction,
} from "./domain/progress";
import type { Progress } from "./domain/progress";
import { exportBackup, parseBackup, tryLoadProgress, trySaveProgress } from "./storage/backup";
import { AudioButton, AudioDiagnostics, AudioProvider, useAudio } from "./features/audio";
import { RoleplayView } from "./features/roleplay";
import { ListeningTransfer } from "./features/listening-transfer";
import { diagnosticQuestions } from "./features/assessment/bank";
import { displayOptions } from "./features/assessment/options";
import { assessmentScopes, makeRecommendations, skillLabels } from "./features/assessment/results";
import { Recorder } from "./features/recording";
import { addManualReview, removeManualReview } from "./features/review/manual";
import { HangulBuilder } from "./features/learning/HangulBuilder";
import { LetterSoundGuide } from "./features/learning/LetterSoundGuide";
import { KeyboardPage, PronunciationPage } from "./features/reference";
import "./features/learning/style.css";

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const questions = (l: Lesson) => [...l.recall, ...l.exercises, ...l.exitTest];
const ids = contentIds(lessons);
const link = (path: string) => `#/${path}`;
const ko = (text: string) => (
  <KoreanText
    text={text
      .replace(/第(\d+)課/g, (_, day: string) => lessonLabel(Number(day)))
      .replace(/第([1-8])週/g, "第$1章")}
  />
);
const lessonLabel = (day: number) =>
  `第${Math.floor((day - 1) / 7) + 1}章第${((day - 1) % 7) + 1}節`;
const chapterTitles = [
  "文字と基本表現",
  "時制・疑問・依頼",
  "説明を広げる",
  "日常の構文",
  "旅行や外出",
  "自分のことを伝える",
  "音と処理速度",
  "統合して確認する",
];
type LessonTab = "text" | "practice" | "production" | "exit" | "sources";
const tabs: [LessonTab, string][] = [
  ["text", "本文"],
  ["practice", "練習"],
  ["production", "作文・発話"],
  ["exit", "確認テスト"],
  ["sources", "出典・メモ"],
];
const tabForPosition = (id?: string): LessonTab =>
  id === "exercises" || id === "roleplay" || id === "voice-transfer" || id === "recall"
    ? "practice"
    : id === "production"
      ? "production"
      : id === "exit"
        ? "exit"
        : id === "sources"
          ? "sources"
          : "text";

type Update = (fn: (p: Progress) => Progress) => void;
function AppContent() {
  const [route, setRoute] = useState(() => location.hash.slice(2) || "home");
  const [loaded] = useState(() => tryLoadProgress(localStorage));
  const [progress, setProgress] = useState<Progress>(() =>
    loaded.ok ? (loaded.value ?? newProgress()) : newProgress(),
  );
  const [error, setError] = useState(loaded.ok ? "" : loaded.error);
  const [writable, setWritable] = useState(loaded.ok);
  const audio = useAudio();
  const voiceReady = useRef(false);
  useEffect(() => {
    if (!voiceReady.current) {
      voiceReady.current = true;
      if (progress.settings.voice !== undefined) audio.select(progress.settings.voice);
      return;
    }
    if (writable && progress.settings.voice !== audio.selected)
      update((p) => ({ ...p, settings: { ...p.settings, voice: audio.selected } }));
  }, [audio.selected]);
  useEffect(() => {
    const change = () => {
      audio.stop();
      setRoute(location.hash.slice(2) || "home");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, [audio.stop]);
  const update: Update = (fn) =>
    setProgress((p) => {
      const next = fn(p);
      if (writable) {
        const result = trySaveProgress(localStorage, next);
        setError(result.ok ? "" : result.error);
      }
      return next;
    });
  const [routePath, target] = route.split("?");
  const lesson = lessons.find((l) => `lesson/${l.id}` === routePath);
  return (
    <>
      <header className="site-header">
        <a className="brand" href={link("home")}>
          韓国語の教科書
        </a>
        <nav aria-label="主なメニュー">
          <a href={link("lessons")}>目次</a>
          <a href={link("review")}>復習</a>
          <a href={link("results")}>学習結果</a>
          <a href={link("reference")}>語彙・文法</a>
          <a href={link("pronunciation")}>発音</a>
          <a href={link("keyboard")}>入力</a>
          <a href={link("settings")}>設定</a>
        </nav>
      </header>
      {error && (
        <div role="alert" className="notice">
          {error} {!writable && "設定から有効なバックアップを読み込むまで自動保存しません。"}
        </div>
      )}
      {lesson ? (
        <LessonPage
          key={`${lesson.id}-${target ?? ""}`}
          lesson={lesson}
          progress={progress}
          update={update}
          target={target}
        />
      ) : route === "lessons" ? (
        <Contents progress={progress} />
      ) : route === "review" ? (
        <ReviewPage progress={progress} update={update} />
      ) : route === "diagnostic" ? (
        <Contents progress={progress} />
      ) : route === "results" ? (
        <ResultsPage progress={progress} />
      ) : route === "reference" ? (
        <Reference progress={progress} update={update} />
      ) : route === "pronunciation" ? (
        <PronunciationPage />
      ) : route === "keyboard" ? (
        <KeyboardPage
          drafts={progress.drafts}
          onDraftChange={(id, value) =>
            update((p) => ({ ...p, drafts: { ...p.drafts, [id]: value } }))
          }
        />
      ) : route === "settings" ? (
        <Settings
          progress={progress}
          update={update}
          apply={(p) => {
            const result = trySaveProgress(localStorage, p);
            if (result.ok) {
              setProgress(p);
              if (p.settings.voice !== undefined) audio.select(p.settings.voice);
              setWritable(true);
              setError("");
            } else setError(result.error);
          }}
        />
      ) : (
        <Home progress={progress} update={update} />
      )}
    </>
  );
}
function Home({ progress, update }: { progress: Progress; update: Update }) {
  const current = resumeLesson(lessons, progress);
  return (
    <main>
      <h1>今日の学習</h1>
      <p>自分のペースで進めましょう。節はいつでも開けます。</p>
      {current ? (
        <p>
          <a className="primary" href={link(`lesson/${current.id}`)}>
            続きから学ぶ：{lessonLabel(current.day)} {ko(current.title)}
          </a>
        </p>
      ) : (
        <p>教材を準備しています。</p>
      )}
      <p>
        <a href={link("review")}>今日の復習：{dueReviews(progress.reviews, today()).length}件</a>
      </p>
      {dueReviews(progress.reviews, today()).length > 20 && (
        <p>
          復習が20件を超えています。今日は新出を控え、復習を20件まで優先しましょう。節はいつでも開けます。
        </p>
      )}
      <p>
        <a href={link("results")}>技能別の学習結果を見る</a>
      </p>
      <h2>学習時間の目安</h2>
      <fieldset>
        <legend>今日の時間</legend>
        {([60, 90, 120] as const).map((n) => (
          <label className="inline" key={n}>
            <input
              type="radio"
              name="mode"
              checked={progress.settings.mode === n}
              onChange={() => update((p) => ({ ...p, settings: { ...p.settings, mode: n } }))}
            />
            {n}分
          </label>
        ))}
      </fieldset>
      <p>60分では一部を次回に繰り越します。90分と同じ内容を同じ日数で終える目安ではありません。</p>
      {current && (
        <ul>
          {current.modes[progress.settings.mode].map((x) => (
            <li key={x}>{ko(x)}</li>
          ))}
        </ul>
      )}
      <p>
        <a href={link("lessons")}>すべての節を見る</a>
      </p>
    </main>
  );
}
function Contents({ progress }: { progress: Progress }) {
  return (
    <main>
      <h1>目次</h1>
      {Array.from({ length: 8 }, (_, i) => (
        <section key={i}>
          <h2>
            第{i + 1}章 {chapterTitles[i]}
          </h2>
          <ol className="contents-list">
            {Array.from({ length: 7 }, (_, j) => {
              const day = i * 7 + j + 1;
              const l = lessons.find((x) => x.day === day);
              return (
                <li key={day}>
                  {l ? (
                    <a href={link(`lesson/${l.id}`)}>
                      <span>
                        第{j + 1}節 {ko(l.title)}
                      </span>
                      <span className="lesson-status">
                        <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          {progress.completedLessons.includes(l.id) ? (
                            <path
                              d="m5.5 10 3 3 6-6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            />
                          ) : progress.positions[l.id] ? (
                            <path
                              d="M10 4v6l4 2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          ) : (
                            <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                          )}
                        </svg>
                        {progress.completedLessons.includes(l.id)
                          ? "完了"
                          : progress.positions[l.id]
                            ? "学習中"
                            : "未着手"}
                      </span>
                    </a>
                  ) : day === 55 ? (
                    "準備中（弱点を確認して最終復習）"
                  ) : day === 56 ? (
                    "準備中（技能別の最終評価）"
                  ) : (
                    "準備中"
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </main>
  );
}
function ReviewControl({
  id,
  progress,
  update,
}: {
  id: string;
  progress: Progress;
  update: Update;
}) {
  const registered = progress.reviews.some((review) => review.id === id);
  return (
    <span>
      {" "}
      {registered && "登録済み "}
      <button
        type="button"
        onClick={() =>
          update((p) => ({
            ...p,
            reviews: registered
              ? removeManualReview(p.reviews, id)
              : addManualReview(p.reviews, id, today()),
          }))
        }
      >
        {registered ? "復習から外す" : "復習に追加"}
      </button>
    </span>
  );
}
function QuestionView({
  q,
  progress,
  update,
}: {
  q: Question;
  progress: Progress;
  update: Update;
}) {
  const [composing, setComposing] = useState(false);
  const [played, setPlayed] = useState(false);
  const [playError, setPlayError] = useState(false);
  const [rate, setRate] = useState(1);
  const [repeat, setRepeat] = useState(1);
  const [shown, setShown] = useState(false);
  const audio = useAudio();
  const unavailable = Boolean(q.requiresVerifiedAudio && q.audio?.status !== "checked");
  const answer = progress.drafts[q.id] ?? "";
  const attempts = progress.attempts.filter((a) => a.questionId === q.id);
  const last = attempts.at(-1);
  const viewed = progress.answerViewedQuestionIds.includes(q.id);
  const setAnswer = (value: string) =>
    update((p) => ({ ...p, drafts: { ...p.drafts, [q.id]: value } }));
  const check = () => {
    if (composing || unavailable || !answer.trim() || (q.type === "listening" && !played)) return;
    const result = gradeAnswer(q, answer);
    const at = new Date().toISOString();
    update((p) => ({
      ...p,
      answerViewedQuestionIds: p.answerViewedQuestionIds.includes(q.id)
        ? p.answerViewedQuestionIds
        : [...p.answerViewedQuestionIds, q.id],
      attempts: [
        ...p.attempts,
        {
          questionId: q.id,
          answer,
          result,
          stage: nextStage(p.attempts, q.id, p.answerViewedQuestionIds.includes(q.id)),
          at,
        },
      ],
      reviews:
        result === "incorrect"
          ? [
              ...p.reviews,
              ...[q.id, ...q.tags]
                .filter((id) => !p.reviews.some((r) => r.id === id))
                .map((id) => ({ id, due: today(), interval: 0 })),
            ]
          : p.reviews,
    }));
    setShown(true);
  };
  const reveal = () => {
    update((p) => ({
      ...p,
      answerViewedQuestionIds: p.answerViewedQuestionIds.includes(q.id)
        ? p.answerViewedQuestionIds
        : [...p.answerViewedQuestionIds, q.id],
    }));
    setShown(true);
  };
  return (
    <div className="question" id={q.id}>
      <p>
        <strong>{ko(q.prompt)}</strong>
      </p>
      {unavailable && <p>重要な音声が未確認のため、この問題は未実施です。</p>}
      {q.type === "listening" && (
        <div>
          <button
            type="button"
            onClick={() =>
              void (async () => {
                setPlayError(false);
                const ok = q.audio
                  ? await audio.play(q.audio.text, q.audio, {
                      allowFallback: !q.requiresVerifiedAudio,
                      rate,
                      repeat,
                    })
                  : false;
                setPlayed(ok);
                setPlayError(!ok);
              })()
            }
          >
            問題の音声を再生
          </button>{" "}
          <button type="button" onClick={audio.stop}>
            停止
          </button>
          <label>
            速度
            <select value={rate} onChange={(e) => setRate(Number(e.target.value))}>
              <option value={1}>通常</option>
              <option value={0.75}>ゆっくり</option>
            </select>
          </label>
          <label>
            繰り返し
            <select value={repeat} onChange={(e) => setRepeat(Number(e.target.value))}>
              <option value={1}>1回</option>
              <option value={2}>2回</option>
              <option value={3}>3回</option>
            </select>
          </label>
          <p>音声の内容は未確認です。再生できない場合は未実施のままにできます。</p>
          {playError && (
            <p role="status">
              再生できませんでした。<a href={link("settings")}>音声設定</a>を確認してください。
            </p>
          )}
        </div>
      )}
      {q.type === "choice" || (q.type === "listening" && q.options) ? (
        <fieldset>
          <legend>回答を選ぶ</legend>
          {q.options &&
            displayOptions(q.id, q.options).map((o) => (
              <label className="option" key={o}>
                <input
                  type="radio"
                  name={q.id}
                  checked={answer === o}
                  onChange={() => setAnswer(o)}
                />
                {ko(o)}
              </label>
            ))}
        </fieldset>
      ) : q.type === "self" ? (
        <>
          <p>自動採点はしません。次の項目を確認して記録してください。</p>
          <ul>
            {q.rubric?.map((x) => (
              <li key={x}>{ko(x)}</li>
            ))}
          </ul>
          <label>
            自分の回答
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={() => setComposing(false)}
            />
          </label>
        </>
      ) : (
        <label>
          回答
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => setComposing(false)}
          />
          {q.type === "ordering" && <small>並べた結果を入力してください。</small>}
        </label>
      )}
      <div className="actions">
        <button
          type="button"
          disabled={
            composing || unavailable || !answer.trim() || (q.type === "listening" && !played)
          }
          onClick={check}
        >
          {q.type === "self" ? "自己評価を記録" : "答え合わせ"}
        </button>
        <button type="button" onClick={reveal}>
          答えを見る
        </button>
      </div>
      {shown && (
        <div role="status">
          {last && (
            <p>
              <strong>
                {last.result === "correct"
                  ? "正解"
                  : last.result === "incorrect"
                    ? "もう一度確認"
                    : "自己評価を記録しました"}
              </strong>
              （{last.stage === "first" ? "初回" : last.stage === "retry" ? "再挑戦" : "答え閲覧後"}
              ）
            </p>
          )}
          {(viewed || last) && (
            <>
              <p>
                答え：
                {q.answers.length
                  ? q.answers.map((answer, i) => (
                      <span key={answer}>
                        {i > 0 && "、"}
                        {ko(answer)}
                      </span>
                    ))
                  : "自由回答"}
              </p>
              <p>{ko(q.explanation)}</p>
              <ReviewControl id={q.id} progress={progress} update={update} />
              {q.type === "listening" && q.audio && (
                <details>
                  <summary>音声の原文を確認</summary>
                  <p lang="ko">{q.audio.text}</p>
                  <p>原文を閉じて再び聞き、書き取りや復唱を試しましょう。</p>
                </details>
              )}
              <p>
                {q.tags.map((id) => {
                  const item = lessons
                    .flatMap((lesson) => [...lesson.vocabulary, ...lesson.grammar])
                    .find((term) => term.id === id);
                  const source = item && lessons.find((lesson) => lesson.day === item.firstDay);
                  if (!source || !item) return null;
                  const name = "name" in item ? item.name : item.korean;
                  const sectionId = "name" in item ? (item.sectionId ?? "section-0") : "vocabulary";
                  return (
                    <a key={id} href={link(`lesson/${source.id}?${sectionId}`)}>
                      {ko(name)}の本文（{lessonLabel(source.day)}）{" "}
                    </a>
                  );
                })}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
function LessonPage({
  lesson: l,
  progress,
  update,
  target,
}: {
  lesson: Lesson;
  progress: Progress;
  update: Update;
  target?: string;
}) {
  const checks = progress.productionChecks[l.id] ?? [];
  const selfChecked =
    l.production.rubric.every((_, i) => checks[i]) &&
    checks[l.production.rubric.length] &&
    checks[l.production.rubric.length + 1];
  const [hideKorean, setHideKorean] = useState(false);
  const [hideJapanese, setHideJapanese] = useState(false);
  const initialPosition = useRef<string | undefined>(target ?? progress.positions[l.id]);
  const [activeTab, setActiveTab] = useState<LessonTab>(() =>
    tabForPosition(initialPosition.current),
  );
  const audio = useAudio();
  const selectTab = (tab: LessonTab, position?: string) => {
    audio.stop();
    setActiveTab(tab);
    mark(
      position ??
        (
          {
            text: "objectives",
            practice: "recall",
            production: "production",
            exit: "exit",
            sources: "sources",
          } as const
        )[tab],
    );
  };
  useEffect(() => {
    update((p) => (p.lastLessonId === l.id ? p : { ...p, lastLessonId: l.id }));
    if (initialPosition.current) {
      document.getElementById(initialPosition.current)?.scrollIntoView();
      initialPosition.current = undefined;
    }
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const observer = new IntersectionObserver(
      () => {
        const focused =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const rect = focused?.getBoundingClientRect();
        const visible =
          (rect &&
            rect.bottom > 0 &&
            rect.top < window.innerHeight &&
            focused?.closest("main section[id]")) ||
          sections
            .filter((section) => {
              const bounds = section.getBoundingClientRect();
              return (
                bounds.bottom > window.innerHeight * 0.1 && bounds.top < window.innerHeight * 0.3
              );
            })
            .at(-1);
        if (visible)
          update((p) =>
            p.positions[l.id] === visible.id
              ? p
              : {
                  ...p,
                  lastLessonId: l.id,
                  positions: { ...p.positions, [l.id]: visible.id },
                },
          );
      },
      { rootMargin: "-10% 0px -70% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [l.id, activeTab]);
  const mark = (id: string) =>
    update((p) => ({ ...p, lastLessonId: l.id, positions: { ...p.positions, [l.id]: id } }));
  const summary = summarize(l.exitTest, progress.attempts);
  const productionSummary = summarizeProduction(checks, l.production.rubric.length);
  const productionDone = progress.drafts[`${l.id}`]?.trim();
  const complete = () =>
    update((p) => ({
      ...p,
      completedLessons: p.completedLessons.includes(l.id)
        ? p.completedLessons
        : [...p.completedLessons, l.id],
      reviews: [
        ...p.reviews,
        ...l.reviewTargets
          .filter((id) => !p.reviews.some((r) => r.id === id))
          .map((id) => ({ id, due: today(), interval: 0 })),
      ],
    }));
  const examples = (items: Lesson["examples"]) =>
    items.map((e, i) => (
      <div className="example" key={i}>
        {!hideKorean && (
          <p lang="ko" className="korean">
            {e.korean}
          </p>
        )}
        {!hideJapanese && <p>{ko(e.japanese)}</p>}
        {e.note && <p>{ko(e.note)}</p>}
        <AudioButton text={e.korean} audio={e.audio} />
      </div>
    ));
  return (
    <div className="lesson-layout">
      <main
        onClick={(e) => {
          const section = (e.target as HTMLElement).closest("section[id]");
          if (section && progress.positions[l.id] !== section.id) mark(section.id);
        }}
        onFocus={(e) => {
          const section = (e.target as HTMLElement).closest("section[id]");
          if (section && progress.positions[l.id] !== section.id) mark(section.id);
        }}
      >
        <h1>
          {lessonLabel(l.day)} {ko(l.title)}
        </h1>
        <div
          className="lesson-tabs"
          role="tablist"
          aria-label="節の内容"
          onKeyDown={(e) => {
            const index = tabs.findIndex(([id]) => id === activeTab);
            const next =
              e.key === "ArrowRight"
                ? (index + 1) % tabs.length
                : e.key === "ArrowLeft"
                  ? (index + tabs.length - 1) % tabs.length
                  : e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? tabs.length - 1
                      : -1;
            if (next >= 0) {
              e.preventDefault();
              selectTab(tabs[next][0]);
              document.getElementById(`tab-${tabs[next][0]}`)?.focus();
            }
          }}
        >
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-controls={`panel-${id}`}
              aria-selected={activeTab === id}
              tabIndex={activeTab === id ? 0 : -1}
              onClick={() => selectTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          tabIndex={0}
          id="panel-text"
          aria-labelledby="tab-text"
          hidden={activeTab !== "text"}
        >
          <section id="objectives" onClick={() => mark("objectives")}>
            <h2>今日できるようになること</h2>
            <ul>
              {l.objectives.map((x) => (
                <li key={x}>{ko(x)}</li>
              ))}
            </ul>
          </section>
          {l.sections.map((s, i) => (
            <section id={`section-${i}`} key={i} onClick={() => mark(`section-${i}`)}>
              <h2>{ko(s.heading)}</h2>
              {s.paragraphs.map((p, j) => (
                <p key={j}>{ko(p)}</p>
              ))}
            </section>
          ))}
          {l.day <= 3 && activeTab === "text" && <LetterSoundGuide key="guide" day={l.day} />}
          {l.day <= 3 && <HangulBuilder key="builder" day={l.day} />}
          <section id="vocabulary">
            <h2>語彙</h2>
            {l.vocabulary.length ? (
              <ul>
                {l.vocabulary.map((v) => (
                  <li key={v.id}>
                    <span lang="ko">{v.korean}</span>：{v.meaning}（{v.partOfSpeech}、辞書形
                    <span lang="ko">{v.dictionaryForm}</span>、{lessonLabel(v.firstDay)}）
                    <ReviewControl id={v.id} progress={progress} update={update} />
                  </li>
                ))}
              </ul>
            ) : (
              <p>語彙の登録はありません。</p>
            )}
          </section>
          <fieldset>
            <legend>例文と会話の表示</legend>
            <label className="inline">
              <input
                type="checkbox"
                checked={hideKorean}
                onChange={(e) => setHideKorean(e.target.checked)}
              />
              原文を隠す
            </label>
            <label className="inline">
              <input
                type="checkbox"
                checked={hideJapanese}
                onChange={(e) => setHideJapanese(e.target.checked)}
              />
              訳を隠す
            </label>
          </fieldset>
          <section id="examples">
            <h2>例文</h2>
            {examples(l.examples)}
          </section>
          <section id="dialogue">
            <h2>会話・読解</h2>
            {examples(l.dialogue)}
          </section>
        </div>
        <div
          role="tabpanel"
          tabIndex={0}
          id="panel-practice"
          aria-labelledby="tab-practice"
          hidden={activeTab !== "practice"}
        >
          <section id="recall">
            <h2>前の内容を復習</h2>
            {l.recall.length ? (
              l.recall.map((q) => (
                <QuestionView key={q.id} q={q} progress={progress} update={update} />
              ))
            ) : (
              <p>復習問題はありません。</p>
            )}
          </section>
          <section id="exercises">
            <h2>練習</h2>
            {l.exercises.map((q) => (
              <QuestionView key={q.id} q={q} progress={progress} update={update} />
            ))}
          </section>
          {activeTab === "practice" && l.roleplay && (
            <RoleplayView
              lessonId={l.id}
              roleplay={l.roleplay}
              progress={progress}
              update={update}
            />
          )}
          {l.voiceTransfer && (
            <ListeningTransfer
              transfer={l.voiceTransfer}
              saved={progress.voiceTransferRuns[l.id]}
              onSelfCheck={(run) =>
                update((p) => ({
                  ...p,
                  voiceTransferRuns: { ...p.voiceTransferRuns, [l.id]: run },
                }))
              }
            />
          )}
        </div>
        <div
          role="tabpanel"
          tabIndex={0}
          id="panel-production"
          aria-labelledby="tab-production"
          hidden={activeTab !== "production"}
        >
          <section id="production">
            <h2>作文・発話</h2>
            <p>{ko(l.production.prompt)}</p>
            <label>
              自分の文章
              <textarea
                value={progress.drafts[l.id] ?? ""}
                onChange={(e) =>
                  update((p) => ({ ...p, drafts: { ...p.drafts, [l.id]: e.target.value } }))
                }
              />
            </label>
            <details>
              <summary>模範例と自己確認</summary>
              <p>{ko(l.production.model)}</p>
              {l.production.rubric.map((x, i) => (
                <label key={x}>
                  <input
                    type="checkbox"
                    checked={checks[i] ?? false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      update((p) => ({
                        ...p,
                        productionChecks: {
                          ...p.productionChecks,
                          [l.id]: Array.from({ length: l.production.rubric.length + 2 }, (_, j) =>
                            j === i ? checked : (p.productionChecks[l.id]?.[j] ?? false),
                          ),
                        },
                      }));
                    }}
                  />
                  {ko(x)}
                </label>
              ))}
            </details>
            {activeTab === "production" && (
              <Recorder sampleText={productionSpeakingModel(l.production)} />
            )}
            {["作文を自己評価した", "発話を自己評価した"].map((label, offset) => (
              <label key={label}>
                <input
                  type="checkbox"
                  checked={checks[l.production.rubric.length + offset] ?? false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    update((p) => ({
                      ...p,
                      productionChecks: {
                        ...p.productionChecks,
                        [l.id]: Array.from({ length: l.production.rubric.length + 2 }, (_, i) =>
                          i === l.production.rubric.length + offset
                            ? checked
                            : (p.productionChecks[l.id]?.[i] ?? false),
                        ),
                      },
                    }));
                  }}
                />
                {label}
              </label>
            ))}
          </section>
          {l.day === 55 && (
            <p>
              <a href={link("results")}>学習履歴から弱点と復習先を確認する</a>　
              <a href={link("review")}>今日の復習へ</a>
            </p>
          )}
        </div>
        <div
          role="tabpanel"
          tabIndex={0}
          id="panel-exit"
          aria-labelledby="tab-exit"
          hidden={activeTab !== "exit"}
        >
          <section id="exit">
            <h2>確認テスト</h2>
            <p>
              練習とは別の問題です。8割は学習の目安で、公式認定ではありません。結果に関係なく次の節に進めます。
            </p>
            {l.exitTest.map((q) => (
              <QuestionView key={q.id} q={q} progress={progress} update={update} />
            ))}
            <p>
              初回の自力正答：{summary.firstCorrect}/{summary.firstAttempted}問。実施
              {summary.attempted}/{summary.total}問、未実施{summary.unattempted}問、答え閲覧後に回答
              {summary.afterAnswer}問。
            </p>
            <ul>
              {(
                [
                  ["reading", "読解"],
                  ["listening", "聴解"],
                  ["typing", "入力"],
                  ["writing", "作文"],
                  ["speaking", "発話"],
                ] as const
              ).map(([skill, label]) => {
                const result = summary.bySkill[skill];
                return (
                  <li key={skill}>
                    {label}：初回正答{result.firstCorrect}/{result.firstAttempted}、実施
                    {result.attempted}/{result.total}、自己評価{result.self.attempted}/
                    {result.self.total}
                    {(skill === "writing" || skill === "speaking") && (
                      <>
                        、作文・発話の自己評価{productionSummary[skill].checked}/
                        {productionSummary[skill].total}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
            <p>
              作文・発話の自己確認：{productionSummary.rubric.checked}/
              {productionSummary.rubric.total}
              項目。作文・発話は自己評価です。節の完了は成績認定ではありません。
            </p>
            {l.day === 56 && (
              <p>
                <a href={link("results")}>技能別結果と次の2〜4週間の復習案を見る</a>
              </p>
            )}
            <button
              type="button"
              disabled={
                !summary.complete ||
                !productionDone ||
                !selfChecked ||
                (!!l.voiceTransfer && !progress.voiceTransferRuns[l.id])
              }
              onClick={complete}
            >
              この節を完了する
            </button>
            {(!summary.complete || !productionDone || !selfChecked) && (
              <p>出口テストをすべて実施し、作文と発話を自己評価してから完了できます。</p>
            )}
            {l.voiceTransfer && !progress.voiceTransferRuns[l.id] && (
              <p>別の合成音声での練習を自己確認してから完了できます。</p>
            )}
            {progress.completedLessons.includes(l.id) && <p>完了済みです。</p>}
          </section>
        </div>
        <div
          role="tabpanel"
          tabIndex={0}
          id="panel-sources"
          aria-labelledby="tab-sources"
          hidden={activeTab !== "sources"}
        >
          <section id="sources">
            <h2>出典と確認状況</h2>
            <p>
              言語内容：{l.languageStatus === "checked" ? "確認済み" : "未確認"}／音声：
              {l.audioStatus === "checked" ? "確認済み" : "未確認"}
            </p>
            <ul>
              {l.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url}>{s.name}</a>（{s.checkedAt}、
                  {s.status === "checked" ? "確認済み" : "未確認"}）：{s.checked}
                </li>
              ))}
            </ul>
            <label>
              メモ
              <textarea
                value={progress.notes[l.id] ?? ""}
                onChange={(e) =>
                  update((p) => ({ ...p, notes: { ...p.notes, [l.id]: e.target.value } }))
                }
              />
            </label>
          </section>
        </div>
        {lessons.find((x) => x.day === l.day + 1) && (
          <p>
            <a
              className="primary"
              href={link(`lesson/${lessons.find((x) => x.day === l.day + 1)?.id}`)}
            >
              次の節へ
            </a>
          </p>
        )}
      </main>
    </div>
  );
}
function ResultsPage({ progress }: { progress: Progress }) {
  const scopes = assessmentScopes(lessons, progress);
  const [scope, setScope] = useState(
    () => [...scopes].reverse().find((item) => item.attempted)?.id ?? "all",
  );
  const selected = scopes.find((item) => item.id === scope);
  const evaluated = selected ? lessons.filter((lesson) => lesson.id === selected.id) : lessons;
  const { result, production, skills } = makeRecommendations(lessons, progress, evaluated);
  const weak = lessons
    .filter((l) =>
      [
        ...l.vocabulary.filter((x) => x.firstDay === l.day),
        ...l.grammar.filter((x) => x.firstDay === l.day),
        ...questions(l),
      ].some((x) => progress.reviews.some((r) => r.id === x.id && r.due <= today())),
    )
    .slice(0, 5);
  return (
    <main>
      <h1>技能別の学習結果</h1>
      <label>
        評価範囲
        <select value={scope} onChange={(event) => setScope(event.target.value)}>
          <option value="all">全履歴</option>
          {scopes.map((item) => (
            <option key={item.id} value={item.id}>
              {lessonLabel(item.day)}の確認テスト{item.attempted ? "" : "（未実施）"}
            </option>
          ))}
        </select>
      </label>
      <p>
        {selected ? `${lessonLabel(selected.day)}の確認テスト` : "全履歴（各節の出口テスト）"}
        ：自動採点の実施{result.attempted}/{result.total}問、未実施{result.unattempted}
        問。未実施は0点として扱いません。
      </p>
      <p>自動採点の初回自力回答と問題の自己評価を表示します。公式な資格認定ではありません。</p>
      <ul>
        {(
          [
            ["reading", "読解"],
            ["listening", "聴解"],
            ["typing", "入力"],
            ["writing", "作文"],
            ["speaking", "発話"],
          ] as const
        ).map(([skill, label]) => {
          const r = result.bySkill[skill];
          return (
            <li key={skill}>
              {label}：
              {r.firstAttempted ? `初回正答${r.firstCorrect}/${r.firstAttempted}` : "初回未実施"}
              、未実施{r.unattempted}問、問題の自己評価{r.self.attempted}/{r.self.total}
            </li>
          );
        })}
      </ul>
      <p>
        節の自己評価：作文チェック{production.writing}/{evaluated.length}件、発話チェック
        {production.speaking}/{evaluated.length}件。 自動採点とは別の自己確認です。
      </p>
      <h2>復習先</h2>
      {weak.length ? (
        <ul>
          {weak.map((l) => (
            <li key={l.id}>
              <a href={link(`lesson/${l.id}`)}>
                {lessonLabel(l.day)} {ko(l.title)}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>期限到来の弱点はありません。未実施の節も確認しましょう。</p>
      )}
      <p>
        <a href={link("review")}>期限の来た復習へ</a>
      </p>
      <h2>次の2〜4週間</h2>
      <p>
        1週目は上の期限到来の復習を1日最大20件行い、間違えた節の本文に戻ります。期限到来がなければ、以下の未実施の技能から確認しましょう。
      </p>
      {skills.some((item) => item.missed.length > 0) && (
        <p>
          初回に間違えた節：
          {Array.from(
            new Map(
              skills.flatMap((item) => item.missed).map((lesson) => [lesson.id, lesson]),
            ).values(),
          )
            .slice(0, 5)
            .map((lesson) => (
              <span key={lesson.id}>
                {" "}
                <a href={link(`lesson/${lesson.id}`)}>{lessonLabel(lesson.day)}</a>
              </span>
            ))}
        </p>
      )}
      <p>
        2週目は技能ごとに次の練習を選びます。初回回答が5問未満で対象問題が残る場合は、判定を急がず回答を増やします。
      </p>
      <ul>
        {skills.map(({ skill, state, related, recommended }) => (
          <li key={skill}>
            {skillLabels[skill]}：
            {state === "unattempted"
              ? "未実施をまず確認"
              : state === "more"
                ? "回答を増やして確認"
                : state === "review"
                  ? "初回正答が8割未満のため復習を優先"
                  : "8割以上のため別文や別声への転移を練習"}
            。
            {skill === "writing" &&
              production.writing === 0 &&
              "作文課題の自己確認も試しましょう。"}
            {skill === "speaking" &&
              production.speaking === 0 &&
              "発話課題の自己確認も試しましょう。"}
            {skill === "reading" && "本文や初見の短文を読んで内容を確かめます。"}
            {skill === "listening" && "音声を聞いて内容を確かめます。"}
            {skill === "typing" && "韓国語を入力して確認します。"}
            {skill === "writing" && "課題を入力して自己確認します。"}
            {skill === "speaking" && "課題を声に出して自己確認します。"}
            {recommended.map((lesson) => (
              <span key={lesson.id}>
                {" "}
                <a href={link(`lesson/${lesson.id}`)}>{lessonLabel(lesson.day)}</a>
              </span>
            ))}
            {!related.length && "関連する出口テストは収録されていません。"}
          </li>
        ))}
      </ul>
      <p>
        3〜4週目は間隔を空けて再評価し、別文や利用可能な別の声で確かめましょう。作文と発話は課題のチェック項目を使って自己評価します。
      </p>
      {lessons.some((lesson) => lesson.day >= 43) && (
        <p>収録済みの第7章以降も技能練習や再評価に活用しましょう。</p>
      )}
      <ul>
        {lessons
          .filter((lesson) => lesson.day >= 43)
          .map((lesson) => (
            <li key={lesson.id}>
              <a href={link(`lesson/${lesson.id}`)}>
                {lessonLabel(lesson.day)} {ko(lesson.title)}
              </a>
            </li>
          ))}
      </ul>
    </main>
  );
}
function ReviewPage({ progress, update }: { progress: Progress; update: Update }) {
  const day = today();
  const history = progress.reviewHistory.filter((x) => x.day === day);
  const done = new Set(history.filter((x) => x.outcome !== "viewed").map((x) => x.id));
  const viewed = new Set<string>();
  for (const entry of progress.reviewHistory) {
    if (entry.outcome === "viewed") viewed.add(entry.id);
    else viewed.delete(entry.id);
  }
  const due = dueReviews(progress.reviews, day).filter((r) => !done.has(r.id));
  const remaining = Math.max(0, 20 - done.size);
  return (
    <main>
      <h1>復習</h1>
      <p>
        今日の予定は{due.length}件、今日あと{remaining}件まで取り組めます。
      </p>
      {due.slice(0, remaining).map((r) => {
        const v = lessons.flatMap((l) => l.vocabulary).find((x) => x.id === r.id);
        const g = lessons.flatMap((l) => l.grammar).find((x) => x.id === r.id);
        const q = [...lessons.flatMap(questions), ...diagnosticQuestions].find(
          (x) => x.id === r.id,
        );
        const diagnosticGrammar =
          q && diagnosticQuestions.includes(q)
            ? lessons.flatMap((l) => l.grammar).find((item) => q.tags.includes(item.id))
            : undefined;
        const source = lessons.find(
          (l) =>
            (v && l.day === v.firstDay) ||
            (g && l.day === g.firstDay) ||
            (diagnosticGrammar && l.day === diagnosticGrammar.firstDay) ||
            questions(l).some((x) => x.id === r.id),
        );
        const related = g && source && questions(source).find((x) => x.tags.includes(r.id));
        return (
          <div className="question" key={r.id}>
            <p>{ko(v?.korean ?? (g ? (related?.prompt ?? g.name) : (q?.prompt ?? r.id)))}</p>
            {q?.type === "listening" && q.audio && (
              <AudioButton text={q.audio.text} audio={q.audio} />
            )}
            <button
              type="button"
              onClick={() =>
                update((p) => ({
                  ...p,
                  reviewHistory: [...p.reviewHistory, { day, id: r.id, outcome: "viewed" }],
                }))
              }
            >
              答えを見る
            </button>
            {viewed.has(r.id) && (
              <div>
                <p>
                  {ko(
                    v?.meaning ??
                      (g
                        ? `${g.name}：${related?.explanation ?? "本文を確認してください"}`
                        : q
                          ? `答え：${q.answers.join("、") || "自由回答"}。${q.explanation}`
                          : ""),
                  )}
                </p>
                {q?.type === "listening" && q.audio && <p lang="ko">{q.audio.text}</p>}
                {source && (
                  <p>
                    <a
                      href={link(
                        `lesson/${source.id}?${g?.sectionId ?? diagnosticGrammar?.sectionId ?? (v ? "vocabulary" : "exercises")}`,
                      )}
                    >
                      {lessonLabel(source.day)}の本文へ
                    </a>
                  </p>
                )}
              </div>
            )}
            <div className="actions">
              {(
                [
                  ["recalled", "答えを見る前に思い出せた"],
                  ["understood", "答えを見て理解した"],
                  ["missed", "思い出せなかった"],
                ] as const
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  disabled={value === "recalled" && viewed.has(r.id)}
                  onClick={() =>
                    update((p) => ({
                      ...p,
                      reviews: p.reviews.map((x) =>
                        x.id === r.id ? scheduleReview(x, value, day) : x,
                      ),
                      reviewHistory: [...p.reviewHistory, { day, id: r.id, outcome: value }],
                    }))
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {remaining === 0 ? (
        <p>今日の上限に達しました。残りは明日以降に取り組めます。</p>
      ) : (
        due.length === 0 && <p>今日の復習はありません。</p>
      )}
    </main>
  );
}
function Reference({ progress, update }: { progress: Progress; update: Update }) {
  const [query, setQuery] = useState("");
  const vocab = Array.from(
    new Map(lessons.flatMap((l) => l.vocabulary).map((x) => [x.id, x])).values(),
  ).filter((x) => `${x.korean} ${x.meaning} ${x.dictionaryForm}`.includes(query));
  const grammar = Array.from(
    new Map(lessons.flatMap((l) => l.grammar).map((x) => [x.id, x])).values(),
  ).filter((x) => x.name.includes(query));
  return (
    <main>
      <h1>語彙・文法</h1>
      <label>
        検索
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <h2>語彙</h2>
      {vocab.map((v) => (
        <p id={v.id} key={v.id}>
          <strong lang="ko">{v.korean}</strong>：{v.meaning}（{v.partOfSpeech}、辞書形{" "}
          <span lang="ko">{v.dictionaryForm}</span>、{lessonLabel(v.firstDay)}）
          <ReviewControl id={v.id} progress={progress} update={update} />
        </p>
      ))}
      <h2>文法</h2>
      {grammar.map((g) => (
        <p id={g.id} key={g.id}>
          {ko(g.name)}（
          <a
            href={link(
              `lesson/${lessons.find((l) => l.day === g.firstDay)?.id}?${g.sectionId ?? "section-0"}`,
            )}
          >
            {lessonLabel(g.firstDay)}の本文
          </a>
          ）
          <ReviewControl id={g.id} progress={progress} update={update} />
        </p>
      ))}
    </main>
  );
}
function Settings({
  progress,
  apply,
}: {
  progress: Progress;
  update: Update;
  apply: (p: Progress) => void;
}) {
  const [preview, setPreview] = useState<Progress | null>(null);
  const [error, setError] = useState("");
  return (
    <main>
      <h1>設定とバックアップ</h1>
      <AudioDiagnostics />
      <section>
        <h2>バックアップ</h2>
        <p>
          進捗はこのブラウザーの配信元（プロトコル・ホスト・ポート）ごとに保存され、端末間で自動同期されません。同じ配信元の画面内移動では共有されます。ブラウザーのデータ削除で消えます。録音はバックアップに含まれません。
        </p>
        <button
          type="button"
          onClick={() => {
            const url = URL.createObjectURL(
              new Blob([exportBackup(progress)], { type: "application/json" }),
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = "korean-textbook-backup.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          バックアップを書き出す
        </button>
        <label>
          バックアップを選ぶ
          <input
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(null);
              setError("");
              if (file)
                void file
                  .text()
                  .then((text) => {
                    try {
                      setPreview(parseBackup(text, ids));
                    } catch {
                      setError("読み込めないバックアップです。現在のデータは変更していません。");
                    }
                  })
                  .catch(() => setError("ファイルを読み込めませんでした。"));
              e.target.value = "";
            }}
          />
        </label>
        {error && <p role="alert">{error}</p>}
        {preview && (
          <div className="notice">
            <h3>読み込み内容の確認</h3>
            <p>
              完了した節：{preview.completedLessons.length}件、回答：{preview.attempts.length}
              件、復習：{preview.reviews.length}件。適用すると現在の進捗を置き換えます。
            </p>
            <button
              type="button"
              onClick={() => {
                apply(preview);
                setPreview(null);
              }}
            >
              この内容を適用
            </button>{" "}
            <button type="button" onClick={() => setPreview(null)}>
              取消
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
export default function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}
