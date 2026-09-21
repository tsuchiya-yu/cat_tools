import { catBreeds } from '@/data/catBreeds';

describe('catBreeds', () => {
  it('contains exactly the 45 breeds specified in Issue #192', () => {
    const expected = [
      ['abyssinian', 'アビシニアン', 'Abyssinian'],
      ['american-curl', 'アメリカンカール', 'American Curl'],
      ['american-shorthair', 'アメリカンショートヘア', 'American Shorthair'],
      ['american-bobtail', 'アメリカンボブテイル', 'American Bobtail'],
      ['exotic-shorthair', 'エキゾチックショートヘア', 'Exotic Shorthair'],
      ['egyptian-mau', 'エジプシャンマウ', 'Egyptian Mau'],
      ['australian-mist', 'オーストラリアンミスト', 'Australian Mist'],
      ['ocicat', 'オシキャット', 'Ocicat'],
      ['oriental-shorthair', 'オリエンタルショートヘア', 'Oriental Shorthair'],
      ['cornish-rex', 'コーニッシュレックス', 'Cornish Rex'],
      ['korat', 'コラット', 'Korat'],
      ['siberian', 'サイベリアン', 'Siberian'],
      ['japanese-bobtail', 'ジャパニーズボブテイル', 'Japanese Bobtail'],
      ['siamese', 'シャム', 'Siamese'],
      ['chartreux', 'シャルトリュー', 'Chartreux'],
      ['singapura', 'シンガプーラ', 'Singapura'],
      ['scottish-fold', 'スコティッシュフォールド', 'Scottish Fold'],
      ['snowshoe', 'スノーシュー', 'Snowshoe'],
      ['sphynx', 'スフィンクス', 'Sphynx'],
      ['selkirk-rex', 'セルカークレックス', 'Selkirk Rex'],
      ['somali', 'ソマリ', 'Somali'],
      ['turkish-angora', 'ターキッシュアンゴラ', 'Turkish Angora'],
      ['turkish-van', 'ターキッシュバン', 'Turkish Van'],
      ['devon-rex', 'デボンレックス', 'Devon Rex'],
      ['toyger', 'トイガー', 'Toyger'],
      ['tonkinese', 'トンキニーズ', 'Tonkinese'],
      ['nebelung', 'ネベロング', 'Nebelung'],
      ['norwegian-forest-cat', 'ノルウェージャンフォレストキャット', 'Norwegian Forest Cat'],
      ['birman', 'バーマン', 'Birman'],
      ['burmese', 'バーミーズ', 'Burmese'],
      ['burmilla', 'バーミラ', 'Burmilla'],
      ['havana-brown', 'ハバナブラウン', 'Havana Brown'],
      ['balinese', 'バリニーズ', 'Balinese'],
      ['pixiebob', 'ピクシーボブ', 'Pixiebob'],
      ['british-shorthair', 'ブリティッシュショートヘア', 'British Shorthair'],
      ['persian', 'ペルシャ', 'Persian'],
      ['bengal', 'ベンガル', 'Bengal'],
      ['bombay', 'ボンベイ', 'Bombay'],
      ['munchkin', 'マンチカン', 'Munchkin'],
      ['minuet', 'ミヌエット', 'Minuet'],
      ['maine-coon', 'メインクーン', 'Maine Coon'],
      ['ragamuffin', 'ラガマフィン', 'Ragamuffin'],
      ['ragdoll', 'ラグドール', 'Ragdoll'],
      ['laperm', 'ラパーマ', 'LaPerm'],
      ['russian-blue', 'ロシアンブルー', 'Russian Blue'],
    ];

    expect(catBreeds).toHaveLength(45);
    expect(catBreeds.map(({ slug, nameJa, nameEn }) => [slug, nameJa, nameEn]))
      .toEqual(expect.arrayContaining(expected));
  });

  it('has unique slugs', () => {
    expect(new Set(catBreeds.map(({ slug }) => slug)).size).toBe(catBreeds.length);
  });

  it.each(catBreeds)('$slug has an ASCII kebab-case slug and nonempty required text', (breed) => {
    expect(breed.slug).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
    for (const field of ['nameJa', 'nameEn', 'sortKeyJa', 'origin', 'summary'] as const) {
      expect(breed[field].trim()).not.toBe('');
      expect(breed[field]).toBe(breed[field].trim());
    }
    expect(breed.sortKeyJa).toMatch(/^[ぁ-ゖ]+$/);
  });

  it.each(catBreeds)('$slug uses the allowed size and coat length values', (breed) => {
    expect(['small', 'medium', 'large']).toContain(breed.size);
    expect(['hairless', 'short', 'medium', 'long']).toContain(breed.coatLength);
  });

  it.each(catBreeds)('$slug has a concise summary', ({ summary }) => {
    expect(Array.from(summary).length).toBeGreaterThanOrEqual(50);
    expect(Array.from(summary).length).toBeLessThanOrEqual(100);
    expect(summary).not.toMatch(/飼いやすい|初心者向け/);
  });

  it('is already in Japanese gojuon order without sorting the exported data', () => {
    const keys = catBreeds.map(({ sortKeyJa }) => sortKeyJa);
    expect(keys).toEqual([...keys].sort(new Intl.Collator('ja').compare));
  });

  it('does not include Chinchilla as an independent breed', () => {
    expect(catBreeds.some(({ slug, nameJa, nameEn }) =>
      /chinchilla/i.test(slug + nameEn) || nameJa.includes('チンチラ'),
    )).toBe(false);
  });
});
