export const CONFIG = {
  urls: {
    govSearchPage:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?fet=%C2%AC1&fglo=1&sort=M&page=",
    searchResult: "https://www.jobbank.gc.ca/jobsearch/jobposting/",
  },

  selectors: {
    govJobBank: {
      info: {
        jobPosting: "article",
        postEmailTag: `p span#tp_applyByEmailAddress`,
        postEmail: "a",
      },
      inputs: { howToApply: "button#applynowbutton" },
    },
  },
} as const;
