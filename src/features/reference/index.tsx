import { useRef, useState } from "react";
import { AudioButton, AudioDiagnostics } from "../audio";
import { Recorder } from "../recording";
import "./style.css";

const vowels = [
  ["ㅏ", "아", "口を開き、舌を低く置く。"],
  ["ㅓ", "어", "唇を丸めず、舌を後ろ寄りにする。ㅏより口の開きを抑える。"],
  ["ㅗ", "오", "唇を丸め、舌の奥を中程度の高さにする。"],
  ["ㅜ", "우", "唇を丸め、舌の奥をㅗより高くする。"],
  ["ㅡ", "으", "唇を横に引き気味にし、舌を奥で高くする。日本語のウと同一ではない。"],
  ["ㅣ", "이", "唇を横に引き、舌の前を高くする。"],
  ["ㅑ", "야", "ㅏの前に短い半母音を添える。"],
  ["ㅕ", "여", "ㅓの前に短い半母音を添える。"],
  ["ㅛ", "요", "ㅗの前に短い半母音を添える。"],
  ["ㅠ", "유", "ㅜの前に短い半母音を添える。"],
];

export function PronunciationPage() {
  const [showAudioHelp, setShowAudioHelp] = useState(false);
  return (
    <main className="reference-page">
      <h1>発音リファレンス</h1>
      <p>
        字母の名前と音節の中の音は別です。以下の音声は音節や単語を読み上げます。端末の合成音声は発音の内容が未確認です。
      </p>
      <details onToggle={(event) => setShowAudioHelp(event.currentTarget.open)}>
        <summary>音声が出ないとき</summary>
        {showAudioHelp && <AudioDiagnostics />}
      </details>
      <h2>基本母音</h2>
      <p>
        口の形を鏡で見ながら音節を聞き、似た音を交互にまねします。カタカナへの置き換えは目安になりません。
      </p>
      <div className="reference-grid">
        {vowels.map(([letter, syllable, description]) => (
          <section key={letter}>
            <h3 lang="ko">
              {letter}：{syllable}
            </h3>
            <p>{description}</p>
            <AudioButton text={syllable} />
          </section>
        ))}
      </div>
      <h2>複合母音</h2>
      <p>
        ㅐ・ㅔは現代の多くの話者で近く、区別には話者差があります。音だけで必ず判定できると考えず、綴りも覚えましょう。ㅘ・ㅝは唇を丸めた状態から次の母音へ移り、ㅟ・ㅢも一音節としてつなぎます。ㅒ・ㅖ・ㅚ・ㅙ・ㅞも語の中で覚えます。
      </p>
      <p>例：왜・웨、와・워、위・의</p>
      <AudioButton text="왜 웨 와 워 위 의" />
      <h2>平音・激音・濃音</h2>
      <p>
        가・카・까で比べます。平音ㄱは力を入れすぎず、激音ㅋは息を強く出し、濃音ㄲは喉や口の緊張を伴い息を強く漏らさず出します。紙を口の前に置いて息を観察しましょう。日本語の清音・濁音と一対一には対応しません。ㄷ・ㅌ・ㄸ、ㅂ・ㅍ・ㅃ、ㅈ・ㅊ・ㅉも同様に比べます。
      </p>
      <AudioButton text="가 카 까" />
      <h2>パッチムと音の変化</h2>
      <p>
        パッチムは音節の下にある終声です。代表的な終声はㄱ・ㄴ・ㄷ・ㄹ・ㅁ・ㅂ・ㅇの7種です。語末の閉鎖音に余分な母音を足さない練習をします。母音で始まる助詞などに続くときは、連音などの条件に従います。
      </p>
      <ul>
        <li>
          連音：表記「집이」／発音「지비」。母音で始まる助詞へ終声が移ります。ㅎや口蓋音化などには別の規則があります。
        </li>
        <li>鼻音化：表記「국물」／発音「궁물」。後の鼻音に影響されます。</li>
        <li>濃音化：表記「학교」／発音「학꾜」。後の子音が濃くなります。</li>
      </ul>
      <p>音声は表記を読み上げます。発音欄を読み上げると別の変化が起こることがあります。</p>
      <AudioButton text="집이 국물 학교" />
      <h2>聞く・区別する・まねする</h2>
      <ol>
        <li>가・카・까を順に聞き、息の強さと緊張に注目します。</li>
        <li>順序を隠して自分で言い分け、違いを意識します。音声が未確認なので合否は付けません。</li>
        <li>同じ順序でまねし、録音と交互に聞きます。</li>
      </ol>
      <Recorder sampleText="가 카 까" />
      <p>
        口の説明と個別音声の言語的照合は未完了です。端末ごとの合成音声を母語話者の手本として保証しません。
      </p>
    </main>
  );
}

const keys = [
  ["q", "ㅂ", "ㅃ"],
  ["w", "ㅈ", "ㅉ"],
  ["e", "ㄷ", "ㄸ"],
  ["r", "ㄱ", "ㄲ"],
  ["t", "ㅅ", "ㅆ"],
  ["y", "ㅛ", "ㅛ"],
  ["u", "ㅕ", "ㅕ"],
  ["i", "ㅑ", "ㅑ"],
  ["o", "ㅐ", "ㅒ"],
  ["p", "ㅔ", "ㅖ"],
  ["a", "ㅁ", "ㅁ"],
  ["s", "ㄴ", "ㄴ"],
  ["d", "ㅇ", "ㅇ"],
  ["f", "ㄹ", "ㄹ"],
  ["g", "ㅎ", "ㅎ"],
  ["h", "ㅗ", "ㅗ"],
  ["j", "ㅓ", "ㅓ"],
  ["k", "ㅏ", "ㅏ"],
  ["l", "ㅣ", "ㅣ"],
  ["z", "ㅋ", "ㅋ"],
  ["x", "ㅌ", "ㅌ"],
  ["c", "ㅊ", "ㅊ"],
  ["v", "ㅍ", "ㅍ"],
  ["b", "ㅠ", "ㅠ"],
  ["n", "ㅜ", "ㅜ"],
  ["m", "ㅡ", "ㅡ"],
];
const exercises = [
  ["letter", "字母：ㅎを入力", "ㅎ", "g"],
  ["syllable", "音節：하を入力", "하", "gk"],
  ["final", "パッチム：한を入力", "한", "gks"],
  ["vowel", "複合母音：와を入力", "와", "dhk"],
  ["tense", "Shiftで濃音：까を入力", "까", "Shift+r、k"],
  ["word", "単語：한글を入力", "한글", "gksrmf"],
  ["sentence", "短文：안녕하세요を入力", "안녕하세요", "dkssudgktpdy"],
  ["space", "空白を含む短文：한국어 한글を入力", "한국어 한글", "空白はスペースキー"],
  ["setup1", "設定確認：안녕하세요", "안녕하세요", ""],
  ["setup2", "設定確認：한국어", "한국어", ""],
  ["setup3", "設定確認：한글", "한글", ""],
];
type KeyboardProps = {
  drafts: Record<string, string>;
  onDraftChange: (id: string, value: string) => void;
};
function Practice({
  id,
  prompt,
  answer,
  hint,
  drafts,
  onDraftChange,
  selfCheck = false,
}: KeyboardProps & {
  id: string;
  prompt: string;
  answer: string;
  hint: string;
  selfCheck?: boolean;
}) {
  const [result, setResult] = useState("");
  const [showHint, setShowHint] = useState(false);
  const composing = useRef(false);
  const key = `reference-keyboard-${id}`;
  return (
    <section className="reference-practice">
      <label htmlFor={key}>{prompt}</label>
      <input
        id={key}
        lang="ko"
        value={drafts[key] ?? ""}
        onChange={(event) => {
          onDraftChange(key, event.target.value);
          setResult("");
        }}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={() => {
          composing.current = false;
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (composing.current || event.nativeEvent.isComposing)) return;
        }}
      />
      <button
        type="button"
        onClick={() => {
          if (!composing.current)
            setResult(
              selfCheck
                ? `表記：${answer}。入力と見比べてください。`
                : (drafts[key] ?? "").normalize("NFC").trim() === answer.normalize("NFC")
                  ? "一致しました。"
                  : "もう一度、文字と空白を確認しましょう。",
            );
        }}
      >
        {selfCheck ? "表記を見て自己確認" : "答え合わせ"}
      </button>
      {hint && (
        <button type="button" onClick={() => setShowHint(!showHint)}>
          {showHint ? "ヒントを隠す" : "ヒントを表示"}
        </button>
      )}
      {showHint && <p>キー：{hint}</p>}
      <p role="status">{result}</p>
    </section>
  );
}
export function KeyboardPage(props: KeyboardProps) {
  const [showKeys, setShowKeys] = useState(true);
  const [shift, setShift] = useState(false);
  const [heard, setHeard] = useState(false);
  return (
    <main className="reference-page">
      <h1>韓国語キーボード設定と入力</h1>
      <p>
        日本語のローマ字入力とは異なり、キーに字母が割り当てられています。入力言語を追加しても日本語の表示言語を変更する必要はありません。
      </p>
      <h2>iPhone</h2>
      <ol>
        <li>
          「設定」→「一般」→「キーボード」→「キーボード」→「新しいキーボードを追加」で韓国語を追加します。
        </li>
        <li>
          追加した言語の配列を選びます。2ボル式に対応する配列を選んでください。選択肢の表示名はOS版や端末で確認が必要です。選択後にキーボードを表示し、上段が
          <span lang="ko">ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ</span>の順か確かめます。
        </li>
        <li>入力中に地球儀などの切替キーを長押しし、韓国語を選びます。下の入力欄で確かめます。</li>
      </ol>
      <p>画面上の配列と物理キーボードのキー操作は同一とは限りません。</p>
      <h2>Windows 11</h2>
      <ol>
        <li>
          「設定」→「時刻と言語」→「言語と地域」から言語を追加し、韓国語を選びます。表示言語の変更は不要です。
        </li>
        <li>韓国語の言語オプションでMicrosoft IMEとキーボード配列を確認します。</li>
        <li>
          Win＋Spaceまたはタスクバーの入力言語から韓国語へ切り替えます。Microsoft
          IMEの「A」アイコンをクリックして「가」にすると韓国語入力になります。右Altキーでも切り替えられる場合がありますが、キーボードや設定によって異なります。Win＋Ctrl＋Oでスクリーンキーボードを開いて配列を確認し、下の欄で入力してみましょう。
        </li>
      </ol>
      <p>設定名はOSの版により変わります。両端末の実機手順は未確認です。</p>
      <p>
        公式手順（2026-11-12確認）：
        <a href="https://support.apple.com/ja-jp/guide/iphone/-iph73b71eb/ios">Apple</a>、
        <a href="https://support.microsoft.com/ja-jp/windows/hardware/input-devices/manage-the-language-and-keyboard-input-layout-settings-in-windows">
          Microsoft
        </a>
        、
        <a href="https://support.microsoft.com/en-us/windows/hardware/input-devices/advanced-input-methods-for-east-asian-languages">
          MicrosoftのIME案内
        </a>
        、
        <a href="https://learn.microsoft.com/en-us/globalization/input/korean-ime">
          韓国語IMEの操作
        </a>
      </p>
      <h2>2ボル式の配列</h2>
      <p>
        物理QWERTYキーの例です。g→ㅎ、gk→하、gks→한はキー操作であり、発音のローマ字表記ではありません。
      </p>
      <button type="button" onClick={() => setShowKeys(!showKeys)}>
        {showKeys ? "配列を隠す" : "配列を表示"}
      </button>
      {showKeys && (
        <div>
          <button type="button" aria-pressed={shift} onClick={() => setShift(!shift)}>
            Shift {shift ? "オン" : "オフ"}
          </button>
          {[keys.slice(0, 10), keys.slice(10, 19), keys.slice(19)].map((row, index) => (
            <div className={`reference-key-row row-${index}`} key={index}>
              {row.map(([key, normal, shifted]) => (
                <div key={key}>
                  <strong>{key.toUpperCase()}</strong>
                  <span lang="ko">{shift ? shifted : normal}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <h2>段階練習</h2>
      <p>
        子音、母音、必要なパッチムの順に打ちます。複合母音は母音キーを続けて打ち、濃音はShiftを使います。空白はスペース、間違えたら削除キーで戻します。端末によって削除の単位は異なります。
      </p>
      {exercises.map(([id, prompt, answer, hint]) => (
        <Practice key={id} id={id} prompt={prompt} answer={answer} hint={hint} {...props} />
      ))}
      <h2>聞いた語を入力</h2>
      <p>音声は合成音声で内容未確認です。再生できないときは未実施のまま次へ進めます。</p>
      <AudioButton text="한글" onPlaybackComplete={() => setHeard(true)} />
      {heard && (
        <Practice
          selfCheck
          id="listening"
          prompt="聞いた語を入力して自己確認"
          answer="한글"
          hint="ㅎ、ㅏ、ㄴ、ㄱ、ㅡ、ㄹ"
          {...props}
        />
      )}
    </main>
  );
}
