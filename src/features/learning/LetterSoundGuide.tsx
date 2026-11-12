import { SpeakableText } from "../audio";
import { letterSoundData } from "./letterSoundData";
import "./letterSoundGuide.css";

export function LetterSoundGuide({ day }: { day: number }) {
  return (
    <section id="letter-sound-guide">
      <h2>字母の音を聞く</h2>
      <p>文字を押すと、その字母を含む音節や単語を聞けます。</p>
      {letterSoundData[day]?.map((group) => (
        <div key={group.title}>
          <h3>{group.title}</h3>
          <ul className="letter-sound-list">
            {group.samples.map((sample, index) => (
              <li key={`${sample.letter}-${sample.text}-${index}`}>
                <span className="letter-sound-letter">
                  <SpeakableText text={sample.letter} sampleText={sample.text} />
                </span>
                <span className="letter-sound-example">
                  <SpeakableText text={sample.text} />
                </span>
                <span>{sample.note}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
