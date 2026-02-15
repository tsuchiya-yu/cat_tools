import type { Metadata } from "next";
import CatFeedingCalculator from "@/components/CatFeedingCalculator";

export const metadata: Metadata = {
  title: "猫の給餌量計算｜1日の必要カロリーから与える目安量を自動計算",
  description:
    "1日の必要カロリーとフードのカロリー密度（kcal/100g）を入れるだけで、1日に与える目安量（g）と朝・夜に分けた1回量を自動計算します。",
  alternates: {
    canonical: "/calculate-cat-feeding",
  },
  openGraph: {
    title: "猫の給餌量計算｜1日の必要カロリーから与える目安量を自動計算",
    description:
      "1日の必要カロリーとフードのカロリー密度（kcal/100g）を入れるだけで、1日に与える目安量（g）と朝・夜に分けた1回量を自動計算します。",
    url: "https://cat-tools.catnote.tokyo/calculate-cat-feeding",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "猫の給餌量計算｜1日の必要カロリーから与える目安量を自動計算",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "猫の給餌量計算｜1日の必要カロリーから与える目安量を自動計算",
    description:
      "1日の必要カロリーとフードのカロリー密度（kcal/100g）を入れるだけで、1日に与える目安量（g）と朝・夜に分けた1回量を自動計算します。",
    images: ["/og.png"],
  },
};

type PageProps = {
  searchParams?: Promise<{
    kcal?: string | string[];
    d?: string | string[];
  }>;
};

const getSingleParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] ?? "" : value ?? "");

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const initialKcal = getSingleParam(resolvedSearchParams?.kcal);
  const initialDensity = getSingleParam(resolvedSearchParams?.d);
  return <CatFeedingCalculator initialKcal={initialKcal} initialDensity={initialDensity} />;
}
