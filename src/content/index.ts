import type { Lesson } from "../domain/content";
import { week01 } from "./lessons/week01";
import { week02 } from "./lessons/week02";
import { week03 } from "./lessons/week03";
import { week04 } from "./lessons/week04";
import { week05 } from "./lessons/week05";
import { week06 } from "./lessons/week06";
import { week07 } from "./lessons/week07";
import { week08 } from "./lessons/week08";

export const lessons: Lesson[] = [
  ...week01,
  ...week02,
  ...week03,
  ...week04,
  ...week05,
  ...week06,
  ...week07,
  ...week08,
];
