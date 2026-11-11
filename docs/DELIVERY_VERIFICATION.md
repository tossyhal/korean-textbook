# 配信準備の検証記録

2026-11-12、ローカル作業ツリーで確認。GitHub上のworkflow実行、Pages設定変更、公開、pushは行っていない。

- `mise install --locked`、`pnpm install --frozen-lockfile`：成功。Node.js 24.22.1、pnpm 12.11.2。
- `mise run lint`、`mise run typecheck`、`mise run build`：成功。`dist`を生成。
- `mise run test`：34件成功。`mise run test:browser`：Chromiumで14件成功。音声・録音のブラウザーテストはAPIをモックし、実音声・実マイクを検証しない。
- `mise run content:check`：第8〜56課の不足により失敗。`pnpm run content:check -- --partial`：収録済み7課で成功。厳格検査は維持。
- `mise run format:check`：AGENTS.md、docs/ASSESSMENT.md、docs/DESIGN.md、docs/IMPLEMENTATION_PLAN.md、docs/TASKS.md、docs/reviews/week01-acceptance.md、korean_8week_codex_prompt.mdの既存整形差異により失敗。今回のREADME、配信手順、workflowは個別のoxfmt検査に成功。
- `git diff --check`：成功。workflowのGitHub上での動作は未検証。

言語的照合、合成音声の発音・品質、iPhone・Windows実機、ローカルHTTPSでの録音は未確認。教材の確認状態は[CONTENT_STATUS.md](CONTENT_STATUS.md)、ブラウザーテストの詳細は[VERIFICATION-browser.md](VERIFICATION-browser.md)を参照。
