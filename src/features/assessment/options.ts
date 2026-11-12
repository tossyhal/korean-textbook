export function displayOptions(questionId: string, options: readonly string[]): string[] {
  let seed = 2166136261;
  for (const char of questionId) {
    seed = Math.imul(seed ^ char.codePointAt(0)!, 16777619);
  }

  const result = [...options];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    const random = ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    const index = Math.floor(random * (i + 1));
    [result[i], result[index]] = [result[index], result[i]];
  }
  return result;
}
