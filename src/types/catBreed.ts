export type CatBreedSize = 'small' | 'medium' | 'large';

export type CatBreedCoatLength = 'hairless' | 'short' | 'medium' | 'long';

export type CatBreed = {
  readonly slug: string;
  readonly nameJa: string;
  readonly nameEn: string;
  // 日本語名のひらがな読み。長音は母音に展開する（例: ブルー → ぶるう）。
  readonly sortKeyJa: string;
  readonly origin: string;
  readonly size: CatBreedSize;
  // Phase 1 の代表区分。被毛のバリエーションは summary と出典メモを参照。
  readonly coatLength: CatBreedCoatLength;
  readonly summary: string;
};
