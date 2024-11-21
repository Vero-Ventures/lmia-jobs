import { fetchJobPostList } from '../../libs/jobsiteAPIrequest';
import Loading from '../ui/Loading';
import JobListCard from './jobListCard';
import { useCallback, useEffect, useState, useRef } from 'react';

export default function JobLists({
  jobSiteName,
  colourTheme,
  onClickJob,
  page,
  sortByDate,
  filterValues,
}) {
  const [list, setList] = useState([]); // jobPosts list that will be displayed
  const [isLoading, setIsLoading] = useState(true);
  const hasSetInitialJob = useRef(false);

  /**
   * Fetch Jobposts list of page from database.
   */
  const getJobPostings = useCallback(async () => {
    setIsLoading(true);
    const jobpostings = await fetchJobPostList(
      jobSiteName,
      page,
      sortByDate,
      filterValues
    );
    setList(prevList => {
      if (
        !hasSetInitialJob.current &&
        jobpostings.length !== 0 &&
        prevList.length === 0
      ) {
        onClickJob(jobpostings[0]._id);
        hasSetInitialJob.current = true;
      }
      return jobpostings;
    });
    setIsLoading(false);
  }, [onClickJob, page, sortByDate, filterValues]);

  useEffect(() => {
    getJobPostings();
  }, [getJobPostings]);

  return (
    <div>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="space-y-8">
          {list.map(item => {
            return (
              <JobListCard
                key={item._id}
                colourTheme={colourTheme}
                item={item}
                onClick={onClickJob}></JobListCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
