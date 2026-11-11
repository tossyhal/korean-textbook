import { useEffect, useRef, useState } from "react";
import { lessons } from "./content";
import type { Lesson, Question } from "./domain/content";
import { contentIds } from "./domain/validate-content";
import {
  dueReviews,
  gradeAnswer,
  newProgress,
  nextStage,
  scheduleReview,
  summarize,
} from "./domain/progress";
import type { Progress } from "./domain/progress";
import { exportBackup, parseBackup, tryLoadProgress, trySaveProgress } from "./storage/backup";
import { AudioButton, AudioDiagnostics, AudioProvider, useAudio } from "./features/audio";
import { Recorder } from "./features/recording";
import { KeyboardPage, PronunciationPage } from "./features/reference";
import "./features/learning/style.css";

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const questions = (l: Lesson) => [...l.recall, ...l.exercises, ...l.exitTest];
const ids = contentIds(lessons);
const link = (path: string) => `#/${path}`;
const ko = (text: string) =>
  text.split(/([가-힣ㄱ-ㅎㅏ-ㅣ]+)/gu).map((part, i) =>
    /[가-힣ㄱ-ㅎㅏ-ㅣ]/u.test(part) ? (
      <span lang="ko" key={i}>
        {part}
      </span>
    ) : (
      part
    ),
  );

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
      ) : route === "reference" ? (
        <Reference />
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
  const current =
    lessons.find((l) => progress.positions[l.id] && !progress.completedLessons.includes(l.id)) ??
    lessons.find((l) => !progress.completedLessons.includes(l.id)) ??
    lessons[0];
  return (
    <main>
      <h1>今日の学習</h1>
      <p>自分のペースで進めましょう。課はいつでも開けます。</p>
      {current ? (
        <p>
          <a className="primary" href={link(`lesson/${current.id}`)}>
            続きから学ぶ：第{current.day}課 {current.title}
          </a>
        </p>
      ) : (
        <p>教材を準備しています。</p>
      )}
      <p>
        <a href={link("review")}>今日の復習：{dueReviews(progress.reviews, today()).length}件</a>
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
        <a href={link("lessons")}>すべての課を見る</a>
      </p>
    </main>
  );
}
function Contents({ progress }: { progress: Progress }) {
  return (
    <main>
      <h1>目次</h1>
      <p>すべての課を自由に開けます。前提の課に戻って復習することもできます。</p>
      {Array.from({ length: 8 }, (_, i) => (
        <section key={i}>
          <h2>第{i + 1}週</h2>
          <ol start={i * 7 + 1}>
            {Array.from({ length: 7 }, (_, j) => {
              const day = i * 7 + j + 1;
              const l = lessons.find((x) => x.day === day);
              return (
                <li key={day}>
                  {l ? (
                    <>
                      <a href={link(`lesson/${l.id}`)}>{l.title}</a> —{" "}
                      {progress.completedLessons.includes(l.id)
                        ? "完了"
                        : progress.positions[l.id]
                          ? "学習中"
                          : "未着手"}
                      {l.prerequisites.length > 0 && (
                        <small>
                          （前提：
                          {l.prerequisites
                            .map((id) => lessons.find((x) => x.id === id)?.day ?? id)
                            .join("、")}
                          課）
                        </small>
                      )}
                    </>
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
          at: new Date().toISOString(),
        },
      ],
      reviews:
        result === "incorrect"
          ? [
              ...p.reviews,
              ...q.tags
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
              再生できませんでした。<a href={link("settings")}>音声診断</a>を確認してください。
            </p>
          )}
        </div>
      )}
      {q.type === "choice" ? (
        <fieldset>
          <legend>回答を選ぶ</legend>
          {q.options?.map((o) => (
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
                  const index = source.sections.findIndex((section) =>
                    `${section.heading} ${section.paragraphs.join(" ")}`.includes(name),
                  );
                  return (
                    <a key={id} href={link(`lesson/${source.id}?section-${Math.max(index, 0)}`)}>
                      {ko(name)}の本文（第{source.day}課）{" "}
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
  const initialPosition = useRef(target ?? progress.positions[l.id]);
  useEffect(() => {
    if (initialPosition.current) document.getElementById(initialPosition.current)?.scrollIntoView();
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible)
          update((p) =>
            p.positions[l.id] === visible.target.id
              ? p
              : { ...p, positions: { ...p.positions, [l.id]: visible.target.id } },
          );
      },
      { rootMargin: "-10% 0px -70% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [l.id]);
  const sections = [
    ["objectives", "今日できるようになること"],
    ["recall", "想起練習"],
    ...l.sections.map((s, i) => [`section-${i}`, s.heading]),
    ["vocabulary", "語彙"],
    ["examples", "例文"],
    ["dialogue", "会話・読解"],
    ["exercises", "練習"],
    ["production", "作文・発話"],
    ["exit", "出口テスト"],
    ["sources", "出典"],
  ];
  const mark = (id: string) => update((p) => ({ ...p, positions: { ...p.positions, [l.id]: id } }));
  const summary = summarize(l.exitTest, progress.attempts);
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
        {!hideJapanese && <p>{e.japanese}</p>}
        {e.note && <p>{ko(e.note)}</p>}
        <AudioButton text={e.korean} audio={e.audio} />
      </div>
    ));
  return (
    <div className="lesson-layout">
      <aside>
        <details open={!window.matchMedia("(max-width: 700px)").matches}>
          <summary>この課の目次</summary>
          <nav aria-label="課内目次">
            {sections.map(([id, title]) => (
              <a
                key={id}
                href={`#/${`lesson/${l.id}`}?${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  mark(id);
                  document.getElementById(id)?.scrollIntoView();
                }}
              >
                {title}
              </a>
            ))}
          </nav>
        </details>
      </aside>
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
          第{l.day}課 {l.title}
        </h1>
        {progress.positions[l.id] && (
          <p>
            <button
              type="button"
              onClick={() => document.getElementById(progress.positions[l.id])?.scrollIntoView()}
            >
              前回の位置へ
            </button>
          </p>
        )}
        <section id="objectives" onClick={() => mark("objectives")}>
          <h2>今日できるようになること</h2>
          <ul>
            {l.objectives.map((x) => (
              <li key={x}>{ko(x)}</li>
            ))}
          </ul>
          {l.prerequisites.length > 0 && (
            <p>
              前提：
              {l.prerequisites.map((id) => (
                <a key={id} href={link(`lesson/${id}`)}>
                  {lessons.find((x) => x.id === id)?.title ?? id}{" "}
                </a>
              ))}
            </p>
          )}
        </section>
        <section id="recall">
          <h2>想起練習</h2>
          {l.recall.length ? (
            l.recall.map((q) => (
              <QuestionView key={q.id} q={q} progress={progress} update={update} />
            ))
          ) : (
            <p>前提となる想起問題はありません。</p>
          )}
        </section>
        {l.sections.map((s, i) => (
          <section id={`section-${i}`} key={i} onClick={() => mark(`section-${i}`)}>
            <h2>{s.heading}</h2>
            {s.paragraphs.map((p, j) => (
              <p key={j}>{ko(p)}</p>
            ))}
          </section>
        ))}
        <section id="vocabulary">
          <h2>語彙</h2>
          {l.vocabulary.length ? (
            <ul>
              {l.vocabulary.map((v) => (
                <li key={v.id}>
                  <span lang="ko">{v.korean}</span>：{v.meaning}（{v.partOfSpeech}、辞書形
                  <span lang="ko">{v.dictionaryForm}</span>、第{v.firstDay}課）
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
        <section id="exercises">
          <h2>練習</h2>
          {l.exercises.map((q) => (
            <QuestionView key={q.id} q={q} progress={progress} update={update} />
          ))}
        </section>
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
          <Recorder sampleText={l.production.model} />
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
        <section id="exit">
          <h2>出口テスト</h2>
          <p>
            練習とは別の問題です。8割は学習の目安で、公式認定ではありません。結果に関係なく次の課に進めます。
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
                </li>
              );
            })}
          </ul>
          <p>
            作文・発話の自己確認：{checks.filter(Boolean).length}/{l.production.rubric.length}
            項目。作文・発話は自己評価です。課の完了は成績認定ではありません。
          </p>
          <button
            type="button"
            disabled={!summary.complete || !productionDone || !selfChecked}
            onClick={complete}
          >
            この課を完了する
          </button>
          {(!summary.complete || !productionDone || !selfChecked) && (
            <p>出口テストをすべて実施し、作文と発話を自己評価してから完了できます。</p>
          )}
          {progress.completedLessons.includes(l.id) && <p>完了済みです。</p>}
        </section>
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
        {lessons.find((x) => x.day === l.day + 1) && (
          <p>
            <a
              className="primary"
              href={link(`lesson/${lessons.find((x) => x.day === l.day + 1)?.id}`)}
            >
              次の課へ
            </a>
          </p>
        )}
      </main>
    </div>
  );
}
function ReviewPage({ progress, update }: { progress: Progress; update: Update }) {
  const due = dueReviews(progress.reviews, today());
  const [revealed, setRevealed] = useState<string[]>([]);
  return (
    <main>
      <h1>復習</h1>
      <p>今日の予定は{due.length}件です。一度に最大20件を表示します。残りは次回に回せます。</p>
      <p>弱点は各課に戻って確認できます。第55課の総復習と第56課の技能別評価は準備中です。</p>
      {due.slice(0, 20).map((r) => {
        const v = lessons.flatMap((l) => l.vocabulary).find((x) => x.id === r.id);
        const g = lessons.flatMap((l) => l.grammar).find((x) => x.id === r.id);
        const q = lessons.flatMap(questions).find((x) => x.id === r.id);
        const source = g && lessons.find((l) => l.day === g.firstDay);
        const related =
          source &&
          [...source.recall, ...source.exercises, ...source.exitTest].find((item) =>
            item.tags.includes(r.id),
          );
        return (
          <div className="question" key={r.id}>
            <p>
              {v
                ? ko(v.korean)
                : g
                  ? ko(related?.prompt ?? source?.examples[0]?.japanese ?? g.name)
                  : q
                    ? ko(q.prompt)
                    : r.id}
            </p>
            <button type="button" onClick={() => setRevealed((s) => [...s, r.id])}>
              答えを見る
            </button>
            {revealed.includes(r.id) && (
              <p>
                {v?.meaning ??
                  (g
                    ? `${g.name}：${related?.explanation ?? source?.examples[0]?.korean ?? "本文を確認してください"}`
                    : q?.explanation)}
              </p>
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
                  disabled={value === "recalled" && revealed.includes(r.id)}
                  onClick={() =>
                    update((p) => ({
                      ...p,
                      reviews: p.reviews.map((x) =>
                        x.id === r.id ? scheduleReview(x, value, today()) : x,
                      ),
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
      {due.length === 0 && <p>今日の復習はありません。</p>}
    </main>
  );
}
function Reference() {
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
          <span lang="ko">{v.dictionaryForm}</span>、第{v.firstDay}課）
        </p>
      ))}
      <h2>文法</h2>
      {grammar.map((g) => (
        <p id={g.id} key={g.id}>
          {ko(g.name)}（
          <a href={link(`lesson/${lessons.find((l) => l.day === g.firstDay)?.id}?section-0`)}>
            第{g.firstDay}課の本文
          </a>
          ）
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
          進捗はこのブラウザーに保存され、端末間で自動同期されません。別端末や別URLには引き継がれず、ブラウザーのデータ削除で消えます。録音はバックアップに含まれません。
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
              完了した課：{preview.completedLessons.length}件、回答：{preview.attempts.length}
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
