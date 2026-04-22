import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-stone-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/#horses"
            className="px-6 py-3 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors"
          >
            View Horses
          </Link>
        </div>
      </div>
    </div>
  );
}
