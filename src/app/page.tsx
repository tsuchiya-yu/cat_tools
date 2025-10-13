import { redirect } from 'next/navigation';

export default function Home() {
  // ルートにアクセスしたら猫年齢計算ページへリダイレクト
  redirect('/calculate-cat-age');
}
