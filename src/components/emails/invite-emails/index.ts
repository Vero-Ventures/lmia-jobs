function formatPostNames(postNames: string[], totalPosts: number) {
  let postNamesString;
  if (totalPosts === 1) {
    postNamesString = postNames[0];
  } else if (totalPosts < 3) {
    postNamesString = postNames.join(" and ");
  } else {
    postNamesString =
      postNames[0] + ", " + postNames[1] + ", and " + postNames[2];
  }
  return postNamesString;
}

export function inviteEmail_1(
  mailerId: number,
  expiryDate: string,
  topPostNames: string[],
  totalPosts: number
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);
  const optOutLink = "https://allopportunities.ca/dashboard/opt-out" + mailerId;
  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 1 Text Content
    `,
  ];
}

export function inviteEmail_2(
  mailerId: number,
  expiryDate: string,
  topPostNames: string[],
  totalPosts: number
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);
  const optOutLink = "https://allopportunities.ca/dashboard/opt-out" + mailerId;
  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 2 Text Content
    `,
  ];
}

export function inviteEmail_3(
  mailerId: number,
  expiryDate: string,
  topPostNames: string[],
  totalPosts: number
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);
  const optOutLink = "https://allopportunities.ca/dashboard/opt-out" + mailerId;
  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 3 Text Content
    `,
  ];
}

export function inviteEmail_4(
  mailerId: number,
  expiryDate: string,
  topPostNames: string[],
  totalPosts: number
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);
  const optOutLink = "https://allopportunities.ca/dashboard/opt-out" + mailerId;
  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 4 Text Content
    `,
  ];
}

export function inviteEmail_5(
  mailerId: number,
  expiryDate: string,
  topPostNames: string[],
  totalPosts: number
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);
  const optOutLink = "https://allopportunities.ca/dashboard/opt-out" + mailerId;
  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 5 Text Content
    `,
  ];
}

export function inviteEmail_6(
  mailerId: number,
  expiryDate: string,
  topPostNames: string[],
  totalPosts: number
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);
  const optOutLink = "https://allopportunities.ca/dashboard/opt-out" + mailerId;
  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 6 Text Content
    `,
  ];
}

export function inviteEmail_7(
  mailerId: number,
  expiryDate: string,
  topPostNames: string[],
  totalPosts: number
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);
  const optOutLink = "https://allopportunities.ca/dashboard/opt-out" + mailerId;
  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 7 Text Content
    `,
  ];
}

export function inviteEmail_8(
  mailerId: number,
  expiryDate: string,
  topPostNames: string[],
  totalPosts: number
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);
  const optOutLink = "https://allopportunities.ca/dashboard/opt-out" + mailerId;
  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 8 Text Content
    `,
  ];
}

export function inviteEmail_9(
  mailerId: number,
  expiryDate: string,
  topPostNames: string[],
  totalPosts: number
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);
  const optOutLink = "https://allopportunities.ca/dashboard/opt-out" + mailerId;
  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 9 Text Content
    `,
  ];
}

export function inviteEmail_10(
  mailerId: number,
  expiryDate: string,
  topPostNames: string[],
  totalPosts: number
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);
  const optOutLink = "https://allopportunities.ca/dashboard/opt-out" + mailerId;
  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 10 Text Content
    `,
  ];
}
