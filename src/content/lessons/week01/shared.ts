import type { Lesson, Question } from "../../../domain/content";

export const audio = (text: string) => ({
  text: text.replace(/(?:^|\s)[가나다]:\s*/gu, " ").trim(),
  source: "端末の韓国語音声による合成音声",
  license: "端末・音声提供者の利用条件に従う",
  voice: "端末で選択した韓国語音声",
  status: "unverified" as const,
});
export const example = (korean: string, japanese: string, note?: string) => ({
  korean,
  japanese,
  note,
  audio: audio(korean),
});
export const source = (name: string, url: string, checked: string) => ({
  name,
  url,
  checkedAt: "2026-11-12",
  checked,
  status: "checked" as const,
});
type Item = [string, string, string, string?, string[]?];
export function questions(day: number, group: "recall" | "ex" | "exit", items: Item[]): Question[] {
  return items.map(([prompt, answer, explanation, kind = "reading", options], index) => ({
    id: `day-${String(day).padStart(2, "0")}-${group}-${String(index + 1).padStart(2, "0")}`,
    type: options ? "choice" : "input",
    prompt,
    answers: answer.split("|"),
    explanation,
    skill: kind as Question["skill"],
    assessmentKind: group === "exit" ? "exit" : "practice",
    normalization: "standard",
    options,
    tags: [`grammar-day-${String(day).padStart(2, "0")}`],
  }));
}
export function base(
  day: number,
  title: string,
  objectives: string[],
  sections: Lesson["sections"],
  examples: Lesson["examples"],
  dialogue: Lesson["dialogue"],
  exercises: Item[],
  exit: Item[],
  sources: Lesson["sources"],
  vocabulary: Lesson["vocabulary"] = [],
): Lesson {
  const id = `day-${String(day).padStart(2, "0")}`;
  const tag = `grammar-day-${String(day).padStart(2, "0")}`;
  return {
    id,
    day,
    title,
    objectives,
    prerequisites: day > 1 ? [`day-${String(day - 1).padStart(2, "0")}`] : [],
    recall:
      day > 1
        ? [
            {
              id: `${id}-recall-01`,
              type: "self",
              prompt: "前の課で学んだことを、答えを見る前に説明しましょう。",
              answers: [],
              explanation: "前の課の本文で説明を確認しましょう。",
              tags: [tag],
              skill: "speaking",
              assessmentKind: "practice",
              normalization: "standard",
              rubric: ["例を挙げて説明できたか", "不確かな箇所を前の課で確認したか"],
            },
          ]
        : [],
    sections,
    examples,
    dialogue,
    exercises: questions(day, "ex", exercises),
    exitTest: questions(day, "exit", exit),
    production: {
      prompt:
        "今日の内容を使い、自分について書いて声に出しましょう。文字の日は音節を組み立て、発音を録音して比べます。",
      model: examples[0]?.korean ?? dialogue[0]?.korean ?? "",
      rubric: [
        "習った形を使って意味が伝わるか",
        "文字と分かち書きを確認したか",
        "語尾まで発音したか",
        "手本と録音を比べ、聞き取れない部分を確認したか",
      ],
    },
    vocabulary,
    grammar: [{ id: tag, name: title, firstDay: day, sectionId: "section-0" }],
    reviewTargets: [tag],
    modes: {
      60: ["本文・例・演習の前半と出口テスト。残りは別の日に行う"],
      90: ["本文・例・全演習・作文と出口テスト"],
      120: ["90分の内容に加え録音と復習を行う"],
    },
    sources,
    languageStatus: "unverified",
    audioStatus: "unverified",
  };
}

export function listening(
  day: number,
  group: "ex" | "exit",
  index: number,
  text: string,
  prompt: string,
  answer: string,
  explanation: string,
): Question {
  return {
    id: `day-${String(day).padStart(2, "0")}-${group}-listen-${index}`,
    type: "listening",
    prompt,
    answers: [answer],
    explanation,
    tags: [`grammar-day-${String(day).padStart(2, "0")}`],
    skill: "listening",
    assessmentKind: group === "exit" ? "exit" : "practice",
    normalization: "standard",
    audio: audio(text),
  };
}

const topics = [
  {
    id: "grammar-noun-predicate",
    name: "名詞の述語と否定",
    firstDay: 4,
    sectionId: "section-0",
    match: /이에요|예요|아니에요|否定|丁寧形/,
  },
  {
    id: "grammar-particles",
    name: "話題と主語の助詞",
    firstDay: 4,
    sectionId: "section-1",
    match: /話題|主語|은|는|이\/가/,
  },
  {
    id: "grammar-existence",
    name: "存在と不在",
    firstDay: 5,
    sectionId: "section-0",
    match: /있어요|없어요|存在|ありません/,
  },
  {
    id: "grammar-location",
    name: "所在と動作の場所",
    firstDay: 5,
    sectionId: "section-1",
    match: /場所|所在|여기|거기|저기|학교|집에/,
  },
  {
    id: "grammar-conjugation",
    name: "動詞の丁寧形と縮約",
    firstDay: 6,
    sectionId: "section-0",
    match: /먹다|가다|오다|마시다|縮約|動詞/,
  },
  {
    id: "grammar-object",
    name: "目的語助詞",
    firstDay: 6,
    sectionId: "section-1",
    match: /目的語|물을|밥을/,
  },
];
export function tagTopics(lesson: Lesson) {
  const available = topics.filter((t) => t.firstDay <= lesson.day);
  for (const q of [...lesson.recall, ...lesson.exercises, ...lesson.exitTest]) {
    for (const t of available) if (t.match.test(`${q.prompt} ${q.explanation}`)) q.tags.push(t.id);
  }
  for (const t of available)
    if (
      [...lesson.recall, ...lesson.exercises, ...lesson.exitTest].some((q) => q.tags.includes(t.id))
    ) {
      lesson.grammar.push({ id: t.id, name: t.name, firstDay: t.firstDay, sectionId: t.sectionId });
      lesson.reviewTargets.push(t.id);
    }
}
