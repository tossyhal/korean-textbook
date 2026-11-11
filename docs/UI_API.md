# 学習画面の接続

アプリはハッシュルーティングを使い、発音リファレンスとキーボード練習を`AudioProvider`内に置く。キーボードの下書きキーは`REFERENCE_API.md`を参照。

課内位置は`objectives`、`recall`、`section-N`、`vocabulary`、`examples`、`dialogue`、`exercises`、`production`、`exit`、`sources`を使う。回答下書きは問題ID、作文下書きとメモは課IDで保存する。`productionChecks`は課IDごとの自己確認項目の真偽値配列で、旧データには空オブジェクトを補完する。バックアップは教材IDと入力練習の有限キーを検証する。
