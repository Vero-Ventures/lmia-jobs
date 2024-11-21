import Image from 'next/image';
import Link from 'next/link';
import { JOBSITE_INFO } from '@/libs/jobsiteConstants';

export default function Top({ name }) {
  const COULOUR_THEME = JOBSITE_INFO[name.jobsiteName].colours;
  const JOBSITE_NAME = JOBSITE_INFO[name.jobsiteName].jobsiteName;

  return (
    <header className="flex items-center justify-between w-full md:p-5">
      <Link
        className={`flex items-center space-x-2 ${COULOUR_THEME.baseText} font-bold`}
        href="/">
        <Image
          alt="Logo"
          className="h-12 w-12"
          height={32}
          src="/placeholder.svg"
          style={{
            aspectRatio: '32/32',
            objectFit: 'cover',
            marginRight: '20px',
          }}
          width={32}
        />
        <span className="titleCase">{`${JOBSITE_NAME} Job Site`}</span>
      </Link>
    </header>
  );
}
