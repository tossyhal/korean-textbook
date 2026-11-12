import { expect, test } from "@playwright/test";
import { lessons } from "../../src/content";

const key = "korean-textbook-progress-v1";
const display = (text: string) =>
  text
    .replace(
      /第(\d+)課/g,
      (_, day: string) =>
        `第${Math.floor((Number(day) - 1) / 7) + 1}章第${((Number(day) - 1) % 7) + 1}節`,
    )
    .replace(/第([1-8])週/g, "第$1章");

type ActivityQuestion = (typeof lessons)[number]["exercises"][number];

function chooseActivity(questions: ActivityQuestion[]) {
  return (
    questions.find((q) => q.type !== "self" && q.type !== "listening" && !isUnavailable(q)) ??
    questions.find((q) => q.type === "self" && !isUnavailable(q)) ??
    questions.find((q) => isUnavailable(q) || q.type === "listening")
  );
}

function isUnavailable(q: ActivityQuestion) {
  return Boolean(q.requiresVerifiedAudio && q.audio?.status !== "checked");
}

test("固定解のない将来の課でも活動を選べる", () => {
  const base = lessons[0].exercises[0];
  const self = { ...base, type: "self" as const };
  const listening = { ...base, type: "listening" as const, requiresVerifiedAudio: true };
  expect(chooseActivity([self])).toEqual(self);
  expect(chooseActivity([listening])).toEqual(listening);
  expect(chooseActivity([])).toBeUndefined();
});

test("固定解のない課の自己評価と未確認音声を保存する", async ({ page, baseURL }) => {
  test.skip(baseURL?.includes(":4174/"), "教材差し替えは開発サーバー専用");
  await page.route("**/src/content/index.ts*", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    await route.fulfill({
      response,
      body: `${body}
      const fixtureBase = lessons[0].exercises[0];
      lessons[0].exercises = [
        {...fixtureBase, id: "fixture-self", type: "self", answers: [], rubric: ["伝わるか確認"]},
        {...fixtureBase, id: "fixture-audio", type: "listening", requiresVerifiedAudio: true, audio: undefined},
        {...fixtureBase, id: "fixture-audio-self", type: "self", requiresVerifiedAudio: true, audio: undefined, rubric: ["確認"]}
      ];
      lessons[0].exitTest = [];
    `,
    });
  });
  await page.goto(`#/lesson/${lessons[0].id}`);
  await page.getByRole("tab", { name: "練習" }).click();
  const self = page.locator("#fixture-self");
  await self.getByLabel("自分の回答").fill("自由な回答");
  await expect(self).toContainText("自動採点はしません");
  await self.getByRole("button", { name: "自己評価を記録" }).click();
  await expect(self.getByRole("status")).toContainText("自己評価を記録しました");
  const before = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), key);
  expect(before.attempts).toEqual([
    expect.objectContaining({ questionId: "fixture-self", result: "self", answer: "自由な回答" }),
  ]);
  const audio = page.locator("#fixture-audio");
  await audio.getByLabel("回答").fill("聞き取りの下書き");
  await expect(audio).toContainText("この問題は未実施です");
  await expect(audio.getByRole("button", { name: "答え合わせ" })).toBeDisabled();
  const audioSelf = page.locator("#fixture-audio-self");
  await audioSelf.getByLabel("自分の回答").fill("自己評価の下書き");
  await expect(audioSelf).toContainText("この問題は未実施です");
  await expect(audioSelf.getByRole("button", { name: "自己評価を記録" })).toBeDisabled();
  await page.reload();
  await expect(self.getByLabel("自分の回答")).toHaveValue("自由な回答");
  await expect(audio.getByLabel("回答")).toHaveValue("聞き取りの下書き");
  await expect(audioSelf.getByLabel("自分の回答")).toHaveValue("自己評価の下書き");
  const after = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), key);
  expect(after.attempts).toEqual(before.attempts);
});

test("本番プレビューではビルド済みアセットを配信する", async ({ page, baseURL }) => {
  if (!baseURL?.includes(":4174/")) return;
  const responses: string[] = [];
  page.on("response", (response) => {
    if (response.ok()) responses.push(response.url());
  });
  await page.goto("#/home");
  await expect(page.locator("main h1")).toBeVisible();
  expect(responses.some((url) => /\/korean-textbook\/assets\/.*\.js/.test(url))).toBe(true);
});

test(`収録課数を表示する（${lessons.length}/56課）`, async () => {
  expect(lessons.length).toBeGreaterThan(0);
  expect(lessons.length).toBeLessThanOrEqual(56);
  expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(lessons.length);
});

for (const lesson of lessons) {
  test(`第${lesson.day}課：教材表示と回答の保存`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(`#/lesson/${lesson.id}`);
    await expect(page.locator("main h1")).toHaveText(
      `第${Math.floor((lesson.day - 1) / 7) + 1}章第${((lesson.day - 1) % 7) + 1}節 ${display(lesson.title)}`,
    );
    for (const [index, section] of lesson.sections.entries()) {
      await expect(page.locator(`#section-${index}`)).toContainText(display(section.heading));
      await expect(page.locator(`#section-${index}`)).toContainText(display(section.paragraphs[0]));
    }
    for (const [id, items] of [
      ["examples", lesson.examples],
      ["dialogue", lesson.dialogue],
    ] as const) {
      for (const item of items) {
        await expect(page.locator(`#${id}`)).toContainText(item.korean);
        await expect(page.locator(`#${id}`)).toContainText(item.japanese);
      }
    }
    for (const [id, questions] of [
      ["exercises", lesson.exercises],
      ["exit", lesson.exitTest],
    ] as const) {
      await page.getByRole("tab", { name: id === "exercises" ? "練習" : "確認テスト" }).click();
      for (const question of questions)
        await expect(page.locator(`#${id} #${question.id}`)).toBeVisible();
    }
    await page.getByRole("tab", { name: "本文" }).click();
    await expect(page.getByRole("button", { name: /未実施を残して学習を終え/ })).toBeHidden();
    await page.getByRole("tab", { name: "確認テスト" }).click();
    await expect(page.getByRole("button", { name: /未実施を残して学習を終え/ })).toBeVisible();

    const q = chooseActivity([...lesson.exercises, ...lesson.exitTest]);
    if (q) {
      await page
        .getByRole("tab", { name: lesson.exercises.includes(q) ? "練習" : "確認テスト" })
        .click();
      const view = page.locator(`#${q.id}`);
      if (q.type === "choice" || (q.type === "listening" && q.options))
        await view
          .getByRole("radio", {
            name: q.type === "choice" ? q.answers[0] : q.options![0],
            exact: true,
          })
          .check();
      else if (q.type === "self") await view.getByLabel("自分の回答").fill("自由な回答");
      else await view.getByLabel("回答").fill(q.answers[0] ?? "回答");
      const button = view.getByRole("button", {
        name: q.type === "self" ? "自己評価を記録" : "答え合わせ",
      });
      if (isUnavailable(q) || q.type === "listening") {
        if (isUnavailable(q)) await expect(view).toContainText("この問題は未実施です");
        await expect(button).toBeDisabled();
        const before = await page.evaluate(
          (storageKey) => JSON.parse(localStorage.getItem(storageKey)!).attempts,
          key,
        );
        await page.reload();
        await expect(button).toBeDisabled();
        const after = await page.evaluate(
          (storageKey) => JSON.parse(localStorage.getItem(storageKey)!).attempts,
          key,
        );
        expect(after).toEqual(before);
      } else {
        await button.click();
        await expect(view.getByRole("status")).toContainText(
          q.type === "self" ? "自己評価を記録しました" : "正解",
        );
        if (q.type === "self") await expect(view).toContainText("自動採点はしません");
        const progress = await page.evaluate(
          (storageKey) => JSON.parse(localStorage.getItem(storageKey)!),
          key,
        );
        expect(progress.attempts).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              questionId: q.id,
              result: q.type === "self" ? "self" : "correct",
              stage: "first",
            }),
          ]),
        );
      }
    }
    await page.getByRole("tab", { name: "実践" }).click();
    const draftLabel = lesson.production.kind === "typing" ? "入力した文字" : "自分の文章";
    const checkLabel =
      lesson.production.kind === "typing" ? "文字入力を自己評価した" : "作文を自己評価した";
    if (lesson.production.kind !== "speaking") {
      await page.getByLabel(draftLabel).fill("안녕하세요");
      await page.getByLabel(checkLabel).check();
    } else await page.getByLabel("発話を自己評価した").check();
    await page.getByRole("tab", { name: "練習" }).click();
    if (lesson.roleplay) {
      await expect(page.locator("#roleplay")).toContainText(lesson.roleplay.scenario);
      await expect(page.locator("#roleplay")).toContainText("AIによる自動評価はありません");
      await page.getByLabel("返答の下書き").fill("네");
    }
    if (lesson.voiceTransfer) {
      const voiceTransfer = page.locator("#voice-transfer");
      await expect(voiceTransfer).toContainText("同じ文を2種類の合成音声で聞き比べます");
      await expect(voiceTransfer).not.toContainText("音声の内容と発音は未確認");
      await expect(voiceTransfer.getByLabel("手本の声")).toBeVisible();
      await expect(voiceTransfer.getByLabel("別の合成音声")).toBeVisible();
      await expect(voiceTransfer.getByRole("button", { name: "手本を聞く" })).toBeVisible();
      await expect(
        voiceTransfer.getByRole("button", { name: "別の声で同じ文を聞く" }),
      ).toBeVisible();
      await expect(
        voiceTransfer.getByRole("button", { name: "別の声で別の文を聞く" }),
      ).toBeVisible();
    }
    for (const item of [...lesson.recall, ...lesson.exercises, ...lesson.exitTest]) {
      await page
        .getByRole("tab", { name: lesson.exitTest.includes(item) ? "確認テスト" : "練習" })
        .click();
      if (item.requiresVerifiedAudio && item.audio?.status !== "checked") {
        await expect(page.locator(`#${item.id}`)).toContainText("この問題は未実施です");
        await expect(
          page
            .locator(`#${item.id}`)
            .getByRole("button", { name: item.type === "self" ? "自己評価を記録" : "答え合わせ" }),
        ).toBeDisabled();
      }
      if (item.type === "self")
        await expect(page.locator(`#${item.id}`)).toContainText("自動採点はしません");
    }
    const saved = await page.evaluate(
      (storageKey) => JSON.parse(localStorage.getItem(storageKey)!),
      key,
    );
    await page.reload();
    await page.getByRole("tab", { name: "実践" }).click();
    if (lesson.production.kind !== "speaking") {
      await expect(page.getByLabel(checkLabel)).toBeChecked();
      await expect(page.getByLabel(draftLabel)).toHaveValue("안녕하세요");
    } else await expect(page.getByLabel("発話を自己評価した")).toBeChecked();
    if (lesson.roleplay) {
      await page.getByRole("tab", { name: "練習" }).click();
      await expect(page.getByLabel("返答の下書き")).toHaveValue("네");
    }
    const restored = await page.evaluate(
      (storageKey) => JSON.parse(localStorage.getItem(storageKey)!),
      key,
    );
    expect(restored.attempts).toEqual(saved.attempts);
    expect(restored.productionChecks[lesson.id]).toEqual(saved.productionChecks[lesson.id]);
    if (q) expect(restored.drafts[q.id]).toEqual(saved.drafts[q.id]);
    expect(errors).toEqual([]);
  });
}

for (const lesson of [lessons[0], lessons.at(-1)!]) {
  test(`第${lesson.day}課：390pxの表示`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`#/lesson/${lesson.id}`);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator('[lang="ko"]').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
  });
}

test("主要画面への移動", async ({ page }) => {
  await page.goto("#/home");
  for (const [name, route] of [
    ["目次", "lessons"],
    ["復習", "review"],
    ["単語帳・文法", "reference"],
    ["発音", "pronunciation"],
    ["入力", "keyboard"],
  ] as const) {
    await page
      .getByRole("navigation", { name: "主なメニュー" })
      .getByRole("link", { name })
      .click();
    await expect(page).toHaveURL(new RegExp(`#/${route}$`));
    await expect(page.locator("main h1")).toBeVisible();
  }
});

test("旧結果URLは復習へ移り、ホームに時間選択を表示しない", async ({ page }) => {
  await page.goto("#/results");
  await expect(page.locator("main h1")).toHaveText("復習");
  await expect(page.getByRole("link", { name: "学習結果" })).toHaveCount(0);
  await page.goto("#/home");
  await expect(page.getByText("学習時間の目安")).toHaveCount(0);
  await expect(page.getByRole("radio", { name: /60分|90分|120分/ })).toHaveCount(0);
});
