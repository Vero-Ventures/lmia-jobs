"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";
import { XCircle } from "lucide-react";
import { PROVINCES } from "@/app/lib/constants";
import Form from "next/form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createJobPost } from "@/actions/create-job-post";

export default function Page() {
  const { data: session, isPending } = authClient.useSession();

  if (!session && !isPending) {
    redirect("/admin");
  }

  const [submittingPost, setSubmittingPost] = useState(false);

  const [formValues, setFormValues] = useState({
    jobTitle: "",
    hiringOrganization: "",
    employmentType: "",
    addressRegion: "",
    addressLocality: "",
    streetAddress: "",
    compTimeUnit: "",
    minCompValue: "",
    maxCompValue: "",
    workHours: "",
    startTime: new Date().toISOString().split("T")[0],
    vacancies: "",
    description: "",
    language: "",
    postAsylum: false,
    postDisabled: false,
    postIndigenous: false,
    postNewcomers: false,
    postYouth: false,
  });

  const [showNoBoardsSelected, setShowNoBoardsSelected] = useState(false);
  const [postToNoBoards, setPostToNoBoards] = useState(false);

  const [showPostingError, setShowPostingError] = useState(false);
  const [showPostingSuccess, setShowPostingSuccess] = useState(false);

  const handleValueChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | string
      | boolean
      | undefined,
    fieldName: string | null = null
  ) => {
    if (typeof e === "string" || typeof e === "boolean") {
      setFormValues((prevValues) => ({ ...prevValues, [fieldName!]: e }));
    } else if (e) {
      const { name, value } = e.target;
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  const submitForm = async () => {
    setSubmittingPost(true);
    setShowPostingError(false);

    const result = await createJobPost(formValues, postToNoBoards);
    if (result === "no boards") {
      setShowNoBoardsSelected(true);
      setPostToNoBoards(true);
    }
    if (result === "error") {
      setShowPostingError(true);
    }
    if (result === "success") {
      setShowPostingSuccess(true);
      setTimeout(() => {
        redirect("/admin/dashboard");
      }, 750);
    }
    setSubmittingPost(false);
  };

  return (
    <div className="m-6 mx-auto flex w-4/5 max-w-3xl flex-col rounded-lg border-2 border-gray-800 p-2 px-4 mb:w-5/6 mb:pt-4 sm:w-4/5 md:w-3/4 md:px-6">
      <Form className="flex flex-col" action={submitForm}>
        <Button className="w-10 self-end justify-self-end bg-white">
          <XCircle className="min-h-8 min-w-8 bg-white text-black" />
        </Button>

        <div className="md:mx-auto md:w-4/5">
          <label className="p-2 font-semibold mb:text-lg">Job Title</label>
          <Input
            className="border-2 border-gray-500"
            type="text"
            name="jobTitle"
            value={formValues.jobTitle}
            onChange={handleValueChange}
            required
          />
        </div>

        <div className="mt-4 md:mx-auto md:w-4/5">
          <label className="p-2 font-semibold mb:text-lg">
            Organization Name
          </label>
          <Input
            className="border-2 border-gray-500"
            type="text"
            name="hiringOrganization"
            value={formValues.hiringOrganization}
            onChange={handleValueChange}
            required
          />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:justify-evenly lg:px-8">
          <div className="mx-auto mt-2 flex flex-row md:mx-0">
            <label className="p-2 font-semibold mb:mr-1 mb:mt-2.5 mb:block mb:text-lg">
              Province
            </label>
            <Select
              defaultValue={formValues.addressRegion}
              onValueChange={(value) =>
                handleValueChange(value, "addressRegion")
              }
              required>
              <SelectTrigger className="ml-4 min-w-36 border-2 border-gray-500 pl-6 text-base font-semibold mb:ml-2 mb:mt-3 mb:min-w-48 mb:text-lg sm:min-w-32 md:min-w-40 md:pl-10">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map((location) => (
                  <SelectItem
                    key={location.value}
                    value={location.value}
                    className="text-lg font-semibold">
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="h-1 w-0 -translate-y-4 p-0 opacity-0"
              required
              value={formValues.addressRegion}
              onChange={handleValueChange}
            />
          </div>

          <div className="flex flex-col sm:ml-2 sm:mt-2 sm:flex-row">
            <label className="mt-2 p-2 font-semibold mb:mr-1 mb:text-lg sm:mt-3">
              City
            </label>
            <Input
              className="w-full border-2 border-gray-500 sm:mt-3"
              type="text"
              name="addressLocality"
              value={formValues.addressLocality}
              onChange={handleValueChange}
              required
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col md:mx-auto md:w-4/5">
          <label className="p-1 font-semibold mb:text-lg">
            Address <span className="text-sm italic"> (Optional)</span>
          </label>
          <Input
            className="border-2 border-gray-500"
            type="text"
            name="streetAddress"
            value={formValues.streetAddress}
            onChange={handleValueChange}
          />
        </div>

        <div className="mb-4 mt-4 flex flex-col">
          <label className="p-2 text-center font-semibold mb:text-lg">
            Hiring Date <span className="text-sm italic"> (Optional)</span>
          </label>
          <Input
            className="mx-auto w-max border-2 border-gray-500 text-center mb:text-lg mb:font-semibold sm:text-xl md:min-w-64 md:pl-8 md:text-xl"
            type="date"
            name="startTime"
            value={formValues.startTime}
            onChange={handleValueChange}
          />
        </div>

        <div className="mt-4 flex flex-col mb:flex-row mb:justify-evenly">
          <div className="flex flex-col mb:flex-row">
            <label className="p-2 font-semibold mb:mr-2 mb:mt-3 mb:w-28 mb:text-center md:mr-2 md:mt-6 md:w-fit md:px-0 md:text-lg">
              Employment Type
            </label>
            <Select
              defaultValue={formValues.employmentType}
              onValueChange={(value) =>
                handleValueChange(value, "employmentType")
              }
              required>
              <SelectTrigger className="border-2 border-gray-500 text-base mb:mt-7 mb:max-w-32 sm:w-36 sm:text-lg sm:font-semibold md:ml-2 md:max-w-28 lg:min-w-48 lg:pl-16">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full Time" className="text-lg font-semibold">
                  Full Time
                </SelectItem>
                <SelectItem value="Part Time" className="text-lg font-semibold">
                  Part Time
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              className="h-1 w-0 -translate-y-4 p-0 opacity-0"
              required
              value={formValues.employmentType}
              onChange={handleValueChange}
            />
          </div>

          <div className="flex flex-col mb:flex-row">
            <label className="mt-4 p-2 font-semibold mb:mr-2 mb:mt-2.5 mb:w-20 mb:text-center md:mr-2 md:mt-3 md:min-w-36 md:text-lg">
              Weekly Hours <span className="text-sm italic"> (Optional)</span>
            </label>
            <Input
              className="border-2 border-gray-500 mb:mt-7 mb:w-16 md:w-20 lg:w-32"
              type="number"
              name="workHours"
              value={formValues.workHours}
              onChange={handleValueChange}
              placeholder=""
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:justify-evenly">
          <div className="mx-auto flex w-fit flex-col text-center mb:text-lg sm:mt-5 md:mx-0 md:mt-7">
            <label className="p-2 font-semibold sm:text-center">
              Payment Type
            </label>
            <Select
              defaultValue={formValues.compTimeUnit}
              onValueChange={(value) =>
                handleValueChange(value, "compTimeUnit")
              }
              required>
              <SelectTrigger className="mx-auto w-40 border-2 border-gray-500 pl-12 text-base mb:w-48 mb:pl-16 mb:text-lg mb:font-semibold sm:mx-auto sm:w-40 sm:pl-12 md:w-48 md:pl-16">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hourly" className="text-lg font-semibold">
                  Hourly
                </SelectItem>
                <SelectItem value="Salary" className="text-lg font-semibold">
                  Salary
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              className="h-1 -translate-y-4 opacity-0"
              required
              value={formValues.compTimeUnit}
              onChange={handleValueChange}
            />
          </div>

          <div className="flex flex-col mb:flex-row mb:justify-evenly">
            <div className="flex flex-col mb:flex-row sm:mx-2 sm:flex-col md:ml-6 md:mr-4 lg:mr-12">
              <label className="mt-4 p-2 font-semibold mb:min-w-20 mb:max-w-24 mb:text-center sm:mx-auto sm:mt-0 sm:text-center md:text-lg">
                Min Pay Range
              </label>
              <Input
                className="border-2 border-gray-500 mb:mt-7 mb:w-24 sm:mx-auto sm:mt-0 sm:w-full sm:max-w-44"
                type="number"
                name="minCompValue"
                value={formValues.minCompValue}
                onChange={handleValueChange}
                placeholder=""
                required
              />
            </div>

            <div className="flex flex-col mb:flex-row sm:mx-2 sm:flex-col">
              <label className="mt-4 p-2 font-semibold mb:max-w-36 mb:text-center sm:mx-auto sm:mt-0 sm:w-36 md:text-lg">
                Max Pay Range{" "}
                <span className="text-sm italic"> (Optional)</span>
              </label>
              <Input
                className="border-2 border-gray-500 mb:mt-7 mb:w-24 sm:mx-auto sm:mt-0 sm:w-full sm:max-w-44"
                type="number"
                name="maxCompValue"
                value={formValues.maxCompValue}
                onChange={handleValueChange}
                placeholder=""
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex w-full flex-col lg:mx-auto lg:w-11/12">
          <label className="p-2 font-semibold mb:text-lg">Description</label>
          <textarea
            className="h-24 w-full rounded-md border-2 border-gray-500 p-2 sm:h-36 lg:h-52"
            name="description"
            value={formValues.description}
            onChange={handleValueChange}
            required></textarea>
        </div>

        <div className="mt-2 flex flex-col">
          <label className="p-2 text-center font-semibold mb:text-lg">
            Language
          </label>
          <Select
            defaultValue={formValues.language}
            onValueChange={(value) => handleValueChange(value, "language")}
            required>
            <SelectTrigger className="mx-auto w-48 border-2 border-gray-500 pl-16 text-base mb:text-lg mb:font-semibold sm:text-lg sm:font-semibold md:w-64 md:pl-24">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English" className="text-lg font-semibold">
                English
              </SelectItem>
              <SelectItem value="French" className="text-lg font-semibold">
                French
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          className="h-1 -translate-y-4 opacity-0"
          required
          value={formValues.language}
          onChange={handleValueChange}
        />

        <div className="mt-2 flex flex-col text-center sm:mx-auto sm:w-fit sm:pr-12 md:w-full md:flex-row md:justify-evenly md:p-0">
          <div className="mt-4 flex flex-row md:flex-col">
            <label className="mt-2 w-2/3 font-semibold mb:text-lg sm:w-48 md:w-24">
              Asylum Board
            </label>
            <Checkbox
              className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300 sm:ml-8 md:mx-auto"
              name="Asylum"
              onCheckedChange={() =>
                handleValueChange(!formValues.postAsylum, "postAsylum")
              }
            />
          </div>

          <div className="mt-4 flex flex-row md:flex-col">
            <label className="mt-2 w-2/3 font-semibold mb:text-lg sm:w-48 md:w-24">
              Disablility Board
            </label>
            <Checkbox
              className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300 sm:ml-8 md:mx-auto"
              name="Disabled"
              onCheckedChange={() =>
                handleValueChange(!formValues.postDisabled, "postDisabled")
              }
            />
          </div>

          <div className="mt-4 flex flex-row md:flex-col">
            <label className="mt-2 w-2/3 font-semibold mb:text-lg sm:w-48 md:w-24">
              Indigenous Board
            </label>
            <Checkbox
              className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300 sm:ml-8 md:mx-auto"
              name="Indigenous"
              onCheckedChange={() =>
                handleValueChange(!formValues.postIndigenous, "postIndigenous")
              }
            />
          </div>

          <div className="mt-4 flex flex-row md:flex-col">
            <label className="mt-2 w-2/3 font-semibold mb:text-lg sm:w-48 md:w-24">
              Newcomers Board
            </label>
            <Checkbox
              className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300 sm:ml-8 md:mx-auto"
              name="Newcomers"
              onCheckedChange={() =>
                handleValueChange(!formValues.postNewcomers, "postNewcomers")
              }
            />
          </div>

          <div className="mt-4 flex flex-row md:flex-col">
            <label className="mt-2 w-2/3 font-semibold mb:text-lg sm:w-48 md:w-24">
              Youth Board
            </label>
            <Checkbox
              className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300 sm:ml-8 md:mx-auto"
              name="Youth"
              onCheckedChange={() =>
                handleValueChange(!formValues.postYouth, "postYouth")
              }
            />
          </div>
        </div>

        <div className={showNoBoardsSelected ? "mx-auto mt-6 w-fit" : "hidden"}>
          <p className="text-center text-lg font-semibold text-red-500">
            No Job Boards Are Selected <br />
            Are You Sure?
          </p>
        </div>

        <div className={showPostingError ? "mx-auto mt-6 w-fit" : "hidden"}>
          <p className="text-center text-xl font-semibold text-red-500">
            <span className="text-2xl"> Error</span> <br />
            Please Try Again
          </p>
        </div>

        <div className={showPostingSuccess ? "mx-auto mt-6 w-fit" : "hidden"}>
          <p className="text-center text-xl font-semibold text-blue-600">
            Post Created <br /> Successfully
          </p>
        </div>

        <div className="mt-4 flex flex-row justify-evenly py-2 mb:mt-6 md:mt-8">
          <Button
            type="button"
            className="w-2/5 mb:py-6 mb:text-lg sm:w-1/3 md:text-xl"
            disabled={submittingPost}>
            <Link href="/admin/dashboard">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="w-2/5 mb:py-6 mb:text-lg sm:w-1/3 md:text-xl"
            disabled={submittingPost}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
