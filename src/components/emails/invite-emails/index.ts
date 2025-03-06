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
  topPostNames: string[],
  totalPosts: number,
  expiryDate: string,
  optOutLink: string
) {
  const _postNamesString = formatPostNames(topPostNames, totalPosts);
  return [
    "Strengthen Your LMIA Application with Targeted Job Listings",
    `
    <body>
    
    <p>We noticed your job listing on the official Job Bank Canada website and wanted to share how you can take it a step further to strengthen your LMIA application.</p>
    
    <p>In today’s climate, where immigration programs are under political scrutiny, even small details and proactive efforts can make or break a case. Listing your job on specialized job boards - like <a href="https://youthopportunities.ca">YouthOpportunities.ca</a>, <a href="https://indigenousopportunities.ca">IndigenousOpportunities.ca</a>, and others - demonstrates to the Canadian government that you’ve made a genuine effort to hire local Canadian talent before seeking foreign workers.</p>
    
    <p><strong>Here’s why our platforms are the perfect choice:</strong></p>
    <ul>
        <li><strong>Enhanced Credibility:</strong> Targeted listings show proactive hiring efforts for vulnerable Canadian populations.</li>
        <li><strong>Ease of Use:</strong> Your listing has already been scraped from Job Bank Canada—all you need to do is claim it and use it for your LMIA application.</li>
        <li><strong>Affordable & Comprehensive:</strong> Manage listings across multiple sites with a single login at a fraction of the cost of general job banks.</li>
    </ul>
    
    <p>Strengthen your LMIA application by claiming your listings before <strong>${expiryDate}</strong> to showcase your commitment to hiring locally!</p>
    
    <p><a href="allopportunities.ca/sign-in" style="display: inline-block; 	font-size: 1 rem; font-weight: 600; padding: 10px 10px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Claim Your Listing Now</a></p>
    
    <p>Warm regards,<br>
    Vero Ventures (proudly Canadian 🇨🇦)</p>

    <p><a href="${optOutLink}">Opt Out of Future Reminders</a></p>
    </body>
    `,
  ];
}

export function inviteEmail_2(
  topPostNames: string[],
  totalPosts: number,
  expiryDate: string,
  optOutLink: string
) {
  const _postNamesString = formatPostNames(topPostNames, totalPosts);

  return [
    "Make Your Job Listing Work Harder for You",
    `
    <p>Hello,</p>
    
    <p>We noticed a job posting from your company on the official Job Bank Canada website and wanted to introduce you to a way to make it even more impactful. By claiming your listing on our specialized job boards — like <a href="https://youthopportunities.ca">YouthOpportunities.ca</a>, <a href="https://newcomeropportunities.ca">NewcomerOpportunities.ca</a>, and others — you can reach targeted groups of Canadians while strengthening your LMIA application (if applicable).</p>
    
    <p><strong>Here’s how we can help:</strong></p>
    <ul>
        <li><strong>Automatic Integration:</strong> Your listing has already been scraped from Job Bank Canada—claim it in minutes!</li>
        <li><strong>Boost LMIA Success:</strong> If your posting is tied to an LMIA application, showcasing efforts to hire locally through targeted sites can significantly strengthen its credibility.</li>
        <li><strong>Affordable & User-Friendly:</strong> Manage listings on multiple platforms with one login, all at an affordable price.</li>
        <li><strong>Avoid Removal:</strong> Job Bank Canada listings typically stay live for only a few weeks and are removed automatically if unclaimed. By claiming before <strong>${expiryDate}</strong> and extending your listing on these platforms, you ensure continued visibility and compliance.</li>
    </ul>
    
    <p>Whether or not your listing is connected to an LMIA application, using our specialized platforms ensures compliance, credibility, and better visibility among local Canadian talent.</p>
    
    <p><a href="allopportunities.ca/sign-in" style="display: inline-block; 	font-size: 1 rem; font-weight: 600; padding: 10px 10px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Claim Your Listing Now</a></p>

    <p>Best regards,<br>
    Vero Ventures (proudly Canadian 🇨🇦)</p>

    <p><a href="${optOutLink}">Opt Out of Future Reminders</a></p>
    </body>
    `,
  ];
}

export function inviteEmail_3(
  topPostNames: string[],
  totalPosts: number,
  expiryDate: string,
  optOutLink: string
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);

  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 3 Text Content
    `,
  ];
}

export function inviteEmail_4(
  topPostNames: string[],
  totalPosts: number,
  expiryDate: string,
  optOutLink: string
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);

  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 4 Text Content
    `,
  ];
}

export function inviteEmail_5(
  topPostNames: string[],
  totalPosts: number,
  expiryDate: string,
  optOutLink: string
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);

  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 5 Text Content
    `,
  ];
}

export function inviteEmail_6(
  topPostNames: string[],
  totalPosts: number,
  expiryDate: string,
  optOutLink: string
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);

  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 6 Text Content
    `,
  ];
}

export function inviteEmail_7(
  topPostNames: string[],
  totalPosts: number,
  expiryDate: string,
  optOutLink: string
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);

  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 7 Text Content
    `,
  ];
}

export function inviteEmail_8(
  topPostNames: string[],
  totalPosts: number,
  expiryDate: string,
  optOutLink: string
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);

  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 8 Text Content
    `,
  ];
}

export function inviteEmail_9(
  topPostNames: string[],
  totalPosts: number,
  expiryDate: string,
  optOutLink: string
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);

  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 9 Text Content
    `,
  ];
}

export function inviteEmail_10(
  topPostNames: string[],
  totalPosts: number,
  expiryDate: string,
  optOutLink: string
) {
  const postNamesString = formatPostNames(topPostNames, totalPosts);

  return [
    "Invite Subject",
    `
     ${expiryDate} , ${postNamesString}, ${totalPosts}, ${optOutLink},
    Test 10 Text Content
    `,
  ];
}
