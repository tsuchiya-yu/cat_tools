レビュー指摘（r2440625709, r2440625716, r2440625721, r2440625725, r2440625731, r2440625734）に対応しました。再レビューをお願いします。

変更点

- パンくずリンクのキーボード制御: `tabbable={false}` の場合も `Link` を維持し、`tabIndex={-1}` でタブ順から除外（機能は保持）
- 給餌の警告文言を定数化: `FEEDING_UI_TEXT.WARNINGS` に集約し、ハードコードを排除
- 体重入力の手動フォーカス移動を削除: 自然なタブフローに移行（Breadcrumbs側のtabIndex制御で干渉を解消済み）
- 共有のタイトル定数化: `navigator.share` の `title` を `FEEDING_UI_TEXT.HEADER.TITLE` 参照に変更
- トースト表示のクリーンアップ: `useEffect` で `showToast` を監視して `setTimeout` を安全にクリア（Feeding/Calorie 両方）
- URL同期のDRY化: `shareUrl` 生成に削除処理を含め、`useEffect([shareUrl])` に一本化（空入力時のクエリ削除も担保）

注記

- 共有メニューのロジック共通化（DRY化）は別Issue（#26）で対応します。本PRでは動作に関わる修正・整理のみ反映しています。

@gemini-code-assist /gemini review  
@cursor 再レビューをお願いします。

