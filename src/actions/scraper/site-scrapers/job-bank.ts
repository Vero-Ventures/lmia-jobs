import type { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import { CONFIG } from "@/actions/scraper/helpers/config";
// import { DataHandler } from "@/actions/scraper/scraping-handlers/data-handler";

export async function scrapeGovJobBank(
  browserHandler: BrowserHandler
): Promise<{ postIds: string[]; postEmails: string[] }> {
  let pageNum = 1;
  let scrape = true;

  // const dataHandler = new DataHandler();

  const postIds: string[] = [];

  while (scrape) {
    const newPostIds = await scrapePosts(browserHandler, pageNum);
    postIds.push(...newPostIds);
    pageNum += 1;

    // Testing Limit
    if (pageNum > 0) {
      scrape = false;
    }
  }

  const { postEmails, badPostIds } = await visitPages(browserHandler, postIds);

  const goodPosts = postIds!.filter(
    (postId: string) => !badPostIds.includes(postId)
  );

  return { postIds: goodPosts, postEmails: postEmails };
}

async function scrapePosts(
  browserHandler: BrowserHandler,
  pageNum: number
): Promise<string[]> {
  try {
    const pagePostIds: string[] = [];

    await browserHandler.visitPage(CONFIG.urls.govSearchPage + String(pageNum));

    const posts = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobPosting
    );

    // Testing Limit
    const allPosts = await posts.all();
    const testPosts = [allPosts[0], allPosts[1], allPosts[2]];

    for (const post of testPosts) {
      const postedToBank = post.locator(
        CONFIG.selectors.govJobBank.postedToBank
      );

      if ((await postedToBank.innerText()).includes("Posted on Job Bank")) {
        const fullId = await post.getAttribute("id");
        pagePostIds.push(fullId!.split("-")[1]);
      }
    }

    return pagePostIds;
  } catch (error) {
    console.error("Error getting job post Ids: " + error);
    return [];
  }
}

async function visitPages(
  browserHandler: BrowserHandler,
  postIds: string[]
): Promise<{ postEmails: string[]; badPostIds: string[]; postDetails: any[] }> {
  try {
    const postEmails: string[] = [];
    const postDetails: any[] = [];
    const badPostIds: string[] = [];

    for (const post of postIds) {
      await browserHandler.visitPage(
        CONFIG.urls.searchResult + String(post) + "?source=searchresults"
      );

      const email = await getEmail(browserHandler);

      if (!email) {
        console.error("Post With ID: " + post + " Has Invalid Email");
        badPostIds.push(post);
      } else {
        postEmails.push(email);
      }

      const details = await getJobDetails(browserHandler);

      if (!details) {
        console.error("Post With ID: " + post + " Has Invalid Details");
        badPostIds.push(post);
      } else {
        postDetails.push(details);
      }
    }

    return { postEmails, postDetails, badPostIds };
  } catch (error) {
    console.error("Error getting gettig post page emails: " + error);
    return { postEmails: [], badPostIds: [], postDetails: [] };
  }
}

async function getEmail(
  browserHandler: BrowserHandler
): Promise<string | null> {
  try {
    await browserHandler.waitAndClickInput(
      CONFIG.selectors.govJobBank.inputs.howToApply
    );

    const email = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.postEmail,
      5000
    );

    const emailText = await email.innerText();

    if (emailText) {
      return emailText;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error: " + error);
    return null;
  }
}

async function getJobDetails(browserHandler: BrowserHandler): Promise<{
  jobTitle: string | undefined;
  organizationName: string | undefined;
  address: string | undefined;
  city: string | undefined;
  region: string | undefined;
  minPayValue: string | undefined;
  maxPayValue: string | undefined;
  paymentType: string | undefined;
  workHours: string | undefined;
  employmentType: string | undefined;
  startDate: string | undefined;
  vacancies: string | undefined;
} | null> {
  try {
    const headerInfo = await getJobHeaderDetails(browserHandler);

    const locationDetails = await getJobLocationDetails(browserHandler);

    const paymentDetails = await getJobPayDetails(browserHandler);

    const otherDetails = await getOtherJobDetails(browserHandler);

    const data = {
      jobTitle: headerInfo.jobTitle,
      organizationName: headerInfo.organizationName,
      address: locationDetails.address,
      city: locationDetails.city,
      region: locationDetails.region,
      minPayValue: paymentDetails.minPay,
      maxPayValue: paymentDetails.maxPay,
      paymentType: paymentDetails.paymentType,
      workHours: paymentDetails.workHours,
      employmentType: otherDetails.employmentType,
      startDate: otherDetails.startDate,
      vacancies: otherDetails.vacancies,
    };

    return data;
  } catch (error) {
    console.error("Error: " + error);
    return null;
  }
}

async function getJobHeaderDetails(browserHandler: BrowserHandler): Promise<{
  jobTitle: string | undefined;
  organizationName: string | undefined;
  postedDate: string | undefined;
}> {
  let jobTitle = undefined;
  let organizationName = undefined;
  let postedDate = undefined;

  try {
    const getJobTitle = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.header.jobTitle
    );
    jobTitle = (await getJobTitle.allInnerTexts()).pop();
  } catch (error) {
    console.error("Job Title Not Found: " + error);
  }

  try {
    const getOrganizationName = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.header.organizationNameText
    );
    organizationName = (await getOrganizationName.allInnerTexts()).pop();
  } catch (error) {
    console.error("Organization Name Text Not Found: " + error);
    try {
      const getOrganizationLink = await browserHandler.waitAndGetElement(
        CONFIG.selectors.govJobBank.jobDetails.header.organizationNameLink
      );
      organizationName = (await getOrganizationLink.allInnerTexts()).pop();
    } catch (error) {
      console.error("Organization Name Link Not Found: " + error);
    }
  }

  try {
    const getPostedDate = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.header.postedDate
    );
    postedDate = (await getPostedDate.allInnerTexts()).pop();
  } catch (error) {
    console.error("Posted Date Not Found: " + error);
  }

  return {
    jobTitle,
    organizationName,
    postedDate,
  };
}

async function getJobLocationDetails(browserHandler: BrowserHandler): Promise<{
  address: string | undefined;
  city: string | undefined;
  region: string | undefined;
}> {
  let address = undefined;
  let city = undefined;
  let region = undefined;

  try {
    const getAddress = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.location.locationAddress
    );
    address = (await getAddress.allInnerTexts()).pop();
  } catch (error) {
    console.error("Address Not Found: " + error);
  }

  try {
    const getCity = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.location.locationCity
    );
    city = (await getCity.allInnerTexts()).pop();
  } catch (error) {
    console.error("City Not Found: " + error);
  }

  try {
    const getRegion = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.location.locationRegion
    );
    region = (await getRegion.allInnerTexts()).pop();
  } catch (error) {
    console.error("Region Not Found: " + error);
  }

  return {
    address,
    city,
    region,
  };
}

async function getJobPayDetails(browserHandler: BrowserHandler): Promise<{
  minPay: string | undefined;
  maxPay: string | undefined;
  paymentType: string | undefined;
  workHours: string | undefined;
}> {
  let minPay = undefined;
  let maxPay = undefined;
  let paymentType = undefined;
  let workHours = undefined;

  try {
    const getMinPay = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.payment.paymentMinimum
    );
    minPay = (await getMinPay.allInnerTexts()).pop();
  } catch (error) {
    console.error("Minimum Pay Not Found: " + error);
  }

  try {
    const getMaxPay = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.payment.paymentMaximum
    );
    maxPay = (await getMaxPay.allInnerTexts()).pop();
  } catch (error) {
    console.error("Maximum Pay Not Found: " + error);
  }

  try {
    const getPaymentType = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.payment.paymentType
    );

    const paymentTypeValue = (await getPaymentType.allInnerTexts()).pop();

    paymentType = paymentTypeValue === "HOUR" ? "Hourly" : "Salary";
  } catch (error) {
    console.error("Payment Type Not Found: " + error);
  }

  try {
    const getWorkHours = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.payment.workHours
    );
    workHours = (await getWorkHours.allInnerTexts()).pop();
  } catch (error) {
    console.error("Work Hours Not Found: " + error);
  }

  return {
    minPay,
    maxPay,
    paymentType,
    workHours,
  };
}

async function getOtherJobDetails(browserHandler: BrowserHandler): Promise<{
  employmentType: string | undefined;
  startDate: string | undefined;
  vacancies: string | undefined;
}> {
  let employmentType = undefined;
  let startDate = undefined;
  let vacancies = undefined;

  try {
    const getEmploymentType = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.other.employmentType
    );
    employmentType = (await getEmploymentType.allInnerTexts()).pop();
  } catch (error) {
    console.error("Employment Type Not Found: " + error);
  }

  try {
    const startDateContainer = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.other.startDateContainer
    );

    startDateContainer.evaluate((element) => {
      const text = element.textContent || "";
      const match = text.match(/Start date:\s*([\d-]+)/);
      startDate = match ? match[1] : undefined;
    });
  } catch (error) {
    console.error("Start Date Not Found: " + error);
  }

  try {
    const vacanciesContainer = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.other.vacanciesContainer
    );

    vacanciesContainer.evaluate((element) => {
      const text = element.textContent || "";
      const match = text.match(/^(\d+) vacancies$/);
      vacancies = match ? match[1] : undefined;
    });
  } catch (error) {
    console.error("Vacancies Type Not Found: " + error);
  }

  return {
    employmentType,
    startDate,
    vacancies,
  };
}
