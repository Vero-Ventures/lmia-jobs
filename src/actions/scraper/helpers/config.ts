export const CONFIG = {
  url: "https://www.jobbank.gc.ca/jobsearch/jobposting/",
  input: { howToApply: "button#applynowbutton" },
  selectors: {
    jobPosting: "article",
    postEmail: `p a[href^="mailto:"]`,
    jobDetails: {
      jobDetailsList: "ul.job-posting-brief",
      header: {
        jobTitle: `h1[property="name"] span[property="title"]`,
        postedDate: `span[property="datePosted"]`,
        organizationNameLink: `span[property="name"] a`,
        organizationNameText: `span[property="name"] strong`,
      },
      location: {
        locationAddress: `span[property="streetAddress"]`,
        locationCity: `span[property="addressLocality"]`,
        locationRegion: `span[property="addressRegion"]`,
      },
      payment: {
        paymentMinimum: `span[property="minValue"]`,
        paymentMaximum: `span[property="maxValue"]`,
        paymentType: `span[property="unitText"]`,
        workHours: `span[property="workHours"]`,
      },
      details: {
        employmentType: `span[property="employmentType"] span`,
        startDateContainer: `li:has(span#tp_startDate)`,
        vacanciesContainer: `li:has(span#tp_vacancyNumber)`,
        language: `p[property="qualification"]`,
      },
      description: {
        education: `ul[property="educationRequirements qualification"] li span`,
        experience: `p[property="experienceRequirements qualification"] span`,
        onSiteContainer: `p span.description`,
        onSiteFilter: `span.fa-icon-desc.fa-icon.fas.fa-building`,
        enviroment: `div:has(> h4:has-text("Work site environment"))`,
        setting: `div:has(> h4:has-text("Work setting"))`,
        credentials: `div[property="skills"]:has(> h3:has-text("Credentials"))`,
        specializedSkills: `div[property="experienceRequirements"]`,
        tasksAndSupervision: `div[property="responsibilities"]`,
        benefits: `div[property="jobBenefits"]`,
        additionalInfo: `div[property="skills"]:has(> h3:has-text("Additional information"))`,
      },
    },
  },
} as const;
