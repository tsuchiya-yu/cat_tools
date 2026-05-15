import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'ねこツールズにおける利用者情報の取扱いを定めたプライバシーポリシーです。',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="container max-w-3xl mx-auto px-6 pb-12">
      <section className="section mt-6" aria-labelledby="privacy-title">
        <h1 id="privacy-title" className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 !mb-7">
          ねこツールズ プライバシーポリシー
        </h1>
        <p className="text-sm text-gray-700 leading-relaxed">
          個人運営者（以下「運営者」）は、運営者が提供する「ねこツールズ」（以下「本サービス」）における、
          利用者に関する情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
        </p>
      </section>

      <section className="section mt-6 space-y-5 text-sm text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">1. 取得する情報</h2>
          <p>運営者は、本サービスにおいて、以下の情報を取得する場合があります。</p>

          <h3 className="font-bold text-[var(--text)] mt-4 mb-2">1. 利用者がお問い合わせ時に入力する情報</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>氏名またはニックネーム</li>
            <li>メールアドレス</li>
            <li>お問い合わせ内容</li>
            <li>その他、利用者が任意で入力する情報</li>
          </ul>

          <h3 className="font-bold text-[var(--text)] mt-4 mb-2">2. 本サービスの利用に伴い自動的に取得される情報</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>閲覧したページ URL</li>
            <li>利用日時</li>
            <li>参照元</li>
            <li>端末情報、ブラウザ情報</li>
            <li>IP アドレス</li>
            <li>Cookie 等の識別子</li>
            <li>その他、アクセス解析ツールにより取得される情報</li>
          </ul>

          <h3 className="font-bold text-[var(--text)] mt-4 mb-2">3. 共有機能の利用に関連する情報</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>本サービスの一部機能では、入力内容に応じて URL パラメータを含む共有リンクが生成される場合があります。</li>
            <li>これらの情報は、利用者自身の操作により共有されるものであり、運営者が個別に内容を収集・保存することを目的とするものではありません。</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">2. 利用目的</h2>
          <p>運営者は、取得した情報を、以下の目的で利用します。</p>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>本サービスの提供、維持、改善のため</li>
            <li>利用状況の分析、品質向上、新機能検討のため</li>
            <li>利用者からのお問い合わせに対応するため</li>
            <li>不正利用、迷惑行為、規約違反等への対応のため</li>
            <li>障害対応、保守、セキュリティ対応のため</li>
            <li>個人を特定できない形に加工したうえで、統計的な情報として分析・活用するため</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">3. アクセス解析ツールについて</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>本サービスでは、利用状況の把握および改善のため、Google Analytics などのアクセス解析ツールを利用する場合があります。</li>
            <li>これにより、Cookie 等を通じて利用者のアクセス情報が収集されることがあります。</li>
            <li>これらの情報は、各提供事業者の定めるプライバシーポリシーその他の条件に基づいて管理されます。</li>
            <li>利用者は、ブラウザ設定の変更や各提供事業者が提供する手段により、情報収集を制限できる場合があります。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">4. Cookie 等の利用について</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>本サービスでは、利便性向上、利用状況分析、表示最適化等のため、Cookie その他これに類する技術を利用する場合があります。</li>
            <li>利用者は、ブラウザの設定により Cookie の受け取りを拒否し、または削除することができます。</li>
            <li>ただし、Cookie を無効化した場合、本サービスの一部機能が正常に利用できないことがあります。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">5. 外部サービスの利用</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>本サービスでは、アクセス解析、問い合わせ受付、その他の機能提供のため、外部事業者のサービスを利用する場合があります。</li>
            <li>利用者が外部サービス上のフォーム、リンク、共有機能等を利用した場合、当該外部サービスにおいても利用者情報が取り扱われることがあります。</li>
            <li>これらの情報の取扱いは、各外部サービス提供事業者の定める規約やプライバシーポリシーによります。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">6. 第三者提供</h2>
          <p>運営者は、取得した情報を、以下の場合を除き、第三者に提供しません。</p>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>利用者本人の同意がある場合</li>
            <li>法令に基づき開示が求められた場合</li>
            <li>人の生命、身体または財産の保護のために必要があり、本人の同意を得ることが困難な場合</li>
            <li>業務遂行に必要な範囲で、外部サービス提供事業者等に取扱いを委ねる場合</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">7. 情報の管理</h2>
          <p>
            運営者は、取得した情報について、漏えい、滅失、き損、不正アクセス等を防止するため、
            合理的な範囲で必要な管理に努めます。ただし、インターネット通信および電子的保存手段の性質上、
            完全な安全性を保証するものではありません。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">8. 開示・訂正・削除等</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>利用者は、運営者が保有する自己の情報について、法令の定めに従い、開示、訂正、削除等を求めることができます。</li>
            <li>ただし、運営者が継続的に保有していない情報や、運営者のみでは対応できない外部サービス上の情報については、対応できない場合があります。</li>
            <li>請求を希望する場合は、お問い合わせ窓口より連絡するものとします。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">9. 共有機能に関する注意</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>本サービスの一部機能では、入力内容に応じて URL に情報が反映される場合があります。</li>
            <li>利用者は、共有前に URL の内容を確認し、第三者に知られたくない情報を含めないよう、自らの責任で判断してください。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">10. 本ポリシーの変更</h2>
          <p>
            運営者は、必要に応じて、本ポリシーを変更することがあります。
            変更後の本ポリシーは、本サービス上に掲載した時点から効力を生じるものとします。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">11. お問い合わせ</h2>
          <p>
            本ポリシーに関するお問い合わせは、本サービス上のお問い合わせフォームその他運営者が別途案内する方法により受け付けます。
          </p>
        </div>

        <p className="font-semibold">制定日：2025年9月21日</p>
      </section>
    </main>
  );
}
