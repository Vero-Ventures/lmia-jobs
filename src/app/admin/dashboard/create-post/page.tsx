"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { SessionLinks } from "@/app/admin/dashboard/lib/constants";
import Footer from "@/components/footer";
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
import {
  updateJobPost,
  getJobPost,
  createJobPost,
} from "@/actions/handle-job-posts";
import { createStripeCheckout } from "@/actions/stripe/create-checkout";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{
    postId?: string;
  }>;
}) {
  const { data: session, isPending } = authClient.useSession();

  if (!session && !isPending) {
    redirect("/admin");
  }

  const [loadingPostData, setLoadingPostData] = useState(true);
  const [postUpdate, setPostUpdate] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);

  const [formValues, setFormValues] = useState({
    jobTitle: "",
    organizationName: "",
    region: "",
    city: "",
    address: "",
    startTime: new Date().toISOString().split("T")[0],
    vacancies: "",
    employmentType: "",
    workHours: "",
    paymentType: "",
    minPayValue: "",
    maxPayValue: "",
    description: "",
    language: "",
    postAsylum: false,
    postDisabled: false,
    postIndigenous: false,
    postNewcomers: false,
    postYouth: false,
  });

  const [postTime, setPostTime] = useState(1);

  const updatePostTime = (newPostTime: number) => {
    if (newPostTime < 0) {
      setPostTime(1);
    } else if (newPostTime > 12) {
      setPostTime(12);
    } else {
      setPostTime(newPostTime);
    }
  };
  const [showNoBoardsSelected, setShowNoBoardsSelected] = useState(false);

  const [showPostingError, setShowPostingError] = useState(false);
  const [showPostingSuccess, setShowPostingSuccess] = useState(false);

  const [selectedBoards, setSelectedBoards] = useState(0);

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
      if (typeof e === "boolean") {
        setShowNoBoardsSelected(false);
        setSelectedBoards(selectedBoards + (e ? 1 : -1));
      }

      setFormValues((prevValues) => ({ ...prevValues, [fieldName!]: e }));
    } else if (e) {
      const { name, value } = e.target;
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  useEffect(() => {
    const getPostData = async () => {
      const { postId } = await searchParams;

      if (postId) {
        setLoadingPostData(true);
        setPostUpdate(true);

        const [result, jobPosting] = await getJobPost(
          postId,
          session!.user.email
        );

        if (result && jobPosting) {
          setFormValues({
            jobTitle: jobPosting.jobTitle,
            organizationName: jobPosting.organizationName,
            region: jobPosting.region,
            city: jobPosting.city,
            address: jobPosting.address ? jobPosting.address! : "",
            startTime: jobPosting.startTime,
            vacancies: jobPosting.vacancies
              ? String(jobPosting.vacancies!)
              : "",
            employmentType: jobPosting.employmentType,
            workHours: jobPosting.workHours
              ? String(jobPosting.workHours!)
              : "",
            paymentType: jobPosting.paymentType,
            minPayValue: String(jobPosting.maxPayValue),
            maxPayValue: jobPosting.maxPayValue
              ? String(jobPosting.maxPayValue!)
              : "",
            description: jobPosting.description,
            language: jobPosting.language ? jobPosting!.language! : "",
            postAsylum: jobPosting.postAsylum,
            postDisabled: jobPosting.postDisabled,
            postIndigenous: jobPosting.postIndigenous,
            postNewcomers: jobPosting.postNewcomers,
            postYouth: jobPosting.postYouth,
          });
        } else {
          redirect("/admin/dashboard");
        }
      }

      setLoadingPostData(false);
    };

    getPostData();
  }, [session]);

  const submitPostForm = async () => {
    setSubmittingPost(true);
    setShowPostingError(false);
    setShowNoBoardsSelected(false);

    const { postId } = await searchParams;

    let result;

    if (!postId) {
      if (selectedBoards === 0) {
        setShowNoBoardsSelected(true);
        setSubmittingPost(false);
        return;
      }

      const [creationResult, numBoards, newPostId] = await createJobPost(
        formValues,
        postTime,
        session!.user.email
      );

      if (creationResult === "created") {
        const checkoutResult = await createStripeCheckout(
          session!.user.email,
          numBoards,
          postTime,
          newPostId!
        );

        if (checkoutResult.result) {
          redirect(checkoutResult.url);
        } else {
          result = "error";
        }
      } else {
        result = creationResult;
      }
    } else {
      const updateResult = await updateJobPost(
        formValues,
        postId,
        session!.user.email
      );

      if (updateResult === "updated") {
        setShowPostingSuccess(true);
        setTimeout(() => {
          redirect("/admin/dashboard");
        }, 750);
      } else {
        result = updateResult;
      }
    }

    if (result === "error") {
      setShowPostingError(true);
    }

    setSubmittingPost(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <Navbar links={SessionLinks} />
      <div
        className={`m-6 mx-auto flex w-4/5 max-w-3xl flex-col rounded-lg border-2 border-gray-800 bg-white p-2 px-4 mb:w-5/6 mb:pt-4 sm:w-4/5 md:w-3/4 md:px-6 ${loadingPostData ? "opacity-50" : ""}`}>
        <Form className="flex flex-col" action={submitPostForm}>
          <Button className="w-10 self-end justify-self-end bg-white">
            <XCircle className="min-h-8 min-w-8 bg-white text-black" />
          </Button>

          <div className="md:mx-auto md:w-4/5">
            <label className="p-2 font-semibold mb:text-lg">Job Title</label>
            <Input
              className="border-2 border-gray-500 md:text-base"
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
              className="border-2 border-gray-500 md:text-base"
              type="text"
              name="organizationName"
              value={formValues.organizationName}
              onChange={handleValueChange}
              required
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:justify-evenly lg:px-8">
            <div className="mx-auto mt-2 flex flex-row md:mx-0">
              <label className="p-2 font-semibold mb:mr-1 mb:mt-2.5 mb:block mb:text-lg">
                Region
              </label>
              <div className="flex flex-col">
                <Select
                  value={formValues.region}
                  onValueChange={(value) => handleValueChange(value, "region")}
                  required>
                  <SelectTrigger className="ml-4 min-w-32 border-2 border-gray-500 text-base font-semibold mb:ml-2 mb:mt-3 mb:min-w-48 mb:text-lg sm:min-w-32 md:min-w-40">
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
                  className="mx-auto h-1 w-0 p-0 opacity-0"
                  required
                  value={formValues.region}
                  onChange={handleValueChange}
                />
              </div>
            </div>

            <div className="flex flex-col sm:ml-2 sm:mt-2 sm:flex-row">
              <label className="mt-2 p-2 font-semibold mb:mr-1 mb:text-lg sm:mt-3">
                City
              </label>
              <Input
                className="w-full border-2 border-gray-500 sm:mt-3 md:text-base"
                type="text"
                name="city"
                value={formValues.city}
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
              className="border-2 border-gray-500 md:text-base"
              type="text"
              name="address"
              value={formValues.address}
              onChange={handleValueChange}
            />
          </div>

          <div className="mt-4 flex flex-col md:mt-8 md:flex-row md:justify-evenly">
            <div className="flex flex-col">
              <label className="p-2 text-center font-semibold mb:text-lg md:mx-auto md:w-32">
                Hiring Date <span className="text-sm italic"> (Optional)</span>
              </label>
              <Input
                className="mx-auto w-max border-2 border-gray-500 text-center mb:text-lg mb:font-semibold sm:text-xl md:min-w-48 md:text-xl"
                type="date"
                name="startTime"
                value={formValues.startTime}
                onChange={handleValueChange}
              />
            </div>

            <div className="mt-6 flex flex-col md:mt-0">
              <label className="p-2 text-center font-semibold mb:text-lg md:mx-auto md:w-44">
                Avalible Positions{" "}
                <span className="text-sm italic"> (Optional)</span>
              </label>
              <Input
                className="mx-auto w-32 border-2 border-gray-500 text-center mb:text-lg md:min-w-32 md:text-lg"
                type="number"
                name="vacancies"
                value={formValues.vacancies}
                onChange={handleValueChange}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col mb:-translate-x-2 mb:flex-row mb:justify-evenly sm:translate-x-0">
            <div className="flex flex-col mb:flex-row">
              <label className="p-2 font-semibold mb:mr-2 mb:mt-3 mb:w-28 mb:text-center md:mr-2 md:mt-6 md:w-fit md:max-w-40 md:px-0 md:text-lg">
                Employment Type
              </label>
              <div className="flex flex-col">
                <Select
                  value={formValues.employmentType}
                  onValueChange={(value) =>
                    handleValueChange(value, "employmentType")
                  }
                  required>
                  <SelectTrigger className="border-2 border-gray-500 text-base mb:mt-7 mb:max-w-32 sm:min-w-36 sm:text-lg sm:font-semibold md:ml-2 md:max-w-28 lg:min-w-48">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Full Time"
                      className="text-lg font-semibold">
                      Full Time
                    </SelectItem>
                    <SelectItem
                      value="Part Time"
                      className="text-lg font-semibold">
                      Part Time
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="mx-auto h-1 w-0 p-0 opacity-0"
                  required
                  value={formValues.employmentType}
                  onChange={handleValueChange}
                />
              </div>
            </div>

            <div className="flex flex-col mb:flex-row">
              <label className="mt-4 p-2 font-semibold mb:mr-2 mb:mt-2.5 mb:w-20 mb:text-center md:mr-2 md:mt-3 md:min-w-36 md:text-lg">
                Weekly Hours <span className="text-sm italic"> (Optional)</span>
              </label>
              <Input
                className="border-2 border-gray-500 mb:mt-7 mb:w-16 md:w-20 md:text-lg lg:w-32"
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
              <div className="flex flex-col">
                <Select
                  value={formValues.paymentType}
                  onValueChange={(value) =>
                    handleValueChange(value, "paymentType")
                  }
                  required>
                  <SelectTrigger className="mx-auto w-40 border-2 border-gray-500 text-base mb:w-48 mb:text-lg mb:font-semibold sm:mx-auto sm:w-40 md:w-48">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Hourly"
                      className="text-lg font-semibold">
                      Hourly
                    </SelectItem>
                    <SelectItem
                      value="Salary"
                      className="text-lg font-semibold">
                      Salary
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="mx-auto h-1 w-0 p-0 opacity-0"
                  required
                  value={formValues.paymentType}
                  onChange={handleValueChange}
                />
              </div>
            </div>

            <div className="flex flex-col mb:flex-row mb:justify-evenly">
              <div className="flex flex-col mb:flex-row sm:mx-2 sm:flex-col md:ml-6 md:mr-4 lg:mr-12">
                <label className="mt-4 p-2 font-semibold mb:min-w-20 mb:max-w-24 mb:text-center sm:mx-auto sm:mt-0 sm:text-center md:text-lg">
                  Min Pay Range
                </label>
                <Input
                  className="border-2 border-gray-500 mb:mt-7 mb:w-24 sm:mx-auto sm:mt-0 sm:w-full sm:max-w-44 md:text-lg"
                  type="number"
                  name="minPayValue"
                  value={formValues.minPayValue}
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
                  className="border-2 border-gray-500 mb:mt-7 mb:w-24 sm:mx-auto sm:mt-0 sm:w-full sm:max-w-44 md:text-lg"
                  type="number"
                  name="maxPayValue"
                  value={formValues.maxPayValue}
                  onChange={handleValueChange}
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div className="mt-2 flex w-full flex-col lg:mx-auto lg:w-11/12">
            <label className="p-2 font-semibold mb:text-lg">Description</label>
            <textarea
              className="h-24 w-full rounded-md border-2 border-gray-500 p-2 sm:h-40 sm:p-4 lg:h-52"
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
              value={formValues.language}
              onValueChange={(value) => handleValueChange(value, "language")}
              required>
              <SelectTrigger className="mx-auto w-48 border-2 border-gray-500 text-base mb:text-lg mb:font-semibold sm:text-lg sm:font-semibold md:w-64">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English" className="text-lg font-semibold">
                  English
                </SelectItem>
                <SelectItem value="French" className="text-lg font-semibold">
                  French
                </SelectItem>
                <SelectItem value="Other" className="text-lg font-semibold">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`mt-4 flex flex-col ${postUpdate ? "hidden" : ""}`}>
            <div className="flex flex-col text-center sm:mx-auto sm:w-fit sm:pr-12 md:w-full md:flex-row md:justify-between md:p-0 lg:justify-evenly">
              <div className="mt-2 flex flex-row md:flex-col">
                <label className="mt-2 w-2/3 font-semibold mb:text-lg sm:w-52 md:mb-2 md:w-24 md:text-base lg:text-lg">
                  Accessible Job Board
                </label>
                <Checkbox
                  className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300 sm:ml-8 md:mx-auto"
                  name="Disabled"
                  onCheckedChange={() =>
                    handleValueChange(!formValues.postDisabled, "postDisabled")
                  }
                  checked={formValues.postDisabled}
                />
              </div>

              <div className="mt-2 flex flex-row md:flex-col">
                <label className="mt-2 w-2/3 font-semibold mb:text-lg sm:w-52 md:mb-2 md:w-24 md:text-base lg:text-lg">
                  Asylum Job Board
                </label>
                <Checkbox
                  className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300 sm:ml-8 md:mx-auto"
                  name="Asylum"
                  onCheckedChange={() =>
                    handleValueChange(!formValues.postAsylum, "postAsylum")
                  }
                  checked={formValues.postAsylum}
                />
              </div>

              <div className="mt-2 flex flex-row md:flex-col">
                <label className="mt-2 w-2/3 font-semibold mb:text-lg sm:w-52 md:mb-2 md:w-24 md:text-base lg:text-lg">
                  Indigenous Job Board
                </label>
                <Checkbox
                  className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300 sm:ml-8 md:mx-auto"
                  name="Indigenous"
                  onCheckedChange={() =>
                    handleValueChange(
                      !formValues.postIndigenous,
                      "postIndigenous"
                    )
                  }
                  checked={formValues.postIndigenous}
                />
              </div>

              <div className="mt-2 flex flex-row md:flex-col">
                <label className="mt-2 w-2/3 font-semibold mb:text-lg sm:w-52 md:mb-2 md:w-24 md:text-base lg:text-lg">
                  Newcomers Job Board
                </label>
                <Checkbox
                  className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300 sm:ml-8 md:mx-auto"
                  name="Newcomers"
                  onCheckedChange={() =>
                    handleValueChange(
                      !formValues.postNewcomers,
                      "postNewcomers"
                    )
                  }
                  checked={formValues.postNewcomers}
                />
              </div>

              <div className="mt-2 flex flex-row md:flex-col">
                <label className="mt-2 w-2/3 font-semibold mb:text-lg sm:w-52 md:mb-2 md:w-24 md:text-base lg:text-lg">
                  Youth Job Board
                </label>
                <Checkbox
                  className="ml-4 h-10 w-10 rounded-md border-2 border-gray-500 data-[state=checked]:bg-gray-300 sm:ml-8 md:mx-auto"
                  name="Youth"
                  onCheckedChange={() =>
                    handleValueChange(!formValues.postYouth, "postYouth")
                  }
                  checked={formValues.postYouth}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col md:flex-row md:justify-evenly">
              <div className="flex flex-col">
                <label className="mt-1 p-2 text-center font-semibold mb:text-lg">
                  Months Posted
                </label>
                <Input
                  className="mx-auto w-48 border-2 border-gray-500 text-center text-lg font-semibold mb:text-lg sm:font-semibold md:w-48 md:text-lg"
                  type="number"
                  name="workHours"
                  value={postTime}
                  onChange={(e) => updatePostTime(Number(e.target.value))}
                  placeholder=""
                />
              </div>

              <div className="flex flex-col">
                <label className="mt-4 p-2 text-center text-lg font-semibold mb:text-xl md:mt-0 md:text-2xl">
                  Total Price
                </label>
                <Input
                  className="mx-auto mb-2 w-48 border-2 border-gray-500 text-center text-xl font-semibold italic text-gray-600 mb:text-xl sm:font-semibold md:mb-0 md:w-64 md:text-xl"
                  type="text"
                  name="workHours"
                  value={"$" + selectedBoards * postTime * 5 + ".00"}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div
            className={showNoBoardsSelected ? "mx-auto mt-6 w-fit" : "hidden"}>
            <p className="text-center text-lg font-semibold text-red-500">
              No Job Boards Are Selected
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
              Post Updated <br /> Successfully
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
      <Footer />
    </div>
  );
}
