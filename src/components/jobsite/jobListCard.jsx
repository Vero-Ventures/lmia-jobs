import Link from 'next/link';

export default function JobListCard({ colourTheme, item, onClick }) {
  return (
    <div
      className={`bg-white dark:${colourTheme.backgroundDark} rounded-lg shadow-lg p-4 space-y-3`}>
      <div>
        <h5
          className={`text-xl font-bold titleCase ${colourTheme.baseText} dark:text-white`}>
          {item.jobTitle}
        </h5>
        <p className="pl-2 text-gray-500 dark:text-gray-400">
          {item.hiringOrganization}
        </p>
        <div className="pl-2 flex justify-between">
          <div className="text-gray-500 dark:text-gray-400">
            {item.addressLocality}, {item.addressRegion}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-300 mb-4">
            {new Date(item.datePosted).toDateString()}
          </div>
        </div>
        <div className="flex justify-between">
          <p className="pl-2 text-sm text-gray-500 dark:text-gray-400">
            ${item.minCompValue}{' '}
            {item.maxCompValue ? `to $${item.maxCompValue}` : ''} hourly
          </p>
          <button
            className={`text-sm pl-3 font-bold titleCase ${colourTheme.baseText} hidden sm:block dark:text-white`}
            onClick={() => onClick(item._id)}>
            View
          </button>
          <Link
            className={`text-sm pl-3 font-bold titleCase ${colourTheme.baseText} block sm:hidden dark:text-white`}
            href={`/jobposting`}
            as={`/jobposting/${item._id}`}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
