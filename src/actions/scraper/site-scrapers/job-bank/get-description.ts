import type { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import { CONFIG } from "@/actions/scraper/helpers/config";

export async function getDescription(
  browserHandler: BrowserHandler
): Promise<string> {
  const post = "43246447";

  await browserHandler.visitPage(
    CONFIG.urls.searchResult + String(post) + "?source=searchresults"
  );

  console.log(JSON.stringify(await getBaseOverviewValues(browserHandler)));

  console.log(JSON.stringify(await getEnviromentAndSetting(browserHandler)));

  console.log(JSON.stringify(await getCredentials(browserHandler)));

  console.log(JSON.stringify(await getBenefits(browserHandler)));

  console.log(JSON.stringify(await getTasksAndSupervision(browserHandler)));

  console.log(JSON.stringify(await getSkills(browserHandler)));

  console.log(JSON.stringify(await getAdditionalInformation(browserHandler)));

  const description = "null";
  return description;
}

async function getBaseOverviewValues(browserHandler: BrowserHandler): Promise<{
  education: string;
  experience: string;
  onSite: string;
}> {
  let education = "null";
  let experience = "null";
  let onSite = "null";

  const getEducation = await browserHandler.waitAndGetElement(
    CONFIG.selectors.govJobBank.jobDetails.description.education
  );
  const educationValue = (await getEducation.allInnerTexts()).pop();
  if (educationValue) {
    education = educationValue;
  }

  const getExperience = await browserHandler.waitAndGetElement(
    CONFIG.selectors.govJobBank.jobDetails.description.experience
  );
  const experienceValue = (await getExperience.allInnerTexts()).pop();
  if (experienceValue) {
    experience = experienceValue;
  }

  const getOnSite = await browserHandler.waitAndGetElement(
    CONFIG.selectors.govJobBank.jobDetails.description.onSite
  );
  const filteredToOnSite = getOnSite.filter({
    has: browserHandler.page.locator(
      CONFIG.selectors.govJobBank.jobDetails.description.onSiteFilter
    ),
  });
  const onSiteValue = (await filteredToOnSite.allInnerTexts()).pop();
  if (onSiteValue) {
    onSite = onSiteValue;
  }

  return {
    education,
    experience,
    onSite,
  };
}

async function getEnviromentAndSetting(
  browserHandler: BrowserHandler
): Promise<{ enviroment: string[] | null; setting: string[] | null }> {
  const enviromentListValues: string[] = [];
  const settingListValues: string[] = [];

  try {
    const getEnviromentLists = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.description.enviroment
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
      CONFIG.selectors.govJobBank.jobDetails.description.setting
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

async function getCredentials(browserHandler: BrowserHandler): Promise<{
  credentials: string[] | null;
}> {
  const credentialsListValues: string[] = [];

  try {
    const getCredentialsList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.description.credentials
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

async function getBenefits(browserHandler: BrowserHandler): Promise<{
  health: string[] | null;
  financial: string[] | null;
  other: string[] | null;
}> {
  const healthBenifits: string[] = [];
  const financialBenefits: string[] = [];
  const otherBenefits: string[] = [];

  try {
    const getCredentialsList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.description.benefits
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
    health: healthBenifits,
    financial: financialBenefits,
    other: otherBenefits,
  };
}

async function getTasksAndSupervision(browserHandler: BrowserHandler): Promise<{
  tasks: string[];
  supervision: string | null;
}> {
  const tasksList: string[] = [];
  let supervision = "null";

  try {
    const getTasksList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.description.tasksAndSupervision
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
  } catch {}

  return {
    tasks: tasksList,
    supervision: supervision !== "null" ? supervision : null,
  };
}

async function getSkills(browserHandler: BrowserHandler): Promise<{
  skills: { skill: string; attributes: string[] }[] | null;
}> {
  const skillsListValues: { skill: string; attributes: string[] }[] = [];

  try {
    const getSkillsList = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.description.specializedSkills
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

async function getAdditionalInformation(
  browserHandler: BrowserHandler
): Promise<{
  conditionsAndCapability: string[] | null;
  personalSuitability: string[] | null;
  other: { title: string; attributes: string[] }[] | null;
}> {
  const conditionsList: string[] = [];
  const suitabilityList: string[] = [];
  const otherList: { title: string; attributes: string[] }[] = [];

  try {
    const getAdditionalInformation = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobDetails.description.additionalInformation
    );

    const infoInnerHtml = await getAdditionalInformation.innerHTML();

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
