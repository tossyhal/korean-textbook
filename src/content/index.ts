import type { Lesson } from "../domain/content";
import { week01 } from "./lessons/week01";
import { week02 } from "./lessons/week02";

export const lessons: Lesson[] = [...week01, ...week02];
