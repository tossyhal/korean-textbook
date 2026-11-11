import type { Lesson } from "../src/domain/content";

const escape = (text: string) => text.replaceAll("|", "\\|").replaceAll("\n", " ");

export function reportRows(lessons: Lesson[]) {
  return Array.from({ length: 56 }, (_, index) => {
    const day = index + 1;
    const lesson = lessons.find((item) => item.day === day);
    if (!lesson) return { day, lesson: undefined };
    const audioItems = [
      ...lesson.examples,
      ...lesson.dialogue,
      ...lesson.recall,
      ...lesson.exercises,
      ...lesson.exitTest,
      ...(lesson.roleplay?.turns.flatMap((turn) => [turn.partner, ...turn.responseExamples]) ?? []),
    ].flatMap((item) => (item.audio ? [item.audio] : []));
    return {
      day,
      lesson,
      characters: lesson.sections.flatMap((section) => section.paragraphs).join("").length,
      audioItems,
      newVocabulary: lesson.vocabulary.filter((item) => item.firstDay === day),
    };
  });
}

export function renderReport(lessons: Lesson[], sourcePath: (day: number) => string | undefined) {
  const rows = reportRows(lessons);
  const questions = lessons.flatMap((lesson) => [
    ...lesson.recall,
    ...lesson.exercises,
    ...lesson.exitTest,
  ]);
  const vocabulary = lessons.flatMap((lesson) => lesson.vocabulary);
  const fixed = questions.filter((question) => question.type !== "self").length;
  const lines = [
    "# 教材の制作状況（自動集計）",
    "",
    "`mise run content:report`で収録データから再生成します。この集計は構造と記録値を示し、教材の完成判定ではありません。",
    "",
    `収録課: ${lessons.length}/56課。固定解問題: ${fixed}問、自己評価問題: ${questions.length - fixed}問、例文: ${lessons.reduce((sum, lesson) => sum + lesson.examples.length, 0)}件。語彙は辞書形の異なり数${new Set(vocabulary.map((item) => item.dictionaryForm.normalize("NFC"))).size}、語彙IDの異なり数${new Set(vocabulary.map((item) => item.id)).size}。`,
    "",
    "問題数は想起・演習・出口テストの合計で、selfを自己評価、それ以外を固定解として数えます。例文はexamplesのみです。語彙は収録課のvocabulary全体を対象に辞書形またはIDで重複を除き、活用形を別途追加しません。課別の新語はfirstDayがその課と一致する語彙ID数です。本文文字数はsectionsのparagraphsの文字数（UTF-16コード単位）で、見出しを含みません。",
    "",
    "構造項目の数は存在量であり、品質や検査成功を意味しません。教材検査の結果は実行時に確認してください。言語全文の照合、実音声の聴取、実機確認は別の作業です。編集レビューの結果はファイルの存在から判定しません。[手動の確認状態](CONTENT_STATUS.md)と[ブラウザー検証記録](VERIFICATION-browser.md)を参照してください。",
    "",
    "| 課 | 収録・元ファイル | 本文節 | 本文文字 | 例文 | 対話 | 演習 | 出口 | 新語ID | 言語 | 音声 | 音声データ | 出典 |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |",
  ];
  for (const row of rows) {
    if (!row.lesson) {
      lines.push(`| ${row.day} | 未収録 | — | — | — | — | — | — | — | — | — | — | — |`);
      continue;
    }
    const l = row.lesson;
    const path = sourcePath(row.day);
    const label = path ? `[${escape(l.title)}](${path})` : escape(l.title);
    const checked = row.audioItems!.filter((item) => item.status === "checked").length;
    const unverified = row.audioItems!.filter((item) => item.status === "unverified").length;
    lines.push(
      `| ${row.day} | ${label} | ${l.sections.length} | ${row.characters} | ${l.examples.length} | ${l.dialogue.length} | ${l.exercises.length} | ${l.exitTest.length} | ${new Set(row.newVocabulary!.map((item) => item.id)).size} | ${l.languageStatus} | ${l.audioStatus} | checked ${checked} / unverified ${unverified} | ${l.sources.length}件 |`,
    );
  }
  lines.push(
    "",
    "## 出典の記録",
    "",
    "各課のデータに記録されたstatus、確認日、確認事項を表示します。これらは本文全体の照合を意味しません。",
    "",
  );
  for (const { day, lesson } of rows) {
    if (!lesson) continue;
    lines.push(`### 第${day}課`, "");
    if (!lesson.sources.length) lines.push("出典の記録なし。", "");
    for (const source of lesson.sources)
      lines.push(
        `- [${escape(source.name)}](${source.url}) — ${source.status}、${escape(source.checkedAt)}：${escape(source.checked)}`,
      );
    lines.push("");
  }
  return lines.join("\n");
}
