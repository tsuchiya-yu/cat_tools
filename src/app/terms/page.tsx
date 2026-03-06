import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約',
  description: 'ねこツールズの利用規約です。ご利用前に内容をご確認ください。',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="container max-w-3xl mx-auto px-6 pb-12">
      <section className="section mt-6" aria-labelledby="terms-title">
        <h1 id="terms-title" className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-7">
          ねこツールズ 利用規約
        </h1>
        <p className="text-sm text-gray-700 leading-relaxed">
          この利用規約（以下「本規約」）は、個人運営者（以下「運営者」）が提供する「ねこツールズ」（以下「本サービス」）の
          利用条件を定めるものです。本サービスを利用する方（以下「利用者」）は、本規約に同意のうえ、本サービスを利用するものとします。
        </p>
      </section>

      <section className="section mt-6 space-y-5 text-sm text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">1. 適用</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>本規約は、利用者と運営者との間の本サービスの利用に関わる一切の関係に適用されます。</li>
            <li>運営者が本サービス上で掲載する利用上の注意、ガイド、免責表示等は、本規約の一部を構成するものとします。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">2. 本サービスの内容</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>本サービスは、猫に関する計算ツール、チェックツール、情報提供コンテンツ等を提供する Web サービスです。</li>
            <li>本サービスで表示される計算結果・判定結果・説明内容は、一般的な情報提供および参考情報であり、個別事情に応じた正確性・完全性を保証するものではありません。</li>
            <li>運営者は、本サービスの内容を予告なく追加、変更、削除することがあります。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">3. 利用上の注意（重要）</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>本サービスは、獣医療上の診断、治療、投薬判断その他の医療行為を行うものではありません。</li>
            <li>猫の体調不良、誤食、急変、症状の悪化その他緊急性がある場合は、直ちに動物病院・獣医師等の専門家へ相談してください。</li>
            <li>本サービスの情報のみを根拠として受診の要否、治療方針、食事管理等の最終判断を行わないでください。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">4. 禁止事項</h2>
          <p>利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>本サービスの運営を妨害し、または妨害するおそれのある行為</li>
            <li>本サービスのネットワーク・システム等に過度な負荷をかける行為</li>
            <li>本サービスまたは第三者の権利・利益を侵害する行為</li>
            <li>不正アクセス、またはこれを試みる行為</li>
            <li>本サービスの内容を無断で転載・再配布する行為（法令上認められる場合を除く）</li>
            <li>その他、運営者が不適切と判断する行為</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">5. 知的財産権</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>本サービスに掲載される文章、画像、デザイン、プログラムその他一切のコンテンツに関する知的財産権は、運営者または正当な権利者に帰属します。</li>
            <li>利用者は、私的利用その他法令で認められる範囲を超えて、これらを利用してはなりません。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">6. サービスの停止・中断</h2>
          <p>運営者は、以下のいずれかに該当する場合、利用者への事前通知なく、本サービスの全部または一部を停止または中断できるものとします。</p>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>システム保守、点検、更新を行う場合</li>
            <li>通信回線、外部サービス、クラウド基盤等の障害が発生した場合</li>
            <li>天災地変、停電その他不可抗力により提供が困難となった場合</li>
            <li>その他、運営者が停止・中断を必要と判断した場合</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">7. 免責事項・責任制限</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>運営者は、本サービスに事実上または法律上の瑕疵（安全性、正確性、完全性、有用性、特定目的適合性、継続性等を含みますがこれらに限りません）がないことを保証しません。</li>
            <li>運営者は、本サービスの利用または利用不能により利用者に生じた損害について、運営者に故意または重大な過失がある場合を除き、責任を負わないものとします。</li>
            <li>本サービスで提供される情報・計算結果・判定結果を利用したことにより生じた判断ミス、受診遅延、健康被害その他の損害について、運営者は責任を負いません（法令上免責が認められない場合を除きます）。</li>
            <li>本サービスから外部サイトへ遷移した場合、当該外部サイトの内容・安全性・提供状況について、運営者は責任を負いません。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">8. 利用環境・共有機能に関する注意</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>本サービスの一部機能では、入力内容に応じて URL パラメータを用いた共有リンクを生成する場合があります。</li>
            <li>利用者は、共有前にリンク内容を確認し、第三者に知られたくない情報を含めないよう自己の責任で判断するものとします。</li>
            <li>利用者の端末・ブラウザ環境・通信環境に起因して本サービスを正常に利用できない場合、運営者は責任を負いません。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">9. 個人情報・アクセス解析</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>運営者は、本サービスにおいて取得した利用者情報を、別途定めるプライバシーポリシーに従って取り扱います。</li>
            <li>本サービスでは、品質改善や利用状況把握のため、アクセス解析ツール等を利用する場合があります。詳細はプライバシーポリシーをご確認ください。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">10. 規約の変更</h2>
          <p>
            運営者は、必要と判断した場合、利用者に事前通知することなく本規約を変更できるものとします。変更後の規約は、本サービス上に掲載した時点から効力を生じるものとし、掲載後に利用者が本サービスを利用した場合、変更後の規約に同意したものとみなします。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">11. 準拠法・管轄</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
            <li>本サービスに関して紛争が生じた場合は、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。</li>
          </ol>
        </div>

        <p className="font-semibold">制定日：2025年9月21日</p>
      </section>
    </main>
  );
}
