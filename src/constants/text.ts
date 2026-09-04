import tools from './tools.json';
import type { Tool as ToolItem } from '../types/tool';

// メタデータ
export const META = {
  TITLE: '猫の年齢計算｜誕生日から人間年齢に換算【無料ツール】',
  DESCRIPTION:
    '猫の誕生日から実年齢を人間年齢の目安に換算し、ライフステージと次の誕生日までの日数を確認できる無料ツールです。保護猫など誕生日が不明な場合も、推定日を入力して今後のケアを考える目安にできます。',
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
  DESCRIPTION:
    '玉ねぎやチョコレートなど200種類以上の食材を検索し、猫にとっての安全性を「安全・注意・危険」の目安で確認できます。危険な理由、起こりやすい症状、与える際の注意点も掲載。誤食や体調不良時は獣医師へ相談してください。',
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
      CAT_BCS_CHECK: '猫の肥満度チェック（BCS）',
      CAT_FOOD_SAFETY: '猫の食べ物安全性チェック',
      CALCULATE_CAT_AGE: '猫の年齢計算',
      CALCULATE_CAT_CALORIE: '猫のカロリー計算',
      CALCULATE_CAT_FEEDING: '猫の給餌量計算',
      CALCULATE_CAT_WATER_INTAKE: '猫の必要給水量計算',
    },
  },
  GUIDES: {
    TITLE: 'ガイド・読みもの',
    LINKS: {
      CAT_MEAL_MANAGEMENT: '猫の食事管理ガイド',
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
    SHARE_TEXT: (years: number, months: number) =>
      `うちの猫ちゃん、人間に換算したら${years}歳${months}か月でした🐱✨
みんなの猫ちゃんは何歳かにゃ？🐾`,
    X_HASHTAGS: ['#ねこツールズ', '#猫の年齢計算'] as const,
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
  DISCLAIMER:
    '本コンテンツは一般的な情報提供であり、診断・治療を行うものではありません。体調不良や判断に迷う症状がある場合は、獣医師の診察を受けてください。',
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
      `「${keyword}」の安全性チェック結果\n${lines.join('\n')}\n\n${baseUrl}`,
    X_HASHTAGS: ['#ねこツールズ', '#猫の食べ物安全性'] as const,
  },
  CONTENT: {
    EMERGENCY: {
      TITLE: '猫が危険な食べ物を口にしたかもしれないときの対応',
      INTRO:
        '猫が危険な食材を口にした可能性があるときは、症状が出る前でも落ち着いて状況を整理し、動物病院へ相談する準備を進めることが重要です。',
      STEPS: [
        '食べた可能性がある食材名・量・時刻を確認する',
        '追加で同じ食材や別の食べ物を与えない',
        '自己判断で吐かせない',
        'パッケージ、成分表示、吐しゃ物、残り物があれば保管して持参できるようにする',
        '嘔吐、下痢、元気消失、ふらつきなどの症状を記録する',
      ],
      NOTE:
        '加熱済みでも危険な食材や、少量でも受診相談が必要な例があります。不安がある場合は、様子見よりも動物病院への相談を優先してください。',
    },
    DANGER_FOODS: {
      TITLE: '猫に絶対に与えないでほしい食材',
      INTRO:
        '「危険」に分類される食材は、少量でも体調不良や中毒の原因になることがあります。以下は代表例で、実際には検索結果に表示される個別の注意点もあわせて確認してください。',
      NOTE:
        'ネギ類は加熱しても危険です。煮汁、炒め油、ハンバーグなどの混合料理に入っている場合も注意してください。',
      EMPTY: '代表例は現在準備中です。検索欄から個別の食材名で確認してください。',
    },
    CAUTION_FOODS: {
      TITLE: '猫に与えるときに注意が必要な食材',
      INTRO:
        '「注意」には、量、頻度、体質、調理法によってリスクが変わる食材に加え、猫での安全性に関する根拠が限られるため、予防的に積極的な給餌を勧めないものも含まれます。「少量なら与えてよい」という意味ではありません。検索結果の個別の説明・注意点を確認してください。',
      NOTE:
        '人間向け味付け・加工食品は別問題です。素材自体が「注意」や「安全」でも、塩分、糖分、香辛料、油分が加わると不向きになることがあります。',
      EMPTY: '代表例は現在準備中です。検索欄から個別の食材名で確認してください。',
    },
    NON_FOOD_HAZARDS: {
      TITLE: '食べ物以外で猫が口にしやすい危険物',
      INTRO:
        '誤食事故は食べ物以外でも起こります。猫が口にしやすいものは手の届かない場所に保管し、誤飲が疑われる場合は現物や商品名が分かるものを持って相談してください。',
      ITEMS: [
        'ユリ科の植物',
        '人の薬（解熱鎮痛薬など）',
        'アロマオイル・精油',
        '洗剤・消毒用品',
        '保冷剤・乾燥剤',
        'たばこ・加熱式たばこ関連',
        '糸や輪ゴムなどのひも状異物',
      ],
      NOTE: '受診時は、飲み込んだ可能性のある物の名称、量、時刻が分かると相談がスムーズです。',
    },
    GUIDE: {
      TITLE: '判定基準とこのページの使い方',
      INTRO:
        'このページの判定は、家庭内での初期判断を助けるための参考情報です。食材そのものの一般的な傾向を示しており、猫ごとの体質や持病まではカバーしません。',
      STATUS_ITEMS: [
        {
          LABEL: '危険',
          DESCRIPTION: '原則として与えないでください。誤食が疑われる場合は、症状の有無にかかわらず相談を優先します。',
        },
        {
          LABEL: '注意',
          DESCRIPTION:
            '量や調理法、体調によってリスクが変わるものや、猫での安全性に関する根拠が限られ、積極的な給餌を勧めないものです。「少量なら与えてよい」という判定ではないため、個別の説明・注意点を確認してください。',
        },
        {
          LABEL: '安全',
          DESCRIPTION: '一般的に比較的与えられることがある食材です。ただし、量、体質、味付けには注意が必要です。',
        },
      ],
      STEPS: [
        '食材名を入力して検索する',
        '表示された「安全・注意・危険」と理由を確認する',
        '量や調理状態、味付け、猫の体調を踏まえて慎重に判断する',
        '少しでも不安がある場合は、本ツールだけで決めず動物病院へ相談する',
      ],
      NOTE: '本ツールは参考情報であり最終判断ではありません。迷う場合は受診を優先してください。',
    },
    SOURCES: {
      TITLE: '出典',
      INTRO:
        '掲載情報は、公的機関の飼い主向け資料に加え、猫と犬の種差を確認できる研究論文・獣医専門資料を参照しています。一般的な「ペット向け」の予防情報と、特定の動物種で確認された中毒知見を区別して記載しています。',
      GROUPS: [
        {
          TITLE: '危険・注意が必要な食べ物の参考',
          LINKS: [
            {
              LABEL: '環境省: 飼い主のためのペットフード・ガイドライン',
              URL: 'https://www.env.go.jp/nature/dobutsu/aigo/2_data/pamph/petfood_guide_1808.html',
              KIND: '公的機関',
              NOTE: '飼い主向けの総合ガイドライン',
            },
            {
              LABEL: 'FDA: Potentially Dangerous Items for Your Pet',
              URL: 'https://www.fda.gov/animal-veterinary/animal-health-literacy/potentially-dangerous-items-your-pet',
              KIND: '公的機関',
              NOTE: '危険な食べ物・家庭内危険物の例',
            },
            {
              LABEL: 'ASPCA: People Foods to Avoid Feeding Your Pets',
              URL: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets',
              KIND: '専門機関',
              NOTE: '避けるべき人の食べ物の例',
            },
          ],
        },
        {
          TITLE: '猫と犬の種差に関する参考',
          LINKS: [
            {
              LABEL: 'PubMed: Effects of p.o. administered xylitol in cats',
              URL: 'https://pubmed.ncbi.nlm.nih.gov/29430681/',
              KIND: '研究論文',
              NOTE: '健康な猫6匹へのキシリトール投与後の血糖値・血液検査値を調べた小規模研究',
            },
            {
              LABEL: 'Merck Veterinary Manual: Xylitol Toxicosis in Dogs',
              URL: 'https://www.merckvetmanual.com/toxicology/food-hazards/xylitol-toxicosis-in-dogs',
              KIND: '獣医専門資料',
              NOTE: 'キシリトールによる低血糖・肝障害について犬と猫の種差を説明',
            },
            {
              LABEL: 'Merck Veterinary Manual: Grape, Raisin, and Tamarind Toxicosis in Dogs',
              URL: 'https://www.merckvetmanual.com/toxicology/food-hazards/grape-raisin-and-tamarind-vitis-spp-tamarindus-spp-toxicosis-in-dogs',
              KIND: '獣医専門資料',
              NOTE: '犬での腎障害と、猫での報告が限られることを説明',
            },
            {
              LABEL:
                'Journal of Small Animal Practice: Incidence of Vitis fruit-induced clinical signs and acute kidney injury in dogs and cats',
              URL: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9303671/',
              KIND: '研究論文',
              NOTE: 'ぶどう・レーズン類を摂取した猫13頭中2頭に症状がみられたが、急性腎障害は確認されなかった小規模研究',
            },
            {
              LABEL: 'Merck Veterinary Manual: Macadamia Nut Toxicosis in Dogs',
              URL: 'https://www.merckvetmanual.com/toxicology/food-hazards/macadamia-nut-toxicosis-in-dogs',
              KIND: '獣医専門資料',
              NOTE: '特有の臨床症状が報告されているのは犬のみと説明',
            },
          ],
        },
        {
          TITLE: '誤食時の対応の参考',
          LINKS: [
            {
              LABEL: 'ASPCA: What to Do if Your Pet Is Poisoned',
              URL: 'https://www.aspca.org/news/what-do-if-your-pet-poisoned',
              KIND: '専門機関',
              NOTE: '誤食時の初動対応',
            },
          ],
        },
      ],
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
    question: '結果は共有できますか？プライバシーは保護されていますか？',
    answer: '右上の共有ボタンからURLをコピー・共有できます。\nURLに含まれるのは誕生日だけのため個人が特定されることはありません。',
  },
] as const;

// カロリー計算用のメタデータ
export const CALORIE_META = {
  TITLE: '猫のカロリー計算｜体重から1日の必要カロリーを自動計算',
  DESCRIPTION:
    '猫の体重、ライフステージ、去勢/避妊、維持・減量・増量の目標から、1日に必要なカロリー（kcal/日）を自動計算。標準値と参考幅を表示し、フード量を見直す目安として使えます。',
  KEYWORDS: '猫, カロリー計算, 必要カロリー, 体重, ペット, 栄養管理',
  OG: {
    TITLE: '猫のカロリー計算',
    DESCRIPTION:
      '体重、ライフステージ、去勢/避妊、目標から猫の1日に必要なカロリーを自動計算。標準値と参考幅でフード量の見直しに使えます。',
    URL: 'https://cat-tools.catnote.tokyo/calculate-cat-calorie',
    SITE_NAME: 'ねこツールズ',
  },
} as const;

export const WATER_INTAKE_META = {
  TITLE: '猫の必要給水量計算｜体重とフード量から1日の飲水目安を算出',
  DESCRIPTION:
    '猫の体重から1日の総水分目標を参考幅で計算。ドライ・ウェットフードの量を入力すると、食事由来の水分量を差し引き、器から飲む水の目安も確認できます。飲水記録やフード変更後の見直しに使える無料ツールです。',
  KEYWORDS: '猫, 給水量, 飲水量, 水分量, 水分補給, 健康管理',
  OG: {
    TITLE: '猫の必要給水量計算',
    DESCRIPTION:
      '体重とフード量から、猫の1日の総水分目標と器からの飲水目安を計算します。',
    URL: 'https://cat-tools.catnote.tokyo/calculate-cat-water-intake',
    SITE_NAME: 'ねこツールズ',
  },
} as const;

export const MEAL_MANAGEMENT_META = {
  TITLE: '猫の食事管理ガイド｜カロリー・給餌量・水分量の使い分け',
  DESCRIPTION:
    '猫の食事管理で確認したい必要カロリー・給餌量・水分量の違いと、ねこツールズ内の計算ツールを使う順番を案内します。',
  KEYWORDS: '猫, 食事管理, カロリー計算, 給餌量, 水分量, ペット, 栄養管理',
  OG: {
    TITLE: '猫の食事管理ガイド｜カロリー・給餌量・水分量の使い分け',
    DESCRIPTION:
      '猫の食事管理で確認したい必要カロリー・給餌量・水分量の違いと、ねこツールズ内の計算ツールを使う順番を案内します。',
    URL: 'https://cat-tools.catnote.tokyo/cat-meal-management',
    SITE_NAME: 'ねこツールズ',
  },
} as const;

export const CAT_BCS_CHECK_META = {
  TITLE: '猫の肥満度チェック｜BCSで体型の目安を確認',
  DESCRIPTION:
    '肋骨・腰・お腹の3つの観察で、猫の体型（BCS）の目安を確認できます。環境省の5段階BCSを参考にした家庭向けチェックです。診断ではなく観察の目安としてご利用ください。',
  KEYWORDS: '猫, BCS, ボディコンディションスコア, 肥満度チェック, 肥満, 体型',
  OG: {
    TITLE: '猫の肥満度チェック｜BCS',
    DESCRIPTION:
      '肋骨・腰・お腹の観察から、猫の体型（BCS）の目安を家庭で確認できます。',
    URL: 'https://cat-tools.catnote.tokyo/cat-bcs-check',
    SITE_NAME: 'ねこツールズ',
  },
} as const;

export const CAT_BCS_CHECK_FAQ_ITEMS = [
  {
    question: '猫のBCSとは何ですか？',
    answer:
      'BCS（ボディコンディションスコア）は、見た目と触った感触から、主に脂肪のつき方を段階的にみる体型の目安です。本ページでは日本向けに環境省の5段階BCSを主要な参考としています。',
  },
  {
    question: 'BCS3なら適正体重ですか？',
    answer:
      'いいえ。5段階で3に近い特徴は「理想的な体型の目安」という意味であり、特定の体重（kg）が適正だと示すものではありません。個体ごとの骨格や筋肉量も関係します。',
  },
  {
    question: '猫の適正体重は何kgですか？',
    answer:
      '品種や骨格によって差が大きいため、共通の適正体重（kg）表だけでは判断しにくいです。体型（BCS）の観察と、体重の推移をあわせて確認するのがおすすめです。',
  },
  {
    question: '長毛猫はどう確認しますか？',
    answer:
      '毛を分け、できるだけ皮膚の近くで肋骨や背骨を触って確認してください。見た目だけで判断すると、毛量の影響で誤ることがあります。',
  },
  {
    question: 'お腹が垂れているのは肥満ですか？',
    answer:
      '必ずしもそうではありません。正常な体型でもプライモーディアルポーチ（ルーズスキン）と呼ばれる皮膚のたるみが見られることがあります。肋骨の脂肪、腰のくびれ、お腹全体の丸みをあわせて確認してください。',
  },
  {
    question: 'BCSとMCSの違いは？',
    answer:
      'BCSは主に脂肪のつき方、MCS（マッスルコンディションスコア）は筋肉量をみる指標です。脂肪が十分でも筋肉が減っていることがあり、特にシニア猫では注意が必要です。本ツールはMCSを判定しません。',
  },
  {
    question: '子猫にもBCSは使えますか？',
    answer:
      '観察自体は可能です。ただし成長期の食事量は、BCSの観察結果だけで自己調整しないでください。体重の増え方や成長もあわせて確認し、必要なら獣医師に相談してください。',
  },
  {
    question: 'BCS4・5に近い特徴なら食事を減らしてよいですか？',
    answer:
      '自己判断で食事量を大きく減らさないでください。猫の急激な減量は健康を損なうことがあります。本格的な減量は獣医師に相談しながら進めてください。',
  },
  {
    question: 'どんな場合に動物病院へ相談すべきですか？',
    answer:
      '急な体重の増減、食欲低下、嘔吐・下痢、元気がない、痛みがありそうな様子、妊娠中の体型変化などがある場合は、本ツールより受診を優先してください。観察結果が食い違う場合も、不安があれば相談してください。',
  },
] as const;

export const CAT_BCS_CHECK_UI_TEXT = {
  HEADER: {
    EYECATCH: '家庭でできる体型の観察チェック',
    TITLE: '猫の肥満度チェック｜BCS（ボディコンディションスコア）',
    DESCRIPTION:
      '肋骨・腰・お腹の3つの観察から、猫の体型（BCS）の目安を確認できます。環境省の5段階BCSを参考にした家庭向けの観察ガイドです。獣医師による診断や治療判断の代わりにはなりません。',
  },
  GUIDE: {
    WHAT_TITLE: 'このツールでできること',
    WHAT_DESCRIPTION:
      '触診と見た目の観察を組み合わせて、5段階BCSの身体所見にどの程度近いかを案内します。平均や中央値でBCSを計算して確定するものではありません。',
    USAGE_TITLE: '使用例（こんなときに使えます）',
    USAGE_ITEMS: [
      '体重だけでは太っているか分からず、体型の見方を整理したいとき',
      'カロリー計算や給餌量計算の前に、いまの体型印象を確認したいとき',
      '長毛猫など、見た目だけでは判断しづらいときに触診の手順を確認したいとき',
    ],
  },
  BREADCRUMBS: {
    HOME: COMMON_TEXT.BREADCRUMBS.HOME,
    CAT_BCS_CHECK: '猫の肥満度チェック',
  },
  REFERENCE_IMAGE: {
    TITLE: '5段階BCSの参考図',
    DESCRIPTION:
      '環境省の資料にある猫のBCS図です。肋骨の触りやすさ、上から見た腰、横から見たお腹の印象をあわせて確認してください。',
    ALT: '環境省資料をもとにした猫のボディコンディションスコア（BCS）1〜5の参考図',
    CREDIT_PREFIX: '出典: ',
    SOURCE_LABEL: '環境省「飼い主のためのペットフード・ガイドライン」',
    SOURCE_URL:
      'https://www.env.go.jp/nature/dobutsu/aigo/2_data/pamph/petfood_guide_1808/pdf/6.pdf',
  },
  PALPATION_GUIDE: {
    TITLE: '触診のしかた',
    STEPS: [
      '猫が落ち着いているときに、胸の両側（肋骨）と背中の中央（背骨）へ手を当てます',
      '指の腹で軽くなでるよう触り、強く押し込まないでください',
      '長毛の場合は毛を分け、できるだけ皮膚の近くで脂肪の厚みを確認します',
      '「骨がすぐ分かるか / 薄い脂肪があるか / 厚い脂肪で分かりにくいか」を基準に選びます',
    ],
  },
  QUESTIONS: {
    Q1: {
      TITLE: 'Q1. 肋骨や背骨を触ってみてください',
      OPTIONS: [
        {
          value: 1,
          label:
            '肋骨・背骨・腰の骨が外から目立ち、触ると脂肪がほとんどなく骨がはっきり分かる',
        },
        {
          value: 2,
          label: '背骨と肋骨がとても簡単に触れ、脂肪はほとんど感じない',
        },
        {
          value: 3,
          label:
            '外から肋骨は目立たないが、軽く触ると肋骨が分かる。薄く脂肪に覆われている感じがする',
        },
        {
          value: 4,
          label:
            '肋骨の上に少し脂肪を感じるが、軽く触ると肋骨は比較的容易に分かる',
        },
        {
          value: 5,
          label:
            '厚い脂肪に覆われ、肋骨や背骨を触っても分かりにくい、またはほとんど分からない',
        },
      ],
    },
    Q2: {
      TITLE: 'Q2. 猫を真上から見てください',
      OPTIONS: [
        {
          value: 1,
          label: '首が細く、腰が深くくびれて骨ばって見える',
        },
        {
          value: 2,
          label: 'BCS1ほど極端ではないものの、腰まわりが細く見える',
        },
        {
          value: 3,
          label: '肋骨の後ろに、自然な軽いくびれがある',
        },
        {
          value: 4,
          label: '腰のくびれが分かりにくく、胴体がやや丸く見える',
        },
        {
          value: 5,
          label: '腰のくびれがほとんどなく、胴体全体が丸く広がって見える',
        },
      ],
    },
    Q3: {
      TITLE: 'Q3. 猫を横から見て、お腹を確認してください',
      OPTIONS: [
        {
          value: 1,
          label:
            'お腹が大きく上へ引き締まり、脇腹のひだに脂肪はほとんどない（ひだ自体が目立たないこともある）',
        },
        {
          value: 2,
          label: 'お腹の引き締まりはわずかで、脂肪は少ない',
        },
        {
          value: 3,
          label:
            'お腹は緩やかに引き締まっている。脇腹にひだがあっても、脂肪は多くない',
        },
        {
          value: 4,
          label:
            'お腹がやや丸みを帯びる。脇腹のひだが脂肪で垂れ、歩くと揺れに気づくことがある',
        },
        {
          value: 5,
          label:
            'お腹全体が丸く、脇腹のひだが目立ち、歩くと盛んに揺れることがある',
        },
      ],
    },
  },
  POUCH_NOTE: {
    SUMMARY: 'お腹のたるみ（プライモーディアルポーチ）について',
    BODY: '猫のお腹には、正常な体型でもルーズスキン（プライモーディアルポーチ）と呼ばれる皮膚のたるみが見られることがあります。垂れている・少し揺れるだけを肥満とは判断せず、肋骨の脂肪の厚み、腰のくびれ、お腹全体の丸みもあわせて確認してください。BCS4以降では脂肪が増えた脇腹のひだが揺れることもあるため、腹部だけで判断しないでください。',
  },
  SHARE: {
    SHARE_TEXT: (headline: string) =>
      `うちの猫の体型を観察してみたら、「${headline}」でした🐾\nねこツールズのBCSチェックで確認できます`,
    X_HASHTAGS: ['#ねこツールズ', '#猫の肥満度チェック', '#BCS'] as const,
  },
  RESULT: {
    TITLE: '家庭での体型観察の目安',
    NOT_DIAGNOSIS: '※獣医師によるBCS評価の代わりではありません',
    REFERENCE_NOTE: '参考: 環境省「飼い主のためのペットフード・ガイドライン」',
    BREAKDOWN: {
      RIBS: '肋骨（触診）',
      WAIST: '腰（真上）',
      ABDOMEN: '腹部（横）',
    },
    MATCH_HEADLINE: (score: number) => `5段階BCSの「${score}」に近い特徴が見られます`,
    ADJACENT_HEADLINE: (lower: number, upper: number) =>
      `5段階BCSの「${lower}〜${upper}」に近い特徴が見られます`,
    MATCH_LABELS: {
      1: '痩せ側の特徴に近い目安',
      2: 'やや痩せ側の特徴に近い目安',
      3: '理想的な体型の目安',
      4: 'やや肥満側の特徴に近い目安',
      5: '肥満側の特徴に近い目安',
    },
    ADJACENT_LABELS: {
      '1-2': '痩せ〜やや痩せの境界付近の可能性があります',
      '2-3': 'やや痩せ〜理想的な体型の境界付近の可能性があります',
      '3-4': '理想的な体型〜やや肥満の境界付近の可能性があります',
      '4-5': 'やや肥満〜肥満の境界付近の可能性があります',
    },
    ADJACENT_NOTE:
      '観察項目によって1段階の差があります。肋骨の触り心地を中心に、もう一度確認してみてください。',
    UNRESOLVED_HEADLINE: '観察結果に差があり、体型の目安を絞れませんでした',
    UNRESOLVED_PALPATION: [
      '触診と見た目の印象が食い違っています。',
      '毛を分けて肋骨の触り心地をもう一度確認してみてください。',
    ],
    UNRESOLVED_OTHER: [
      '項目ごとの印象が揃っていません。',
      '姿勢や毛並みの影響もあるため、落ち着いた状態でもう一度、肋骨 → 真上 → 横の順で確認してみてください。',
    ],
    PENDING: '3つの質問すべてに回答すると、観察の目安が表示されます。',
  },
  GUIDANCE: {
    LEAN: {
      TITLE: '痩せ側の特徴に近い場合',
      BODY: [
        '痩せて見える原因は、食事量が少ないことだけとは限りません。年齢、持病、歯の問題、消化の問題などが関係することもあります。',
        '急な体重減少、食欲や体調の変化がある場合は、食事量を自己判断で大きく変更せず、動物病院への相談を優先してください。',
      ],
      TOOL_NOTE: '以下の計算ツールは、いまの食事量を把握する補助として使えます（増量の指示ではありません）。',
    },
    IDEAL: {
      TITLE: '理想付近・境界付近の場合',
      BODY: [
        '今の体型を維持できるよう、食事量と体重の変化を定期的に確認するのがおすすめです。',
      ],
      TOOL_NOTE: '現状把握の補助として、カロリー計算・給餌量計算もあわせてご利用ください。',
    },
    HEAVY: {
      TITLE: '肥満側の特徴に近い場合',
      BODY: [
        '自己判断で食事量を大きく減らさないでください。',
        '猫の急激な減量は健康を損なうことがあります。',
        '本格的な減量は獣医師に相談しながら進めてください。',
        '特徴が強い、持病がある、高齢、すでに食事制限中などの場合も、受診相談を優先してください。',
      ],
      TOOL_NOTE: '以下の計算ツールは現状把握の補助です。減量プランや目標カロリーの自動提示は行いません。',
    },
    UNRESOLVED: {
      TITLE: '目安を絞れなかった場合',
      BODY: [
        'まずは観察の再確認を優先してください。',
        '体調に変化がある場合は、計算ツールよりも動物病院への相談を優先してください。',
      ],
    },
    CALORIE_LINK: '猫のカロリー計算',
    FEEDING_LINK: '猫の給餌量計算',
  },
  SUPPLEMENTARY: {
    WHAT_IS_BCS: {
      TITLE: 'BCSとは？',
      BODY: [
        'BCS（ボディコンディションスコア）は、見た目と触った感触から、主に脂肪のつき方を段階評価する指標です。',
        '本ページでは、日本の飼い主向けに環境省「飼い主のためのペットフード・ガイドライン」の5段階BCSを主要な参考としています。',
        '国際的にはWSAVAなどが示す9段階BCSも広く使われます。目的や段階の切り方が異なるため、5段階と9段階の単純な1対1換算表は置きません。',
      ],
    },
    LEVELS: {
      TITLE: 'BCS1〜5の詳しい見方',
      INTRO:
        '環境省の猫用記述を、一般の飼い主さんが確認しやすい表現に整理しています。ツールの選択肢と同じ方向で読んでください。',
      ITEMS: [
        {
          TITLE: 'BCS1（痩せ）',
          BODY: '肋骨・腰椎・骨盤が外から見えやすく、腰が深くくびれ、お腹の引き締まりが強い状態です。',
        },
        {
          TITLE: 'BCS2（やや痩せ）',
          BODY: '背骨と肋骨が容易に触れ、腰まわりは細く見え、お腹の引き締まりはわずかな状態です。',
        },
        {
          TITLE: 'BCS3（理想体重）',
          BODY: '肋骨は触れるが見た目では目立たず、肋骨の後ろに軽いくびれがあり、お腹は緩やかに引き締まっている状態です。',
        },
        {
          TITLE: 'BCS4（やや肥満）',
          BODY: '肋骨の上に少し脂肪を感じるが肋骨は比較的容易に触れ、腰のくびれは分かりにくく、脇腹のひだが脂肪で垂れて歩くと揺れに気づくことがある状態です。',
        },
        {
          TITLE: 'BCS5（肥満）',
          BODY: '肋骨や背骨が厚い脂肪で分かりにくく、腰のくびれがほとんどなく、お腹が丸く脇腹のひだが目立ち歩くと盛んに揺れることがある状態です。',
        },
      ],
      NOTE:
        '一部の観察表現は、環境省原文をそのまま転記したものではなく、図や一般的なBCSの考え方と矛盾しない範囲で補っています。',
    },
    WEIGHT: {
      TITLE: 'BCSと体重の関係',
      BODY: [
        '適正体重は品種や骨格などで異なり、「何kgなら適正」と一律には決めにくいです。',
        '体重の数字だけでなく、体型（BCS）と体重の推移をあわせて見るのが有用です。',
        'このページでは理想体重（kg）の算出は行いません。',
      ],
    },
    MCS: {
      TITLE: 'BCSでは筋肉量までは分かりません',
      BODY: [
        'BCSは主に脂肪のつき方を見る指標です。筋肉量を評価するMCS（マッスルコンディションスコア）とは異なります。',
        '脂肪が十分（または多め）でも筋肉が減っていることがあり、特にシニア猫では注意が必要です。',
        'このツールはMCSを判定しません。気になる変化があれば獣医師に相談してください。',
      ],
    },
    CASES: {
      TITLE: '長毛猫・子猫・シニア猫などの注意',
      PRIORITY_TITLE: '相談を優先したい場合',
      PRIORITY_ITEMS: [
        '妊娠中',
        '急な体重の増減',
        '食欲低下・嘔吐・下痢・明らかな体調不良・痛み',
      ],
      CAUTION_TITLE: '利用できるが、結果だけで判断しない場合',
      CAUTION_ITEMS: [
        '長毛猫（毛を分けて触診する）',
        '子猫・成長期（給餌量をBCSだけで自己調整しない）',
        'シニア猫（筋肉量や体調変化にも注意する）',
        '隣接段階や不一致の結果が出た場合',
      ],
    },
    REFERENCES: {
      TITLE: '参考情報・出典',
      BODY: [
        '医学的・獣医学的な説明は、競合サイトではなく公的機関や一次情報を優先して整理しています。',
      ],
      LINKS: [
        {
          LABEL: '環境省「飼い主のためのペットフード・ガイドライン」',
          URL: 'https://www.env.go.jp/nature/dobutsu/aigo/2_data/pamph/petfood_guide_1808/pdf/6.pdf',
          NOTE: '日本向け5段階BCSの主要参考',
        },
        {
          LABEL: 'WSAVA Feline Body Condition Score',
          URL: 'https://wsava.org/wp-content/uploads/2020/08/Body-Condition-Score-cat-updated-August-2020.pdf',
          NOTE: '国際的に広く使われる9段階BCSの参考',
        },
        {
          LABEL: 'AAHA / AAFP Feline Life Stage Guidelines',
          URL: 'https://www.aaha.org/resources/2021-aaha-aafp-feline-life-stage-guidelines/pe-and-history-focus/',
          NOTE: 'ライフステージごとの体重・BCS・MCS記録の参考',
        },
        {
          LABEL: 'AAHA Nutrition and Weight Management Guidelines',
          URL: 'https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/screening-evaluation/',
          NOTE: '栄養評価におけるBCS/MCSの位置づけ',
        },
        {
          LABEL: 'Association for Pet Obesity Prevention: Cat Body Condition Scoring',
          URL: 'https://www.petobesityprevention.org/catbcs',
          NOTE: '家庭での観察はスクリーニングであることの参考',
        },
      ],
    },
    DISCLAIMER:
      '本コンテンツは家庭での体型観察の目安であり、獣医師による診断・治療の代わりではありません。獣医師監修のツールでもありません。妊娠中や急な体重変化、食欲低下など体調に不安がある場合は、本ツールより動物病院への相談を優先してください。',
  },
} as const;

// カロリー計算用のUI文言
export const NUTRITION_MANAGEMENT_REFERENCES = [
  {
    LABEL: 'Merck Veterinary Manual: Nutritional Requirements of Small Animals',
    URL: 'https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-of-small-animals',
    NOTE: 'RER式と猫の維持エネルギー係数を確認する参考情報',
  },
  {
    LABEL: 'Pet Nutrition Alliance: MER and RER Guide',
    URL: 'https://petnutritionalliance.org/wp-content/uploads/2023/03/MER.RER_.PNA_.pdf',
    NOTE: 'RER/MERの考え方と減量時の係数を確認する参考情報',
  },
  {
    LABEL: '2021 AAHA Nutrition and Weight Management Guidelines for Dogs and Cats',
    URL: 'https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/2021-nutrition-and-weight-management/resourcepdfs/new-2021-aaha-nutrition-and-weight-management-guidelines-with-ref.pdf',
    NOTE: '栄養評価、BCS、個体差を踏まえた調整の参考情報',
  },
] as const;

export const CALORIE_UI_TEXT = {
  HEADER: {
    EYECATCH: '猫のカロリーをかんたん計算',
    TITLE: '猫のカロリー計算',
    DESCRIPTION:
      '体重とライフステージから、猫の1日に必要なカロリー（kcal/日）の目安を計算できます。子猫・成猫・シニアに対応し、成猫では去勢/避妊の有無も反映できます。維持・減量・増量の目標に合わせて、結果は「標準値」と「参考幅」で表示されるため、毎日のフード量を見直す出発点として使えます。',
  },
  OVERVIEW: {
    TITLE: 'このページで確認できること',
    ITEMS: [
      '体重から1日の必要カロリーを計算できます',
      '子猫・成猫・シニアのライフステージを反映できます',
      '成猫では去勢/避妊の有無も反映できます',
      '維持・減量・増量の目標に合わせて確認できます',
      '結果は標準値と参考幅で表示します',
    ],
    USAGE_TITLE: '使い方',
    USAGE_DESCRIPTION:
      '体重を入力し、ライフステージと目標を選ぶだけで、1日の必要カロリーの目安を確認できます。',
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
  NEXT_ACTIONS: {
    TITLE: '次にできること',
    FEEDING: {
      DESCRIPTION: '必要カロリーが分かったら、次にフード量も確認できます。',
      LABEL: '猫の給餌量計算で、1日に与えるグラム数を確認する',
    },
    AGE: {
      DESCRIPTION: 'ライフステージが分からない場合は、猫の年齢計算も利用できます。',
      LABEL: '猫の年齢計算でライフステージを確認する',
    },
  },
  SUPPLEMENTARY: {
    RESULT_GUIDE: {
      TITLE: '計算結果の見方',
      BODY: [
        'このページで表示される「標準値」は、まず最初に試す1日の必要カロリーの基準です。猫ごとの体質や生活環境で必要量は変わるため、表示値はスタート地点として使います。',
        '「参考幅」は、活動量や体型、生活リズムの違いで起こる上下のブレを見込んだ範囲です。標準値から始めて、体重の推移を見ながら、参考幅の中で少しずつ調整していく使い方が現実的です。',
        '1日単位の増減だけで判断せず、数日から1〜2週間の傾向で見ると、食事量が合っているかを判断しやすくなります。',
      ],
      NOTE:
        '表示値は診断結果ではなく、日々の食事管理の目安です。急な増減ではなく、小さく調整して様子を見るのが基本です。',
    },
    BASICS: {
      TITLE: '猫の必要カロリーはどう決まる？',
      INTRO:
        '猫の必要カロリーは体重だけでなく、年齢や去勢・避妊の有無、体重を維持したいか減らしたいかといった目的で変わります。このツールは、それらの条件をまとめて1日の目安に変換します。',
      FACTORS: [
        {
          TITLE: '体重（RER）が土台になる',
          BODY:
            '計算の土台は RER（安静時エネルギー要求量）で、体重から算出します。RERは、猫が安静にしていても生命維持に必要な最低限のエネルギー量です。体重が変わると必要カロリーも連動して変わるため、定期的な体重測定が重要です。',
        },
        {
          TITLE: 'ライフステージで必要量は変わる',
          BODY:
            '子猫・成猫・シニアではエネルギー消費の傾向が異なります。同じ体重でもライフステージが違えば、適切なカロリーの目安は変わります。',
        },
        {
          TITLE: '去勢・避妊の有無も影響する',
          BODY:
            '成猫では、去勢・避妊後に必要カロリーが下がるケースがあります。維持量を考えるときは、去勢・避妊の条件を反映して確認するのが安全です。',
        },
        {
          TITLE: '目標（維持・減量・増量）で係数が変わる',
          BODY:
            '体重維持、減量、増量では適切な目安が異なります。まずは目標に合う設定で標準値を確認し、その後の体重推移で微調整してください。',
        },
      ],
      AGE_LINK: {
        TEXT_BEFORE: 'ライフステージがわからないときは、',
        LABEL: '猫の年齢計算ページ',
        TEXT_AFTER: 'で確認してから設定してください。',
      },
    },
    FEEDING_STEPS: {
      TITLE: '計算結果を給餌量に落とし込む手順',
      INTRO:
        '必要カロリーは、そのままではフードのグラム数になりません。パッケージの表示と合わせて、次の順で換算すると実際の給餌量に落とし込めます。',
      ITEMS: [
        {
          TITLE: '1. フードの kcal/100g を確認する',
          BODY:
            'まず、与えているフードのカロリー表示（kcal/100g）を確認します。商品によっては「1袋あたり」表記のため、100g換算にそろえてから使います。',
        },
        {
          TITLE: '2. 1日量（g）に換算する',
          BODY:
            '計算式は「1日の必要カロリー ÷ フードのkcal/100g × 100」です。必要カロリーが200kcal、フードが400kcal/100gなら、1日量の目安は50gです。',
        },
        {
          TITLE: '3. 1〜2週間ごとに5〜10%ずつ調整する',
          BODY:
            '体重が増え続ける場合は少し減らし、減り続ける場合は少し増やします。急に大きく変えず、5〜10%ずつの小さな調整で様子を見るのが基本です。',
        },
      ],
      FEEDING_LINK: {
        TEXT_BEFORE: '1日量の目安を確認したあとは、',
        LABEL: '猫の給餌量計算ページ',
        TEXT_AFTER: 'で朝・夜の配分目安まで確認できます。',
      },
      WATER_INTAKE_LINK: {
        TEXT_BEFORE: '1日のフード量が決まったら、ドライ・ウェットの量をもとに',
        LABEL: '猫の必要給水量計算ページ',
        TEXT_AFTER: 'で水分摂取の目安も確認できます。',
      },
    },
    PITFALLS: {
      TITLE: 'よくある失敗と見直しポイント',
      ITEMS: [
        {
          TITLE: 'おやつのカロリーを含め忘れる',
          BODY:
            '主食だけで帳尻を合わせると、実際の摂取カロリーが想定より多くなることがあります。おやつをあげる日は、その分を見込んで主食量を調整します。',
        },
        {
          TITLE: '体重を測らずに量だけを固定する',
          BODY:
            '同じ量でも、季節や活動量で必要カロリーは変わります。週1〜2回の体重記録を前提に、量が合っているかを確認してください。',
        },
        {
          TITLE: '一度に大きく増減させる',
          BODY:
            '大きな変更は体調や便の状態に影響しやすく、原因の切り分けもしにくくなります。変更幅を小さくして、変化を追える形で調整します。',
        },
      ],
    },
    VET_SIGNS: {
      TITLE: '受診を検討したいサイン',
      BODY: [
        '食事量を調整しても体重変化が大きい、食欲低下や嘔吐・下痢が続く、元気が落ちている場合は、自己調整を続けるより受診を優先してください。',
        'このページは健康管理の目安を整理するための情報であり、診断を行うものではありません。不安な変化が続く場合は、早めに動物病院へ相談してください。',
      ],
    },
    REFERENCES: {
      TITLE: '計算方法の参考情報',
      BODY: [
        'このツールでは、体重からRER（安静時エネルギー要求量）を求め、ライフステージや目標に応じた係数をかけて1日の必要カロリーの目安を算出しています。',
        '係数はあくまで出発点です。シニア期、減量、増量では個体差が大きいため、体重推移や体調を見ながら調整し、判断に迷う場合は獣医師へ相談してください。',
      ],
      LINKS: NUTRITION_MANAGEMENT_REFERENCES,
    },
    DISCLAIMER:
      '本コンテンツは一般的な情報提供であり、診断・治療を行うものではありません。体調不良や判断に迷う症状がある場合は、獣医師の診察を受けてください。',
  },
  SHARE: {
    BUTTON_LABEL: '共有メニューを開く',
    MENU_LABEL: '共有メニュー',
    SHARE_TEXT: (kcal: string, range: string) => 
      `うちの猫の必要カロリーは「${kcal}（${range}）」でした🐾`,
    DEFAULT_SHARE_TEXT: '猫のカロリーを計算しました🐾',
    X_HASHTAGS: ['#ねこツールズ', '#猫のカロリー計算'] as const,
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

export const HOME_ABOUT_TEXT = {
  TITLE: 'このサイトについて',
  DESCRIPTION:
    'ねこツールズは、猫と暮らす中で必要になりやすい計算や確認をまとめた無料ツール集です。年齢、カロリー、給餌量、必要な水分量、食べ物の安全性、体型（BCS）の観察など、日々の判断を整理するための補助として利用できます。',
  OPERATOR_TITLE: '運営者の背景',
  OPERATOR_DESCRIPTION:
    '運営者はねこ検定上級に合格しており、実際に猫と暮らす中で感じた「ちょっと確認したい」をもとに、日々のケアに役立つツールを作っています。',
  NOTICE_TITLE: 'ご利用にあたって',
  NOTICE_DESCRIPTION:
    '各ツールの結果は一般的な情報や目安であり、診断・治療・投薬判断を行うものではありません。猫の体調不良、誤食、急変などがある場合は、自己判断せず獣医師へ相談してください。',
} as const;

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
    CALORIE_PAGE: '猫のカロリー計算ページ',
  },
  WARNINGS: {
    KCAL_RANGE: (min: number, max: number) => `目安の範囲（${min}〜${max}kcal/日）から外れています。結果は参考としてご利用ください。`,
    DENSITY_RANGE: (min: number, max: number) => `目安の範囲（${min}〜${max}kcal/100g）から外れています。結果は参考としてご利用ください。`,
  },
  SHARE: {
    TEXT: (total: number, morning: number, night: number) =>
      `うちの猫の給餌量は 1日 ${total} g（朝 ${morning} g / 夜 ${night} g）でした🐾`,
    X_HASHTAGS: ['#ねこツールズ', '#猫の給餌量計算'] as const,
  },
  SUPPLEMENTARY: {
    BASICS: {
      TITLE: '猫の1日の給餌量はどう決まる？',
      BODY: [
        '猫の1日に必要な食事量は、「何g与えるか」だけで決まるわけではありません。まずは猫の体重や年齢、活動量などから1日の必要カロリーを考え、そのうえでフードのカロリー密度（kcal/100g）に合わせて、実際に与える量をグラムに換算します。',
        '同じ体重の猫でも、子猫か成猫か、避妊・去勢の有無、運動量、体型によって必要な量は変わります。このページでは、1日の必要カロリーが分かっている場合に、今のフードを1日何g与えるのが目安かを簡単に計算できます。',
      ],
      NOTE:
        'まずは1日の必要カロリーを確認し、そのうえでフードのkcal/100gに合わせてグラムへ換算する、という順番で考えると判断しやすくなります。',
    },
    FORMULA: {
      TITLE: '給餌量の計算式と考え方',
      INTRO: '猫の給餌量は、次の式で計算できます。',
      EQUATION: '1日の給餌量（g） = 1日の必要カロリー ÷ フードのカロリー（kcal/100g） × 100',
      EXAMPLE:
        'たとえば、1日に必要なカロリーが200kcalで、フードが400kcal/100gなら、200 ÷ 400 × 100 = 50g となり、1日の目安は50gです。',
      BODY: [
        'このように、同じ「50g」でもフードによって含まれるカロリーは異なるため、重さだけでなく「kcal/100g」を確認することが大切です。フードを切り替えると、必要カロリーが同じでも与えるグラム数が変わることがあります。',
        '朝と夜に分けて与える場合も、まずは1日の合計量を決めてから、回数に応じて分けるのが基本です。',
      ],
    },
    CONDITIONS: {
      TITLE: '猫の状態によって給餌量が変わる理由',
      INTRO:
        '同じ体重でも、猫の年齢や体型、生活環境によって必要な食事量は変わります。計算結果は便利な目安ですが、猫の状態に合わせて見方を変えることが大切です。',
      ITEMS: [
        {
          TITLE: '子猫は成猫より多く必要になる',
          BODY: [
            '子猫は体を成長させるために多くのエネルギーを使うため、体重あたりの必要カロリーが成猫より高くなる傾向があります。見た目の体重が軽くても、成猫と同じ感覚で量を少なくしすぎないよう注意が必要です。',
            'また、子猫は一度にたくさん食べにくいため、1日の量を複数回に分けて与えるほうが食べやすい場合があります。',
          ],
        },
        {
          TITLE: '成猫は活動量と避妊・去勢の影響を受ける',
          BODY: [
            '成猫の給餌量は、室内で過ごす時間が長いか、よく動くかによって変わります。避妊・去勢後は太りやすくなる猫も多く、同じ体重でも必要量が少し下がることがあります。',
            'そのため、体重だけで一律に決めるのではなく、生活スタイルや体型を見ながら調整するのが現実的です。',
          ],
        },
        {
          TITLE: 'シニア猫は食欲や筋肉量の変化に注意する',
          BODY: [
            'シニア猫は活動量が落ちて必要カロリーが下がることがありますが、一方で食欲の低下や筋肉量の減少が起こることもあります。単純に「年を取ったから減らす」と考えるのではなく、体重を維持できているか、食べ方に変化がないかをあわせて確認することが大切です。',
            '急に食べる量が減った場合は、加齢だけでなく体調の変化にも注意してください。',
          ],
        },
        {
          TITLE: '太り気味の猫は理想体重を基準に考える',
          BODY: [
            '太り気味の猫は、現在の体重だけを基準にすると必要量を多く見積もってしまうことがあります。体型管理をしたい場合は、今の体重だけでなく「目指したい体型」や体つきも意識して考えることが大切です。',
            '急に大きく食事量を減らすのではなく、少しずつ調整しながら、体重の変化を見ていくのが基本です。',
          ],
        },
        {
          TITLE: '妊娠・授乳中は必要量が増えやすい',
          BODY: [
            '妊娠中や授乳中の猫は、通常の成猫よりも多くのエネルギーを必要とすることがあります。とくに授乳期は消耗が大きく、普段と同じ量では足りない場合があります。',
            'この時期は個体差も大きいため、一般的な目安だけでなく、食欲や体調、体重の変化をよく見ながら判断してください。',
          ],
        },
      ],
    },
    ADJUSTMENT: {
      TITLE: '計算結果をどう調整するか',
      BODY: [
        '計算結果は、あくまでスタート地点となる目安です。猫によって必要量には差があるため、実際には体重や体型、便の状態、食べ残しの有無を見ながら微調整していく必要があります。',
        'まずは計算した量で1〜2週間ほど様子を見て、体重が増えすぎるなら少し減らし、減りすぎるなら少し増やす、という考え方が基本です。一度に大きく変えるのではなく、少しずつ調整するほうが変化を追いやすくなります。',
      ],
      ITEMS: [
        {
          TITLE: '1〜2週間ごとに体重を確認する',
          BODY: [
            '食事量が合っているかを見るには、見た目だけでなく体重の変化を定期的に確認するのが分かりやすい方法です。1〜2週間ごとに記録しておくと、増えすぎ・減りすぎに早く気づけます。',
            '短期間で判断しすぎず、同じ条件で継続して見ることが大切です。',
          ],
        },
        {
          TITLE: '増やす・減らすときは5〜10%ずつ調整する',
          BODY: [
            '体重の増減に応じて量を見直すときは、急に大きく変えるのではなく、まずは5〜10%ほどの小さな調整から始めると安心です。',
            'たとえば1日50gを与えていて体重が増えるなら、45〜47g程度に少し下げて様子を見る、という調整がしやすい方法です。',
          ],
        },
        {
          TITLE: '便の状態や食べ残しもあわせて見る',
          BODY: [
            '給餌量の見直しでは、体重だけでなく、便の状態や食べ残し、食べたあとの満足感も参考になります。毎回残すなら量が多い可能性があり、強い空腹サインが続くなら少ない可能性もあります。',
            '数値だけでなく、日々の様子をあわせて見ることで、より合った量に近づけます。',
          ],
        },
      ],
      NOTE:
        '急に大きく増やしたり減らしたりせず、小さく調整して様子を見るほうが、体重の変化や食べ方の差を追いやすくなります。',
    },
    FOOD_TYPES: {
      TITLE: 'ドライフード・ウェットフード・おやつの考え方',
      BODY: [
        '同じ「フード」でも、ドライとウェットではカロリー密度が大きく異なります。また、おやつも1日の総カロリーに含まれるため、主食とは別物として考えないことが大切です。',
        '食べる量をグラムで見るだけでなく、最終的には「1日にどれだけカロリーを摂るか」で考えると調整しやすくなります。',
      ],
      ITEMS: [
        {
          TITLE: 'kcal/100g の見方',
          BODY: [
            'フードのカロリーは、パッケージやメーカー公式サイトにある「代謝エネルギー」や「ME」の表示で確認できます。給餌量を計算するときは、kcal/100g の表記を使うのが基本です。',
            '表記場所は商品によって異なるため、見つからない場合は栄養成分表示や商品説明をよく確認してください。',
          ],
        },
        {
          TITLE: 'ウェットフードは100g表記と1袋表記を確認する',
          BODY: [
            'ウェットフードは、「100gあたり」ではなく「1袋あたり」「1缶あたり」でカロリーが書かれていることがあります。ここを取り違えると、計算結果が大きくずれてしまいます。',
            'たとえば、40g入りのパウチ1袋が35kcalなら、100gあたりでは約87.5kcalです。単位をそろえてから計算すると分かりやすくなります。',
          ],
        },
        {
          TITLE: 'おやつをあげる日はフード量を調整する',
          BODY: [
            'おやつもカロリーを持っているため、毎日の食事量を考えるときは主食とは別にせず、1日の合計に含めて考える必要があります。',
            '主食を計算どおりに与えたうえでおやつを追加すると、気づかないうちに食べすぎになりやすくなります。おやつをあげる日や毎日少量あげる習慣がある場合は、その分を見込んで主食を少し調整するのが基本です。',
          ],
        },
      ],
    },
    EXAMPLES: {
      TITLE: '給餌量の具体例',
      INTRO:
        '計算式だけではイメージしにくい場合は、具体例で考えると分かりやすくなります。ここでは、よくあるケースをもとに、給餌量の見方を簡単に紹介します。',
      ITEMS: [
        {
          TITLE: '室内で暮らす成猫の例',
          BODY: [
            'たとえば、1日の必要カロリーが200kcalで、食べているドライフードが400kcal/100gなら、1日の給餌量は50gが目安です。朝と夜の2回に分けるなら、1回あたり25g前後になります。',
            'まずはこの量から始めて、体重や食べ残しを見ながら少しずつ調整していきます。',
          ],
        },
        {
          TITLE: 'ダイエット中の猫の例',
          BODY: [
            '体重管理をしたい猫では、計算で出た量をそのまま固定するのではなく、体型や体重の推移を見ながら慎重に調整することが大切です。',
            '食事量を急に大きく減らすのではなく、小さな幅で見直しながら、少しずつ理想の体型に近づけていくほうが続けやすく、変化も確認しやすくなります。',
          ],
        },
        {
          TITLE: 'ウェット併用の猫の例',
          BODY: [
            'ドライフードとウェットフードを併用している場合は、グラム数だけでなく、それぞれのカロリーを合計して考えます。',
            '見た目にはウェットのほうが量が多く見えても、水分が多いため、必ずしもカロリーが高いとは限りません。大切なのは、1日の総カロリーが必要量に収まっているかどうかです。',
          ],
        },
      ],
    },
    RELATED_TOOLS: {
      TITLE: '関連ツール',
      INTRO_BEFORE_LINK:
        'このページは、1日の必要カロリーが分かっている場合に、実際の給餌量をグラムで計算するためのツールです。まだ必要カロリーが分からない場合は、',
      INTRO_AFTER_LINK:
        'で体重やライフステージから目安を確認してから使うと、よりスムーズに食事量を決められます。',
      BODY:
        '「必要カロリーを知るページ」と「給餌量をグラムに換算するページ」をあわせて使うことで、毎日の食事管理がしやすくなります。',
    },
    REFERENCES: {
      TITLE: '計算方法の参考情報',
      BODY: [
        'このページの給餌量計算は、1日の必要カロリーとフードのカロリー密度をもとにグラムへ換算する考え方を採用しています。',
        'フードのラベル表示や体型変化もあわせて確認し、計算結果を固定値にせず、必要に応じて少しずつ調整してください。',
      ],
      LINKS: [
        {
          LABEL: 'AAFCO: Reading Labels',
          URL: 'https://www.aafco.org/consumers/understanding-pet-food/reading-labels/',
          NOTE: 'ペットフードラベル、給餌量表示、カロリー表示を確認する参考情報',
        },
        {
          LABEL: 'AAFCO: Calorie Content',
          URL: 'https://www.aafco.org/resources/startups/calorie-content/',
          NOTE: 'ペットフードのカロリー表示と単位換算を確認する参考情報',
        },
        {
          LABEL: 'WSAVA: Global Nutrition Guidelines',
          URL: 'https://wsava.org/global-guidelines/global-nutrition-guidelines/',
          NOTE: 'BCS、栄養評価、個体差を踏まえた調整の参考情報',
        },
        {
          LABEL: 'FelineVMA / AAFP: Feline Feeding Programs',
          URL: 'https://catvets.com/resource/how-to-feed-how-to-feed-a-cat-consensus-statement/',
          NOTE: '食事回数、食べ方、環境、複数猫家庭での給餌設計の参考情報',
        },
      ],
    },
    DISCLAIMER:
      'このページの計算結果や説明は、一般的な目安として使える内容をまとめたものです。実際に必要な量は、猫の体格や体調、活動量、食欲によって変わります。急な食欲低下や体重変化がある場合は、計算値だけで判断せず、日々の様子もあわせて確認してください。',
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
  {
    question: '子猫は1日何回に分けて与える？',
    answer:
      '子猫は一度にたくさん食べにくいため、成猫よりも回数を分けて与えるほうが食べやすいことがあります。月齢や食欲にもよりますが、1日の合計量を複数回に分けて様子を見るのが基本です。',
  },
  {
    question: 'シニア猫は成猫より少なめにしたほうがいい？',
    answer:
      '活動量の低下で必要量が下がることはありますが、食欲や筋肉量の変化もあるため、一律に減らせばよいわけではありません。年齢だけで判断せず、体重の維持や日々の様子を見ながら調整してください。',
  },
  {
    question: '太り気味の猫は現在体重で計算していい？',
    answer:
      '太り気味の猫では、現在体重だけを基準にすると必要量を多く見積もることがあります。体型管理をしたい場合は、体つきや目標とする状態もあわせて考えるのがおすすめです。',
  },
  {
    question: 'ウェットフードだけでも同じように計算できる？',
    answer:
      'はい。ウェットフードでも、カロリー表示を確認できれば同じ考え方で計算できます。ただし、「100gあたり」なのか「1袋あたり」なのかを必ず確認してください。',
  },
  {
    question: 'フードを変えたら給餌量も変えるべき？',
    answer:
      'はい。フードが変わると、同じ量でもカロリーが変わることがあります。新しいフードの kcal/100g を確認し、同じ必要カロリーに合わせて給餌量を見直すのが安心です。',
  },
  {
    question: 'おやつを毎日あげる場合はどう考える？',
    answer:
      'おやつも1日の総カロリーに含めて考えます。毎日おやつをあげる場合は、その分を見込んで主食の量を少し調整すると、食べすぎを防ぎやすくなります。',
  },
] as const;

export const WATER_INTAKE_UI_TEXT = {
  HEADER: {
    EYECATCH: '体重とフード量から必要水分を計算',
    TITLE: '猫の必要給水量計算',
    DESCRIPTION:
      '体重から1日の総水分目標（参考幅）を算出し、フード量を入力した場合は食事由来の水分量（ドライ10%、ウェット78%）を差し引いて、器からの飲水目安を表示します。',
  },
  REFERENCE_TABLE: {
    TITLE: '猫の体重別・1日の総水分量早見表',
    DESCRIPTION:
      '本ツールで採用している計算基準に基づき、猫の1日の総水分量を、体重1kgあたり40〜60mL、中央目安50mLとして単純換算した参考表です。食事に含まれる水分も合わせた量であり、器から飲む水の量そのものではありません。',
    CAPTION: '猫の体重2kgから8kgまでの1日の総水分量参考表',
    HEADERS: {
      WEIGHT: '体重',
      RANGE: '総水分量の参考幅',
      MID: '中央目安',
    },
    NOTE:
      'この表は健康管理のための参考値です。子猫、シニア猫、妊娠・授乳中の猫、肥満・痩せ気味の猫、持病や治療中の猫では必要量が異なることがあります。フードに含まれる水分を差し引いた「器からの飲水目安」は、下の計算機で確認してください。',
  },
  CALCULATOR: {
    TITLE: '体重とフード量から詳しく計算する',
    DESCRIPTION:
      'ドライフードとウェットフードの1日量を入力すると、食事に含まれる水分を差し引いた、器からの飲水目安を確認できます。',
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
  SUPPLEMENTARY: {
    RESULT_GUIDE: {
      TITLE: '計算結果の見方',
      BODY: [
        'このページに表示される数値は、猫の必要水分量の目安です。器から飲む水だけではなく、フードに含まれる水分も合わせて、猫の1日の水の量を考える前提で使います。',
        'ウェットフードの比率が高い場合は、器からの飲水量が少なく見えても総水分は足りていることがあります。反対に、ドライフード中心では食事から取れる水分が少ないため、器からの飲水目標を意識しやすくなります。',
        '猫 給水量 計算の結果は、毎日ぴったり同じ量を守るための数字ではありません。1日だけで判断せず、数日から1週間ほどの傾向で見て、猫の飲水量の目安と普段の差をつかむ使い方が現実的です。',
      ],
      NOTE:
        '表示値は一般的な目安です。暑さ、活動量、年齢、体調でも上下します。大きく外れる日が1日あるだけで急いで判断せず、普段との違いが続くかを見てください。',
    },
    BASICS: {
      TITLE: '猫の1日に必要な水分量はどう決まる？',
      BODY: [
        '本ツールでは、体重1kgあたり40〜60mLを1日の総水分量の参考幅として採用しています。これは確定的な正常値ではなく、実際の猫の1日の水の量は、体格だけでなく生活環境や食事内容でも変わります。',
        'とくにドライフード 水分は少なく、ウェットフード 水分は多いため、器から飲むべき量は同じ猫でも食事次第で変わります。このツールは、食事由来の水分を差し引いたうえで、器からの飲水量の目安を見やすくしています。',
      ],
      FACTORS: [
        {
          title: '体重',
          description: '猫の必要水分量は、体重が増えるほど1日の総水分目標も増えるのが基本です。',
        },
        {
          title: '食事の種類',
          description: 'ドライフード中心か、ウェットフード中心かで、食事から取れる水分量が大きく変わります。',
        },
        {
          title: '運動量',
          description: 'よく動く猫は水分消費も増えやすく、飲水量の目安が上がることがあります。',
        },
        {
          title: '室温や季節',
          description: '暑い時期や乾燥しやすい時期は、普段より水を必要とすることがあります。',
        },
        {
          title: '年齢',
          description: '子猫からシニアまで、生活リズムや体の変化に応じて飲み方にも個体差が出ます。',
        },
        {
          title: '体調',
          description: '体調の変化でも飲水量は上下します。普段と違う状態が続くかを見てください。',
        },
      ],
      NOTE:
        'まずは総水分目標を確認し、そのうえでフードからどれだけ水分を取れているかを見ると、器からの飲水目標を無理なく解釈しやすくなります。',
    },
    LOW_SIGNS: {
      TITLE: '水分不足かもしれないときのサイン',
      INTRO:
        '猫 水を飲まないように見えても、飲水量の変化は日ごとには気づきにくいものです。心配なときは、その日の量だけでなく、普段との違いを複数のサインで確認するのが大切です。',
      CHECK_TITLE: 'チェックしたい変化',
      ITEMS: [
        '尿量やトイレ回数がいつもより少ない',
        '便がかたく、出しにくそうに見える',
        '口の中や歯ぐきが乾いているように見える',
        'なんとなく元気がない時間が増えた',
        '食欲が落ちている',
      ],
      NOTE_TITLE: '受診を考えたいタイミング',
      NOTE:
        'こうした変化が続く場合や、嘔吐、体重減少などを伴う場合は受診を検討してください。このページは診断ではなく、日々の健康管理の目安として使う内容です。',
    },
    TIPS: {
      TITLE: '猫にしっかり水を飲んでもらうコツ',
      INTRO:
        '飲水量を増やしたいときは、量だけでなく、飲みやすい環境づくりも同じくらい重要です。猫ごとに好みが違うため、ひとつずつ試して反応を見ると続けやすくなります。',
      QUICK_TITLE: 'すぐ試しやすい工夫',
      QUICK_ITEMS: [
        '水飲み場を複数用意して、移動先でも飲めるようにする',
        '水はこまめに交換して、においやほこりを減らす',
        '器の素材や形を変えて、飲みやすいものを探す',
        '自動給水器を試して、動く水を好むか確認する',
        'ウェットフードを取り入れて、食事由来の水分を増やす',
      ],
      PLACE_TITLE: '器や置き場所を見直すポイント',
      PLACE_ITEMS: [
        'ひげが当たりにくい広めの器にする',
        '静かな場所に置き、落ち着いて飲める環境をつくる',
        'トイレや食事場所のすぐ横は避け、少し距離を取る',
        '飲む場所を変えたら1つずつ試して、好みを見極める',
      ],
    },
    OVERDRINKING: {
      TITLE: '水を飲みすぎるときは注意',
      BODY: [
        '猫 水を飲みすぎるように見える場合も、見逃さずに様子を見たいポイントです。暑い時期や食事内容の変化で増えることはありますが、以前より明らかに増えた状態が続くなら注意が必要です。',
        '飲水量は多すぎても少なすぎても、健康状態を知る手がかりになります。普段のおおよその飲み方を把握しておくと、変化に気づきやすくなります。',
      ],
      CHECK_TITLE: 'あわせて確認したい変化',
      ITEMS: [
        '尿量が増えている',
        '体重が減ってきた',
        '食欲に変化がある',
        '以前より元気がない',
        '毛づやの変化が気になる',
      ],
    },
    REFERENCES: {
      TITLE: '計算方法の参考情報',
      BODY: [
        '本ツールでは、1日の総水分量を体重1kgあたり40〜60mLの参考幅で計算し、50mL/kgを中央目安として表示しています。NRC由来の50〜60mL/kg/日は一般的に紹介される推奨値ですが、犬の必要量をもとにした推定で、食事内容、環境温度、活動量などを考慮していないという限界があります。Cornellの猫向け情報は約52mL/kg/日に相当します。',
        '40mL/kg/日はAAHAの犬猫向け輸液ガイドラインで、猫の臨床上の維持水分量として用いられる値であり、健康な猫が経口摂取すべき最低量を示すものではありません。猫における最適な最低水分量は確立されておらず、実際の必要量は食事、環境、活動量、年齢、健康状態などによって変わります。',
      ],
      LINKS: [
        {
          LABEL: 'Journal of Animal Science: 猫の水分摂取に関するスコーピングレビュー',
          URL: 'https://academic.oup.com/jas/article/doi/10.1093/jas/skaf434/8379605',
          NOTE: 'NRCの推奨値の前提、猫の総水分摂取量と尿比重の関係、最適な最低量が確立されていないことの参考情報',
        },
        {
          LABEL: 'Cornell Feline Health Center: Hydration',
          URL: 'https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/hydration',
          NOTE: '猫の水分摂取、ウェットフードとドライフードによる飲水量差、脱水サインの参考情報',
        },
        {
          LABEL: 'Merck Veterinary Manual: Nutritional Requirements of Small Animals',
          URL: 'https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-of-small-animals',
          NOTE: '犬猫の水分必要量、食事・環境・活動量・健康状態による個体差、ドライ/缶詰フードの水分量差の参考情報',
        },
        {
          LABEL: '2024 AAHA Fluid Therapy Guidelines for Dogs and Cats',
          URL: 'https://www.aaha.org/resources/2024-aaha-fluid-therapy-guidelines-for-dogs-and-cats/',
          NOTE: '猫の臨床上の維持水分量と、個々の状態に応じて評価・調整する必要性の参考情報',
        },
      ],
    },
    DISCLAIMER:
      'ここでの情報は受診の目安を整理するための補足です。急な変化が続く場合は、早めに動物病院へ相談してください。',
  },
} as const;

export const WATER_INTAKE_FAQ_ITEMS = [
  {
    question: 'この計算結果は絶対に守るべき量ですか？',
    answer:
      'いいえ。表示値は健康管理のための目安です。体調・季節・運動量・食事内容で必要量は変わります。',
  },
  {
    question: '「器からの飲水目標」と「総水分目標」の違いは？',
    answer:
      '「総水分目標」は、食事に含まれる水分も含めた1日の水分量の目安です。いっぽう「器からの飲水目標」は、その総水分目標から食事由来の水分を差し引いた値で、水皿や給水器から飲んでほしい量の目安を示します。',
  },
  {
    question: 'ウェットフードを食べていれば、水をあまり飲まなくても大丈夫ですか？',
    answer:
      'ウェットフードは食事から水分を取りやすいため、器から飲む量が少なく見えても足りていることがあります。ただし、猫の必要水分量を満たせているかは、食事内容と数日単位の飲水量の推移をあわせて確認してください。',
  },
  {
    question: '参考幅はどう使えばよいですか？',
    answer:
      '日々の飲水量を目安レンジと比較し、増減の傾向を見るために使います。1日だけで判断せず、数日から1週間の推移で確認してください。',
  },
  {
    question: '水道水をあげても大丈夫ですか？',
    answer:
      '一般的には新鮮で清潔な水道水を使って問題ないことが多いです。においや味を嫌がる場合は、器の素材や置き場所を見直しながら、飲みやすい状態を整えてください。',
  },
  {
    question: 'どれくらい飲んでいれば受診の目安になりますか？',
    answer:
      '急に飲水量が増えた・減った状態が続く、尿量の変化、体重減少、食欲低下、嘔吐、元気低下などを伴う場合は早めに受診してください。1日だけでなく、普段との違いが続くかを確認することが大切です。',
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

export const MEAL_MANAGEMENT_UI_TEXT = {
  HEADER: {
    EYECATCH: '食事管理の使い分けと手順',
    TITLE: '猫の食事管理ガイド',
    DESCRIPTION:
      '猫の健康管理で欠かせない「必要カロリー」「給餌量（フード量）」「必要水分量」の3つの要素について、それぞれの違いと確認するおすすめの順番を分かりやすく整理しました。愛猫の体重や食事内容に合わせた日々のケアの目安としてお役立てください。',
  },
  BREADCRUMBS: {
    HOME: COMMON_TEXT.BREADCRUMBS.HOME,
    MEAL_MANAGEMENT: '猫の食事管理ガイド',
  },
  INTRO: {
    TITLE: '3つの要素の違いと関係性',
    DIFFERENCES: [
      {
        TITLE: '必要カロリー（kcal/日）',
        BODY: '猫が1日に必要とするエネルギー量の目安です。体重やライフステージ（子猫・成猫・シニア）、去勢・避妊の有無などによって目安が変わります。',
      },
      {
        TITLE: '給餌量（g/日）',
        BODY: '1日の必要カロリーを満たすために、実際に与えるフードの重さ（グラム）です。フードの種類（ドライ・ウェット）やカロリー密度（kcal/100g）によって必要なグラム数は変わります。',
      },
      {
        TITLE: '必要水分量（mL/日）',
        BODY: '食事に含まれる水分と、器から飲む水を合わせた1日の総水分量の目安です。食事内容によって、器から飲む量の見方が変わります。',
      },
    ],
    START_GUIDE:
      '食事管理を始めるときは、まず「1日に必要なカロリー」を把握し、次に「フードの重さ（g）」へ換算し、必要に応じて「水分量」をチェックするという流れが基本です。',
    HOW_TO_USE:
      '計算された数値はあくまで日々の管理の「出発点」です。猫の個体差や体調、季節に合わせて、1〜2週間の体重や便の状態を観察しながら微調整していくことが大切です。',
  },
  PRIMARY_CARDS: {
    TITLE: '目的に合わせた計算ツール',
    DESCRIPTION: '知りたい内容に合わせて、該当する計算ツールをお選びください。',
    CALORIE: {
      TITLE: '1日に必要なカロリーを知りたい',
      DESCRIPTION:
        '猫の体重、ライフステージ、去勢/避妊の有無、体型目標から、1日に必要なエネルギー（kcal/日）の標準値と参考幅を計算します。',
      ACTION: '猫のカロリー計算で必要カロリーを調べる →',
    },
    FEEDING: {
      TITLE: 'フードを何g与えればよいか知りたい',
      DESCRIPTION:
        '1日の必要カロリーとフードの代謝エネルギー（kcal/100g）から、1日に与える目安量（g）と朝・夜の配分を計算します。',
      ACTION: '猫の給餌量計算で1日の給餌量を調べる →',
    },
    WATER_INTAKE: {
      TITLE: '必要水分量の目安を知りたい',
      DESCRIPTION:
        '体重から1日の総水分目標を計算し、ドライ・ウェットフードの量から食事由来の水分を差し引いた器からの飲水目標を確認できます。',
      ACTION: '猫の必要給水量計算で飲水目安を調べる →',
    },
  },
  SEQUENCE: {
    TITLE: '猫の食事管理 6つの基本ステップ',
    INTRO:
      '食事管理に迷ったときは、次の6つのステップに沿って順番に確認していくとスムーズに整理できます。',
    STEPS: [
      {
        STEP: 'STEP 1',
        TITLE: '体重とライフステージの確認',
        BODY: 'まずは猫の現在の体重、月齢・年齢（子猫・成猫・シニア）、去勢・避妊の有無、体型目標（維持・減量・増量）を把握します。',
      },
      {
        STEP: 'STEP 2',
        TITLE: '1日の必要カロリーの算出',
        BODY: '「猫のカロリー計算」を使い、安静時エネルギー要求量（RER）をもとに1日に必要なエネルギー量（kcal/日）の標準値と参考幅を算出します。',
      },
      {
        STEP: 'STEP 3',
        TITLE: 'フードのカロリー密度から給餌量（g）に換算',
        BODY: '「猫の給餌量計算」でフード袋に記載された代謝エネルギー（kcal/100g）をもとに、1日に与える給餌量（g）と朝夕の目安量を計算します。',
      },
      {
        STEP: 'STEP 4',
        TITLE: 'ウェットフードやおやつの調整',
        BODY: 'ウェットフードやおやつも1日の総カロリーに含め、主食全体とのバランスを見ながら量を調整します。',
      },
      {
        STEP: 'STEP 5',
        TITLE: '必要に応じて水分量の目安を確認',
        BODY: '「猫の必要給水量計算」を使い、フードに含まれる水分量を差し引いた器からの飲水目安を確認し、普段の飲み方と比べます。',
      },
      {
        STEP: 'STEP 6',
        TITLE: '1〜2週間の体重・体調推移を見て微調整',
        BODY: '計算結果は固定せず、週1〜2回の体重測定や便の状態、元気さを見ながら、必要に応じて5〜10%ずつ与える量を微調整します。',
      },
    ],
  },
  EXAMPLE: {
    TITLE: '実際に3つのツールを使うときの流れ',
    INTRO:
      '例として「4kg・去勢済みの成猫」の1日の食事を考える場合、3つのツールを次のようにつなげて使います。ここでは順番だけを示し、詳しい条件や計算方法は各ツールで確認します。',
    STEPS: [
      {
        TITLE: '猫の条件を整理する',
        BODY: '現在の体重が4kgであること、成猫で去勢済みであること、体重を維持したいかなどを確認します。',
        HREF: null,
        LINK_LABEL: null,
      },
      {
        TITLE: '必要カロリーの目安を確認する',
        BODY: '整理した条件を「猫のカロリー計算」に入力し、1日に必要なカロリーの目安を確認します。',
        HREF: '/calculate-cat-calorie',
        LINK_LABEL: '猫のカロリー計算を開く',
      },
      {
        TITLE: 'フードの表示を確認する',
        BODY: '普段使っているフードのパッケージで、kcal/100gとドライ・ウェットそれぞれの内容を確認します。',
        HREF: null,
        LINK_LABEL: null,
      },
      {
        TITLE: '1日のフード量へ換算する',
        BODY: '必要カロリーとフードのkcal/100gを「猫の給餌量計算」に入力し、1日に与えるグラム数の目安へ換算します。',
        HREF: '/calculate-cat-feeding',
        LINK_LABEL: '猫の給餌量計算を開く',
      },
      {
        TITLE: '食事内容に応じて水分量も確認する',
        BODY: 'ドライ・ウェットの量をもとに、必要に応じて「猫の必要給水量計算」で食事由来の水分と器から飲む量の目安を確認します。',
        HREF: '/calculate-cat-water-intake',
        LINK_LABEL: '猫の必要給水量計算を開く',
      },
      {
        TITLE: 'その後の変化を観察する',
        BODY: '計算結果を固定値とせず、体重・食欲・便・元気など普段との変化を継続して見ながら調整します。',
        HREF: null,
        LINK_LABEL: null,
      },
    ],
  },
  CASES: {
    TITLE: 'よくあるお悩みとツールの使い分け',
    INTRO: '状況に応じて、どこから計算を始めるか選ぶとスムーズです。',
    ITEMS: [
      {
        TITLE: '1日の必要カロリーの目安が分からない場合',
        BODY: 'まずは「猫のカロリー計算」で体重とライフステージから1日の必要カロリー（標準値・参考幅）を確認しましょう。給餌量を考える出発点になります。',
      },
      {
        TITLE: '必要カロリーは分かるが、与えるグラム数が分からない場合',
        BODY: 'フードパッケージの「kcal/100g」を確認し、「猫の給餌量計算」で1日の給餌グラム数と朝・夜の1回量を算出しましょう。フードを切り替えた際にも便利です。',
      },
      {
        TITLE: 'ドライとウェットを併用している・飲水量が気になる場合',
        BODY: '「猫の必要給水量計算」でフード由来の水分を差し引いた器からの飲水目安を確認し、普段の飲み方との違いを観察しましょう。',
      },
    ],
  },
  CAUTION: {
    TITLE: 'ご利用にあたっての注意事項',
    ITEMS: [
      '本ガイドおよび各ツールの計算結果は日々の食事管理の目安であり、病気の診断や治療を目的としたものではありません。',
      '急激な体重の増減、食欲不振、嘔吐・下痢、元気がないなどの異変が見られる場合は、自己判断で食事調整を続けず、速やかに動物病院で獣医師にご相談ください。',
      '詳しい計算根拠や個別の注意事項については、各ツールのページをご確認ください。',
    ],
  },
  REFERENCES: {
    TITLE: '参考情報',
    INTRO:
      'このページでは、各計算ツールで使用している一般的な栄養管理の考え方をもとに、食事管理の流れを整理しています。詳しい計算根拠や注意点は各ツールのページでご確認ください。',
    LINKS: NUTRITION_MANAGEMENT_REFERENCES,
  },
  AUXILIARY: {
    TITLE: 'その他の関連ツール・サイト情報',
    ITEMS: [
      {
        TITLE: '猫の年齢計算',
        DESCRIPTION: '誕生日から猫の実年齢を人間年齢に換算し、ライフステージを確認できます。',
        HREF: '/calculate-cat-age',
        ACTION: '年齢計算ツールを開く →',
      },
      {
        TITLE: '猫の食べ物安全性チェック',
        DESCRIPTION: '玉ねぎやチョコレートなど200種類以上の食材の安全性（安全・注意・危険）を判定します。',
        HREF: '/cat-food-safety',
        ACTION: '食べ物安全性チェックを開く →',
      },
      {
        TITLE: 'ねこツールズについて',
        DESCRIPTION: 'サイトの開設理由、運営者「つくしの飼い主」について、ご利用時の注意点を紹介します。',
        HREF: '/about',
        ACTION: 'サイトについて見る →',
      },
    ],
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
    },
    {
      question: '計算結果とフード袋の給与量が違うときは？',
      answer:
        'フード袋の給与量は商品ごとの基準値、本ページは体重や条件から算出した目安値です。まずはどちらか一方を開始点にし、1〜2週間単位の体重推移で5〜10%ずつ調整してください。',
    },
    {
      question: 'どのくらいの頻度で再計算すればいい？',
      answer:
        '体重が増減したとき、ライフステージが変わったとき、去勢/避妊や目標設定が変わったときは再計算してください。変化がない場合でも、月1回程度は見直すと管理しやすくなります。',
    },
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
  CAT_BCS_CHECK_FAQ: {
    TYPE: 'FAQPage',
    ITEMS: toFaqStructuredDataItems(CAT_BCS_CHECK_FAQ_ITEMS),
  },
} as const;
