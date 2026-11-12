# Pages配信の検証記録

2026年11月13日、[公開URL](https://tossyhal.github.io/korean-textbook/)を確認した。初めて成功した[Deploy Pages](https://github.com/tossyhal/korean-textbook/actions/runs/43260590013)は`main`へのpushで自動起動し、対象コミットは`32f29847c661cabc79bb1909635127f99f98f956`。CIの単体テスト191件、Chromiumブラウザーテスト123件、本番ビルドのプレビュー検査63件が成功し、後者の開発専用教材差し替えfixtureの1件はスキップされ、成功数には含めていない。配信後の文書変更を含むコミットの配信結果はこの記録の対象外。

初回の[develop CI](https://github.com/tossyhal/korean-textbook/actions/runs/43259681244)と[手動Deploy Pages](https://github.com/tossyhal/korean-textbook/actions/runs/43259906422)はブラウザーテスト用サーバーの起動待ちタイムアウトで失敗し、後者のbuildとdeployはスキップされた。サーバー起動コマンドの修正後、上記のmain配信が成功した。同じ修正を含む[develop CI](https://github.com/tossyhal/korean-textbook/actions/runs/43260613026)ではChromium123件が成功した一方、本番プレビューの第5課でタイムアウトし、62件成功・1件失敗・1件スキップだった。失敗したブラウザーjobを再実行したattempt 2は成功した。初回のタイムアウトは解消済みと断定せず、同じコミットの再実行成功と区別して記録する。

## 公開URLの動作確認

独立したheadless Chromiumセッションで次を確認した。1280×800と390×844はブラウザーの表示領域であり、実機の確認ではない。

- HTTPSでホームとナビゲーションが表示され、ホームの横幅は両表示領域とも画面内に収まった。セキュアコンテキストと`navigator.mediaDevices`の存在を確認した。
- 第1章第1節の練習で「가の母音」に`ㅏ`を入力し、正解と判定された。再読み込み後も練習タブと入力値が保持された。
- 第8章第7節（`#/lesson/day-56`）を直接開き、再読み込み後も同じ節が表示された。
- 単語帳で`좀`を検索して該当項目を表示し、検索文字列をキーボードで削除すると一覧に戻った。
- ページエラーとコンソール出力はなかった。観測した教材本体のHTML・スクリプト・CSSはHTTP 200だった一方、ブラウザーが要求したサイトルートの`/favicon.ico`はHTTP 404だった。

全56節の言語・音声の確認、母語話者による全文照合、音声の実聴、マイク許可と録音品質、実IME、iPhone・Windows実機の確認は行っていない。ブラウザー上でのAPIの存在は、実際の録音や音声再生の成功を示さない。
