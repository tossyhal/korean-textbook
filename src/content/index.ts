import type { Lesson } from "../domain/content";
import { week01 } from "./lessons/week01";
import { week02 } from "./lessons/week02";
import { week03 } from "./lessons/week03";
import { week04 } from "./lessons/week04";

export const lessons: Lesson[] = [...week01, ...week02, ...week03, ...week04];
