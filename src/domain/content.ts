import { z } from "zod";

const text = z.string().trim().min(1);
const id = text;
export const sourceSchema = z.object({
  name: text,
  url: z.string().url(),
  checkedAt: text,
  checked: text,
  status: z.enum(["checked", "unverified"]),
});
export const audioSchema = z.object({
  text,
  source: text,
  license: text,
  voice: text,
  status: z.enum(["checked", "unverified"]),
  path: z.string().optional(),
});
export const exampleSchema = z.object({
  korean: text,
  japanese: text,
  note: z.string().optional(),
  audio: audioSchema.optional(),
});
export const voiceTransferSchema = z.object({
  sameSentence: z.object({ korean: text, japanese: text }),
  newSentence: z.object({ korean: text, japanese: text }),
});
export const roleplaySchema = z.object({
  scenario: text,
  turns: z
    .array(
      z.object({
        partner: exampleSchema,
        goal: text,
        responseExamples: z.array(exampleSchema).min(2),
        rubric: z.array(text).min(1),
      }),
    )
    .min(1),
});
export const questionSchema = z
  .object({
    id,
    type: z.enum(["choice", "input", "ordering", "listening", "translation", "self"]),
    prompt: text,
    skill: z.enum(["reading", "listening", "writing", "speaking", "typing"]).optional(),
    assessmentKind: z.enum(["practice", "exit", "transfer"]).optional(),
    normalization: z.enum(["exact", "spacing", "standard"]).optional(),
    options: z.array(text).optional(),
    answers: z.array(text),
    explanation: text,
    tags: z.array(id),
    audio: audioSchema.optional(),
    requiresVerifiedAudio: z.boolean().optional(),
    rubric: z.array(text).optional(),
  })
  .superRefine((q, ctx) => {
    if (q.type !== "self" && q.answers.length === 0)
      ctx.addIssue({ code: "custom", message: "固定解問題には許容解が必要です" });
    if (
      (q.type === "choice" && !q.options?.length) ||
      (q.options !== undefined &&
        (!q.options.length || q.answers.some((answer) => !q.options?.includes(answer))))
    )
      ctx.addIssue({ code: "custom", message: "選択肢には許容解を含めてください" });
    if (q.type === "self" && !q.rubric?.length)
      ctx.addIssue({ code: "custom", message: "自己評価基準が必要です" });
  });
export const lessonSchema = z.object({
  id,
  day: z.number().int().min(1).max(56),
  lessonKind: z.enum(["normal", "letters", "exam"]).optional(),
  title: text,
  objectives: z.array(text).min(2),
  prerequisites: z.array(id),
  recall: z.array(questionSchema),
  sections: z.array(z.object({ heading: text, paragraphs: z.array(text).min(1) })).min(1),
  examples: z.array(exampleSchema),
  dialogue: z.array(exampleSchema).min(1),
  exercises: z.array(questionSchema),
  production: z.object({ prompt: text, model: text, rubric: z.array(text).min(1) }),
  roleplay: roleplaySchema.optional(),
  voiceTransfer: voiceTransferSchema.optional(),
  exitTest: z.array(questionSchema),
  vocabulary: z.array(
    z.object({
      id,
      korean: text,
      meaning: text,
      partOfSpeech: text,
      dictionaryForm: text,
      firstDay: z.number().int().min(1).max(56),
    }),
  ),
  grammar: z.array(
    z.object({
      id,
      name: text,
      firstDay: z.number().int().min(1).max(56),
      sectionId: text.optional(),
    }),
  ),
  reviewTargets: z.array(id),
  modes: z.object({
    60: z.array(text).min(1),
    90: z.array(text).min(1),
    120: z.array(text).min(1),
  }),
  sources: z.array(sourceSchema),
  languageStatus: z.enum(["checked", "unverified"]),
  audioStatus: z.enum(["checked", "unverified"]),
});
export type Lesson = z.infer<typeof lessonSchema>;
export type Question = z.infer<typeof questionSchema>;
