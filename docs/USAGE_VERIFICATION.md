# 利用手順の検証記録

2026-11-12、既存の依存導入済み環境で確認した。

- `mise tasks`で追加した`format`と`preview`を確認。`mise run dev -- --host 127.0.0.1`は既存サーバーが5173を使用中のため5174で起動した。`mise run build`と`mise run preview -- --host 127.0.0.1`は成功し、プレビューの`/korean-textbook/`はHTTP 200を返した。
- `mise run typecheck`、`mise run lint`、担当ファイルの`pnpm exec oxfmt --check`、`mise run test`（95件）、`pnpm run content:check -- --partial`（実行時点で35課）、`mise run content:report`が成功した。
- 初回のmise・pnpm導入、厳格教材検査、ブラウザーテスト、実音声と実機操作は今回再実行していない。ブラウザー別の既存検証は[Chromium](VERIFICATION-browser.md)と[Desktop WebKit](VERIFICATION-webkit.md)、教材と言語の確認状態は[教材の確認状態](CONTENT_STATUS.md)を参照する。
