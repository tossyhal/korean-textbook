# korean-textbook

日本語話者向け8週間の韓国語学習Web教材です。全56課の完成を目指して制作中です。収録範囲と言語・音声・動作の確認状況は[教材の確認状態](docs/CONTENT_STATUS.md)、出典と制作上の調査は[第1週の調査記録](docs/research/week01.md)を参照してください。

課別の収録状況と集計方法は[教材の制作状況](docs/CONTENT_REPORT.md)を参照してください。`mise run content:report`で再生成できます。

## 始める

[mise](https://mise.jdx.dev/)を用意し、リポジトリのルートで実行します。Node.jsとpnpmのバージョンはmiseで固定しています。

```sh
mise install --locked
pnpm install --frozen-lockfile
mise run dev
```

表示されたURLの`/korean-textbook/`を開きます。通常の開発時は`mise run dev`で起動します。タスク一覧は`mise tasks`で確認できます。

## 検査とビルド

```sh
mise run format:check
mise run lint
mise run typecheck
mise run test
mise run content:check
pnpm exec playwright install chromium
mise run test:browser
mise run build
```

`content:check`は全56課を要求する厳格検査です。制作途中は不足課のため失敗します。収録済み教材だけの途中確認には`pnpm run content:check -- --partial`を使えますが、完成確認の代わりにはなりません。ブラウザーテストはChromiumで動作を確認し、実音声や実機の確認は含みません。ビルド成果物は`dist/`です。

## 音声と保存

音声診断画面で端末の韓国語合成音声の利用状況を確認できます。合成音声の発音・音質は未確認で、端末やブラウザーによって異なります。録音にはマイクの許可と安全なコンテキスト（HTTPSまたはその端末自身のlocalhost）が必要です。PCのlocalhostをiPhoneからLAN上のHTTPアドレスで開いても、iPhone側ではlocalhostではないため録音できません。Pages公開後はHTTPSで開いて録音します。ローカルHTTPSによる実機確認は未実施です。WindowsのWSL2から別端末へ接続する場合はLAN公開とファイアウォールの設定にも注意してください。

進捗はブラウザーの端末内に保存され、端末間では同期されません。JSONでバックアップと復元ができますが、録音は含まれません。保存データの消去やブラウザーのデータ削除に備えてバックアップしてください。

配信の準備と未実施事項は[配信手順](docs/DEPLOYMENT.md)、ブラウザー検証の範囲は[検証記録](docs/VERIFICATION-browser.md)を参照してください。
