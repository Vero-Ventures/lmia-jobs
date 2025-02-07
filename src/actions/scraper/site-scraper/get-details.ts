import type { BrowserHandler } from "@/actions/scraper/helpers/browser-handler";
import { CONFIG } from "@/actions/scraper/helpers/config";
import { getDescription } from "@/actions/scraper/site-scraper/get-description";
import type { JobPostData } from "@/actions/scraper/helpers/types";
import { PROVINCES } from "@/app/lib/constants";

// Gets email by clicking the "Apply Now" button and extracting the email.
// Takes: The Chromium Browser Handler.
// Returns: The Post email or null on failure.
export async function getEmail(
  browserHandler: BrowserHandler
): Promise<string | null> {
  try {
    // Click the "How to Apply" button to reveal the email.
    await browserHandler.waitAndClickInput(CONFIG.input.howToApply);

    // Wait for email to be present and extract the text.
    const email = await browserHandler.waitAndGetElement(
      CONFIG.selectors.postEmail,
      5000
    );

    const emailText = await email.innerText();

    // If an email was present in application info, return it.
    if (emailText) {
      return emailText;
    } else {
      // If no email is found, return a null value.
      return null;
    }
  } catch (error) {
    throw error;
  }
}

// Takes: The Chromium Browser Handler.
export async function getJobDetails(
  browserHandler: BrowserHandler,
  postId: string,
  postEmail: string
): Promise<JobPostData> {
  try {
    // Get the job details from the page.
    // Breaks down the page into sections for easier handling of data extraction.

    // Get info from the Post header: Title, Organization Name, and Date Posted.
    const headerInfo = await getJobHeaderDetails(browserHandler);

    // Get location info from the Post: Province, City, and Address.
    // Address values are optional and may be returned as undefined.
    const locationDetails = await getJobLocationDetails(browserHandler);

    // Get other generic Post info: Employment Type, Start Date, Vacancies Name, and Language.
    // Start date values are optional and may be returned as undefined.
    const otherDetails = await getOtherJobDetails(browserHandler);

    // Get payment info from the Post: Min & Max Pay, Payment Type, and the Min & Max Work Hours.
    // Max Pay and Max Work Hours values are optional and may be returned as undefined.
    const paymentDetails = await getJobPayDetails(browserHandler);

    // Get the Post info related to the description.
    // Description is formatted to a single string prior to return.
    const description = await getDescription(browserHandler);

    // Format the data to the values expected by the database and return it.
    // If no start date was found, start date was posted as ASAP.
    //    In these cases, the date of posting is considered the start date.
    // Also Converts any undefined values to null.
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
      vacancies: otherDetails.vacancies,
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

// Takes: The Chromium Browser Handler.
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

// Takes: The Chromium Browser Handler.
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

// Takes: The Chromium Browser Handler.
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

// Takes: The Chromium Browser Handler.
async function getOtherJobDetails(browserHandler: BrowserHandler): Promise<{
  employmentType: string;
  startDate: string | undefined;
  vacancies: number;
  language: string;
}> {
  let employmentType = "null";
  let startDate = undefined;
  let vacancies = 0;
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
      vacancies = vacanciesNum ? Number(vacanciesNum) : 0;
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
