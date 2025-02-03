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
          onSite: `p span.description`,
          onSiteFilter: `span.fa-icon-desc.fa-icon.fas.fa-building`,
          enviroment: `div:has(> h4:has-text("Work site environment"))`,
          setting: `div:has(> h4:has-text("Work setting"))`,
          credentials: `div[property="skills"]:has(> h3:has-text("Credentials"))`,
          benefits: `div[property="jobBenefits"]`,
          tasksAndSupervision: `div[property="responsibilities"]`,
          specializedSkills: `div[property="experienceRequirements"]`,
          // 3 Values: ConditionsAndCapability, PersonalSuitability, Other.
          additionalInformation: `div[property="skills"]:has(> h3:has-text("Additional information"))`,
        },
      },

      inputs: { howToApply: "button#applynowbutton" },
    },
  },
} as const;
