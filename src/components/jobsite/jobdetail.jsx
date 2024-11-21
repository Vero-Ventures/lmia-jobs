import { fetchJobDetail } from '../../libs/jobsiteAPIrequest';
import { useCallback, useEffect, useState } from 'react';
import MapPinIcon from '@/components/icons/mapPinIcon';
import ClockIcon from '@/components/icons/clockIcon';
import BriefcaseIcon from '@/components/icons/briefCaseIcon';
import MoneyIcon from '@/components/icons/moneyIcon';
import CalendarIcon from '@/components/icons/calendarIcon';
import UserIcon from '@/components/icons/userIcon';
import EmailIcon from '@/components/icons/emailIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/jobsite/error';
import Link from 'next/link';

export default function JobDetail({ colourTheme, postingID, showJobPageBtn }) {
  const [jobDetail, setJobDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isExist, setIsExist] = useState(true); // whether given jobpost exists or not

  /**
   * Fetch Jobpost detail from database.
   */
  const getDetailData = useCallback(async () => {
    if (postingID) {
      setIsLoading(true);
      const result = await fetchJobDetail(postingID);
      if (result.error) {
        if (result.status == 404) {
          setIsExist(false);
        } else {
          console.log(result.error);
        }
      } else {
        setJobDetail(result);
      }
      setIsLoading(false);
    }
  }, [postingID]);

  useEffect(() => {
    getDetailData();
  }, [getDetailData]);

  return (
    <div>
      {!isLoading && isExist && (
        <div className="bg-white min-h-dvh max-h-dvh overflow-y-auto dark:bg-[#0f172a] rounded-lg shadow-lg p-5 md:p-10 flex-1 space-y-4">
          {Object.keys(jobDetail).length !== 0 && (
            <div className="space-y-4">
              <div>
                <h4
                  className={`text-2xl font-bold ${colourTheme.baseText} titleCase dark:text-white`}>
                  {jobDetail.jobTitle}
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  {jobDetail.hiringOrganization}
                </p>
                <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1 lg:mt-0">
                  {new Date(jobDetail.datePosted).toDateString()}
                </div>
                {showJobPageBtn && (
                  <Link
                    className={`inline-flex h-9 items-center justify-center rounded-md ${colourTheme.base} px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:${colourTheme.buttonHover} focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50`}
                    href={`/jobposting/${jobDetail._id}`}>
                    Job Page
                  </Link>
                )}
              </div>
              <div className="grid text-sm md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400 titleCase">
                      {jobDetail.employmentSubType
                        ? jobDetail.employmentSubType
                        : ''}
                      {jobDetail.employmentType
                        ? `, ${jobDetail.employmentType}`
                        : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">
                      {jobDetail.streetAddress
                        ? `${jobDetail.streetAddress}, `
                        : ''}
                      {jobDetail.addressLocality}, {jobDetail.addressRegion}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MoneyIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">
                      ${jobDetail.minCompValue}{' '}
                      {jobDetail.maxCompValue
                        ? `to $${jobDetail.maxCompValue}`
                        : ''}{' '}
                      hourly
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">
                      {jobDetail.workHours ? `${jobDetail.workHours}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">
                      {jobDetail.startTime ? `${jobDetail.startTime}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">
                      {jobDetail.vacancies
                        ? `${jobDetail.vacancies} vacancy`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h5
                  className={`text-base font-bold ${colourTheme.baseText} dark:text-white`}>
                  Job Description
                </h5>
                <p
                  className="text-gray-500 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: jobDetail.description }}
                />
              </div>
              <div>
                <h5
                  className={`text-base font-bold ${colourTheme.baseText} dark:text-white`}>
                  Apply by email
                </h5>
                <div className="flex items-center gap-3 text-sm">
                  <EmailIcon />
                  <a
                    href={`mailto:${jobDetail.email}`}
                    className="text-blue-900 underline">
                    {jobDetail.email}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {!isLoading && !isExist && <Error colourTheme={colourTheme} />}
      {isLoading && <Loading></Loading>}
    </div>
  );
}
