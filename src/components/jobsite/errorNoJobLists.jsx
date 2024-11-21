export default function ErrorNoJobLists({ colourTheme }) {
  return (
    <div className="flex flex-col items-center justify-center h-[50dvh] dark:bg-gray-900 px-4 md:px-6">
      <div className="max-w-md text-center space-y-4">
        <h4
          className={`text-4xl font-bold tracking-tight ${colourTheme.baseText} dark:text-gray-100`}>
          No job is available.
        </h4>
        <p className="text-gray-500 dark:text-gray-400">
          There are currently no available job openings. Please consider other
          options or check back at a later time.
        </p>
      </div>
    </div>
  );
}
