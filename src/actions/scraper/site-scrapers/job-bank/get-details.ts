import type { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import { CONFIG } from "@/actions/scraper/helpers/config";
import { getDescription } from "@/actions/scraper/site-scrapers/job-bank/get-description";
import type { JobPostData } from "@/actions/scraper/helpers/types";

export async function getEmail(
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

export async function getJobDetails(
  browserHandler: BrowserHandler,
  postId: string,
  postEmail: string
): Promise<JobPostData | null> {
  try {
    const headerInfo = await getJobHeaderDetails(browserHandler);

    const locationDetails = await getJobLocationDetails(browserHandler);

    const otherDetails = await getOtherJobDetails(browserHandler);

    const paymentDetails = await getJobPayDetails(browserHandler);

    const description = await getDescription(browserHandler);

    const data = {
      postId,
      email: postEmail,
      title: headerInfo.title,
      orgName: headerInfo.orgName,
      province: locationDetails.province,
      city: locationDetails.city,
      address: locationDetails.address,
      startDate: otherDetails.startDate
        ? otherDetails.startDate
        : headerInfo.postedDate,
      vacancies:
        otherDetails.vacancies !== "null" ? Number(otherDetails.vacancies) : 0,
      employmentType: otherDetails.employmentType,
      workHours:
        paymentDetails.workHours !== "null"
          ? Number(paymentDetails.workHours)
          : 0,
      paymentType: paymentDetails.paymentType,
      minPayValue:
        paymentDetails.minPay !== "null" ? Number(paymentDetails.minPay) : 0,
      maxPayValue:
        paymentDetails.maxPay !== undefined
          ? Number(paymentDetails.maxPay)
          : undefined,
      description: description,
      language: otherDetails.language,
    };

    return data;
  } catch (error) {
    console.error("Error on Page : " + postId + ",\n" + error);
    return null;
  }
}

async function getJobHeaderDetails(browserHandler: BrowserHandler): Promise<{
  title: string;
  orgName: string;
  postedDate: string;
}> {
  let title = "null";
  let orgName = "null";
  let postedDate = "null";

  try {
    const getJobTitle = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.header.jobTitle
    );
    const jobTitleValue = (await getJobTitle.allInnerTexts()).pop();

    if (jobTitleValue) {
      title = jobTitleValue;
    }
  } catch (error) {
    throw "Job Title Not Found: " + error;
  }

  try {
    const getOrganizationName = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.header.organizationNameText
    );
    const organizationNameValue = (
      await getOrganizationName.allInnerTexts()
    ).pop();

    if (organizationNameValue) {
      orgName = organizationNameValue;
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
        orgName = organizationNameValue;
      }
    } catch (error) {
      console.error("Organization Name Link Not Found: " + error);
    }
  }

  if (orgName === "null") {
    throw "Organization Name Or Link Not Found";
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
    throw "Posted Date Not Found: " + error;
  }

  return {
    title,
    orgName,
    postedDate,
  };
}

async function getJobLocationDetails(browserHandler: BrowserHandler): Promise<{
  address: string | undefined;
  city: string;
  province: string;
}> {
  let province = "null";
  let city = "null";
  let address = undefined;

  try {
    const getAddress = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.location.locationAddress,
      2500
    );
    address = (await getAddress.allInnerTexts()).pop();
  } catch {}

  try {
    const getCity = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.location.locationCity
    );
    const cityValue = (await getCity.allInnerTexts()).pop();

    if (cityValue) {
      city = cityValue;
    }
  } catch (error) {
    throw "City Not Found: " + error;
  }

  try {
    const getRegion = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.location.locationRegion
    );
    const regionValue = (await getRegion.allInnerTexts()).pop();

    if (regionValue) {
      province = regionValue;
    }
  } catch (error) {
    throw "Region Not Found: " + error;
  }

  return {
    address,
    city,
    province,
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
    throw "Minimum Pay Not Found: " + error;
  }

  try {
    const getMaxPay = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.payment.paymentMaximum,
      2500
    );
    maxPay = (await getMaxPay.allInnerTexts()).pop();
  } catch {}

  try {
    const getPaymentType = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.payment.paymentType
    );

    const paymentTypeValue = (await getPaymentType.allInnerTexts()).pop();

    paymentType = paymentTypeValue === "HOUR" ? "Hourly" : "Salary";
  } catch (error) {
    throw "Payment Type Not Found: " + error;
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
    throw "Work Hours Not Found: " + error;
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
  language: string;
}> {
  let employmentType = "null";
  let startDate = undefined;
  let vacancies = "null";
  let language = "null";

  try {
    const getEmploymentType = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.details.employmentType
    );
    const employmentTypeValue = (await getEmploymentType.allInnerTexts()).pop();

    if (employmentTypeValue) {
      if (employmentTypeValue.includes("Part time")) {
        employmentType = "Part Time";
      } else {
        employmentType = "Full Time";
      }
    }
  } catch (error) {
    throw "Employment Type Not Found: " + error;
  }

  try {
    const startDateContainer = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.details.startDateContainer,
      2500
    );
    startDate = (await startDateContainer.allInnerTexts()).pop()?.split(":")[1];
  } catch {}

  try {
    const vacanciesContainer = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.details.vacanciesContainer
    );

    const vacanciesValue = (await vacanciesContainer.allInnerTexts()).pop();

    if (vacanciesValue) {
      const vacanciesNum = vacanciesValue.split("\n")[1].split(" ")[0];
      vacancies = vacanciesNum ? vacanciesNum : "null";
    }
  } catch (error) {
    throw "Vacancies Not Found: " + error;
  }

  try {
    const getLanguage = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.details.language
    );

    const languageValue = (await getLanguage.allInnerTexts()).pop();

    if (languageValue) {
      language = languageValue;
    }

    if (language !== "English" && language !== "French") {
      language = "English and French";
    }
  } catch (error) {
    throw "Language Not Found: " + error;
  }

  return {
    employmentType,
    startDate,
    vacancies,
    language,
  };
}
