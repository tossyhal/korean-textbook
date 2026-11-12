import type { Lesson } from "../../domain/content";
import { lessons } from "../index";
import extra from "./extra.json";
import lessonRanks from "./lesson-ranks.json";

export type WordbookEntry = Omit<Lesson["vocabulary"][number], "firstDay"> & {
  firstDay?: number;
  frequencyRank?: number;
  example?: { korean: string; japanese: string };
};

const ranks: Record<string, number> = lessonRanks;
const examples: Record<string, { korean: string; japanese: string }> = {
  가게: { korean: "가게에 가요.", japanese: "店に行きます。" },
  걱정하다: { korean: "너무 걱정하지 마세요.", japanese: "あまり心配しないでください。" },
  기다리다: { korean: "여기에서 기다려요.", japanese: "ここで待ちます。" },
  기억하다: { korean: "이 이름을 기억해요.", japanese: "この名前を覚えています。" },
  끝나다: { korean: "수업이 끝났어요.", japanese: "授業が終わりました。" },
  내리다: { korean: "다음 역에서 내려요.", japanese: "次の駅で降ります。" },
  넣다: { korean: "가방에 책을 넣어요.", japanese: "かばんに本を入れます。" },
  도착하다: { korean: "역에 도착했어요.", japanese: "駅に着きました。" },
  돌아오다: { korean: "집에 돌아왔어요.", japanese: "家に戻りました。" },
  빌리다: { korean: "도서관에서 책을 빌려요.", japanese: "図書館で本を借ります。" },
  설명하다: { korean: "선생님이 설명해요.", japanese: "先生が説明します。" },
  열다: { korean: "창문을 열어요.", japanese: "窓を開けます。" },
  외우다: { korean: "새 단어를 외워요.", japanese: "新しい単語を覚えます。" },
  잃다: { korean: "지갑을 잃었어요.", japanese: "財布をなくしました。" },
  정리하다: { korean: "책상을 정리해요.", japanese: "机を片付けます。" },
  조심하다: { korean: "길에서 조심하세요.", japanese: "道で気をつけてください。" },
  찾다: { korean: "열쇠를 찾아요.", japanese: "鍵を探します。" },
  확인하다: { korean: "시간을 확인해요.", japanese: "時間を確認します。" },
};
const lessonWords: WordbookEntry[] = [
  ...new Map(
    lessons.flatMap((lesson) => lesson.vocabulary).map((word) => [word.id, word]),
  ).values(),
].map((word) => ({ ...word, frequencyRank: ranks[word.id] }));

/** 順位不明の語は末尾に置き、同順位は韓国語表記とIDで安定させる。 */
export const wordbook: WordbookEntry[] = [...lessonWords, ...extra]
  .map((word) => ({
    ...word,
    example: examples[word.dictionaryForm],
  }))
  .sort(
    (a, b) =>
      (a.frequencyRank ?? Infinity) - (b.frequencyRank ?? Infinity) ||
      a.dictionaryForm.localeCompare(b.dictionaryForm, "ko") ||
      a.id.localeCompare(b.id),
  );
