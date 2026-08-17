import { describe, expect, it } from "vitest";
import { patientFormSchema } from "./patient-form";

const validAddress = {
  houseNoStreet: "123 Sukhumvit",
  subDistrict: "คลองตัน",
  district: "คลองเตย",
  province: "กรุงเทพมหานคร",
  postalCode: "10110",
};

const validData = {
  firstName: "Somchai",
  lastName: "Test",
  dateOfBirth: "1990-01-01",
  gender: "Male",
  phoneNumber: "0812345678",
  email: "somchai@example.com",
  address: validAddress,
  preferredLanguage: "Thai",
  nationality: "Thailand",
};

describe("patientFormSchema", () => {
  it("accepts a fully valid submission", () => {
    expect(patientFormSchema.safeParse(validData).success).toBe(true);
  });

  it("accepts valid submission without optional fields", () => {
    const result = patientFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects missing first name", () => {
    const { firstName, ...rest } = validData;
    void firstName;
    expect(patientFormSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = patientFormSchema.safeParse({ ...validData, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it.each(["0812345678", "021234567"])("accepts valid Thai phone number %s", (phoneNumber) => {
    expect(patientFormSchema.safeParse({ ...validData, phoneNumber }).success).toBe(true);
  });

  it.each(["12345678", "+66812345678", "081234"])("rejects invalid Thai phone number %s", (phoneNumber) => {
    expect(patientFormSchema.safeParse({ ...validData, phoneNumber }).success).toBe(false);
  });

  it("rejects a postal code that isn't 5 digits", () => {
    const result = patientFormSchema.safeParse({
      ...validData,
      address: { ...validAddress, postalCode: "1011" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a date of birth in the future", () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const result = patientFormSchema.safeParse({
      ...validData,
      dateOfBirth: future.toISOString().slice(0, 10),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a date of birth more than 120 years ago", () => {
    const result = patientFormSchema.safeParse({ ...validData, dateOfBirth: "1850-01-01" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown gender option", () => {
    const result = patientFormSchema.safeParse({ ...validData, gender: "Unknown" });
    expect(result.success).toBe(false);
  });

  it("accepts an empty religion as not provided (what react-hook-form sends for an untouched optional select)", () => {
    const result = patientFormSchema.safeParse({ ...validData, religion: "" });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown religion option", () => {
    const result = patientFormSchema.safeParse({ ...validData, religion: "NotAReligion" });
    expect(result.success).toBe(false);
  });

  it("accepts an emergency contact when both name and relationship are present", () => {
    const result = patientFormSchema.safeParse({
      ...validData,
      emergencyContact: { name: "Somsri", relationship: "Parent" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an emergency contact missing relationship", () => {
    const result = patientFormSchema.safeParse({
      ...validData,
      emergencyContact: { name: "Somsri" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts a fully-empty emergency contact as not provided (what react-hook-form actually sends for an untouched optional section)", () => {
    const result = patientFormSchema.safeParse({
      ...validData,
      emergencyContact: { name: "", relationship: "" },
    });
    expect(result.success).toBe(true);
  });
});
