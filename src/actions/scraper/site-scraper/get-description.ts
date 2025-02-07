import type { BrowserHandler } from "@/actions/scraper/helpers/browser-handler";
import { CONFIG } from "@/actions/scraper/helpers/config";
import { createFormattedDescription } from "./create-description";

// Runs the get Description helper functions.
// Takes: The Chromium Browser Handler.
// Returns: The formatted Job Post details string.
export async function getDescription(
  browserHandler: BrowserHandler
): Promise<string> {
  try {
    // Get the job description from the page.
    // Breaks down the page into sections for easier handling of data extraction.

    // Get info from the Post: Education, Experience, and On Site.
    const overviewValues = await getBaseOverviewValues(browserHandler);

    // Get info from the Post: Enviroment and Setting.
    const enviromentAndSetting = await getEnviromentAndSetting(browserHandler);

    // Get info from the Post: Credentials.
    const credentials = await getCredentials(browserHandler);

    // Get info from the Post: Skills and their Attributes.
    const skillsAndAttributes = await getSkills(browserHandler);

    // Get info from the Post: Tasks and Supervision.
    const tasksAndSupervision = await getTasksAndSupervision(browserHandler);

    // Get info from the Post: Benefits - Health, Financial, and Other.
    const benefitsValues = await getBenefits(browserHandler);

    // Get info from the Post header: Education, Experience, and On Site.
    const additionalInfo = await getAdditionalInfo(browserHandler);

    return createFormattedDescription(
      overviewValues,
      enviromentAndSetting,
      credentials,
      skillsAndAttributes,
      tasksAndSupervision,
      benefitsValues,
      additionalInfo
    );
  } catch (error) {
    throw error;
  }
}

// Define an object type for values found in the description overview.
export type OverviewValues = {
  education: string;
  experience: string;
  onSite: string;
};

// Gets the job overview description details from the Post.
// Takes: The Chromium Browser Handler.
// Returns: An Overview Values object.
async function getBaseOverviewValues(
  browserHandler: BrowserHandler
): Promise<OverviewValues> {
  let education = "null";
  let experience = "null";
  let onSite = "null";

  // Get the Education description from the post and save it to the education variable.
  try {
    const getEducation = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.education
    );
    const educationValue = (await getEducation.allInnerTexts()).pop();
    if (educationValue) {
      education = educationValue;
    }
  } catch (error) {
    throw "Error finding Education: " + error;
  }

  // Get the Experience description from the post and save it to the experience variable.
  try {
    const getExperience = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.experience
    );
    const experienceValue = (await getExperience.allInnerTexts()).pop();
    if (experienceValue) {
      experience = experienceValue;
    }
  } catch (error) {
    throw "Error finding Experience: " + error;
  }

  // Get the On Site description from the post and save it to the onSite variable.
  try {
    // Finds a Locator that will contain the On Site Locator.
    const getOnSiteContainer = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.onSiteContainer
    );

    // Filter the Locator to just the On Site Element.
    const filteredToOnSite = getOnSiteContainer.filter({
      has: browserHandler.page.locator(
        CONFIG.selectors.jobDetails.description.onSiteFilter
      ),
    });

    // Save the value from the filtered Locator to the onSite variable
    const onSiteValue = (await filteredToOnSite.allInnerTexts()).pop();
    if (onSiteValue) {
      onSite = onSiteValue;
    }
  } catch (error) {
    throw "Error finding On Site: " + error;
  }

  return {
    education,
    experience,
    onSite,
  };
}

// Define an object type for values found in the Enviroment & Setting.
export type EnviromentAndSetting = {
  enviroment: string[] | null;
  setting: string[] | null;
};

// Gets the job Enviroment & Setting description details from the Post.
// Takes: The Chromium Browser Handler.
// Returns: An EnviromentAndSetting Values object.
async function getEnviromentAndSetting(
  browserHandler: BrowserHandler
): Promise<EnviromentAndSetting> {
  const enviromentListValues: string[] = [];
  const settingListValues: string[] = [];

  // Get the Enviroment description from the post and save it to the enviromentListValues variable.
  try {
    const getEnviromentLists = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.enviroment,
      1500
    );
    const enviromentInnerText = await getEnviromentLists.allInnerTexts();

    if (getEnviromentLists) {
      // Iterate through the Enviroment & Setting items and push the values to the enviromentListValues array.
      for (const listItem of enviromentInnerText[0].split(`\n`)) {
        // Selector can only find Div containing both Enviroment and Setting.
        // Loop will stop when the header of the Setting section is found.
        if (listItem === "Work setting") {
          break;
        } else if (listItem !== "Work site environment") {
          enviromentListValues.push(listItem);
        }
      }
    }
  } catch {
    // If no Enviroment value is present, continue without setting the value.
  }

  // Get the Setting description from the post and save it to the settingListValues variable.
  try {
    const getSettingLists = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.setting,
      1500
    );
    const settingInnerText = await getSettingLists.allInnerTexts();

    if (getSettingLists) {
      let settingValues = false;
      // Iterate through the Enviroment & Setting items and push the values to the enviromentListValues array.
      for (const listItem of settingInnerText[0].split(`\n`)) {
        // Selector can only find Div containing both Enviroment and Setting.
        // Loop will start after the header of the Setting section is found.
        if (listItem === "Work setting") {
          settingValues = true;
        } else if (settingValues) {
          settingListValues.push(listItem);
        }
      }
    }
  } catch {
    // If no Setting value is present, continue without setting the value.
  }

  // If no values are found for a variable, return null instead of an empty array.
  // Makes for easier parsing when creating the formatted description string.
  return {
    enviroment: enviromentListValues.length > 0 ? enviromentListValues : null,
    setting: settingListValues.length > 0 ? settingListValues : null,
  };
}

// Define an object type for values found in the Credentials.
export type Credentials = {
  credentials: string[] | null;
};

// Gets the job Credentials description details from the Post.
// Takes: The Chromium Browser Handler.
// Returns: An Credentials Values object.
async function getCredentials(
  browserHandler: BrowserHandler
): Promise<Credentials> {
  const credentialsListValues: string[] = [];

  // Get the Credentials description from the post and save it to the credentialsListValues variable.
  try {
    // Get a Locator for the list of Credentials headers and list items.
    const getCredentialsList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.credentials,
      1500
    );

    const credentialsInnerHtml = await getCredentialsList.innerHTML();

    // Split the Credentials values by line, removing empty lines and tabs.
    const credentialsCleanedHtml = credentialsInnerHtml
      .split(`\n`)
      .filter((item) => item.trim() !== "")
      .map((item) => item.replace(/\t/g, ""));

    if (credentialsCleanedHtml) {
      // Iterate over the cleaned Credentials values.
      for (const listItem of credentialsCleanedHtml) {
        // Split the list by the Tags to extract the text from the innerHTML.
        const tagAndText = listItem
          .replace(/<(\w+)>((?:.|\n)*?)<\/\1>/g, "<$1>, $2, </$1>")
          .split(",");

        // If the Tag is a <span< (a list item), push the text to the credentialsListValues array.
        if (tagAndText[0] === "<span>") {
          credentialsListValues.push(tagAndText[1].trim());
        }
      }
    }
  } catch {
    // If no Credentials value is present, continue without setting the value.
  }

  // If no values are found, return null instead of an empty array.
  // Makes for easier parsing when creating the formatted description string.
  return {
    credentials:
      credentialsListValues.length > 0 ? credentialsListValues : null,
  };
}

// Define an object type for values found in the skills & atrributes.
export type SkillsAndAttributes = {
  skills: { skill: string; attributes: string[] }[] | null;
};

// Gets the job Skills & Attributes description details from the Post.
// Takes: The Chromium Browser Handler.
// Returns: An SkillsAndAttributes Values object.
async function getSkills(
  browserHandler: BrowserHandler
): Promise<SkillsAndAttributes> {
  const skillsListValues: { skill: string; attributes: string[] }[] = [];

  try {
    // Get a Locator for the list of Skills headers and list items.
    const getSkillsList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.specializedSkills,
      1500
    );
    const skillsInnerHtml = await getSkillsList.innerHTML();

    // Split the Skills values by line, removing empty lines and tabs.
    const skillsCleanedHtml = skillsInnerHtml
      .split(`\n`)
      .filter((item) => item.trim() !== "")
      .map((item) => item.replace(/\t/g, ""));

    if (skillsCleanedHtml) {
      // Create a value to record the current header of the Skills section.
      let currentSkillHeader = "";
      // Record the index of the current Skill in the skillsListValues array.
      let skillIndex = -1;
      // Iterate over the cleaned Credentials values.
      for (const listItem of skillsCleanedHtml) {
        // Split the list by the Tags to extract the text from the innerHTML
        const tagAndText = listItem
          .replace(/<(\w+)>((?:.|\n)*?)<\/\1>/g, "<$1>, $2, </$1>")
          .split(",");

        // If a new Skill header is found:
        if (tagAndText[0] === "<h4>") {
          // Format the title, create a new Skill object in the skillsListValues array, and iterate the index variable.
          currentSkillHeader = tagAndText[1].trim();
          skillsListValues.push({ skill: currentSkillHeader, attributes: [] });
          skillIndex += 1;
        }

        // If the value is a list item, store it to the current Skill object by the index variable.
        if (tagAndText[0] === "<span>" && currentSkillHeader) {
          skillsListValues[skillIndex].attributes.push(tagAndText[1].trim());
        }
      }
    }
  } catch {
    // If no Skills value is present, continue without setting the value.
  }

  // If no values are found, return null instead of an empty array.
  // Makes for easier parsing when creating the formatted description string.
  return {
    skills: skillsListValues.length > 0 ? skillsListValues : null,
  };
}

// Define an object type for values found in the tasks & supervision.
export type TasksAndSupervision = {
  tasks: string[];
  supervision: string | null;
};

// Gets the job Tasks & Supervision description details from the Post.
// Takes: The Chromium Browser Handler.
// Returns: An TasksAndSupervision Values object.
async function getTasksAndSupervision(
  browserHandler: BrowserHandler
): Promise<TasksAndSupervision> {
  const tasksList: string[] = [];
  let supervision = "null";

  // Get the Tasks description from the post and save it to the tasksList variable.
  // Also saves the Supervision value to the supervision variable if found.
  try {
    // Get a Locator for the list of Tasks list items.
    const getTasksList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.tasksAndSupervision
    );

    const tasksInnerHtml = await getTasksList.innerHTML();

    // Split the Tasks values by line, removing empty lines and tabs.
    const tasksCleanedHtml = tasksInnerHtml
      .split(`\n`)
      .filter((item) => item.trim() !== "")
      .map((item) => item.replace(/\t/g, ""));

    if (tasksCleanedHtml) {
      // Record if the current list item is part of Supervision.
      let getSupervision = false;
      // Iterate over the cleaned Tasks values.
      for (const listItem of tasksCleanedHtml) {
        // Split the list by the Tags to extract the text from the innerHTML.
        const tagAndText = listItem
          .replace(/<(\w+)>((?:.|\n)*?)<\/\1>/g, "<$1>, $2, </$1>")
          .split(",");

        // If the current List item is a header called Supervision, set the getSupervision variable to true.
        if (
          tagAndText[0] === "<h4>" &&
          tagAndText[1].trim() === "Supervision"
        ) {
          getSupervision = true;
        } else if (getSupervision && tagAndText[0] === "<span>") {
          // If the getSupervision variable is true, save the value to the supervision variable.
          supervision = tagAndText[1].trim();
        } else if (tagAndText[0] === "<span>") {
          // Otherwise, save the value to the tasksList variable.
          tasksList.push(tagAndText[1].trim());
        }
      }
    }
  } catch (error) {
    throw "Error finding Tasks: " + error;
  }

  // If no values is found for Supervision, return null instead of an empty array.
  // Makes for easier parsing when creating the formatted description string.
  return {
    tasks: tasksList,
    supervision: supervision !== "null" ? supervision : null,
  };
}

// Define an object type for values found in the benefits.
export type BenefitsValues = {
  health: string[] | null;
  financial: string[] | null;
  other: string[] | null;
};

// Gets the job Benefits description details from the Post.
// Takes: The Chromium Browser Handler.
// Returns: An BenefitsValues Values object.
async function getBenefits(
  browserHandler: BrowserHandler
): Promise<BenefitsValues> {
  const healthBenifitsList: string[] = [];
  const financialBenefitsList: string[] = [];
  const otherBenefitsList: string[] = [];

  // Get the Benefits descriptions from the post and save it to the benefitsList variables.
  try {
    const getBenefitsList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.benefits,
      1500
    );

    const benefitsInnerHtml = await getBenefitsList.innerHTML();

    // Split the Benefits values by line, removing empty lines and tabs.
    const benefitsCleanedHtml = benefitsInnerHtml
      .split(`\n`)
      .filter((item) => item.trim() !== "")
      .map((item) => item.replace(/\t/g, ""));

    if (benefitsCleanedHtml) {
      // Record which type of benefit is currently being recorded.
      let benefitType = "none";
      for (const listItem of benefitsCleanedHtml) {
        const tagAndText = listItem
          .replace(/<(\w+)>((?:.|\n)*?)<\/\1>/g, "<$1>, $2, </$1>")
          .split(",");

        // If the current list item is a header, set the benefitType variable to the header value.
        if (tagAndText[0] === "<h4>") {
          benefitType = tagAndText[1].trim();
        }

        // Check if the current list item is a list value.
        if (tagAndText[0] === "<span>") {
          // Get the attribute and use a switch statement to push the list item to the correct BenefitsList.
          const benefit = tagAndText[1].trim();

          switch (benefitType) {
            case "Health benefits":
              healthBenifitsList.push(benefit);
              break;
            case "Financial benefits":
              financialBenefitsList.push(benefit);
              break;
            case "Other benefits":
              otherBenefitsList.push(benefit);
              break;
          }
        }
      }
    }
  } catch {
    // If no Benefits values are present, continue without setting the values.
  }

  // If no values are found for a variable, return null instead of an empty array.
  // Makes for easier parsing when creating the formatted description string.
  return {
    health: healthBenifitsList.length > 0 ? healthBenifitsList : null,
    financial: financialBenefitsList.length > 0 ? financialBenefitsList : null,
    other: otherBenefitsList.length > 0 ? otherBenefitsList : null,
  };
}

// Define an object type for values found in the additional info.
export type AdditionalInfo = {
  conditionsAndCapability: string[] | null;
  personalSuitability: string[] | null;
  other: { title: string; attributes: string[] }[] | null;
};

// Gets the job Additional Info description details from the Post.
// Takes: The Chromium Browser Handler.
// Returns: An AdditionalInfo Values object.
async function getAdditionalInfo(
  browserHandler: BrowserHandler
): Promise<AdditionalInfo> {
  const conditionsList: string[] = [];
  const suitabilityList: string[] = [];
  const otherList: { title: string; attributes: string[] }[] = [];

  // Get the Additional Info elements description from the post and save it to the related List variable.
  try {
    // Get a Locator for the list of Additional Info and list items.
    const getAdditionalInfo = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.additionalInfo
    );

    const infoInnerHtml = await getAdditionalInfo.innerHTML();

    // Split the Additional Info values by line, removing empty lines and tabs.
    const infoCleanedHtml = infoInnerHtml
      .split(`\n`)
      .filter((item) => item.trim() !== "")
      .map((item) => item.replace(/\t/g, ""));

    if (infoCleanedHtml) {
      // Record the current Additional Info section and index of the list in the otherList array.
      let section = "";
      let otherIndex = -1;
      for (const listItem of infoCleanedHtml) {
        // Split the list by the Tags to extract the text from the innerHTML.
        const tagAndText = listItem
          .replace(/<(\w+)>((?:.|\n)*?)<\/\1>/g, "<$1>, $2, </$1>")
          .split(",");

        // If the current list item is a header, set the section variable to the header value.
        if (tagAndText[0] === "<h4>") {
          if (tagAndText[1].includes("Work conditions")) {
            // On "Work conditions", set the section to "conditions".
            section = "conditions";
          } else if (tagAndText[1].includes("Personal suitability")) {
            // On "Personal suitability", set the section to "suitability".
            section = "suitability";
          } else {
            // On a variable header, set the section to the exact header value.
            section = tagAndText[1].trim();
            // Also push the Additional Info header into the otherList array as a new object.
            otherList.push({ title: section, attributes: [] });
            // Increment the index of the otherList array.
            otherIndex = otherIndex += 1;
          }
        }

        // Check if the current list item is a list value.
        if (tagAndText[0] === "<span>") {
          // Get the attribute and use a switch statement to push the list item to the correct variable array.
          const attribute = tagAndText[1].trim();

          // On "conditions" or "suitability", push directly to that variable array.
          switch (section) {
            case "conditions":
              conditionsList.push(attribute);
              break;
            case "suitability":
              suitabilityList.push(attribute);
              break;
            default:
              // If the section does not match a specific variable:
              // Push the list item to the current otherList section using the otherIndex variable.
              otherList[otherIndex].attributes.push(attribute);
              break;
          }
        }
      }
    }
  } catch {
    // If no Additional Info values are present, continue without setting the values.
  }

  // If no values are found for a variable, return null instead of an empty array.
  // Makes for easier parsing when creating the formatted description string.
  return {
    conditionsAndCapability: conditionsList.length > 0 ? conditionsList : null,
    personalSuitability: suitabilityList.length > 0 ? suitabilityList : null,
    other: otherList.length > 0 ? otherList : null,
  };
}
