"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  EMPLOYMENT_TYPES,
  languages,
  paymentTypes,
  PROVINCES,
} from "@/app/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { updateJobPost } from "../../create/actions";
import FormSubmitButton from "@/components/form-submit-button";
import { useParams, useRouter } from "next/navigation";
import type { EditJobPosting } from "@/app/lib/job-postings/schema";
import { editJobPostingSchema } from "@/app/lib/job-postings/schema";
import { formatDate } from "@/lib/utils";

export function EditPostForm({
  initialValues,
}: {
  initialValues: EditJobPosting;
}) {
  const params = useParams<{ id: string }>();
  const postId = Number.parseInt(params.id);

  const form = useForm<EditJobPosting>({
    resolver: zodResolver(editJobPostingSchema),
    defaultValues: { ...initialValues },
  });
  const router = useRouter();

  async function onSubmit(values: EditJobPosting) {
    toast.promise(updateJobPost(values, postId), {
      loading: "Updating job posting...",
      success: () => {
        form.reset();
        router.push(`/dashboard/posts/${postId}`);
        return "Job posting updated successfully";
      },
      error: (error) => {
        if (error instanceof Error) return error.message;
      },
    });
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Edit Job Posting</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <div className="space-y-6">
              <h2 className="mt-6 text-xl font-semibold">Job Details</h2>
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
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
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EMPLOYMENT_TYPES.map((jobType) => (
                            <SelectItem
                              key={jobType.value}
                              value={jobType.value}>
                              {jobType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min="1900-01-01"
                          defaultValue={formatDate(field.value)}
                          onChange={(e) => {
                            field.onChange(new Date(e.target.value));
                          }}
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
                      <FormLabel>
                        Work Hours{" "}
                        <span className="text-xs font-normal italic">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Enter weekly hours"
                          {...field}
                        />
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
                      <FormLabel>
                        Vacancies{" "}
                        <span className="text-xs font-normal italic">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Enter a hiring date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a job description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="mt-6 text-xl font-semibold">
                Organization Details
              </h2>
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="orgName"
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter a contact email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
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
            </div>

            <div className="space-y-6">
              <h2 className="mt-6 text-xl font-semibold">
                Compensation Details
              </h2>
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentTypes.map((paymentType) => (
                            <SelectItem key={paymentType} value={paymentType}>
                              {paymentType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minPayValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Pay</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Enter a minimum pay"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPayValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Maximum Pay{" "}
                        <span className="text-xs font-normal italic">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={form.watch("minPayValue") || 0}
                          placeholder="Enter a maximum pay"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="order-2 w-full sm:order-1"
                variant="outline">
                <Link href={`/dashboard/posts/${postId}`}>Cancel</Link>
              </Button>
              <FormSubmitButton
                className="order-1 w-full sm:order-2"
                isPending={form.formState.isSubmitting}
                loadingValue="Updating job posting..."
                value="Edit"
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
