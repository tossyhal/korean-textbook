# 音声・録音API

`AudioProvider`でアプリを囲む。`AudioButton`は`text`と任意の教材`audio`を受け取り、再生・停止と速度・繰り返しを提供する。`onPlaybackComplete`は全文再生が最後まで成功したときだけ呼ばれ、聴解の再生成功フラグに使える。`AudioDiagnostics`は声の選択、再検出と試聴を提供する。`Recorder`は`sampleText`と任意の`audio`を受け取り、録音・比較・自己確認を提供する。各コンポーネントはそれぞれ`src/features/audio`、`src/features/recording`からimportできる。画面遷移時は`useAudio().stop()`を呼ぶか、各画面をアンマウントする。

`useAudio()`の`play(text, audio?, options?)`は再生完了でtrue、停止・失敗でfalseを返す。教材音声の`path`を優先し、失敗時は韓国語音声のみで合成する。合成音声の品質は未確認。単独字母は合成しない。`options`は`rate`、`repeat`、`allowFallback`、`onSource`を指定できる。`onSource`は完了した方式を`file`または`tts`で通知する。重要音対立など確認済み音声が必要な場合は教材の確認状態も判定し、`allowFallback: false`を指定する。`AudioButton`にも同名の指定がある。`stop()`は再生と録音を中断する。録音の許可待ち・録音中は他の再生要求を拒否する。録音はメモリにのみ保持し、明示的なダウンロード操作で保存する。

外部の音声要素や録音を追加する場合、`registerExternalStop`で停止処理を登録し、再生開始時に`beginExternalPlayback()`を呼ぶ。falseなら再生しない。録音開始前には`beginRecording()`を呼び、終了・失敗時に`endRecording()`で解除する。`Recorder`はこれらを使用する。

参照：MDNの[音声一覧](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices)、[voiceschanged](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event)、[マイク取得](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)、[録音形式](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static)（2026-11-12確認）。実機の音声品質や録音動作は未確認。
