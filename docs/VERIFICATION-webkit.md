# Desktop WebKit回帰検証

全56課の最終固定版は、同じ公式コンテナによる88件が成功した。[最終検証](VERIFICATION-final.md)に結果と未確認範囲を記録する。

## 初期の19件の検証記録

2026-11-12にPlaywright 1.65.0のDesktop WebKit（Linux、ヘッドレス）で開発サーバーの`/korean-textbook/`を検証し、19件すべて成功した。各テストは独立したブラウザーコンテキストを使う。

- 第1課の回答・採点・再読込、採点履歴、作文と自己評価の保存を確認した。
- JSONを実際にダウンロードし、取消、不正なJSONの拒否、適用後の復元を確認した。ダウンロードしたファイルを読み戻せた。
- 390pxと1280pxで課・キーボード・設定・復習画面の文書全体に横方向のはみ出しがないことを確認した。
- IME変換中の採点防止と、変換確定後のinputイベントによる保存・再読込・採点を合成イベントで確認した。実際のIMEやSafariのイベント順の観測ではない。
- 録音と音声合成のケースはブラウザーAPIをモックした。実際のマイク、音声再生や音質は確認していない。

既定のChromium設定は変更していない。別途実行した既存17件はすべて成功し、追加したIMEイベントのテストもChromiumで成功した。

通常は`pnpm exec playwright install --with-deps webkit`の後、`pnpm exec playwright test --config playwright.webkit.config.ts`で実行できる。この環境ではホストのシステムライブラリが不足し、依存のインストールには利用できないsudo認証が必要だったため、公式`mcr.microsoft.com/playwright:v1.65.0-noble`コンテナから既に起動中の開発サーバーに接続して実行した。

```sh
docker run --rm --network host --user "$(id -u):$(id -g)" -v "$PWD:/work" -w /work mcr.microsoft.com/playwright:v1.65.0-noble node node_modules/@playwright/test/cli.js test --config playwright.webkit.config.ts
```

このコマンドはLinux上でホストの127.0.0.1:5173に開発サーバーが起動していることを前提とする。Desktop WebKitの検証はiPhone実機、iOS Safari、実際のIMEや音声の確認の代わりにはならない。言語内容の照合は別記録とする。
