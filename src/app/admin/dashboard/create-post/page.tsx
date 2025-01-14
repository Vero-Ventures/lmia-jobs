"use client";

import { useState } from "react";
import { XCircle } from "lucide-react";
import { PROVINCES } from "@/app/lib/constants";
import Form from "next/form";
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

export default function Page() {
  const [formValues, setFormValues] = useState({
    jobTitle: "",
    organizationName: "",
    employmentType: "",
    province: "",
    city: "",
    address: "",
    paymentType: "",
    minCompValue: undefined,
    maxCompValue: undefined,
    workHours: "",
    startTime: new Date().toISOString().split("T")[0],
    vacancies: null,
    description: "",
    language: "",
    postAsylum: false,
    postDisabled: false,
    postIndigenous: false,
    postNewcomers: false,
    postYouth: false,
  });

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
    if (typeof e === "string") {
      setFormValues((prevValues) => ({ ...prevValues, [fieldName!]: e }));
    } else if (typeof e === "boolean") {
    } else if (e) {
      const { name, value } = e.target;
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  const submitForm = () => {
    console.log("Form Submitted");
  };

  return (
    <div className="m-6 mx-auto flex w-4/5 flex-col rounded-lg border-2 border-gray-800 p-2 px-4">
      <Form className="flex flex-col" action={submitForm}>
        <Button className="w-10 self-end justify-self-end bg-white">
          <XCircle className="min-h-8 min-w-8 bg-white text-black" />
        </Button>

        <div>
          <label className="p-2 font-semibold md:text-lg">Job Title</label>
          <Input
            className="border-2 border-gray-500"
            type="text"
            name="jobTitle"
            value={formValues.jobTitle}
            onChange={handleValueChange}
          />
        </div>

        <div className="mt-4">
          <label className="p-2 font-semibold md:text-lg">
            Organization Name
          </label>
          <Input
            className="border-2 border-gray-500"
            type="text"
            name="organizationName"
            value={formValues.organizationName}
            onChange={handleValueChange}
          />
        </div>

        <div className="mt-4 flex flex-col">
          <label className="p-2 font-semibold md:text-lg">
            Province / Territory
          </label>
          <Select
            defaultValue={formValues.province}
            onValueChange={(value) => handleValueChange(value, "province")}>
            <SelectTrigger className="border-2 border-gray-500 text-base">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {PROVINCES.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="mt-2 p-2 font-semibold md:text-lg">City</label>
          <Input
            className="border-2 border-gray-500"
            type="text"
            name="city"
            value={formValues.city}
            onChange={handleValueChange}
          />
        </div>

        <div className="mt-4">
          <label className="p-1 font-semibold md:text-lg">
            Address <span className="text-sm italic"> (Optional)</span>
          </label>
          <Input
            className="border-2 border-gray-500"
            type="text"
            name="address"
            value={formValues.address}
            onChange={handleValueChange}
          />
        </div>

        <div className="mt-4 flex flex-col">
          <label className="p-2 font-semibold md:text-lg">
            Employment Type
          </label>
          <Select
            defaultValue={formValues.province}
            onValueChange={(value) =>
              handleValueChange(value, "employmentType")
            }>
            <SelectTrigger className="border-2 border-gray-500 text-base">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full Time">Full Time</SelectItem>
              <SelectItem value="Part Time">Part Time</SelectItem>
            </SelectContent>
          </Select>

          <label className="mt-4 p-2 font-semibold md:text-lg">
            Weekly Hours <span className="text-sm italic"> (Optional)</span>
          </label>
          <Input
            className="border-2 border-gray-500"
            type="text"
            name="workHours"
            value={formValues.workHours}
            onChange={handleValueChange}
            placeholder="0"
          />

          <label className="mt-4 p-2 font-semibold md:text-lg">
            Hiring Date <span className="text-sm italic"> (Optional)</span>
          </label>
          <Input
            className="mx-auto w-max border-2 border-gray-500 text-center"
            type="date"
            name="startTime"
            value={formValues.startTime}
            onChange={handleValueChange}
          />
        </div>

        <div className="mt-4 flex flex-col">
          <label className="p-2 font-semibold md:text-lg">Payment Type</label>
          <Select
            defaultValue={formValues.province}
            onValueChange={(value) => handleValueChange(value, "paymentType")}>
            <SelectTrigger className="border-2 border-gray-500 text-base">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hourly">Hourly</SelectItem>
              <SelectItem value="Salary">Salary</SelectItem>
            </SelectContent>
          </Select>

          <label className="mt-4 p-2 font-semibold md:text-lg">
            Min Pay Range
          </label>
          <Input
            className="border-2 border-gray-500"
            type="number"
            name="minCompValue"
            value={formValues.minCompValue}
            onChange={handleValueChange}
            placeholder="0"
          />

          <label className="mt-4 p-2 font-semibold md:text-lg">
            Max Pay Range <span className="text-sm italic"> (Optional)</span>
          </label>
          <Input
            className="border-2 border-gray-500"
            type="number"
            name="maxCompValue"
            value={formValues.maxCompValue}
            onChange={handleValueChange}
            placeholder="0"
          />
        </div>

        <div className="mt-2 flex w-full flex-col">
          <label className="p-2 font-semibold md:text-lg">Description</label>
          <textarea
            className="h-24 w-full rounded-md border-2 border-gray-500 p-2"
            name="description"
            value={formValues.description}
            onChange={handleValueChange}></textarea>
        </div>

        <div className="mt-2 flex flex-col">
          <label className="p-2 font-semibold md:text-lg">Language</label>
          <Select
            defaultValue={formValues.province}
            onValueChange={(value) => handleValueChange(value, "language")}>
            <SelectTrigger className="border-2 border-gray-500 text-base">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="French">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-2 flex flex-col">
          <div className="mt-4 flex flex-row">
            <label className="mt-2 w-2/3 font-semibold md:text-lg">
              Asylum Board
            </label>
            <Checkbox
              className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300"
              name="Asylum"
              onChange={() => handleValueChange(!formValues.postAsylum)}
            />
          </div>

          <div className="mt-4 flex flex-row">
            <label className="mt-2 w-2/3 font-semibold md:text-lg">
              Disablility Board
            </label>
            <Checkbox
              className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300"
              name="Disabled"
              onChange={() => handleValueChange(!formValues.postAsylum)}
            />
          </div>

          <div className="mt-4 flex flex-row">
            <label className="mt-2 w-2/3 font-semibold md:text-lg">
              Indigenous Board
            </label>
            <Checkbox
              className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300"
              name="Indigenous"
              onChange={() => handleValueChange(!formValues.postAsylum)}
            />
          </div>

          <div className="mt-4 flex flex-row">
            <label className="mt-2 w-2/3 font-semibold md:text-lg">
              Newcomers Board
            </label>
            <Checkbox
              className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300"
              name="Newcomers"
              onChange={() => handleValueChange(!formValues.postAsylum)}
            />
          </div>

          <div className="mt-4 flex flex-row">
            <label className="mt-2 w-2/3 font-semibold md:text-lg">
              Youth Board
            </label>
            <Checkbox
              className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300"
              name="Youth"
              onChange={() => handleValueChange(!formValues.postAsylum)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-row justify-evenly py-2">
          <Button type="submit" className="w-1/3">
            Submit
          </Button>
          <Button type="button" className="w-1/3">
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
