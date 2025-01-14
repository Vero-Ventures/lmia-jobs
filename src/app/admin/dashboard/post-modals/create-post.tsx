import { useState } from "react";

export default function CreatePosting() {
  const [formValues, setFormValues] = useState({
    jobTitle: "",
    organizationName: "",
    employmentType: "",
    province: "",
    city: "",
    address: "",
    paymentType: "",
    minCompValue: 0,
    maxCompValue: 0,
    workHours: "",
    startTime: new Date(),
    vacancies: 0,
    description: "",
    language: "",
    postAsylum: false,
    postDisabled: false,
    postIndigenous: false,
    postNewcomers: false,
    postYouth: false,
  });

  const handleValueChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  return (
    <div>
      <form>
        <button type="button" onClick={() => {}}>
          Close
        </button>

        <div>
          <label>Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formValues.jobTitle}
            onChange={handleValueChange}
          />
        </div>

        {/* Organization Name */}
        <div>
          <label>Organization Name</label>
          <input
            type="text"
            name="organizationName"
            value={formValues.organizationName}
            onChange={handleValueChange}
          />
        </div>

        {/* Employment Type */}
        <div>
          <label>Employment Type</label>
          <select
            name="employmentType"
            value={formValues.employmentType}
            onChange={handleValueChange}>
            <option value="">Select</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        {/* Province + City */}
        <div>
          <label>Province</label>
          <input
            type="text"
            name="province"
            value={formValues.province}
            onChange={handleChange}
          />
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formValues.city}
            onChange={handleChange}
          />
        </div>

        {/* Address (Optional) */}
        <div>
          <label>Address (Optional)</label>
          <input
            type="text"
            name="address"
            value={formValues.address}
            onChange={handleChange}
          />
        </div>

        {/* Payment Type + Min Comp Value + Max Comp Value */}
        <div>
          <label>Payment Type</label>
          <select
            name="paymentType"
            value={formValues.paymentType}
            onChange={handleChange}>
            <option value="">Select</option>
            <option value="hourly">Hourly</option>
            <option value="salary">Salary</option>
          </select>
          <label>Min Comp Value</label>
          <input
            type="number"
            name="minCompValue"
            value={formValues.minCompValue}
            onChange={handleChange}
          />
          <label>Max Comp Value</label>
          <input
            type="number"
            name="maxCompValue"
            value={formValues.maxCompValue}
            onChange={handleChange}
          />
        </div>

        {/* Work Hours + Start Time */}
        <div>
          <label>Work Hours (Optional)</label>
          <input
            type="text"
            name="workHours"
            value={formValues.workHours}
            onChange={handleChange}
          />
          <label>Start Time (Optional)</label>
          <input
            type="time"
            name="startTime"
            value={formValues.startTime}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formValues.description}
            onChange={handleChange}></textarea>
        </div>

        {/* Language */}
        <div>
          <label>Language</label>
          <select
            name="language"
            value={formValues.language}
            onChange={handleChange}>
            <option value="">Select</option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
          </select>
        </div>

        {/* 5 Buttons */}
        <div>
          <button type="button">Button 1</button>
          <button type="button">Button 2</button>
          <button type="button">Button 3</button>
          <button type="button">Button 4</button>
          <button type="button">Button 5</button>
        </div>

        {/* Submit and Cancel Buttons */}
        <div>
          <button type="submit">Submit</button>
          <button type="button">Cancel</button>
        </div>
      </form>
    </div>
  );
}
