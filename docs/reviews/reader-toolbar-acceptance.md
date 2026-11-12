# 読書ツールバーの最終受入確認

2026-11-12、feature/readable-lessons-audioの共有作業ツリーを限定レビュー。[前回の修正受入レビュー](reader-audio-gate.md)で残った、モバイルとPC閉状態のstickyトグルによる本文の部分的な隠れだけを確認した。アプリソースの変更、コミット、pushは行っていない。

## 結論

残存P2は解消しており、読書ツールバーを受け入れる。今回の範囲でP1・P2の未解消事項は確認していない。音声拒否処理と本文字母の契約は前回の受入結果を引き継ぐ。

## ソース確認

- `src/App.tsx`では`.reader-toolbar`が独立した要素としてh1より前にある。PCのgridはツールバーが第1行全列、h1が第2行、ナビとtabpanelが第3行で、初期表示の重なりを作らない。閉状態もh1とtabpanelの行を維持する。
- `src/features/learning/style.css`ではツールバーが`position:sticky; top:0`、白い不透明背景、`z-index:2`を持つ。PCナビのsticky位置は60pxで、45pxのツールバーより下にある。
- 700px以下では通常のblock配置に戻るが、ツールバーは本文と同じ幅の独立した行になる。htmlの`scroll-padding-top`とsectionの`scroll-margin-top`が、それぞれ4rem指定されている。
- スクロール中の本文がツールバーの背後を通る通常のsticky表示は残る。今回の欠陥だった、アイコンだけが本文行の一部分を隠す表示は解消している。

## 実ブラウザ確認

agent-browserスキルの専用セッションで、ローカル開発サーバーの第1章第3節を確認した。画像は撮影後に実見し、リポジトリへ追加していない。

- 1280×900pxの開状態：初期ツールバー下端134.64px、h1上端156.08px。1000pxスクロール後はツールバーがy=0〜45px、x=140〜1140px、ナビ上端60pxで、トグルをクリックして閉じられた。`/tmp/reader-toolbar-pc-open.png`。
- 同幅の閉状態：1000pxスクロール後、ツールバーはx=260〜1020px、本文領域と同じ760px幅。アイコンは44×44pxで上端に残る。先頭に戻った閉状態もツールバー下端134.64px、h1上端156.08pxで重ならない。`/tmp/reader-toolbar-pc-closed.png`。
- 390×844px：1000pxスクロール後、閉状態のツールバーはx=20〜370px、350px幅、y=0〜45px。背景の計算値は`rgb(255, 255, 255)`。トグルをクリックして開状態へ戻しても同位置を維持し、`aria-expanded=true`となった。開閉ともページのscrollWidthは390px。`/tmp/reader-toolbar-mobile-closed.png`。
- sectionへの`scrollIntoView()`後、対象h2上端は390px幅で128.23px、1280px幅で127.52pxとなり、ツールバー下端45pxより下に見える。
- 390px幅で画面外の文字組立selectへフォーカスすると、上端432.45px、下端476.45pxにスクロールされ、844pxの画面内でツールバーより下に見えた。`/tmp/reader-toolbar-mobile-focus.png`。
- PCのページscrollWidthも1280pxで横方向のはみ出しはなかった。

今回、新たな全体テストや音声の再検証は行っていない。端末TTSの実聴、母語話者照合、iPhone／Windows実機、スクリーンリーダー実機は未実施のままである。
