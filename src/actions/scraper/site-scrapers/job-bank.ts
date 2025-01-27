import type { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import { CONFIG } from "@/actions/scraper/helpers/config";
// import { DataHandler } from "@/actions/scraper/scraping-handlers/data-handler";

export async function scrapeGovJobBank(
  browserHandler: BrowserHandler
): Promise<{
  postIds: string[];
  postEmails: { postId: string; email: string }[];
  postDetails: any[];
}> {
  let pageNum = 1;
  let scrape = true;

  // const dataHandler = new DataHandler();

  const newPosts: string[] = [];

  while (scrape) {
    const newPostIds = await scrapePosts(browserHandler, pageNum);
    newPosts.push(...newPostIds);
    pageNum += 1;

    // Testing Limit
    if (pageNum > 0) {
      scrape = false;
    }
  }

  const { postEmails, badPostIds, postDetails } = await visitPages(
    browserHandler,
    newPosts
  );

  const postIds = newPosts!.filter(
    (postId: string) => !badPostIds.includes(postId)
  );

  return { postIds, postEmails, postDetails };
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
): Promise<{
  postEmails: { postId: string; email: string }[];
  postDetails: any[];
  badPostIds: string[];
}> {
  try {
    const postEmails: { postId: string; email: string }[] = [];
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
        postEmails.push({ postId: post, email });
      }

      const details = await getJobDetails(browserHandler, post);

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

async function getJobDetails(
  browserHandler: BrowserHandler,
  postId: string
): Promise<{
  postId: string;
  postedDate: string;
  jobTitle: string;
  organizationName: string;
  address: string | undefined;
  city: string;
  region: string;
  minPayValue: string;
  maxPayValue: string | undefined;
  paymentType: string;
  workHours: string;
  employmentType: string;
  startDate: string | undefined;
  vacancies: string;
} | null> {
  try {
    const headerInfo = await getJobHeaderDetails(browserHandler);

    const locationDetails = await getJobLocationDetails(browserHandler);

    const paymentDetails = await getJobPayDetails(browserHandler);

    const otherDetails = await getOtherJobDetails(browserHandler);

    const data = {
      postId,
      postedDate: headerInfo.postedDate,
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
  jobTitle: string;
  organizationName: string;
  postedDate: string;
}> {
  let jobTitle = "null";
  let organizationName = "null";
  let postedDate = "null";

  try {
    const getJobTitle = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.header.jobTitle
    );
    const jobTitleValue = (await getJobTitle.allInnerTexts()).pop();

    if (jobTitleValue) {
      jobTitle = jobTitleValue;
    }
  } catch (error) {
    console.error("Job Title Not Found: " + error);
  }

  try {
    const getOrganizationName = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.header.organizationNameText
    );
    const organizationNameValue = (
      await getOrganizationName.allInnerTexts()
    ).pop();

    if (organizationNameValue) {
      organizationName = organizationNameValue;
    }
  } catch (error) {
    console.error("Organization Name Text Not Found: " + error);
    try {
      const getOrganizationLink = await browserHandler.waitAndGetElement(
        CONFIG.selectors.govJobBank.jobDetails.header.organizationNameLink
      );
      const organizationNameValue = (
        await getOrganizationLink.allInnerTexts()
      ).pop();

      if (organizationNameValue) {
        organizationName = organizationNameValue;
      }
    } catch (error) {
      console.error("Organization Name Link Not Found: " + error);
    }
  }

  try {
    const getPostedDate = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.header.postedDate
    );
    const postedDateValue = (await getPostedDate.allInnerTexts()).pop();

    if (postedDateValue) {
      const dateString = postedDateValue.replace("Posted on ", "").trim();
      const date = new Date(dateString);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      postedDate = `${year}-${month}-${day}`;
    }
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
  city: string;
  region: string;
}> {
  let address = undefined;
  let city = "null";
  let region = "null";

  try {
    const getAddress = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.location.locationAddress,
      2500
    );
    address = (await getAddress.allInnerTexts()).pop();
  } catch (error) {
    console.error("Address Not Found: " + error);
  }

  try {
    const getCity = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.location.locationCity
    );
    const cityValue = (await getCity.allInnerTexts()).pop();

    if (cityValue) {
      city = cityValue;
    }
  } catch (error) {
    console.error("City Not Found: " + error);
  }

  try {
    const getRegion = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.location.locationRegion
    );
    const regionValue = (await getRegion.allInnerTexts()).pop();

    if (regionValue) {
      region = regionValue;
    }
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
  minPay: string;
  maxPay: string | undefined;
  paymentType: string;
  workHours: string;
}> {
  let minPay = "null";
  let maxPay = undefined;
  let paymentType = "null";
  let workHours = "null";

  try {
    const getMinPay = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.payment.paymentMinimum
    );
    const minPayValue = (await getMinPay.allInnerTexts()).pop();

    if (minPayValue) {
      minPay = minPayValue;
    }
  } catch (error) {
    console.error("Minimum Pay Not Found: " + error);
  }

  try {
    const getMaxPay = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.payment.paymentMaximum,
      2500
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
    const workHoursValue = (await getWorkHours.allInnerTexts()).pop();

    if (workHoursValue) {
      const workHoursNum = workHoursValue.split("hours")[0].trim();

      workHours = workHoursNum;
    }
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
  employmentType: string;
  startDate: string | undefined;
  vacancies: string;
}> {
  let employmentType = "null";
  let startDate = undefined;
  let vacancies = "null";

  try {
    const getEmploymentType = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.other.employmentType
    );
    const employmentTypeValue = (await getEmploymentType.allInnerTexts()).pop();

    if (employmentTypeValue) {
      if (employmentTypeValue.includes("Part time")) {
        employmentType = "Part Time";
      } else {
        employmentType = "Full Time"
      }
    }
  } catch (error) {
    console.error("Employment Type Not Found: " + error);
  }

  try {
    const startDateContainer = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.other.startDateContainer,
      2500
    );

    startDate = (await startDateContainer.allInnerTexts()).pop()?.split(":")[1];
  } catch (error) {
    console.error("Start Date Not Found: " + error);
  }

  try {
    const vacanciesContainer = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.other.vacanciesContainer
    );

    const vacanciesValue = (await vacanciesContainer.allInnerTexts()).pop();

    if (vacanciesValue) {
      const vacanciesNum = vacanciesValue.split("\n")[1].split(" ")[0];
      vacancies = vacanciesNum ? vacanciesNum : "null";
    }
  } catch (error) {
    console.error("Vacancies Type Not Found: " + error);
  }

  return {
    employmentType,
    startDate,
    vacancies,
  };
}
