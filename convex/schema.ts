import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  mailingList: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),
  jobPostings: defineTable({
    addressLocality: v.string(),
    addressRegion: v.string(),
    streetAddress: v.optional(v.string()),
    compTimeUnit: v.optional(v.string()),
    datePosted: v.string(),
    description: v.string(),
    email: v.string(),
    employmentSubType: v.string(),
    employmentType: v.optional(v.string()),
    workHours: v.optional(v.string()),
    startTime: v.optional(v.number()),
    vacancies: v.optional(v.number()),
    hiringOrganization: v.string(),
    jobPageId: v.string(),
    jobTitle: v.string(),
    language: v.string(),
    minCompValue: v.string(),
    maxCompValue: v.optional(v.string()),
    paid: v.boolean(),
    validThrough: v.string(),
  })
    .index("by_location", ["addressRegion"])
    .index("by_job_type", ["employmentSubType"])
    .index("by_location_job_type", ["addressRegion", "employmentSubType"]),
});
