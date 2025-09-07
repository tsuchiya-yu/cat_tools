// メタデータ
export const META = {
  TITLE: '猫の年齢計算｜誕生日から人間年齢に換算【無料ツール】',
  DESCRIPTION: '誕生日を入力するだけで、猫の年齢を人間年齢に換算。ライフステージと次の誕生日までの日数も表示します。入力はブラウザ内のみで安全。',
  KEYWORDS: '猫, 年齢計算, 人間年齢, ライフステージ, 誕生日, ペット',
  OG: {
    TITLE: '猫の年齢計算｜人間年齢に換算',
    DESCRIPTION: '誕生日を入れるだけで、猫の年齢を人間年齢に換算。ライフステージも表示。',
    URL: 'https://tools.catnote.tokyo/calculate-cat-age',
    SITE_NAME: 'CAT LINK tools',
  },
} as const;

// UI文言
export const UI_TEXT = {
  HEADER: {
    EYECATCH: '猫の年齢を人間年齢に換算',
    TITLE: '猫の年齢計算ツール',
    DESCRIPTION: '誕生日を入力するだけで、人間年齢・ライフステージ・次の誕生日までを表示します。',
  },
  INPUT: {
    LABEL: '誕生日を入力',
    PLACEHOLDER: '2023-04-01',
    ERROR: {
      REQUIRED: '誕生日を入力してください。',
      FUTURE_DATE: '未来日は指定できません。',
      CALCULATION_ERROR: '計算中にエラーが発生しました。',
    },
  },
  RESULT: {
    TITLE: '人間に換算すると',
    YEARS_UNIT: '歳',
    MONTHS_UNIT: 'か月',
    DETAILS: {
      REAL_AGE: {
        LABEL: '実年齢',
        FORMAT: (years: number, months: number) => `${years}年${months}か月`,
      },
      LIFE_STAGE: {
        LABEL: 'ライフステージ',
      },
      NEXT_BIRTHDAY: {
        LABEL: '次の誕生日まで',
        FORMAT: (days: number) => `${days}日`,
      },
    },
  },
  SHARE: {
    BUTTON_LABEL: '共有メニューを開く',
    MENU_LABEL: '共有メニュー',
    SHARE_TEXT: (years: number, months: number) => 
      `うちの猫の人間年齢は「${years}歳${months}か月」でした🐾`,
    MENU_ITEMS: {
      SHARE: '結果を共有',
      X_SHARE: 'Xでシェア',
      COPY_LINK: 'リンクをコピー',
    },
    TOAST: {
      SUCCESS: 'リンクをコピーしました',
      ERROR: 'コピーに失敗しました',
    },
  },
} as const;

// FAQ
export const FAQ_ITEMS = [
  {
    question: '誕生日がはっきり分からないときは？',
    answer: 'だいたいで大丈夫です。\n月だけ分かるなら「その月の1日」、年だけなら「その年の6/1」など、推定の誕生日を入れて、目安として使ってください。',
  },
  {
    question: 'どうやって換算しているの？',
    answer: '「1歳=人の15歳、2歳=24歳、以降は1年ごとに+4歳」で計算しています。',
  },
  {
    question: 'ライフステージは何の役に立つ？',
    answer: '獣医のガイドラインでは年齢ごとにケアの目安としてライフステージが定義されています。\n\n・0–1歳：家の危険対策（コードや小物を片付ける）／1日5–10分×2–3回遊ぶ／爪切り・歯みがき練習／初年度ワクチンや避妊去勢を獣医に相談。\n・1–6歳：月1で体重を記録（太り始めを早く気づく）／毎日遊びで運動確保／成猫用フードへ切替／年1回の健康・歯科チェック。\n・7–10歳：給水ポイントを増やす／段差・トイレ入口を低めにして出入りを楽に／食欲や活動量の変化をメモ／年1回の健診＋血液・尿の基礎検査を相談。\n・11歳〜：滑り止めマットやステップで移動を楽に／シニア食や腎臓配慮は獣医と相談／–15歳は少なくとも年2回、15歳超は4か月ごとの健診を目安に。\n\n※個体差があるため、かかりつけの先生と調整してください。ステージは目安として、遊び・食事・環境・健診の頻度を見直すきっかけに使うのがおすすめです。\n',
  },
  {
    question: '結果は共有できますか？プライバシーは保護されていますか？',
    answer: '右上の共有ボタンからURLをコピー・共有できます。\nURLに含まれるのは誕生日だけのため個人が特定されることはありません。',
  },
] as const;

// 構造化データ（JSON-LD）用のテキスト
export const STRUCTURED_DATA = {
  FAQ: {
    TYPE: 'FAQPage',
    ITEMS: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer.replace(/\n/g, ' ') // 改行を空白に変換
      }
    }))
  }
} as const;
