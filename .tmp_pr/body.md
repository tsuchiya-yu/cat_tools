<!-- PR の目的を簡潔に。スクショ/動画/GIF があれば貼ってください。 -->
Lighthouse のアクセシビリティ指摘（aria-allowed-attr）に対応し、ラジオUIの ARIA 適合性とキーボード操作性を改善します。

## 関連Issue
- Close #18

## 概要
- `aria-pressed` を削除（`role="radio"` では不適切）
- roving tabindex を導入（選択中のみ `tabindex=0`、非選択は `-1`）
- 矢印キー（←/→/↑/↓）での移動、Space で選択をサポート
- `type="button"` を明示

## スクリーンショット/動画（任意）
（UIの見た目変更は最小。動作はキーボード操作で確認できます）

## 動作確認
- [ ] キーボードのみでの移動/選択が可能
- [ ] 主要ブラウザでの表示/操作
- [ ] スマホ幅での表示/操作

## 影響範囲
- `SegmentedButton` を利用している箇所（`calculate-cat-calorie` の入力UIなど）

## チェックリスト
- [ ] ESLint/Prettier を通過
- [ ] テストコード を追加/更新（必要に応じて）
- [ ] 文言・日本語確認

## 備考
- Node バージョン差異のためローカルCIは未実行。環境で `npm run build`/`npm test` の確認をお願いします。
