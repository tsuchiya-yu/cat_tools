# 猫種マスタの出典と分類メモ

対象: [Issue #192](https://github.com/tsuchiya-yu/cat_tools/issues/192) の Phase 1、45猫種。確認日: 2026-09-22。

## 作成方針

- TICA の猫種紹介・掲載されている標準を優先し、情報が不足する箇所を CFA、Purina、GCCF 等で補った。下表は各レコードの主な参照先で、補足の参照先は後述する。
- `summary` は外見・体格・被毛の事実をもとに作成した独自文。翻訳文の転載ではない。全件50〜100字で、性格・飼いやすさ・健康上の評価は含めない。猫種内にも個体差、性差、成長や季節による差がある。
- `origin` は自然発生の地域または近代的な品種の成立地。祖先の推定地域と成立地を混同しないよう、必要なレコードには括弧で補足した。古い由来の伝説は事実として採用しない。
- `size` は各資料の体格記述から採用し、体重で区切る独自基準は設けない。small-to-medium / medium-to-large のように幅がある場合は原則 `medium`。大型と明記されるオシキャット、ノルウェージャンフォレストキャット、ターキッシュバン、メインクーン、ラグドールと、CFA が大型として紹介するラガマフィンは `large`。個体の体重判定には使わない。
- `coatLength` は被毛の記述をもとに、無毛型を `hairless`、短毛を `short`、セミロング・中程度の長さを `medium`、長毛を `long` とする。団体の審査部門名（Longhair）と実際の毛の長さは同一ではない。
- 長毛・短毛を同じ猫種として掲載する場合は、TICA の同名エントリーに対応する被毛を代表値として採用する。`medium` を「短毛と長毛の中間値」として使わない。下記のバリエーションと代表値を合わせて参照する。
- `sortKeyJa` は名前のひらがな読み。長音符は直前の音の母音に展開する（ショート → しょおと、ブルー → ぶるう）。配列は `Intl.Collator('ja').compare` による50音順とし、濁点を含む名前を単純な文字コード順で並べない。
- 日本語名・英語名は Issue の45件に合わせた。チンチラは独立した猫種として追加しない。画像、UI、将来用の属性はこのマスタに含めない。

## 猫種ごとの参照先と採用区分

各リンクの At a Glance / Height/Weight Range / The Breed Standard / History / Traits（CFA）等を参照。

| slug | 主な参照先 | size | coatLength |
| --- | --- | --- | --- |
| `abyssinian` | [TICA: Abyssinian](https://tica.org/breed/abyssinian/) | `medium` | `short` |
| `american-curl` | [TICA: American Curl](https://tica.org/breed/american-curl/) | `medium` | `short` |
| `american-shorthair` | [TICA: American Shorthair](https://tica.org/breed/american-shorthair/) | `medium` | `short` |
| `american-bobtail` | [TICA: American Bobtail](https://tica.org/breed/american-bobtail/) | `medium` | `medium` |
| `exotic-shorthair` | [TICA: Exotic Shorthair](https://tica.org/breed/exotic-shorthair/) | `medium` | `short` |
| `egyptian-mau` | [TICA: Egyptian Mau](https://tica.org/breed/egyptian-mau/) | `medium` | `short` |
| `australian-mist` | [TICA: Australian Mist](https://tica.org/breed/australian-mist/) | `medium` | `short` |
| `ocicat` | [TICA: Ocicat](https://tica.org/breed/ocicat/) | `large` | `short` |
| `oriental-shorthair` | [TICA: Oriental Shorthair](https://tica.org/breed/oriental-shorthair/) | `medium` | `short` |
| `cornish-rex` | [TICA: Cornish Rex](https://tica.org/breed/cornish-rex/) | `small` | `short` |
| `korat` | [TICA: Korat](https://tica.org/breed/korat/) | `medium` | `short` |
| `siberian` | [TICA: Siberian](https://tica.org/breed/siberian/) | `medium` | `medium` |
| `japanese-bobtail` | [TICA: Japanese Bobtail](https://tica.org/breed/japanese-bobtail/) | `medium` | `short` |
| `siamese` | [TICA: Siamese](https://tica.org/breed/siamese/) | `medium` | `short` |
| `chartreux` | [TICA: Chartreux](https://tica.org/breed/chartreux/) | `medium` | `short` |
| `singapura` | [TICA: Singapura](https://tica.org/breed/singapura/) | `small` | `short` |
| `scottish-fold` | [TICA: Scottish Fold](https://tica.org/breed/scottish-fold/) | `medium` | `short` |
| `snowshoe` | [TICA: Snowshoe](https://tica.org/breed/snowshoe/) | `medium` | `short` |
| `sphynx` | [TICA: Sphynx](https://tica.org/breed/sphynx/) | `medium` | `hairless` |
| `selkirk-rex` | [TICA: Selkirk Rex](https://tica.org/breed/selkirk-rex/) | `medium` | `short` |
| `somali` | [TICA: Somali](https://tica.org/breed/somali/) | `medium` | `medium` |
| `turkish-angora` | [TICA: Turkish Angora](https://tica.org/breed/turkish-angora/) | `medium` | `medium` |
| `turkish-van` | [TICA: Turkish Van](https://tica.org/breed/turkish-van/) | `large` | `medium` |
| `devon-rex` | [TICA: Devon Rex](https://tica.org/breed/devon-rex/) | `medium` | `short` |
| `toyger` | [TICA: Toyger](https://tica.org/breed/toyger/) | `medium` | `short` |
| `tonkinese` | [TICA: Tonkinese](https://tica.org/breed/tonkinese/) | `medium` | `short` |
| `nebelung` | [TICA: Nebelung](https://tica.org/breed/nebelung/) | `medium` | `medium` |
| `norwegian-forest-cat` | [TICA: Norwegian Forest Cat](https://tica.org/breed/norwegian-forest/) | `large` | `medium` |
| `birman` | [TICA: Birman](https://tica.org/breed/birman/) | `medium` | `medium` |
| `burmese` | [TICA: Burmese](https://tica.org/breed/burmese/) | `medium` | `short` |
| `burmilla` | [TICA: Burmilla](https://tica.org/breed/burmilla/) | `medium` | `short` |
| `havana-brown` | [TICA: Havana Brown](https://tica.org/breed/havana/) | `medium` | `short` |
| `balinese` | [TICA: Balinese](https://tica.org/breed/balinese/) | `medium` | `medium` |
| `pixiebob` | [TICA: Pixiebob](https://tica.org/breed/pixiebob/) | `medium` | `short` |
| `british-shorthair` | [TICA: British Shorthair](https://tica.org/breed/british-shorthair/) | `medium` | `short` |
| `persian` | [TICA: Persian](https://tica.org/breed/persian/) | `medium` | `long` |
| `bengal` | [TICA: Bengal](https://tica.org/breed/bengal/) | `medium` | `short` |
| `bombay` | [TICA: Bombay](https://tica.org/breed/bombay/) | `medium` | `short` |
| `munchkin` | [TICA: Munchkin](https://tica.org/breed/munchkin/) | `medium` | `short` |
| `minuet` | [TICA: Minuet](https://tica.org/breed/minuet/) | `medium` | `short` |
| `maine-coon` | [TICA: Maine Coon](https://tica.org/breed/maine-coon/) | `large` | `long` |
| `ragamuffin` | [CFA: Ragamuffin](https://cfa.org/breed/ragamuffin/) | `large` | `long` |
| `ragdoll` | [TICA: Ragdoll](https://tica.org/breed/ragdoll/) | `large` | `medium` |
| `laperm` | [TICA: LaPerm](https://tica.org/breed/laperm/) | `medium` | `medium` |
| `russian-blue` | [TICA: Russian Blue](https://tica.org/breed/russian-blue/) | `medium` | `short` |

## 単一の被毛区分で表せない猫種

以下は短毛・長毛の両方が存在する。summary にも両方があることを記載し、`coatLength` だけで猫種全体の被毛を断定しない。

| 猫種 | Phase 1 の代表値 | 採用理由 |
| --- | --- | --- |
| アメリカンカール | `short` | TICA の American Curl に対応。American Curl Longhair は別エントリー。 |
| アメリカンボブテイル | `medium` | TICA の American Bobtail に対応する中長毛。American Bobtail Shorthair も存在する。 |
| ジャパニーズボブテイル | `short` | TICA の Japanese Bobtail に対応。Longhair も存在する。 |
| スコティッシュフォールド | `short` | TICA の Scottish Fold に対応。Longhair の被毛はセミロング。 |
| セルカークレックス | `short` | TICA の Selkirk Rex に対応。Longhair も存在する。 |
| バーミラ | `short` | TICA の Burmilla に対応。Burmilla Longhair も存在する。 |
| ピクシーボブ | `short` | TICA の Pixiebob に対応。Longhair も存在する。 |
| マンチカン | `short` | TICA の Munchkin に対応。Longhair も存在する。短毛側にも厚みがある。 |
| ミヌエット | `short` | TICA の Minuet に対応。Longhair も存在する。 |
| ラパーマ | `medium` | TICA の LaPerm に対応する長毛側の、中程度から長めの巻き毛。LaPerm Shorthair も存在する。 |

ベンガルも TICA には Bengal Longhair が別にあるが、本マスタは同名の Bengal に対応する短毛を採用する。ノルウェージャンフォレストキャット、サイベリアン、バーマン、ソマリ、ターキッシュバン、ターキッシュアンゴラ、ネベロング、ラグドール等の `medium` は、資料のセミロング・中長毛の記述による。バリニーズは [CFA の標準](https://cfa.org/breed/balinese/)でも中程度の長さ、尾が最も長いと記述されるため `medium` とする。

スフィンクスの `hairless` は無毛型の外見の区分であり、産毛まで完全にないという意味ではない。メインクーンとラガマフィンは主参照先の長毛の紹介に合わせて `long` としたが、部位で長さが異なる。

## 由来・名称・分類の補足

- アビシニアン: TICA は古い祖先の由来を未確定とし、英国での品種の発展を説明している。エチオピア起源と断定せず、英国を品種成立地として記載する。
- バーマン: ビルマの寺院にまつわる話は TICA でも伝説として扱われる。確認できるフランスでの成立・公認の歴史を採用する。
- ペルシャ: TICA はペルシャやトルコに関連する歴史を紹介している。祖先の地域を一国に限定せず「ペルシャ周辺（由来に諸説）」とする。
- ソマリ: ソマリア起源という意味ではない。[CFA の歴史資料](https://cfa.org/somali-article-1991/)で米国・カナダ双方の品種成立への関与を確認し、成立地を記載した。
- シンガプーラ: [CFA の猫種紹介](https://cfa.org/breed/singapura/)と TICA はシンガポールに関連する猫と米国での繁殖計画を説明している。品種成立地を補足し、古代からの固有種などとは断定しない。
- バーミーズ: TICA の記述に従ってミャンマー・タイ周辺の由来と米国・英国での品種成立を併記した。団体や系統による体型差を一つの顔立ちに固定しない。
- スフィンクス: TICA はカナダと米国で生まれた無毛の猫の系統を説明しているため、両国を記載した。
- トンキニーズ: TICA の歴史にあるカナダ・米国での共同の品種成立を採用し、古いシャム由来の猫の記録と区別する。
- ネベロング: TICA の歴史に加え、[Purina の History and Origins](https://www.purina.co.uk/find-a-pet/cat-breeds/nebelung)で米国での品種成立を確認。ロシアンブルーに似た外見をロシア原産の根拠にはしない。
- バーミラ: [TICA の標準](https://tica.org/wp-content/uploads/2025/05/AllBreedStandards1.pdf)は英国での成立を記載。祖先にチンチラのペルシャがいることは、チンチラを別猫種として数える理由にはしない。
- ハバナブラウン: TICA は Havana、[CFA は Havana Brown](https://cfa.org/breed/havana-brown/)を使用する。Issue の Havana Brown を維持し、英国で始まり米国で発展した猫種として扱う。英国でのオリエンタルの茶色のタイプとの区別に注意する。
- ラパーマ: TICA の品種史を、[CFA の紹介](https://cfa.org/breed/laperm/)にあるオレゴンでの成立で補足した。
- トイガー: TICA の品種史を、[GCCF の紹介](https://www.gccfcats.org/getting-a-cat/choosing/cat-breeds/toyger/)にある米国での成立で補足した。
- ラガマフィン: TICA の猫種一覧には同名の紹介がないため CFA を使用。CFA の表記は RagaMuffin だが、データの英語名は Issue の Ragamuffin とする。
- ノルウェージャンフォレストキャット: TICA の見出しは Norwegian Forest。Issue に合わせて Norwegian Forest Cat とする。
- アメリカンカール、デボンレックス、マンチカン等は、資料内に小型〜中型と中型の両方の記述があるため `medium`。アメリカンボブテイル、サイベリアン、バーマン、バーミーズ、ブリティッシュショートヘア、ベンガル、ピクシーボブ、セルカークレックス等も中型〜大型の幅を `medium` で代表させている。シャルトリューは TICA の体格欄の中型を採用。大きめの個体が存在しないという意味ではない。

## 後続で扱うこと

被毛フィルターを実装する際は、上記の両被毛型をどの条件でヒットさせるかを別途決める必要がある。今回は単一値という Issue の型を維持し、配列属性や検索処理を追加しない。チンチラの検索意図はペルシャの説明や毛色コンテンツで扱う余地があるが、今回の45件には含めない。
