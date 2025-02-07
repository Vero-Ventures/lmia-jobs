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

// Runs the get Details helper functions and formats the Job Post data.
// Takes: The Chromium Browser Handler.
// Returns: The formatted Job Post Data Object.
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

// Gets the job details in the header of the Post.
// Takes: The Chromium Browser Handler.
// Returns: Title, Org Name, and Posted Date strings.
async function getJobHeaderDetails(browserHandler: BrowserHandler): Promise<{
  title: string;
  orgName: string;
  postedDate: string;
}> {
  let title = "null";
  let orgName = "null";
  let postedDate = "null";

  // Await the element locator, get first inner text, and assign it to "title".
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

  // Await the element locator for text Organization Name.
  try {
    const getOrganizationName = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.header.organizationNameText
    );

    // Get the Organization Name from the locator and save it to "orgName".
    const organizationNameValue = (
      await getOrganizationName.allInnerTexts()
    ).pop();

    if (organizationNameValue) {
      orgName = organizationNameValue;
    }
  } catch {
    // If Organization Name is not stored as text, get the locator for a Link name.
    // Runs when a timeout of the Text Organization Name is caught.
    try {
      const getOrganizationLink = await browserHandler.waitAndGetElement(
        CONFIG.selectors.jobDetails.header.organizationNameLink
      );

      // Get the Organization Name from the Link locator and save it to "orgName".
      const organizationNameValue = (
        await getOrganizationLink.allInnerTexts()
      ).pop();

      if (organizationNameValue) {
        orgName = organizationNameValue;
      }
    } catch (error) {
      // If neither Organization Name is found, throw an error.
      throw "Organization Name And Link Not Found: " + error;
    }
  }

  // Await the element locator for the Posting date.
  try {
    const getPostedDate = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.header.postedDate
    );

    // Get the Posting Date string.
    const postedDateValue = (await getPostedDate.allInnerTexts()).pop();

    if (postedDateValue) {
      // Format string to the Date and convert it to a Date object.
      const dateString = postedDateValue.replace("Posted on ", "").trim();
      const date = new Date(dateString);

      // Use the date object to extract the Year, Month, and Day.
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      // Set the "postedDate" variable to a formatted string.
      postedDate = `${year}-${month}-${day}`;
    }
  } catch (error) {
    throw "Posted Date Not Found: " + error;
  }

  // Return the extracted values after they are set.
  return {
    title,
    orgName,
    postedDate,
  };
}

// Gets the job location details from the Post.
// Takes: The Chromium Browser Handler.
// Returns: Adress (nullable), City, and Province strings.
async function getJobLocationDetails(browserHandler: BrowserHandler): Promise<{
  address: string | undefined;
  city: string;
  province: string;
}> {
  let province = "null";
  let city = "null";
  let address = undefined;

  // Get the address from the post and save it to the "address" variable.
  try {
    const getAddress = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.location.locationAddress,
      2500
    );
    address = (await getAddress.allInnerTexts()).pop();
  } catch {
    // If no address is present, continue without setting the value.
  }

  // Await the element locator, get first inner text, and assign it to "city".
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

  // Await the element locator, get first inner text, and assign it to "title".
  try {
    const getRegion = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.location.locationRegion
    );
    const regionValue = (await getRegion.allInnerTexts()).pop();

    // Get the possible valid provinces as an array.
    const ProvincesArray = PROVINCES.map((province) => String(province.value));

    // Check the region is present and a valid province before saving.
    if (regionValue && ProvincesArray.includes(regionValue)) {
      province = regionValue;
    }
  } catch (error) {
    throw "Region Not Found: " + error;
  }

  // Return the extracted values after they are set.
  return {
    address,
    city,
    province,
  };
}

// Gets the job pay details from the Post.
// Takes: The Chromium Browser Handler.
// Returns: Min Pay, Max Pay (nullable), Payment Type, Min Work Hours, and Max Work Hours (nullable) strings.
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

  // Await the element locator, get first inner text, and assign it to "minPay".
  try {
    const getMinPay = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.payment.paymentMinimum
    );
    const minPayValue = (await getMinPay.allInnerTexts()).pop();

    // Before saving, remove all comma's for later Number conversion.
    if (minPayValue) {
      minPay = minPayValue.replace(/,/g, "");
    }
  } catch (error) {
    throw "Minimum Pay Not Found: " + error;
  }

  // Get the address from the post and save it to the "maxPay" variable.
  try {
    const getMaxPay = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.payment.paymentMaximum,
      2500
    );
    const maxPayValue = (await getMaxPay.allInnerTexts()).pop();

    // Before saving, remove all comma's for later Number conversion.
    if (maxPayValue) {
      maxPay = maxPayValue.replace(/,/g, "");
    }
  } catch {
    // If no Max Pay value is present, continue without setting the value.
  }

  // Get the address from the post and save it to the "paymentType" variable.
  try {
    const getPaymentType = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.payment.paymentType
    );

    const paymentTypeValue = (await getPaymentType.allInnerTexts()).pop();

    // Convert from "HOUR" or "SALARY" to standard string values.
    paymentType = paymentTypeValue === "HOUR" ? "Hourly" : "Salary";
  } catch (error) {
    throw "Payment Type Not Found: " + error;
  }

  // Await the work hours locator and get first inner text.
  try {
    const getWorkHours = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.payment.workHours
    );
    const workHoursValue = (await getWorkHours.allInnerTexts()).pop();

    if (workHoursValue) {
      // Split the work hours to extract the numerical value.
      const workHoursNum = workHoursValue.split("hours")[0].trim();

      // If a Min and Max are present, split by "to" and assign to variables.
      if (workHoursNum.includes(" to ")) {
        minWorkHours = workHoursNum.split(" to ")[0];
        maxWorkHours = workHoursNum.split(" to ")[1];
      } else {
        // If no Max is present, only store the extracted value to "minWorkHours".
        minWorkHours = workHoursNum;
      }
    }
  } catch (error) {
    throw "Work Hours Not Found: " + error;
  }

  // Return the extracted values after they are set.
  return {
    minPay,
    maxPay,
    paymentType,
    minWorkHours,
    maxWorkHours,
  };
}

// Gets the other job details from the Post.
// Takes: The Chromium Browser Handler.
// Returns: Employment Type, Start Date, and Language strings.
//          Vacancies as a number.
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

  // Get the address from the post and save it to the "employmentType" variable.
  try {
    const getEmploymentType = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.details.employmentType
    );
    const employmentTypeValue = (await getEmploymentType.allInnerTexts()).pop();

    // Checks for possible value "Part time leading to full time".
    // If the value or "Part Time" is present, value is saved as "Part Time".
    if (employmentTypeValue) {
      if (employmentTypeValue.includes("Part time")) {
        employmentType = "Part Time";
      } else {
        // Otherwise, save the "employmentType" as "Full Time".
        employmentType = "Full Time";
      }
    }
  } catch (error) {
    throw "Employment Type Not Found: " + error;
  }

  // Get the address from the post and save it to the "startDate" variable.
  try {
    const startDateContainer = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.details.startDateContainer,
      2500
    );
    startDate = (await startDateContainer.allInnerTexts()).pop()?.split(":")[1];
  } catch {
    // If no start date is found, continue without setting the value.
  }

  // Get the address from the post and save it to the "vacancies" variable.
  try {
    const vacanciesContainer = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.details.vacanciesContainer
    );

    const vacanciesValue = (await vacanciesContainer.allInnerTexts()).pop();

    if (vacanciesValue) {
      // Before saving, split the string to extract the numerical value.
      const vacanciesNum = vacanciesValue.split("\n")[1].split(" ")[0];
      vacancies = vacanciesNum ? Number(vacanciesNum) : 0;
    }
  } catch (error) {
    throw "Vacancies Not Found: " + error;
  }

  // Get the address from the post and save it to the "language" variable.
  try {
    const getLanguage = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.details.language
    );

    const languageValue = (await getLanguage.allInnerTexts()).pop();

    if (languageValue) {
      language = languageValue;
    }

    // If value is not exactly "English" or "French" value is saved as "English and French".
    if (language !== "English" && language !== "French") {
      language = "English and French";
    }
  } catch (error) {
    throw "Language Not Found: " + error;
  }

  // Return the extracted values after they are set.
  return {
    employmentType,
    startDate,
    vacancies,
    language,
  };
}
