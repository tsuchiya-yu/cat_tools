import { NextResponse } from 'next/server';
import { searchCatFood } from '@/lib/catFoodSafety';
import type { CatFoodSearchResponse } from '@/types';

const ERROR_MESSAGES = {
  REQUIRED: '食材名を入力してください。',
  GENERAL: '検索処理でエラーが発生しました。',
  TOO_LONG: '食材名は40文字以内で入力してください。',
} as const;

const MAX_KEYWORD_LENGTH = 40;

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = (searchParams.get('food') ?? '').trim();
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

    if (!keyword) {
      return NextResponse.json<CatFoodSearchResponse>(
        { results: [], error: ERROR_MESSAGES.REQUIRED },
        { status: 400 }
      );
    }

    if (keyword.length > MAX_KEYWORD_LENGTH) {
      return NextResponse.json<CatFoodSearchResponse>(
        { results: [], error: ERROR_MESSAGES.TOO_LONG },
        { status: 400 }
      );
    }

    const matches = await searchCatFood(keyword);

    const limitedResults =
      typeof limit === 'number' && Number.isFinite(limit) && limit > 0
        ? matches.slice(0, limit)
        : matches;

    return NextResponse.json<CatFoodSearchResponse>({ results: limitedResults });
  } catch (error) {
    console.error('cat-food-safety search failed:', error);
    return NextResponse.json<CatFoodSearchResponse>(
      { results: [], error: ERROR_MESSAGES.GENERAL },
      { status: 500 }
    );
  }
}
