// メタデータ
export const META = {
  TITLE: '猫の年齢計算｜誕生日から人間年齢に換算【無料ツール】',
  DESCRIPTION: '誕生日を入力するだけで、猫の年齢を人間年齢に換算。ライフステージと次の誕生日までの日数も表示します。入力はブラウザ内のみで安全。',
  KEYWORDS: '猫, 年齢計算, 人間年齢, ライフステージ, 誕生日, ペット',
  OG: {
    TITLE: '猫の年齢計算｜人間年齢に換算',
    DESCRIPTION: '誕生日を入れるだけで、猫の年齢を人間年齢に換算。ライフステージも表示。',
    URL: 'https://cat-tools.catnote.tokyo/calculate-cat-age',
    SITE_NAME: 'ねこツールズ',
  },
} as const;

// UI文言
export const UI_TEXT = {
  HEADER: {
    EYECATCH: '猫の年齢を人間年齢に換算',
    TITLE: '猫の年齢計算ツール',
    DESCRIPTION: '誕生日を入力するだけで、人間年齢・ライフステージ・次の誕生日までを表示します。',
  },
  BREADCRUMBS: {
    HOME: 'ホーム',
    CAT_AGE_CALCULATOR: '猫の年齢計算',
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
    SHARE_TEXT: (years: number, months: number, baseUrl: string) => 
      `うちの猫ちゃん、人間に換算したら${years}歳${months}か月でした🐱✨
みんなの猫ちゃんは何歳かにゃ？🐾

${baseUrl}

#猫の年齢計算 #ねこ好きさんと繋がりたい #猫のいる暮らし #ねこツールズ`,
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
    answer: 'ライフステージによって気を付ける点が異なります。\nAAFP/AAHAのライフステージ区分にそって、気をつけるポイントをご説明します。\n\n【子猫（0–1歳）】\n・毎回の健診で「体重・体格（BCS）・歯・寄生虫・行動」をチェック。ワクチンや不妊手術の時期は生活環境に合わせて獣医と計画。\n・家庭内の危険物（コード・小物）を片付け、水平＆垂直の遊び場を用意。短時間×複数回の遊びでストレスと肥満を予防。\n・子猫用フードと新鮮な水。爪切り・歯みがきなどのハンドリングをこの時期から慣らす。\n\n【若年成猫（1–6歳）】\n・少なくとも年1回の健康診断。体重・筋肉量・歯科・行動の変化を記録し、早めに相談。\n・室内の"狩り・登る・隠れる"を満たす環境づくり（上下移動できる棚、爪とぎ、安心できる隠れ家、清潔なトイレ）。\n・活動量に見合った食事管理。間食・給餌量を可視化し、太り始めを早期にキャッチ。\n\n【成熟成猫（7–10歳）】\n・年1回の健診に加えて、基準値をつくるための検査（血液・尿・血圧など）を少なくとも年1回は実施。\n・関節や歯のトラブル、腎臓や甲状腺の初期サインに注意。食欲・飲水・排泄・活動量の小さな変化をメモ。\n・段差を低くしたトイレや滑りにくいマット、水飲み場を増やすなど、少しずつ"年齢にやさしい"住環境へ。\n\n【シニア（11歳〜）】\n・健診は少なくとも年2回を目安に。15歳以上は4か月ごとのチェックも検討。\n・健診ごとに血圧測定。スクリーニングとして血液検査・尿検査、甲状腺（T4）などを定期的に行い、早期発見に努める。\n・体重減少、食欲・飲水・トイレ回数、夜鳴き・落ち着きの変化、歩きにくさ（痛み）を観察。段差を減らし、移動を助けるステップや暖かい寝床を用意。\n\n※上記は一般的な目安です。個体差や持病で必要なケアは変わるため、かかりつけの獣医師と相談して調整してください。\n',
  },
  {
    question: '結果は共有できますか？プライバシーは保護されていますか？',
    answer: '右上の共有ボタンからURLをコピー・共有できます。\nURLに含まれるのは誕生日だけのため個人が特定されることはありません。',
  },
] as const;

// カロリー計算用のメタデータ
export const CALORIE_META = {
  TITLE: '猫のカロリー計算｜体重から1日の必要カロリーを自動計算',
  DESCRIPTION: '体重といくつかの簡単な選択だけで、猫の1日の必要カロリー（kcal/日）を自動計算。結果は標準値と参考幅で表示します。',
  KEYWORDS: '猫, カロリー計算, 必要カロリー, 体重, ペット, 栄養管理',
  OG: {
    TITLE: '猫のカロリー計算',
    DESCRIPTION: '体重から猫の1日の必要カロリーを自動計算。結果は標準値＋参考幅で表示。',
    URL: 'https://cat-tools.catnote.tokyo/calculate-cat-calorie',
    SITE_NAME: 'ねこツールズ',
  },
} as const;

// カロリー計算用のUI文言
export const CALORIE_UI_TEXT = {
  HEADER: {
    EYECATCH: '猫のカロリーをかんたん計算',
    TITLE: '猫のカロリー計算',
    DESCRIPTION: '体重といくつかの選択だけで、1日の必要カロリー（kcal/日）を表示します。結果は標準値と参考幅で出るので、むずかしい設定は不要です。',
  },
  BREADCRUMBS: {
    HOME: 'ホーム',
  },
  INPUT: {
    WEIGHT_LABEL: '体重(kg)',
    WEIGHT_PLACEHOLDER: '例: 4.2',
    WEIGHT_HELP: '例: 4.2',
    LIFE_STAGE_LABEL: 'ライフステージ',
    NEUTERED_LABEL: '去勢/避妊済み',
    GOAL_LABEL: '目標',
    STAGES: {
      KITTEN: '子猫（0〜12か月）',
      ADULT: '成猫（1〜10歳）',
      SENIOR: 'シニア（11歳以上）',
    },
    GOALS: {
      MAINTAIN: '維持',
      LOSS: '減量したい',
      GAIN: '増量したい',
    },
    ERROR: {
      WEIGHT_RANGE: '体重が一般的な範囲を外れています（0.5〜12kg目安）。結果はあくまで参考に。',
    },
  },
  RESULT: {
    TITLE: '1日の必要カロリー',
    UNIT: 'kcal/日',
    DETAILS: {
      RANGE: '参考幅',
      FACTOR: '係数',
      FORMULA: '計算に使った式',
      NOTE: 'ひとこと',
    },
    FORMULA_TEXT: 'RER=70×体重^0.75',
  },
  SHARE: {
    BUTTON_LABEL: '共有メニューを開く',
    MENU_LABEL: '共有メニュー',
    SHARE_TEXT: (kcal: string, range: string) => 
      `うちの猫の必要カロリーは「${kcal}（${range}）」でした🐾`,
    DEFAULT_SHARE_TEXT: '猫のカロリーを計算しました🐾',
    MENU_ITEMS: {
      SHARE: 'この結果を共有',
      X_SHARE: 'Xでシェア',
      COPY_LINK: 'リンクをコピー',
    },
    TOAST: {
      SUCCESS: 'リンクをコピーしました',
    },
  },
} as const;

// カロリー計算用のFAQ
export const CALORIE_FAQ_ITEMS = [
    {
      question: 'どうやって計算しているの？',
      answer: 'まずRER（安静時必要量）を計算します：\nRER = 70 × (体重kg)^0.75\n\nそのRERに、ライフステージ／目標／去勢の有無に応じた係数を掛けて、\n1日の必要カロリー（kcal/日）を出します。\n\n本ツールは難しい設定は不要。その代わりに「標準値」と「参考幅」を表示して、\n体格差や生活の違いによるブレをカバーします。'
    },
    {
      question: '参考幅って何？どう使うの？',
      answer: '参考幅＝個体差（やせ気味・太り気味、よく動く・おとなしい等）で生じる\n必要カロリーのゆれ幅です。\n\n使い方のコツ：\n1) まずは標準値でスタート\n2) 週1〜2回、体重をメモ\n3) 増え続け/減り続ける場合は、与える量を5〜10%ずつ上下して調整\n\n無理なく少しずつ調整するのが安全です。'
    },
    {
      question: '標準値とは？',
      answer: '標準値とは、そのライフステージ・目標・去勢状況における「基準となるカロリー量」のことです。\n\n例：成猫・去勢済み・維持目標の場合\n→ RER × 1.2 が標準値\n\n統計学でいう「中央値」や「平均値」とは異なり、獣医学的な推奨基準に基づいた値です。まずはこの標準値から始めて、猫ちゃんの体重変化を見ながら微調整していくのがおすすめです。',
    },
    {
      question: '去勢/避妊はどんな影響がある？',
      answer: '成猫では一般に、未去勢よりも去勢/避妊済みのほうが必要カロリーが低めです。\n目安の係数：\n・未去勢/未避妊：1.4 × RER\n・去勢/避妊済み：1.2 × RER\n\n本ツールでは「成猫」を選ぶとトグルが表示され、\n切り替えに応じて標準値と参考幅が変わります。\n体重の推移を見ながら、5〜10%ずつ微調整してください。'
    }
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
  },
  CALORIE_FAQ: {
    TYPE: 'FAQPage',
    ITEMS: CALORIE_FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer.replace(/\n/g, ' ') // 改行を空白に変換
      }
    }))
  }
} as const;
