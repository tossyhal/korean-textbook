# 録音の手本音源表示

録音欄に、手本が端末の韓国語合成音声であり、音声内容と発音の品質が未確認であることを表示した。将来音声ファイルが指定された場合は、そのファイルまたは失敗時の端末合成音声を使う可能性を示し、品質は未確認と表示する。

## 動作確認

- `mise run typecheck`、`mise run lint`: 成功。
- `pnpm exec oxfmt --check src/features/recording/index.tsx tests/browser/media.spec.ts tests/browser/roleplay.spec.ts`: 成功。
- `pnpm exec playwright test tests/browser/media.spec.ts tests/browser/roleplay.spec.ts`: 8件成功。第1課、発音ガイド、ロールプレイの録音欄の表示を確認。録音と音声はモックを使用。
- 初回のブラウザ実行では発音ガイドのURLを誤って指定し失敗した。URLを修正し上記の対象テストで再確認した。

実際の音声内容・発音品質、実機での再生は未確認。

- 初回は引数の渡し方によりブラウザ全88件が実行され、80件成功、8件失敗。上記の発音ガイドURLのほか、第46〜52課の出典リンク検査7件が、リンク名の部分一致で複数要素に該当し失敗した。対象外のため変更していない。
