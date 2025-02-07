import type { BrowserHandler } from "@/actions/scraper/helpers/browser-handler";
import { CONFIG } from "@/actions/scraper/helpers/config";
import { createFormattedDescription } from "./create-description";

export async function getDescription(
  browserHandler: BrowserHandler
): Promise<string> {
  try {
    const overviewValues = await getBaseOverviewValues(browserHandler);

    const enviromentAndSetting = await getEnviromentAndSetting(browserHandler);

    const credentials = await getCredentials(browserHandler);

    const skillsAndAttributes = await getSkills(browserHandler);

    const tasksAndSupervision = await getTasksAndSupervision(browserHandler);

    const benefitsValues = await getBenefits(browserHandler);

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

async function getBaseOverviewValues(
  browserHandler: BrowserHandler
): Promise<OverviewValues> {
  let education = "null";
  let experience = "null";
  let onSite = "null";

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

  try {
    const getOnSiteContainer = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.onSiteContainer
    );

    const filteredToOnSite = getOnSiteContainer.filter({
      has: browserHandler.page.locator(
        CONFIG.selectors.jobDetails.description.onSiteFilter
      ),
    });
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

// Define an object type for values found in the enviroment & setting.
export type EnviromentAndSetting = {
  enviroment: string[] | null;
  setting: string[] | null;
};

async function getEnviromentAndSetting(
  browserHandler: BrowserHandler
): Promise<EnviromentAndSetting> {
  const enviromentListValues: string[] = [];
  const settingListValues: string[] = [];

  try {
    const getEnviromentLists = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.enviroment,
      1500
    );
    const enviromentInnerText = await getEnviromentLists.allInnerTexts();

    if (getEnviromentLists) {
      for (const listItem of enviromentInnerText[0].split(`\n`)) {
        if (listItem === "Work setting") {
          break;
        } else if (listItem !== "Work site environment") {
          enviromentListValues.push(listItem);
        }
      }
    }
  } catch {}

  try {
    const getSettingLists = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.setting,
      1500
    );
    const settingInnerText = await getSettingLists.allInnerTexts();

    if (getSettingLists) {
      let settingValues = false;
      for (const listItem of settingInnerText[0].split(`\n`)) {
        if (listItem === "Work setting") {
          settingValues = true;
        } else if (settingValues) {
          settingListValues.push(listItem);
        }
      }
    }
  } catch {}

  return {
    enviroment: enviromentListValues.length > 0 ? enviromentListValues : null,
    setting: settingListValues.length > 0 ? settingListValues : null,
  };
}

// Define an object type for values found in the credentials.
export type Credentials = {
  credentials: string[] | null;
};

async function getCredentials(
  browserHandler: BrowserHandler
): Promise<Credentials> {
  const credentialsListValues: string[] = [];

  try {
    const getCredentialsList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.credentials,
      1500
    );

    const credentialsInnerHtml = await getCredentialsList.innerHTML();

    const credentialsCleanedHtml = credentialsInnerHtml
      .split(`\n`)
      .filter((item) => item.trim() !== "")
      .map((item) => item.replace(/\t/g, ""));

    if (credentialsCleanedHtml) {
      for (const listItem of credentialsCleanedHtml) {
        const tagAndText = listItem
          .replace(/<(\w+)>((?:.|\n)*?)<\/\1>/g, "<$1>, $2, </$1>")
          .split(",");

        if (tagAndText[0] === "<span>") {
          credentialsListValues.push(tagAndText[1].trim());
        }
      }
    }
  } catch {}

  return {
    credentials:
      credentialsListValues.length > 0 ? credentialsListValues : null,
  };
}

// Define an object type for values found in the skills & atrributes.
export type SkillsAndAttributes = {
  skills: { skill: string; attributes: string[] }[] | null;
};

async function getSkills(
  browserHandler: BrowserHandler
): Promise<SkillsAndAttributes> {
  const skillsListValues: { skill: string; attributes: string[] }[] = [];

  try {
    const getSkillsList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.specializedSkills,
      1500
    );
    const skillsInnerHtml = await getSkillsList.innerHTML();

    const skillsCleanedHtml = skillsInnerHtml
      .split(`\n`)
      .filter((item) => item.trim() !== "")
      .map((item) => item.replace(/\t/g, ""));

    if (skillsCleanedHtml) {
      let currentSkillHeader = "";
      let skillIndex = -1;
      for (const listItem of skillsCleanedHtml) {
        const tagAndText = listItem
          .replace(/<(\w+)>((?:.|\n)*?)<\/\1>/g, "<$1>, $2, </$1>")
          .split(",");

        if (tagAndText[0] === "<h4>") {
          currentSkillHeader = tagAndText[1].trim();
          skillsListValues.push({ skill: currentSkillHeader, attributes: [] });
          skillIndex += 1;
        }

        if (tagAndText[0] === "<span>" && currentSkillHeader) {
          skillsListValues[skillIndex].attributes.push(tagAndText[1].trim());
        }
      }
    }
  } catch {}

  return {
    skills: skillsListValues.length > 0 ? skillsListValues : null,
  };
}

// Define an object type for values found in the tasks & supervision.
export type TasksAndSupervision = {
  tasks: string[];
  supervision: string | null;
};

async function getTasksAndSupervision(
  browserHandler: BrowserHandler
): Promise<TasksAndSupervision> {
  const tasksList: string[] = [];
  let supervision = "null";

  try {
    const getTasksList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.tasksAndSupervision
    );

    const tasksInnerHtml = await getTasksList.innerHTML();

    const tasksCleanedHtml = tasksInnerHtml
      .split(`\n`)
      .filter((item) => item.trim() !== "")
      .map((item) => item.replace(/\t/g, ""));

    if (tasksCleanedHtml) {
      let getSupervision = false;
      for (const listItem of tasksCleanedHtml) {
        const tagAndText = listItem
          .replace(/<(\w+)>((?:.|\n)*?)<\/\1>/g, "<$1>, $2, </$1>")
          .split(",");

        if (
          tagAndText[0] === "<h4>" &&
          tagAndText[1].trim() === "Supervision"
        ) {
          getSupervision = true;
        } else if (getSupervision && tagAndText[0] === "<span>") {
          supervision = tagAndText[1].trim();
        } else if (tagAndText[0] === "<span>") {
          tasksList.push(tagAndText[1].trim());
        }
      }
    }
  } catch (error) {
    throw "Error finding Description: " + error;
  }

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

async function getBenefits(
  browserHandler: BrowserHandler
): Promise<BenefitsValues> {
  const healthBenifits: string[] = [];
  const financialBenefits: string[] = [];
  const otherBenefits: string[] = [];

  try {
    const getCredentialsList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.benefits,
      1500
    );

    const credentialsInnerHtml = await getCredentialsList.innerHTML();

    const credentialsCleanedHtml = credentialsInnerHtml
      .split(`\n`)
      .filter((item) => item.trim() !== "")
      .map((item) => item.replace(/\t/g, ""));

    if (credentialsCleanedHtml) {
      let benefitType = "none";
      for (const listItem of credentialsCleanedHtml) {
        const tagAndText = listItem
          .replace(/<(\w+)>((?:.|\n)*?)<\/\1>/g, "<$1>, $2, </$1>")
          .split(",");

        if (tagAndText[0] === "<h4>") {
          benefitType = tagAndText[1].trim();
        }

        if (tagAndText[0] === "<span>") {
          const benefit = tagAndText[1].trim();

          switch (benefitType) {
            case "Health benefits":
              healthBenifits.push(benefit);
              break;
            case "Financial benefits":
              financialBenefits.push(benefit);
              break;
            case "Other benefits":
              otherBenefits.push(benefit);
              break;
          }
        }
      }
    }
  } catch {}

  return {
    health: healthBenifits.length > 0 ? healthBenifits : null,
    financial: financialBenefits.length > 0 ? financialBenefits : null,
    other: otherBenefits.length > 0 ? otherBenefits : null,
  };
}

// Define an object type for values found in the additional info.
export type AdditionalInfo = {
  conditionsAndCapability: string[] | null;
  personalSuitability: string[] | null;
  other: { title: string; attributes: string[] }[] | null;
};

async function getAdditionalInfo(
  browserHandler: BrowserHandler
): Promise<AdditionalInfo> {
  const conditionsList: string[] = [];
  const suitabilityList: string[] = [];
  const otherList: { title: string; attributes: string[] }[] = [];

  try {
    const getAdditionalInfo = await browserHandler.waitAndGetElement(
      CONFIG.selectors.jobDetails.description.additionalInfo
    );

    const infoInnerHtml = await getAdditionalInfo.innerHTML();

    const infoCleanedHtml = infoInnerHtml
      .split(`\n`)
      .filter((item) => item.trim() !== "")
      .map((item) => item.replace(/\t/g, ""));

    if (infoCleanedHtml) {
      let section = "";
      let otherIndex = -1;
      for (const listItem of infoCleanedHtml) {
        const tagAndText = listItem
          .replace(/<(\w+)>((?:.|\n)*?)<\/\1>/g, "<$1>, $2, </$1>")
          .split(",");

        if (tagAndText[0] === "<h4>") {
          if (tagAndText[1].includes("Work conditions")) {
            section = "conditions";
          } else if (tagAndText[1].includes("Personal suitability")) {
            section = "suitability";
          } else {
            section = tagAndText[1].trim();
            otherList.push({ title: section, attributes: [] });
            otherIndex = otherIndex += 1;
          }
        }

        if (tagAndText[0] === "<span>") {
          const attribute = tagAndText[1].trim();

          switch (section) {
            case "conditions":
              conditionsList.push(attribute);
              break;
            case "suitability":
              suitabilityList.push(attribute);
              break;
            default:
              otherList[otherIndex].attributes.push(attribute);
              break;
          }
        }
      }
    }
  } catch {}

  return {
    conditionsAndCapability: conditionsList.length > 0 ? conditionsList : null,
    personalSuitability: suitabilityList.length > 0 ? suitabilityList : null,
    other: otherList.length > 0 ? otherList : null,
  };
}
