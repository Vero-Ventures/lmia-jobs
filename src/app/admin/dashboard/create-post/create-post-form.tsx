"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  jobTypeLabels,
  languages,
  paymentType,
  PROVINCES,
  provinceValues,
} from "@/app/lib/constants";

const createPostSchema = z.object({
  jobTitle: z.string().trim().min(1, {
    message: "Job title must be at least 1 character.",
  }),
  organizationName: z.string().trim().min(1, {
    message: "Organization Name must be at least 1 character.",
  }),
  province: z.enum(provinceValues, {
    message: "Please select a province.",
  }),
  city: z.string().trim().min(1, {
    message: "City must be at least 1 character.",
  }),
  address: z.string().trim().optional(),
  startTime: z.string().trim().optional(),
  vacancies: z.string().trim().optional(),
  employmentType: z.enum(jobTypeLabels, {
    message: "Please select an employment type.",
  }),
  workHours: z.string().trim().optional(),
  paymentType: z.enum(paymentType, {
    message: "Please select a payment type.",
  }),
  minPayValue: z.string().trim().min(1, {
    message: "Minimum pay value must be at least 1 character.",
  }),
  maxPayValue: z.string().trim().optional(),
  description: z.string().trim().min(1, {
    message: "Description must be at least 1 character.",
  }),
  language: z.enum(languages, {
    message: "Please select a language.",
  }),
  postAsylum: z.boolean(),
  postDisabled: z.boolean(),
  postIndigenous: z.boolean(),
  postNewcomers: z.boolean(),
  postYouth: z.boolean(),
  monthsToPost: z.string().trim(),
});
type CreatePost = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
  const form = useForm<CreatePost>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      jobTitle: "",
      organizationName: "",
      province: "AB",
      city: "",
      address: "",
      startTime: new Date().toISOString().split("T")[0],
      vacancies: "",
      employmentType: "Full Time",
      workHours: "",
      paymentType: "Hourly",
      minPayValue: "",
      maxPayValue: "",
      description: "",
      language: "English",
      postAsylum: false,
      postDisabled: false,
      postIndigenous: false,
      postNewcomers: false,
      postYouth: false,
      monthsToPost: "1",
    },
  });

  function onSubmit(values: CreatePost) {
    console.log(values);
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Create job posting</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h2 className="mt-6 text-xl font-semibold">Basic Job Details</h2>
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a organization name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROVINCES.map((province) => (
                          <SelectItem
                            key={province.value}
                            value={province.value}>
                            {province.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hiring Date</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a hiring date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vacancies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Positions</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a hiring date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Select an employment type"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter weekly hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2"></div>
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2"></div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
