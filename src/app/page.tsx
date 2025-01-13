"use client";

export default function Home() {
  return (
    <div className="flex h-dvh w-dvw flex-col justify-center text-center">
      <p className="text-4xl font-bold">Domain Redirect</p>
      <p className="mt-4 text-xl">
        Enter routes directly when testing locally.
      </p>
      <p className="mt-2 text-xl">
        Middleware redirect is disabled on localhost.
      </p>
      <p className="mt-6 text-xl">ManageOpportunities.ca: /admin</p>
      <p className="mt-4 text-xl">
        AccessibleOpportunities.ca: /disability-job-board
      </p>
      <p className="mt-4 text-xl">AsylumOpportunities.ca: /asylum-job-board</p>
      <p className="mt-4 text-xl">
        IndigenousOpportunities.ca: /indigenous-job-board
      </p>
      <p className="mt-4 text-xl">
        ImmigrantOpportunities.ca: /newcomers-job-board
      </p>
      <p className="mt-4 text-xl">YouthOpportunities.ca: /youth-job-board</p>
    </div>
  );
}
