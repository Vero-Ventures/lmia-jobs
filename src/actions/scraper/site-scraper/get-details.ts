import type { BrowserHandler } from "@/actions/scraper/helpers/browser-handler";
import { CONFIG } from "@/actions/scraper/helpers/config";
import { getDescription } from "@/actions/scraper/site-scraper/get-description";
import type { JobPostData } from "@/actions/scraper/helpers/types";
import { PROVINCES } from "@/app/lib/constants";

export async function getEmail(
  browserHandler: BrowserHandler
): Promise<string | null> {
  try {
    await browserHandler.waitAndClickInput(CONFIG.inputs.howToApply);

    const email = await browserHandler.waitAndGetElement(
      CONFIG.selectors.postEmail,
      5000
    );

    const emailText = await email.innerText();

    if (emailText) {
      return emailText;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
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
      address: locationDetails.address ? locationDetails.address : null,
      startDate: otherDetails.startDate
        ? otherDetails.startDate
        : headerInfo.postedDate,
      vacancies: Number(otherDetails.vacancies),
      employmentType: otherDetails.employmentType,
      minWorkHours: paymentDetails.minWorkHours,
      maxWorkHours: paymentDetails.maxWorkHours
        ? paymentDetails.maxWorkHours
        : null,
      paymentType: paymentDetails.paymentType,
      minPayValue: paymentDetails.minPay,
      maxPayValue: paymentDetails.maxPay ? paymentDetails.maxPay : null,
      description: description,
      language: otherDetails.language,
    };

    return data;
  } catch (error) {
    throw error;
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
      CONFIG.selectors.jobDetails.header.jobTitle
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
      CONFIG.selectors.jobDetails.header.organizationNameText
    );
    const organizationNameValue = (
      await getOrganizationName.allInnerTexts()
    ).pop();

    if (organizationNameValue) {
      orgName = organizationNameValue;
    }
  } catch {
    try {
      const getOrganizationLink = await browserHandler.waitAndGetElement(
        CONFIG.selectors.jobDetails.header.organizationNameLink
      );
      const organizationNameValue = (
        await getOrganizationLink.allInnerTexts()
      ).pop();

      if (organizationNameValue) {
        orgName = organizationNameValue;
      }
    } catch (error) {
      throw "Organization Name And Link Not Found: " + error;
    }
  }

  if (orgName === "null") {
    throw "Organization Name Or Link Not Found";
  }

  try {
    const getPostedDate = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.header.postedDate
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
      CONFIG.selectors.jobDetails.location.locationAddress,
      2500
    );
    address = (await getAddress.allInnerTexts()).pop();
  } catch {}

  try {
    const getCity = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.location.locationCity
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
      CONFIG.selectors.jobDetails.location.locationRegion
    );
    const regionValue = (await getRegion.allInnerTexts()).pop();

    const ProvincesArray = PROVINCES.map((province) => String(province.value));

    if (regionValue && ProvincesArray.includes(regionValue)) {
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
  minWorkHours: string;
  maxWorkHours: string | undefined;
}> {
  let minPay = "null";
  let maxPay = undefined;
  let paymentType = "null";
  let minWorkHours = "null";
  let maxWorkHours = undefined;

  try {
    const getMinPay = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.payment.paymentMinimum
    );
    const minPayValue = (await getMinPay.allInnerTexts()).pop();

    if (minPayValue) {
      minPay = minPayValue.replace(/,/g, "");
    }
  } catch (error) {
    throw "Minimum Pay Not Found: " + error;
  }

  try {
    const getMaxPay = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.payment.paymentMaximum,
      2500
    );
    const maxPayValue = (await getMaxPay.allInnerTexts()).pop();

    if (maxPayValue) {
      maxPay = maxPayValue.replace(/,/g, "");
    }
  } catch {}

  try {
    const getPaymentType = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.payment.paymentType
    );

    const paymentTypeValue = (await getPaymentType.allInnerTexts()).pop();

    paymentType = paymentTypeValue === "HOUR" ? "Hourly" : "Salary";
  } catch (error) {
    throw "Payment Type Not Found: " + error;
  }

  try {
    const getWorkHours = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.payment.workHours
    );
    const workHoursValue = (await getWorkHours.allInnerTexts()).pop();

    if (workHoursValue) {
      const workHoursNum = workHoursValue.split("hours")[0].trim();

      if (workHoursNum.includes(" to ")) {
        minWorkHours = workHoursNum.split(" to ")[0];
        maxWorkHours = workHoursNum.split(" to ")[1];
      } else {
        minWorkHours = workHoursNum;
      }
    }
  } catch (error) {
    throw "Work Hours Not Found: " + error;
  }

  return {
    minPay,
    maxPay,
    paymentType,
    minWorkHours,
    maxWorkHours,
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
      CONFIG.selectors.jobDetails.details.employmentType
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
      CONFIG.selectors.jobDetails.details.startDateContainer,
      2500
    );
    startDate = (await startDateContainer.allInnerTexts()).pop()?.split(":")[1];
  } catch {}

  try {
    const vacanciesContainer = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.details.vacanciesContainer
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
      CONFIG.selectors.jobDetails.details.language
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
