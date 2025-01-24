export const CONFIG = {
  urls: {
    govSearchPage:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?fet=%C2%AC1&fglo=1&sort=M&page=",
    searchResult: "https://www.jobbank.gc.ca/jobsearch/jobposting/",
  },

  selectors: {
    govJobBank: {
      info: { jobPosting: "article", postEmail: "p#htaemail + a" },
      inputs: { howToApply: "#applynowbutton" },
    },
  },
} as const;
