export const SITE_CONFIG = {
  NAME: 'ねこツールズ',
  URL: 'https://cat-tools.catnote.tokyo',
  DESCRIPTION:
    '猫の年齢換算、1日の必要カロリー・給餌量・水分量の計算、食べ物の安全性チェックを無料で使える「ねこツールズ」。各ツールの計算方法や参考情報も確認でき、愛猫の健康管理や日々のお世話の目安として利用できます。',
} as const;

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? SITE_CONFIG.URL;
}
