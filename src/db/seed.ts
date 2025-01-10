import { db } from "@/db";
import { jobPostings } from "@/db/schema";

const data = [
  {
    jobTitle: "Software Engineer",
    hiringOrganization: "Northern Tech Solutions",
    datePosted: "2025-01-05",
    employmentType: "Full-time",
    addressRegion: "ON",
    addressLocality: "Toronto",
    streetAddress: "100 Bay Street",
    compTimeUnit: "Salary",
    minCompValue: "$80000",
    maxCompValue: "$100000",
    workHours: "40 hours/week",
    startTime: "2025-01-20",
    vacancies: 5,
    description: "Design and develop software applications for our clients.",
    email: "jobs@northerntech.ca",
    language: "English",
    createdAt: "2025-01-05T10:00:00Z",
    updatedAt: "2025-01-05T10:00:00Z",
    validThrough: "2025-02-10",
    postAsylum: true,
    postDisabled: true,
    postIndigenous: true,
    postNewcomers: true,
    postYouth: true,
  },
  {
    jobTitle: "Project Manager",
    hiringOrganization: "Maple Project Management",
    datePosted: "2025-01-06",
    employmentType: "Contract",
    addressRegion: "BC",
    addressLocality: "Vancouver",
    streetAddress: "200 Granville Street",
    compTimeUnit: "Salary",
    minCompValue: "$90000",
    maxCompValue: null,
    workHours: null,
    startTime: null,
    vacancies: 2,
    description: "Oversee project timelines and deliverables for our clients.",
    email: "careers@maplepm.ca",
    language: "English",
    createdAt: "2025-01-06T09:00:00Z",
    updatedAt: "2025-01-06T09:00:00Z",
    validThrough: "2025-03-01",
    postAsylum: true,
    postDisabled: true,
    postIndigenous: true,
    postNewcomers: true,
    postYouth: true,
  },
  {
    jobTitle: "Graphic Designer",
    hiringOrganization: "Creative Studios Inc.",
    datePosted: "2025-01-07",
    employmentType: "Part-time",
    addressRegion: "QC",
    addressLocality: "Montreal",
    streetAddress: "300 Saint Laurent Blvd",
    compTimeUnit: "Hourly",
    minCompValue: "$25",
    maxCompValue: "$35",
    workHours: "20 hours/week",
    startTime: "2025-01-25",
    vacancies: null,
    description: "Create visual designs and graphics for marketing campaigns.",
    email: "design@creativestudios.ca",
    language: "French",
    createdAt: "2025-01-07T11:00:00Z",
    updatedAt: "2025-01-07T11:00:00Z",
    validThrough: "2025-02-15",
    postAsylum: true,
    postDisabled: true,
    postIndigenous: true,
    postNewcomers: true,
    postYouth: true,
  },
  {
    jobTitle: "Customer Support Representative",
    hiringOrganization: "West Coast Call Center",
    datePosted: "2025-01-08",
    employmentType: "Full-time",
    addressRegion: "AB",
    addressLocality: "Calgary",
    streetAddress: "400 Centre Street",
    compTimeUnit: "Hourly",
    minCompValue: "$18",
    maxCompValue: null,
    workHours: "40 hours/week",
    startTime: "2025-02-01",
    vacancies: 10,
    description: "Provide customer support via phone and email.",
    email: "support@westcoastcall.ca",
    language: "English",
    createdAt: "2025-01-08T08:00:00Z",
    updatedAt: "2025-01-08T08:00:00Z",
    validThrough: "2025-02-28",
    postAsylum: true,
    postDisabled: true,
    postIndigenous: true,
    postNewcomers: true,
    postYouth: true,
  },
  {
    jobTitle: "Digital Marketing Specialist",
    hiringOrganization: "Prairie Marketing Co.",
    datePosted: "2025-01-09",
    employmentType: "Full-time",
    addressRegion: "MB",
    addressLocality: "Winnipeg",
    streetAddress: "500 Portage Avenue",
    compTimeUnit: "Salary",
    minCompValue: "$50000",
    maxCompValue: "$70000",
    workHours: null,
    startTime: null,
    vacancies: 3,
    description: "Develop and execute digital marketing campaigns.",
    email: "jobs@prairiemarketing.ca",
    language: "English",
    createdAt: "2025-01-09T10:00:00Z",
    updatedAt: "2025-01-09T10:00:00Z",
    validThrough: "2025-03-01",
    postAsylum: true,
    postDisabled: true,
    postIndigenous: true,
    postNewcomers: true,
    postYouth: true,
  },
];

(async function () {
  await Promise.all(
    data.map((jp) =>
      db.insert(jobPostings).values({
        jobTitle: jp.jobTitle,
        hiringOrganization: jp.hiringOrganization,
        datePosted: jp.datePosted,
        employmentType: jp.employmentType,
        addressRegion: jp.addressRegion,
        addressLocality: jp.addressLocality,
        streetAddress: jp.streetAddress,
        compTimeUnit: jp.compTimeUnit,
        minCompValue: jp.minCompValue,
        maxCompValue: jp.maxCompValue,
        workHours: jp.workHours,
        startTime: jp.startTime,
        vacancies: jp.vacancies,
        description: jp.description,
        email: jp.email,
        language: jp.language,
        validThrough: jp.validThrough,
        postAsylum: jp.postAsylum,
        postDisabled: jp.postDisabled,
        postIndigenous: jp.postIndigenous,
        postNewcomers: jp.postNewcomers,
        postYouth: jp.postYouth,
      })
    )
  );
  return "success";
})().catch((err) => console.log(err.message));
