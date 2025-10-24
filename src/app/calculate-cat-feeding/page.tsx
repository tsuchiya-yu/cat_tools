import CatFeedingCalculator from "@/components/CatFeedingCalculator";

export const metadata = {
  title: "猫の給餌量計算｜1日の必要カロリーから与える目安量を自動計算",
  description:
    "1日の必要カロリーとフードのカロリー密度（kcal/100g）を入れるだけで、1日に与える目安量（g）と朝・夜に分けた1回量を自動計算します。",
};

export default function Page() {
  return <CatFeedingCalculator />;
}

