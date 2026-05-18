import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLdScript from '@/components/JsonLdScript';
import { SITE_CONFIG } from '@/config/site';
import { ABOUT_PATH, CONTACT_FORM_URL, X_PROFILE_URL } from '@/constants/paths';
import TsukushiImage from './TsukushiImage';

export const metadata: Metadata = {
  title: 'サイトについて',
  description:
    'ねこツールズを作った理由、運営者「つくしの飼い主」について、サイトで大切にしていること、ご利用時の注意点を紹介します。',
  alternates: {
    canonical: ABOUT_PATH,
  },
};

const aboutPageDescription =
  'ねこツールズを作った理由、運営者「つくしの飼い主」について、サイトで大切にしていること、ご利用時の注意点を紹介します。';

const operatorStructuredData = {
  '@type': 'Person',
  name: 'つくしの飼い主',
  description:
    'ねこツールズを個人開発で運営している猫の飼い主です。保護猫のつくしとの暮らしをきっかけに、猫と暮らす人のためのツールを作っています。',
  sameAs: [X_PROFILE_URL],
};

const aboutStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      name: 'サイトについて',
      url: `${SITE_CONFIG.URL}${ABOUT_PATH}`,
      description: aboutPageDescription,
      mainEntity: operatorStructuredData,
    },
    {
      '@type': 'ProfilePage',
      name: 'つくしの飼い主について',
      url: `${SITE_CONFIG.URL}${ABOUT_PATH}`,
      description: aboutPageDescription,
      mainEntity: operatorStructuredData,
    },
  ],
};

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'ねこツールズ',
      item: SITE_CONFIG.URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'サイトについて',
      item: `${SITE_CONFIG.URL}${ABOUT_PATH}`,
    },
  ],
};

const sections = [
  {
    title: 'ねこツールズとは',
    body: [
      'ねこツールズは、猫と暮らす中で出てくる「これってどうだっけ？」を、できるだけ簡単に確認できるようにするためのWebサイトです。',
      '猫の年齢、必要カロリー、給餌量、水分量、食べ物の安全性など、日々の暮らしで迷いやすいことを、シンプルなツールとしてまとめています。',
      '専門的な知識がなくても、スマートフォンやパソコンからすぐに目安を確認できることを大切にしています。',
    ],
  },
  {
    title: '作った理由',
    body: [
      '猫と暮らしていると、毎日の中に小さな疑問や不安がたくさん出てきます。',
      '「このフード量で足りているのかな」\n「年齢でいうと、今はどんなライフステージなんだろう」\n「水分はちゃんと取れているのかな」\n「この食べ物は猫にあげても大丈夫なのかな」',
      '保護猫のつくしと暮らすようになってから、こうしたことを何度も調べるようになりました。',
      '根本にあるのは、つくしにできるだけ長く、できるだけ幸せに暮らしてほしいという気持ちです。できれば、これからもずっと一緒に暮らしていきたい。そのために、日々の食事や水分量、体調の変化、ライフステージごとの違いを、飼い主として少しでも理解しておきたいと思うようになりました。',
      'もちろん、猫の健康について最終的に頼るべきなのは動物病院です。けれど、毎日の暮らしの中で「今すぐ少しだけ確認したい」「病院に行く前に、まず目安を知っておきたい」と思う場面もあります。',
      'そうした時に、必要な情報や計算ツールが1つの場所にまとまっていたら、猫と暮らす人にとって少し助けになるのではないかと思いました。',
      'ねこツールズは、そんな思いから個人開発として作り始めたサイトです。',
      '猫との暮らしに正解は1つではありません。猫の性格、年齢、体質、生活環境によって、気にするべきことも変わります。それでも、飼い主が「知ろうとすること」「気づこうとすること」は、猫との生活を少しずつ良くしていくきっかけになると考えています。',
      'ねこツールズが、猫と暮らす人の「どうだっけ？」を少しでも減らし、愛猫との暮らしをより安心できるものにする手助けになれば嬉しいです。',
    ],
  },
  {
    title: '運営者について',
    body: [
      'ねこツールズは、「つくしの飼い主」が個人開発として運営しています。',
      'つくしは、一緒に暮らしている保護猫の男の子です。日々のお世話の中で感じた疑問や不安をもとに、猫と暮らす人にとって使いやすいツールを少しずつ作っています。',
      '専門家ではありませんが、猫について学ぶ一環として「ねこ検定 上級」を取得しています。',
      'また、普段はWebサービスの開発に関わっており、その経験を活かして、スマートフォンでもパソコンでも使いやすいシンプルなツールを目指しています。',
    ],
  },
  {
    title: '大切にしていること',
    body: [
      'ねこツールズでは、できるだけシンプルで使いやすいことを大切にしています。',
      '猫との暮らしで知りたいことは多い一方で、入力項目が多すぎたり、専門用語が多すぎたりすると、かえって使いにくくなることがあります。',
      'そのため、各ツールでは「まず目安を確認できること」を重視しています。',
      '入力フォームはできるだけ少なくし、結果は分かりやすく表示する。スマートフォンでもパソコンでも、迷わず使える。そうした状態を目指しています。',
      'また、ねこツールズの結果は「診断」ではなく「目安」です。',
      '不安を煽るのではなく、猫との暮らしを少しでも安心して続けられるようにすること。必要な時には動物病院へ相談するきっかけになること。そうした補助ツールでありたいと考えています。',
    ],
  },
  {
    title: 'ご利用にあたって',
    body: [
      'ねこツールズで表示される内容は、一般的な情報や計算式をもとにした目安です。',
      '診断、治療、投薬判断を行うものではありません。',
      'また、ねこツールズは獣医師監修のサイトではありません。できるだけ参考情報を確認しながら作成していますが、猫の体質や生活環境には個体差があります。',
      '食欲不振、嘔吐、下痢、急な体重変化、元気がない、誤食の可能性があるなど、体調に不安がある場合は、自己判断せず動物病院へ相談してください。',
    ],
  },
  {
    title: '参考情報について',
    body: [
      '各ツールページでは、計算方法や判断のもとにした参考情報をできるだけ記載するようにしています。',
      'ただし、表示される結果はあくまで目安です。猫の年齢、体質、活動量、持病、生活環境によって、適切な判断は変わります。',
      '今後も必要に応じて、参考情報の追加や見直しを行っていきます。',
    ],
  },
];

function Breadcrumb() {
  return (
    <nav aria-label="パンくず" className="mb-5 text-xs font-medium text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" prefetch={false} className="transition-colors hover:text-pink-600">
            ねこツールズ
          </Link>
        </li>
        <li aria-hidden="true" className="text-gray-300">
          /
        </li>
        <li aria-current="page" className="text-gray-700">
          サイトについて
        </li>
      </ol>
    </nav>
  );
}

function TextSection({ title, body }: { title: string; body: string[] }) {
  return (
    <section className="py-1">
      <h2 className="text-xl font-bold leading-snug text-[var(--text)]">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-[1.9] text-gray-700">
        {body.map((paragraph) => (
          <p key={paragraph} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function TsukushiFigure() {
  return (
    <figure className="w-full max-w-[220px] self-center md:self-start">
      <TsukushiImage />
      <figcaption className="mt-2 text-center text-xs leading-relaxed text-gray-500">
        保護猫のつくし
      </figcaption>
    </figure>
  );
}

export default function AboutPage() {
  return (
    <>
      <JsonLdScript data={[aboutStructuredData, breadcrumbStructuredData]} />
      <main className="container max-w-3xl mx-auto px-6 pb-12">
        <section className="section mt-6" aria-labelledby="about-title">
          <Breadcrumb />
          <p className="eyebrow">About</p>
          <h1 id="about-title" className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 !mb-4">
            ねこツールズについて
          </h1>
          <p className="lead text-sm text-gray-600 mt-2.5 mb-0 leading-relaxed">
            ねこツールズを作った理由、運営者のこと、利用時に知っておいてほしいことをまとめています。
          </p>
        </section>

        <div className="section mt-10 space-y-11 md:space-y-12">
          {sections.slice(0, 3).map((section) => (
            <TextSection key={section.title} title={section.title} body={section.body} />
          ))}

          <section className="py-1">
            <h2 className="text-xl font-bold leading-snug text-[var(--text)]">つくしについて</h2>
            <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-start">
              <div className="space-y-4 text-sm leading-[1.9] text-gray-700 md:flex-1">
                <p>つくしは、一緒に暮らしている保護猫の男の子です。</p>
                <p>
                  ねこツールズの多くのツールは、つくしとの暮らしの中で「これを簡単に確認できたら助かる」と感じたことから生まれています。
                </p>
                <p>
                  このサイトは、つくしのために調べてきたこと、迷ってきたこと、不安に感じたことを、同じように猫と暮らす人にも使いやすい形にしたいという思いで作っています。
                </p>
              </div>
              <TsukushiFigure />
            </div>
          </section>

          {sections.slice(3).map((section) => (
            <TextSection key={section.title} title={section.title} body={section.body} />
          ))}

          <section className="py-1">
            <h2 className="text-xl font-bold leading-snug text-[var(--text)]">お問い合わせ・改善要望</h2>
            <div className="mt-4 space-y-4 text-sm leading-[1.9] text-gray-700">
              <p>
                内容に誤りがある場合や、追加してほしいツール、改善してほしい点があれば、お問い合わせフォームまたはXからお知らせください。
              </p>
              <p>いただいた内容をもとに、少しずつ改善していきます。</p>
              <p>猫と暮らす人にとって、より使いやすいサイトにしていきたいと考えています。</p>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={CONTACT_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--primary-strong)] px-4 text-sm font-semibold text-white transition-colors hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600"
              >
                お問い合わせフォーム
              </a>
              <a
                href={X_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--text)] transition-colors hover:border-pink-300 hover:text-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600"
              >
                Xを見る
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
