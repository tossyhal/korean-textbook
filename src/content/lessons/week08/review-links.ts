import type { Lesson } from "../../../domain/content";
import { day06 } from "../week01/day06";
import { day09 } from "../week02/day09";
import { day10 } from "../week02/day10";
import { day12 } from "../week02/day12";
import { day18 } from "../week03/day18";
import { day20 } from "../week03/day20";
import { day13 } from "../week02/day13";
import { day15 } from "../week03/day15";
import { day16 } from "../week03/day16";
import { day17 } from "../week03/day17";
import { day22 } from "../week04/day22";
import { day23 } from "../week04/day23";
import { day24 } from "../week04/day24";
import { day25 } from "../week04/day25";
import { day26 } from "../week04/day26";

const references = [
  day06,
  day09,
  day10,
  day12,
  day13,
  day18,
  day20,
  day15,
  day16,
  day17,
  day22,
  day23,
  day24,
  day25,
  day26,
].flatMap((day) => day.grammar);
const rules: [RegExp, string][] = [
  [/읽다の丁寧形|가다の丁寧形|丁寧形で入力|해요体で入力/u, "grammar-conjugation"],
  [/過去形|過去の해요体|過去の活用/u, "grammar-day09-conjugation"],
  [/해야|어야 해요|義務|必要なこと/u, "grammar-obligation"],
  [/으면|오면|条件/u, "grammar-condition"],
  [/고 있어요|進行/u, "grammar-progressive"],
  [/어도|許可/u, "grammar-permission"],
  [/고 싶어요|希望/u, "grammar-want"],
  [/名詞修飾形|過去の名詞修飾|산が책/u, "grammar-verb-modifier-past"],
  [/내일 볼|내일 만들/u, "grammar-verb-modifier-future"],
  [/좋아하는/u, "grammar-verb-modifier-present"],
  [/아서|어서|理由を表|理由や順序/u, "grammar-connect-aseo"],
  [/지만|対比|対照/u, "grammar-connect-jiman"],
  [/順序を表|後の行動|先の行動|고の後/u, "grammar-connect-go"],
  [/거예요|予定の해요体/u, "grammar-day-10"],
  [/動作の場所|에서が場所/u, "grammar-location-review"],
  [/目的語助詞/u, "grammar-object"],
];
// 設問が実際に要求する知識を、文面の一致に依存せず補う。
const explicit: Record<string, string[]> = {
  "day-50-ex-3": ["grammar-connect-aseo"],
  "day-50-ex-8": ["grammar-connect-go"],
  "day-50-ex-listen-2": ["grammar-connect-aseo"],
  "day-50-exit-1": ["grammar-connect-go"],
  "day-50-exit-2": ["grammar-connect-aseo"],
  "day-50-exit-listen-2": ["grammar-connect-go"],
  "day-51-exit-5": ["grammar-connect-aseo"],
  "day-52-ex-1": ["grammar-questions"],
  "day-52-ex-2": ["grammar-questions", "grammar-location-review"],
  "day-52-ex-5": ["grammar-connect-go"],
  "day-52-ex-listen-2": ["grammar-connect-aseo"],
  "day-52-exit-2": ["grammar-connect-aseo"],
  "day-53-recall-1": ["grammar-questions", "grammar-location-review"],
  "day-53-ex-5": ["grammar-w8-53-1"],
  "day-53-ex-6": ["grammar-w8-53-2"],
  "day-53-ex-7": ["grammar-w8-53-2"],
  "day-53-ex-8": ["grammar-w8-53-2"],
  "day-53-ex-9": ["grammar-w8-53-1"],
  "day-53-ex-10": ["grammar-w8-53-1"],
  "day-53-ex-11": ["grammar-w8-53-3"],
  "day-53-ex-12": ["grammar-w8-53-2"],
  "day-53-exit-4": ["grammar-w8-53-1"],
  "day-53-exit-5": ["grammar-w8-53-2"],
  "day-54-ex-4": ["grammar-questions"],
  "day-54-ex-5": ["grammar-d-irregular", "grammar-location-review"],
  "day-54-ex-6": ["grammar-questions"],
  "day-54-ex-7": ["grammar-questions", "grammar-location-review"],
  "day-54-ex-9": ["grammar-questions"],
  "day-54-ex-10": ["grammar-questions", "grammar-location-review"],
  "day-55-ex-1": ["grammar-questions"],
  "day-55-ex-5": ["grammar-location-review"],
  "day-55-ex-7": ["grammar-condition"],
  "day-55-ex-8": ["grammar-connect-aseo"],
  "day-55-ex-12": ["grammar-connect-go"],
  "day-56-exit-input-3": ["grammar-location-review"],
};
export function linkReview(lesson: Lesson) {
  for (const question of [...lesson.recall, ...lesson.exercises, ...lesson.exitTest]) {
    const text = `${question.prompt} ${question.explanation}`;
    const ids = [
      ...(explicit[question.id] ?? []),
      ...rules.filter(([pattern]) => pattern.test(text)).map(([, id]) => id),
    ];
    for (const id of ids) {
      const reference = [...lesson.grammar, ...references].find((item) => item.id === id);
      if (!reference) throw new Error(`Missing grammar ${id}`);
      if (!lesson.grammar.some((item) => item.id === id)) lesson.grammar.push(reference);
      if (!lesson.reviewTargets.includes(id)) lesson.reviewTargets.push(id);
      if (!question.tags.includes(id)) question.tags.push(id);
    }
  }
}
