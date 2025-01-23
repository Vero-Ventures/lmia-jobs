export const CONFIG = {
  urls: {
    govSearchPage:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?fet=%C2%AC1&fglo=1&sort=M&page=",
  },
  inputs: {},
  selectors: {
    govJobBank: {
      jobPosting: "article",
    },
  },
} as const;
