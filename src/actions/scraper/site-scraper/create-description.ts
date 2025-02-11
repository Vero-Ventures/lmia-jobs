import type {
  OverviewValues,
  EnviromentAndSetting,
  Credentials,
  BenefitsValues,
  TasksAndSupervision,
  SkillsAndAttributes,
  AdditionalInfo,
} from "@/actions/scraper/site-scraper/get-description";

// Takes the various description values and creates a formatted string.
// Takes: The formatted objects for the description values.
export function createFormattedDescription(
  overviewValues: OverviewValues,
  enviromentAndSetting: EnviromentAndSetting,
  credentials: Credentials,
  skillsAndAttributes: SkillsAndAttributes,
  tasksAndSupervision: TasksAndSupervision,
  benefitsValues: BenefitsValues,
  additionalInfo: AdditionalInfo
): string {
  try {
    // Add the Eductation, Experience, and Job Site values.
    let description = `Education: ${overviewValues.education} \nExperience: ${overviewValues.experience} \n\nJob Site: ${overviewValues.onSite}
      `;

    // If present, add the Enviroment and Setting.
    if (enviromentAndSetting.enviroment) {
      description += `\nWork Enviroment: ` + enviromentAndSetting.enviroment;
    }

    if (enviromentAndSetting.setting) {
      description += `\nWork Setting: ` + enviromentAndSetting.setting;
    }

    // If Credentials are present, iterate over them and add them.
    if (credentials.credentials) {
      description += `\n\nRequired Credentials: `;

      for (const credential of credentials.credentials) {
        description += `\n -${credential}`;
      }
    }

    // If Skills & Attributes are found, iterate over the content.
    if (skillsAndAttributes.skills) {
      description += `\n\nSpecialized Skills: `;

      // Iterate over the Skills headers and add them to the description.
      for (const skill of skillsAndAttributes.skills) {
        description += `\n -${skill.skill}`;
        // Iterates over the attributes of the Skill and adds them to the description.
        for (const attribute of skill.attributes) {
          description += `\n  --${attribute}`;
        }
      }
    }

    // If the Conditions and Capabilities are found, iterate over them and add them.
    if (additionalInfo.conditionsAndCapability) {
      description += `\n\nConditions and Psyical Capabilities: `;

      for (const value of additionalInfo.conditionsAndCapability) {
        description += `\n -${value}`;
      }
    }

    // If Tasks & Supervision are found, iterate over the content
    if (tasksAndSupervision.tasks) {
      // Iterate over the Tasks and add them to the description.
      description += `\n\nTasks: `;
      for (const value of tasksAndSupervision.tasks) {
        description += `\n -${value}`;
      }

      // If a Supervision value is found, add it.
      if (tasksAndSupervision.supervision) {
        description += `\nSupervision: ${tasksAndSupervision.supervision}`;
      }
    }

    // If Personal Suitability is found, iterate over them and add them.
    if (additionalInfo.personalSuitability) {
      description += `\n\nPersonal Suitability: `;

      for (const value of additionalInfo.personalSuitability) {
        description += `\n -${value}`;
      }
    }

    // If any Benifits value is found:
    if (
      benefitsValues.health ||
      benefitsValues.financial ||
      benefitsValues.other
    ) {
      description += `\n\nBenefits: `;

      // Checks for Health Benefits, iterates over the values and adds them.
      if (benefitsValues.health) {
        description += `\n -Health: `;
        for (const attribute of benefitsValues.health) {
          description += `\n  --${attribute}`;
        }
      }

      // Checks for Financial Benefits.
      if (benefitsValues.financial) {
        description += `\n -Financial: `;
        for (const attribute of benefitsValues.financial) {
          description += `\n  --${attribute}`;
        }
      }

      // Checks for Other Benefits.
      if (benefitsValues.other) {
        description += `\n -Other: `;
        for (const attribute of benefitsValues.other) {
          description += `\n  --${attribute}`;
        }
      }
    }

    // Check for any "Other" Additional Info
    if (additionalInfo.other) {
      description += `\n\nAdditional Info: `;

      // Iterate over the Additional info titles and add them.
      for (const value of additionalInfo.other) {
        description += `\n -${value.title}`;
        // Iterate over the attributes of the "Other" Additional Info Header and add them.
        for (const attribute of value.attributes) {
          description += `\n  --${attribute}`;
        }
      }
    }

    // Return the formatted description string.
    return description;
  } catch (error) {
    throw "Error creating Description: " + error;
  }
}
