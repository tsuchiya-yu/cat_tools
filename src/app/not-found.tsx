import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <div className="p-8">
        <h1 className="text-8xl font-bold text-pink-600">404</h1>
        <p className="mt-4 text-2xl font-medium text-gray-700">
          お探しのページは見つかりませんでした 🐾
        </p>
        <p className="mt-2 text-gray-500">
          ご指定のURLが見つからないか、移動または削除された可能性があります。
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="rounded-md bg-pink-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
