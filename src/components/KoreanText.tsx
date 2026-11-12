import { SpeakableText } from "../features/audio";

export function KoreanText({ text, playable = false }: { text: string; playable?: boolean }) {
  return text.split(/([가-힣]+|[ㄱ-ㅎㅏ-ㅣ])/gu).map((part, i) =>
    /[가-힣ㄱ-ㅎㅏ-ㅣ]/u.test(part) ? (
      playable ? (
        <SpeakableText text={part} inline key={i} />
      ) : (
        <span lang="ko" key={i}>
          {part}
        </span>
      )
    ) : (
      part
    ),
  );
}
