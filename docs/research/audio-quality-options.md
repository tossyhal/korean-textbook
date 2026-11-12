# 韓国語音声の品質改善の選択肢

調査日：2026-11-12。実音声の試聴や端末実機での確認は未実施。

- 現在はWeb Speech APIが公開する韓国語音声から選ぶ。声の一覧は端末・ブラウザーに依存し、同じ声や品質が得られる保証はない。音声設定で同じ短文を聞き比べ、選択を保存できる。声名にNatural、Enhanced、Neuralなどがある場合は自動選択の手がかりにするが、品質の保証ではない。
- [Appleの読み上げ設定](https://support.apple.com/ja-jp/111798)では声の追加が選択肢となる。ただしこの調査ではページ取得が429で失敗し、現行手順を確認できなかった。追加した声をブラウザーが公開する保証もない。
- [Microsoft EdgeのRead aloud](https://www.microsoft.com/en-us/edge/learning-center/customize-read-aloud-settings)にはオンラインの自然な声があると案内されている。これはEdgeの読み上げ機能の説明であり、その声がWeb Speech APIで利用できる保証はない。
- [Azure Speechの対応音声](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=text-to-speech)には韓国語のSunHiやInJoonなどがある。有料外部APIのため呼び出しも導入もしていない。
- 端末間で品質と声を揃えるには、利用条件・権利を確認した固定音声を事前生成し、内容と発音を実聴して同梱する方法が本命。料金、生成物の配布条件、話者と文ごとの確認を導入前に検討する。

- [Piperの韓国語kss mediumモデルカード](https://huggingface.co/rhasspy/piper-voices/blob/main/ko/ko_KR/kss/medium/MODEL_CARD)はデータセットのライセンスをCC BY-NC-SA 4.0と記載している。既存音声との品質比較も未実施のため今回は導入しない。
