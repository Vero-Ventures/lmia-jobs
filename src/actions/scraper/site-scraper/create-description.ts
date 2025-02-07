import type {
  OverviewValues,
  EnviromentAndSetting,
  Credentials,
  BenefitsValues,
  TasksAndSupervision,
  SkillsAndAttributes,
  AdditionalInfo,
} from "./get-description";

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
    let description = `Education: ${overviewValues.education} \nExperience: ${overviewValues.experience} \n\nJob Site: ${overviewValues.onSite}
      `;

    if (enviromentAndSetting.enviroment) {
      description += `\nWork Enviroment: ` + enviromentAndSetting.enviroment;
    }

    if (enviromentAndSetting.setting) {
      description += `\nWork Setting: ` + enviromentAndSetting.setting;
    }

    if (credentials.credentials) {
      description += `\n\nRequired Credentials: `;

      for (const credential of credentials.credentials) {
        description += `\n -${credential}`;
      }
    }

    if (skillsAndAttributes.skills) {
      description += `\n\nSpecialized Skills: `;

      for (const skill of skillsAndAttributes.skills) {
        description += `\n -${skill.skill}`;
        for (const attribute of skill.attributes) {
          description += `\n  --${attribute}`;
        }
      }
    }

    if (additionalInfo.conditionsAndCapability) {
      description += `\n\nConditions and Psyical Capabilities: `;

      for (const value of additionalInfo.conditionsAndCapability) {
        description += `\n -${value}`;
      }
    }

    if (tasksAndSupervision.tasks) {
      description += `\n\nTasks: `;
      for (const value of tasksAndSupervision.tasks) {
        description += `\n -${value}`;
      }
      if (tasksAndSupervision.supervision) {
        description += `\nSupervision: ${tasksAndSupervision.supervision}`;
      }
    }

    if (additionalInfo.personalSuitability) {
      description += `\n\nPersonal Suitability: `;

      for (const value of additionalInfo.personalSuitability) {
        description += `\n -${value}`;
      }
    }

    if (
      benefitsValues.health ||
      benefitsValues.financial ||
      benefitsValues.other
    ) {
      description += `\n\nBenefits: `;
      if (benefitsValues.health) {
        description += `\n -Health: `;
        for (const attribute of benefitsValues.health) {
          description += `\n  --${attribute}`;
        }
      }

      if (benefitsValues.financial) {
        description += `\n -Financial: `;
        for (const attribute of benefitsValues.financial) {
          description += `\n  --${attribute}`;
        }
      }

      if (benefitsValues.other) {
        description += `\n -Other: `;
        for (const attribute of benefitsValues.other) {
          description += `\n  --${attribute}`;
        }
      }
    }

    if (additionalInfo.other) {
      description += `\n\nAdditional Info: `;

      for (const value of additionalInfo.other) {
        description += `\n -${value.title}`;
        for (const attribute of value.attributes) {
          description += `\n  --${attribute}`;
        }
      }
    }

    return description;
  } catch (error) {
    throw "Error creating Description: " + error;
  }
}
