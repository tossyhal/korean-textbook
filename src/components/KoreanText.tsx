export function KoreanText({ text }: { text: string }) {
  return text.split(/([가-힣ㄱ-ㅎㅏ-ㅣ]+)/gu).map((part, i) =>
    /[가-힣ㄱ-ㅎㅏ-ㅣ]/u.test(part) ? (
      <span lang="ko" key={i}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}
