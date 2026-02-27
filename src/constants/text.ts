import tools from './tools.json';
import type { Tool as ToolItem } from '../types/tool';

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

export const CAT_FOOD_SAFETY_META = {
  TITLE: '猫の食べ物安全性チェック｜食材名から安全度を判定',
  DESCRIPTION: '玉ねぎやチョコレートなど、猫に与えても大丈夫かを200種類のデータから検索できます。危険度の理由や症状、注意点もまとめました。',
  KEYWORDS: '猫, 食べ物, 安全性, 危険, 注意, 食材',
  OG: {
    TITLE: '猫の食べ物安全性チェック',
    DESCRIPTION: '食材名を入れるだけで、猫にとって安全かどうかを判定します。',
    URL: 'https://cat-tools.catnote.tokyo/cat-food-safety',
    SITE_NAME: 'ねこツールズ',
  },
} as const;

// UI文言
export const COMMON_TEXT = {
  BREADCRUMBS: {
    HOME: 'ホーム',
  },
} as const;

export const FOOTER_TEXT = {
  TOOLS: {
    TITLE: 'ツール',
    LINKS: {
      CAT_FOOD_SAFETY: '猫の食べ物安全性チェック',
      CALCULATE_CAT_AGE: '猫の年齢計算',
      CALCULATE_CAT_CALORIE: '猫のカロリー計算',
      CALCULATE_CAT_FEEDING: '猫の給餌量計算',
      CALCULATE_CAT_WATER_INTAKE: '猫の必要給水量計算',
    },
  },
} as const;

export const UI_TEXT = {
  HEADER: {
    EYECATCH: '猫の年齢を人間年齢に換算',
    TITLE: '猫の年齢計算ツール',
    DESCRIPTION:
      '誕生日を入力するだけで、猫の実年齢を人間年齢の目安に換算できます。ライフステージと次の誕生日までの日数も同時に表示されるため、日々のケア計画に活用しやすい設計です。保護猫などで誕生日が不明な場合も、推定日を入れて目安として利用できます。',
  },
  GUIDE: {
    WHAT_TITLE: 'このツールでできること',
    WHAT_DESCRIPTION:
      '誕生日から猫の年齢を人間年齢の目安に換算し、ライフステージも確認できます。年齢に応じたケアを考える出発点として使えます。',
    USAGE_TITLE: '使用例（こんなときに使えます）',
    USAGE_ITEMS: [
      '保護猫の推定年齢を入力して、現在のライフステージを把握したいとき',
      '健康診断やワクチンの計画を立てる前に、年齢感を整理したいとき',
      '家族やSNSで愛猫の年齢を分かりやすく共有したいとき',
    ],
  },
  BREADCRUMBS: {
    HOME: COMMON_TEXT.BREADCRUMBS.HOME,
    CAT_AGE_CALCULATOR: '猫の年齢計算',
  },
  INPUT: {
    LABEL: '誕生日を入力',
    PLACEHOLDER: '2023-04-01',
    ERROR: {
      REQUIRED: '誕生日を入力してください。',
      INVALID_DATE: '無効な日付です。',
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
  CONTENT: {
    CONVERSION: {
      TITLE: '猫の年齢を人間年齢に換算する考え方（早見表）',
      INTRO:
        '猫の年齢は人間と同じ速さでは進みません。特に子猫期は成長が早く、2歳までに大きく成熟し、その後は比較的ゆるやかに年齢が進みます。',
      BODY: [
        '生後0〜11か月：人間年齢 = 15 × (月齢 ÷ 12)',
        '1〜2歳：人間年齢 = 15 + 9 × ((月齢 - 12) ÷ 12)',
        '2歳以降：人間年齢 = 24 + 4 × ((月齢 - 24) ÷ 12)',
      ],
      FORMULA_TITLE: 'このページで採用している計算式（目安）',
      TABLE_HEADERS: {
        CAT_AGE: '猫年齢',
        HUMAN_AGE: '人間年齢',
      },
      TABLE: [
        { CAT_AGE: '3か月', HUMAN_AGE: '約4歳' },
        { CAT_AGE: '6か月', HUMAN_AGE: '約8歳' },
        { CAT_AGE: '1歳', HUMAN_AGE: '約15歳' },
        { CAT_AGE: '2歳', HUMAN_AGE: '約24歳' },
        { CAT_AGE: '3歳', HUMAN_AGE: '約28歳' },
        { CAT_AGE: '4歳', HUMAN_AGE: '約32歳' },
        { CAT_AGE: '5歳', HUMAN_AGE: '約36歳' },
        { CAT_AGE: '6歳', HUMAN_AGE: '約40歳' },
        { CAT_AGE: '7歳', HUMAN_AGE: '約44歳' },
        { CAT_AGE: '8歳', HUMAN_AGE: '約48歳' },
        { CAT_AGE: '9歳', HUMAN_AGE: '約52歳' },
        { CAT_AGE: '10歳', HUMAN_AGE: '約56歳' },
        { CAT_AGE: '11歳', HUMAN_AGE: '約60歳' },
        { CAT_AGE: '12歳', HUMAN_AGE: '約64歳' },
        { CAT_AGE: '13歳', HUMAN_AGE: '約68歳' },
        { CAT_AGE: '14歳', HUMAN_AGE: '約72歳' },
        { CAT_AGE: '15歳', HUMAN_AGE: '約76歳' },
      ],
      NOTE:
        '猫の年齢換算には複数モデル（1歳=16歳/18歳/20歳など）があり、媒体により差があります。大切なのは数字自体より、現在のライフステージに合ったケアへつなげることです。',
      SOURCES: [
        {
          LABEL: 'VCA Animal Hospitals: Wellness Examination in Cats',
          URL: 'https://vcahospitals.com/animal-medical-dental-group/know-your-pet/wellness-examination-in-cats',
        },
        {
          LABEL: 'AAHA/AAFP 2021 Feline Life Stage Guidelines',
          URL: 'https://catvets.com/resource/aaha-aafp-feline-life-stage-guidelines/',
        },
      ],
    },
    LIFE_STAGE_CARE: {
      TITLE: 'ライフステージ別ケアの要点',
      INTRO:
        '年齢換算の結果は健康管理の出発点です。\n※BCS（ボディ・コンディション・スコア）：体型を「やせ・適正・太り気味」で評価する目安。',
      BCS_TITLE: 'BCSの簡易判定（9段階の目安）',
      BCS_CRITERIA: [
        'BCS 1〜3：やせ気味（肋骨が触れやすく、腰のくびれが目立つ）',
        'BCS 4〜5：適正（肋骨は触れるが浮き出ず、上から見て適度なくびれ）',
        'BCS 6〜9：太り気味〜肥満（肋骨が触れにくく、腹部脂肪が目立つ）',
      ],
      ITEMS: [
        {
          STAGE: '子猫（0〜1歳）',
          POINTS: [
            '毎回の健診で「体重・体格（BCS）・歯・寄生虫・行動」をチェック。ワクチンや不妊手術の時期は生活環境に合わせて獣医師と計画。',
            '家庭内の危険物（コード・小物）を片付け、水平と垂直の遊び場を用意。短時間を複数回の遊びでストレスと肥満を予防。',
            '子猫用フードと新鮮な水を用意し、爪切りや歯みがきなどのハンドリングをこの時期から慣らす。',
          ],
        },
        {
          STAGE: '若年成猫（1〜6歳）',
          POINTS: [
            '少なくとも年1回の健康診断。体重・筋肉量・歯科・行動の変化を記録し、早めに相談。',
            '室内の「狩る・登る・隠れる」を満たす環境づくり（上下移動できる棚、爪とぎ、隠れ家、清潔なトイレ）。',
            '活動量に見合った食事管理。間食や給餌量を可視化し、太り始めを早期に把握。',
          ],
        },
        {
          STAGE: '成熟成猫（7〜10歳）',
          POINTS: [
            '年1回の健診に加え、基準値を作るための検査（血液・尿・血圧など）を少なくとも年1回。',
            '関節や歯のトラブル、腎臓や甲状腺の初期サインに注意。食欲・飲水・排泄・活動量の小さな変化を記録。',
            '段差を低くしたトイレや滑りにくいマット、水飲み場の増設など、年齢にやさしい住環境へ段階的に調整。',
          ],
        },
        {
          STAGE: 'シニア（11歳〜）',
          POINTS: [
            '健診は少なくとも年2回を目安に、15歳以上では4か月ごとのチェックも検討。',
            '健診ごとに血圧測定。スクリーニングとして血液検査・尿検査・甲状腺（T4）などを定期的に確認。',
            '体重減少、食欲・飲水・トイレ回数、夜鳴きや落ち着きの変化、歩きにくさを観察し、移動しやすい環境へ調整。',
          ],
        },
      ],
      LINKS: [
        {
          LABEL: '年齢に応じた食事管理は「猫のカロリー計算」も併用推奨',
          HREF: '/calculate-cat-calorie',
        },
      ],
    },
    UNKNOWN_AGE_GUIDE: {
      TITLE: '年齢が不明な猫の推定ガイド',
      INTRO:
        '保護猫や譲渡猫では誕生日が不明なことがあります。複数の身体サインを組み合わせると、おおよその年齢レンジを推定できます。',
      ITEMS_TITLE: '観察ポイント',
      BODY: [
        '子猫（〜6か月目安）：乳歯〜永久歯の生え替わり途中、体格が小さく活動量が高い',
        '若い成猫（1〜3歳目安）：永久歯が比較的きれい、筋肉量と被毛の張りがある',
        '中年期（4〜9歳目安）：歯石や摩耗が少しずつ目立つ、体重変動が出やすい',
        'シニア（10歳以上目安）：被毛変化、筋肉量低下、目の濁り、行動変化が出やすい',
      ],
      ITEMS: [
        '歯（乳歯/永久歯、歯石、摩耗）',
        '目（透明感、濁り）',
        '体格（体重、筋肉量、脂肪）',
        '被毛（毛づや、毛質、白毛）',
        '行動（活動量、睡眠、遊び方）',
      ],
      NOTE: '推定年齢は目安です。最終判断は動物病院で確認してください。',
    },
    LONGEVITY_CHECKLIST: {
      TITLE: '長生きのための生活改善チェックリスト',
      ITEMS: [
        '完全室内飼育を基本にしている',
        '年齢に応じた頻度で健康診断を受けている',
        '体重を定期記録し、急な増減を見逃していない',
        'フード量を体型に合わせて調整している',
        '新鮮な水を複数箇所に用意している',
        '毎日短時間でも遊びの時間を確保している',
        '爪とぎ・隠れ場所・上下運動の環境がある',
        'デンタルケアを継続している',
        '食欲・飲水・排泄・行動の変化を記録している',
        '異変時の受診先を決めている',
      ],
      LINKS: [
        {
          LABEL: '食事量調整には「猫のカロリー計算」を併用推奨',
          HREF: '/calculate-cat-calorie',
        },
        {
          LABEL: '給餌量の目安確認は「猫の給餌量計算」を併用推奨',
          HREF: '/calculate-cat-feeding',
        },
      ],
    },
    RED_FLAGS: {
      TITLE: '受診の目安サイン',
      INTRO:
        '次のサインがある場合は、年齢に関係なく早めの受診を検討してください。',
      ITEMS: [
        '食欲低下が続く',
        '体重が短期間で増減する',
        '飲水量や尿量が急に増える',
        '嘔吐や下痢が繰り返される',
        '動きたがらない、段差を嫌がる',
        '夜鳴きや落ち着きのなさが増える',
      ],
      NOTE: {
        TITLE: '緊急受診を検討するサイン',
        ITEMS: [
          '半日以上まったく食べない（子猫は特に緊急）',
          '呼吸が苦しそう',
          '頻回嘔吐や強いぐったり',
          '尿が出ない、排尿時に強く痛がる',
        ],
      },
    },
    AVERAGE_LIFESPAN: {
      TITLE: '猫の平均寿命の目安',
      BODY: [
        '全体平均：約15.92歳（令和6年 全国犬猫飼育実態調査）',
        '完全室内飼育：約16.34歳',
        '屋外にも出る猫：約14.24歳',
      ],
      SOURCES: [
        {
          LABEL: '一般社団法人ペットフード協会: 主要指標サマリー（令和6年, PDF）',
          URL: 'https://petfood.or.jp/pdf/data/2024/3.pdf',
        },
      ],
    },
    DISCLAIMER:
      '本コンテンツは一般的な情報提供であり、診断・治療を行うものではありません。体調不良や判断に迷う症状がある場合は、獣医師の診察を受けてください。',
  },
} as const;

export const CAT_FOOD_SAFETY_TEXT = {
  HEADER: {
    EYECATCH: '食材名から安全性をチェック',
    TITLE: '猫の食べ物安全性チェック',
    DESCRIPTION:
      '食材名を入力すると、猫にとって「安全・注意・危険」の目安をすぐに確認できます。あわせて、危険な理由や起こりやすい症状、与える場合の注意点も表示します。誤食時の初動判断の参考としてご利用ください。最終判断は、猫の年齢・持病・体調を踏まえて獣医師に相談するのが安心です。',
  },
  GUIDE: {
    WHAT_TITLE: 'このツールでできること',
    WHAT_DESCRIPTION:
      '食材名から、猫にとっての安全性を「安全・注意・危険」で素早く確認できます。あわせて、注意すべき理由や確認ポイントも把握できます。',
    USAGE_TITLE: '使用例（こんなときに使えます）',
    USAGE_ITEMS: [
      '料理中に猫が食材を口にしそうで、与えてよいかすぐ判断したいとき',
      '家族が猫に人の食べ物をあげる前に、安全性を確認したいとき',
      '誤食が疑われる食材の危険度を、受診判断の参考として確認したいとき',
    ],
  },
  BREADCRUMBS: {
    HOME: COMMON_TEXT.BREADCRUMBS.HOME,
    CAT_FOOD_SAFETY: '猫の食べ物安全性チェック',
  },
  INPUT: {
    LABEL: '食材名',
    PLACEHOLDER: '例: 玉ねぎ、チョコレート、ぶどう',
    BUTTON: '安全性を調べる',
    ERROR: {
      REQUIRED: '食材名を入力してください。',
      TOO_LONG: (max: number) => `食材名は${max}文字以内で入力してください。`,
    },
  },
  RESULT: {
    TITLE: '判定結果',
    HIT_COUNT: (count: number) => `${count}件ヒットしました`,
    NO_RESULTS: (keyword: string) => `「${keyword}」に該当するデータは見つかりませんでした。`,
    EMPTY: '検索すると結果が表示されます。',
    FETCH_ERROR: '検索結果の取得に失敗しました。時間をおいて再度お試しください。',
    STATUS_LABEL: '安全性',
    DESCRIPTION_LABEL: '理由・症状',
    NOTES_LABEL: '注意点・補足',
  },
  SHARE: {
    DEFAULT_TEXT: (baseUrl: string) => `猫の食べ物安全性チェックを使っています🐾\n${baseUrl}`,
    FORMAT_TEXT: (keyword: string, lines: string[], baseUrl: string) =>
      `「${keyword}」の安全性チェック結果\n${lines.join('\n')}\n\n${baseUrl}\n\n#猫 #猫の健康 #ねこツールズ`,
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

export const WATER_INTAKE_META = {
  TITLE: '猫の必要給水量計算｜体重とフード量から1日の飲水目安を算出',
  DESCRIPTION:
    '体重とフード量（任意）から、猫の1日の総水分目標と器からの飲水目安を参考幅で計算します。ドライ10%、ウェット78%の水分率で食事由来水分も表示します。',
  KEYWORDS: '猫, 給水量, 飲水量, 水分量, 水分補給, 健康管理',
  OG: {
    TITLE: '猫の必要給水量計算',
    DESCRIPTION:
      '体重とフード量から、猫の1日の総水分目標と器からの飲水目安を計算します。',
    URL: 'https://cat-tools.catnote.tokyo/calculate-cat-water-intake',
    SITE_NAME: 'ねこツールズ',
  },
} as const;

// カロリー計算用のUI文言
export const CALORIE_UI_TEXT = {
  HEADER: {
    EYECATCH: '猫のカロリーをかんたん計算',
    TITLE: '猫のカロリー計算',
    DESCRIPTION:
      '体重とライフステージなどの条件から、猫の1日に必要なカロリー（kcal/日）の目安を計算します。結果は「標準値」と「参考幅」で表示されるため、与えすぎ・不足の調整に使いやすいのが特長です。まずは標準値から始め、体重推移を見ながら少しずつ調整してください。',
  },
  GUIDE: {
    WHAT_TITLE: 'このツールでできること',
    WHAT_DESCRIPTION:
      '体重や条件から、1日に必要なカロリーの目安（標準値・参考幅）を確認できます。日々の食事量調整の基準作りに使えます。',
    USAGE_TITLE: '使用例（こんなときに使えます）',
    USAGE_ITEMS: [
      'フードの適量が分からず、まずは基準となるkcalを知りたいとき',
      '体重が増減してきたため、維持・減量・増量の目安を見直したいとき',
      '去勢/避妊後に必要カロリーがどの程度変わるか確認したいとき',
    ],
  },
  BREADCRUMBS: {
    HOME: COMMON_TEXT.BREADCRUMBS.HOME,
    CAT_CALORIE_CALCULATOR: '猫のカロリー計算',
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

// 共有UI（汎用）
export const SHARE_UI_TEXT = {
  BUTTON_LABEL: '共有メニューを開く',
  MENU_LABEL: '共有メニュー',
  MENU_ITEMS: {
    SHARE: '共有する',
    X_SHARE: 'Xでシェア',
    COPY_LINK: 'リンクをコピー',
  },
  TOAST: {
    SUCCESS: 'リンクをコピーしました',
    ERROR: 'コピーに失敗しました',
  },
} as const;

// トップページで表示するツール一覧
export const TOOLS: readonly ToolItem[] = tools;

// 給餌量計算用のUI文言
export const FEEDING_RANGE = {
  kcal: { min: 50, max: 1000 },
  density: { min: 50, max: 600 },
} as const;

export const FEEDING_UI_TEXT = {
  HEADER: {
    EYECATCH: '必要カロリーから与える量を計算',
    TITLE: '猫の給餌量計算',
    DESCRIPTION:
      '1日の必要カロリーとフードのカロリー密度（kcal/100g）から、1日に与える量（g）を自動計算します。朝・夜に分けた1回量の目安も同時に表示できるため、毎日の給餌管理をすぐに始められます。結果はあくまで目安なので、便の状態や体重推移を見ながら調整してください。',
  },
  GUIDE: {
    WHAT_TITLE: 'このツールでできること',
    WHAT_DESCRIPTION:
      '1日の必要カロリーと、フード100gあたりのカロリー（kcal/100g）から、1日に与える量（g）を自動計算できます。朝・夜の配分目安も同時に確認できます。',
    USAGE_TITLE: '使用例（こんなときに使えます）',
    USAGE_ITEMS: [
      '今のフードを1日何g与えるべきか、すぐに計算したいとき',
      '朝夕2回に分ける際の1回あたりの量を決めたいとき',
      'フードを切り替えたあと、同じkcal基準で給餌量を再計算したいとき',
    ],
  },
  BREADCRUMBS: {
    HOME: COMMON_TEXT.BREADCRUMBS.HOME,
    FEEDING_CALCULATOR: '猫の給餌量計算',
  },
  RESULT: {
    TITLE: '1日に与える目安量',
    NOTE: '※あくまで目安です。猫の体型や活動量に合わせて少しずつ調整してください。',
  },
  LINKS: {
    CALORIE_TOOL: 'こちら（カロリー計算ツール）',
  },
  WARNINGS: {
    KCAL_RANGE: (min: number, max: number) => `目安の範囲（${min}〜${max}kcal/日）から外れています。結果は参考としてご利用ください。`,
    DENSITY_RANGE: (min: number, max: number) => `目安の範囲（${min}〜${max}kcal/100g）から外れています。結果は参考としてご利用ください。`,
  },
  SHARE: {
    TEXT: (total: number, morning: number, night: number) =>
      `うちの猫の給餌量は 1日 ${total} g（朝 ${morning} g / 夜 ${night} g）でした🐾`,
  },
} as const;

// 給餌FAQ（テキスト定数）
export const FEEDING_FAQ_ITEMS = [
  {
    question: '必要カロリー（kcal/日）が分かりません。どうすればいい？',
    answer: '「猫のカロリー計算」で体重などから1日の必要カロリーを求め、ここに入力してください。',
  },
  {
    question: 'kcal/100g はどこで確認できますか？',
    answer:
      'パッケージやメーカーサイトの「代謝エネルギー：◯◯kcal/100g」を参照してください。\nウェットは「1袋あたり◯◯kcal」との表記があり、100g表記と混同しないよう注意してください。',
  },
  {
    question: '朝・夜の分け方はどうなっている？',
    answer:
      '朝=合計の半分（四捨五入）、夜=合計−朝 とし、端数は朝側で吸収します。',
  },
  {
    question: '結果はどれくらい正確？どう調整すればいい？',
    answer:
      '結果は目安です。\n体型・活動量で必要量は変わります。1〜2週間の変化を見て、与える量を5〜10%ずつ上下して調整してください。',
  },
  {
    question: '入力を共有・保存できますか？',
    answer:
      'URLを共有・ブックマークすれば、いつでも結果を確認できます。',
  },
] as const;

export const WATER_INTAKE_UI_TEXT = {
  HEADER: {
    EYECATCH: '体重とフード量から必要水分を計算',
    TITLE: '猫の必要給水量計算',
    DESCRIPTION:
      '体重から1日の総水分目標（参考幅）を算出し、フード量を入力した場合は食事由来の水分量（ドライ10%、ウェット78%）を差し引いて、器からの飲水目安を表示します。',
  },
  GUIDE: {
    WHAT_TITLE: 'このツールでできること',
    WHAT_DESCRIPTION:
      '体重から1日の総水分目安を計算し、フード量を入力した場合は食事由来の水分を差し引いた「器からの飲水目安」を確認できます。',
    USAGE_TITLE: '使用例（こんなときに使えます）',
    USAGE_ITEMS: [
      '最近の飲水量が少ない/多い気がして、目安レンジと比べたいとき',
      'フードを切り替えたあと、食事由来水分を含めて飲水目標を見直したいとき',
      '日々の飲水記録をつける際に、比較する基準値を作りたいとき',
    ],
  },
  BREADCRUMBS: {
    HOME: COMMON_TEXT.BREADCRUMBS.HOME,
    WATER_INTAKE_CALCULATOR: '猫の必要給水量計算',
  },
  INPUT: {
    WEIGHT_LABEL: '体重（kg）',
    DRY_FOOD_LABEL: 'ドライフード量（g/日）',
    WET_FOOD_LABEL: 'ウェットフード量（g/日）',
    OPTIONAL_HINT: '未入力の場合は 0g として計算します。',
    ERROR: {
      NUMBER: '数値を入力してください。',
      WEIGHT_POSITIVE: '体重は 0 より大きい値を入力してください。',
      NON_NEGATIVE: '0 以上の値を入力してください。',
    },
  },
  RESULT: {
    TOTAL_WATER_TITLE: '総水分目標（1日）',
    FOOD_WATER_TITLE: '食事由来水分（1日）',
    DRINK_TARGET_TITLE: '器からの飲水目標（1日）',
    NOTES: [
      '目安値であり、体調・季節・活動量・持病で変動します。',
      '異常が続く場合は受診を推奨します。',
    ],
  },
} as const;

export const WATER_INTAKE_FAQ_ITEMS = [
  {
    question: 'この計算結果は絶対に守るべき量ですか？',
    answer:
      'いいえ。表示値は健康管理のための目安です。体調・季節・運動量・食事内容で必要量は変わります。',
  },
  {
    question: '参考幅はどう使えばよいですか？',
    answer:
      '日々の飲水量を目安レンジと比較し、増減の傾向を見るために使います。1日だけで判断せず、数日から1週間の推移で確認してください。',
  },
  {
    question: 'あまり水を飲まない場合はどうすればいいですか？',
    answer:
      '水飲み場を増やす、器の素材や形を変える、循環式給水器を使う、ウェットフード比率を上げるなどで改善することがあります。',
  },
  {
    question: 'どんなときに病院へ相談すべきですか？',
    answer:
      '多飲が続く、急に飲水量が増減した、体重減少・食欲低下・嘔吐・元気低下がある場合は早めに受診してください。',
  },
  {
    question: '計算方法を教えてください',
    answer:
      '体重から総水分目安（40〜60mL/kg/日）を算出し、フード量入力時は食事由来の水分量（ドライ10%、ウェット78%）を差し引いて器からの飲水目安を表示します。',
  },
] as const;

// 食べ物安全性チェック用のFAQ
export const CAT_FOOD_SAFETY_FAQ_ITEMS = [
  {
    question: '入力した食材が「危険」と出たら、まず何をすればいいですか？',
    answer:
      '追加で与えるのを止め、食べた量・時刻・食材名をメモしてください。不安がある場合は、かかりつけの獣医師に相談して判断を仰いでください。',
  },
  {
    question: '少量なら食べても大丈夫ですか？',
    answer:
      '食材によっては少量でも危険です。量だけで安全判断せず、表示された注意点を確認し、不安があれば獣医師に相談してください。',
  },
  {
    question: '「注意」と「危険」の違いは何ですか？',
    answer:
      '「注意」は条件次第でリスクがある状態、「危険」は基本的に与えないべき状態です。体調や持病によって危険度は上がるため、迷う場合は受診を優先してください。',
  },
  {
    question: '調理後の食材でも判定は同じですか？',
    answer:
      '加熱でリスクが変わる食材もありますが、基本的には「加熱すれば安全」とは考えないほうが安心です。人向けの味付けや加工が加わると、猫には不適切になる場合があります。',
  },
  {
    question: '結果だけで自己判断してよいですか？',
    answer:
      '本ツールは目安情報です。正確な判断が必要な場合は、かかりつけの獣医師に相談してください。',
  },
] as const;

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

const toFaqStructuredDataItems = <T extends { question: string; answer: string }>(items: readonly T[]) =>
  items.map(item => ({
    '@type': 'Question',
    'name': item.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': item.answer.replace(/\n/g, ' '), // 改行を空白に変換
    },
  }));

// 構造化データ（JSON-LD）用のテキスト
export const STRUCTURED_DATA = {
  FAQ: {
    TYPE: 'FAQPage',
    ITEMS: toFaqStructuredDataItems(FAQ_ITEMS),
  },
  CALORIE_FAQ: {
    TYPE: 'FAQPage',
    ITEMS: toFaqStructuredDataItems(CALORIE_FAQ_ITEMS),
  },
  CAT_FOOD_SAFETY_FAQ: {
    TYPE: 'FAQPage',
    ITEMS: toFaqStructuredDataItems(CAT_FOOD_SAFETY_FAQ_ITEMS),
  },
  WATER_INTAKE_FAQ: {
    TYPE: 'FAQPage',
    ITEMS: toFaqStructuredDataItems(WATER_INTAKE_FAQ_ITEMS),
  },
} as const;
