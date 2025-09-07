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
    answer: 'だいたいで大丈夫です。月だけ分かるなら「その月の1日 or 15日」、年だけなら「その年の7/1」など、近い日を入れて目安として使ってください。',
  },
  {
    question: '入力を変えるとすぐ計算されますか？',
    answer: 'はい。日付を変更すると下の結果が自動で更新されます。',
  },
  {
    question: 'どうやって換算しているの？',
    answer: '目安として「1歳=人の15歳、2歳=24歳、以降は1年ごとに+4歳」で計算し、月はなめらかに補間しています。',
  },
  {
    question: 'ライフステージは何の役に立つ？',
    answer: '成長のだいたいの段階が分かります。\n・子猫：遊びやすい環境づくり\n・若年成猫：遊び＋体重管理のペースづくり\n・成猫：生活リズムの見直しに\n・シニア：無理のない運動やチェックの目安に',
  },
  {
    question: '結果は共有できますか？プライバシーは？',
    answer: '右上の共有ボタンからURLをコピー・共有できます。サーバーには何も送信されず、URLに含まれるのは誕生日の日付だけです。',
  },
] as const;
