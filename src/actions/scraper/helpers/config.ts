export const CONFIG = {
  urls: {
    govSearchPage:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?fet=%C2%AC1&fglo=1&sort=M&page=",
    searchResult: "https://www.jobbank.gc.ca/jobsearch/jobposting/",
  },

  selectors: {
    govJobBank: {
      jobPosting: "article",
      postedToBank: "span.postedonJB",
      postEmail: `p a[href^="mailto:"]`,
      jobDetails: {
        jobDetailsList: "ul.job-posting-brief",
        header: {
          jobTitle: `h1[property="name"] span[property="title"]`,
          postedDate: `p[property="date-business"] span[property="datePosted"]`,
          organizationNameLink: `span[property="name"] a`,
          organizationNameText: `span[property="name"] strong`,
        },
        location: {
          locationAddress: `span[property="address"] span[property="streetAddress"]`,
          locationCity: `span[property="address"] span[property="addressLocality"]`,
          locationRegion: `span[property="address"] span[property="addressRegion"]`,
        },
        payment: {
          paymentMinimum: `span[property="value"] span[property="minValue"]`,
          paymentMaximum: `span[property="value"] span[property="maxValue"]`,
          paymentType: `span[property="value"] span[property="unitText"]`,
          workHours: `span[property="baseSalary"] span[property="workHours"]`,
        },
        other: {
          employmentType: `span[property="employmentType"] span`,
          startDateContainer: `li:has(span#tp_startDate)`,
          vacanciesContainer: `li:has(span#tp_vacancyNumber)`,
        },
      },

      inputs: { howToApply: "button#applynowbutton" },
    },
  },
} as const;
