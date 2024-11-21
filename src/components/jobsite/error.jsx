import Link from 'next/link';

export default function Error({ colourTheme }) {
  return (
    <div className="flex flex-col items-center justify-center h-[50dvh] dark:bg-gray-900 px-4 md:px-6">
      <div className="max-w-md text-center space-y-4">
        <h1
          className={`text-4xl font-bold tracking-tight ${colourTheme.baseText} dark:text-gray-100`}>
          Oops, this post is no longer available
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          The content you were trying to access is no longer available. It may
          have been deleted or moved to a different location.
        </p>
        <Link
          className={`inline-flex h-10 items-center justify-center rounded-md ${colourTheme.base} px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:${colourTheme.buttonHover}-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300`}
          href="/">
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}
