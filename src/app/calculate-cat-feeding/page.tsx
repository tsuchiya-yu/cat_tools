import type { Metadata } from "next";
import CatFeedingCalculator from "@/components/CatFeedingCalculator";
import JsonLdScript from "@/components/JsonLdScript";
import { CALCULATE_CAT_FEEDING_PATH } from "@/constants/paths";
import { FEEDING_UI_TEXT } from "@/constants/text";
import { createPageBreadcrumbList } from "@/lib/breadcrumbStructuredData";
import { createWebApplicationStructuredData } from "@/lib/webApplicationStructuredData";

const FEEDING_PAGE_TITLE = "猫の給餌量計算｜複数フードにも対応・1日の目安量を自動計算";
const FEEDING_PAGE_DESCRIPTION =
  "猫の1日の必要カロリーとキャットフードのkcal/100gから給餌量を自動計算。2〜5種類のフードを混ぜる場合も、与えたいグラム数の比率を指定して、それぞれ1日何g与えるか確認できます。";

const feedingBreadcrumbStructuredData = createPageBreadcrumbList({
  name: FEEDING_UI_TEXT.BREADCRUMBS.FEEDING_CALCULATOR,
  path: CALCULATE_CAT_FEEDING_PATH,
});

const feedingWebApplicationStructuredData = createWebApplicationStructuredData({
  name: '猫の給餌量計算',
  url: 'https://cat-tools.catnote.tokyo/calculate-cat-feeding',
  description: FEEDING_PAGE_DESCRIPTION,
  applicationCategory: 'UtilitiesApplication',
});

export const metadata: Metadata = {
  title: FEEDING_PAGE_TITLE,
  description: FEEDING_PAGE_DESCRIPTION,
  alternates: {
    canonical: "/calculate-cat-feeding",
  },
  openGraph: {
    title: FEEDING_PAGE_TITLE,
    description: FEEDING_PAGE_DESCRIPTION,
    url: "https://cat-tools.catnote.tokyo/calculate-cat-feeding",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: FEEDING_PAGE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: FEEDING_PAGE_TITLE,
    description: FEEDING_PAGE_DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function Page() {
  return (
    <>
      <JsonLdScript data={[feedingWebApplicationStructuredData, feedingBreadcrumbStructuredData]} />
      <CatFeedingCalculator />
    </>
  );
}
