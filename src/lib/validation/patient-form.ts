import { z } from "zod";

// Static option lists — shared by zod enums and the corresponding <select> UI.
export const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"] as const;
export const RELIGION_OPTIONS = [
  "Buddhist",
  "Christian",
  "Islam",
  "Hindu",
  "Other",
  "Prefer not to say",
] as const;
export const PREFERRED_LANGUAGE_OPTIONS = ["Thai", "English", "Other"] as const;
export const RELATIONSHIP_OPTIONS = ["Parent", "Spouse", "Sibling", "Child", "Friend", "Other"] as const;

const THAI_PHONE_REGEX = /^0\d{8,9}$/;
const THAI_POSTAL_CODE_REGEX = /^\d{5}$/;

const dateOfBirthSchema = z
  .string()
  .min(1, "Date of birth is required")
  .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date")
  .refine((val) => new Date(val).getTime() <= Date.now(), "Date of birth cannot be in the future")
  .refine((val) => {
    const years = (Date.now() - new Date(val).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return years <= 120;
  }, "Please enter a valid date of birth");

export const addressSchema = z.object({
  houseNoStreet: z.string().min(1, "House number / street is required"),
  subDistrict: z.string().min(1, "Sub-district is required"),
  district: z.string().min(1, "District is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().regex(THAI_POSTAL_CODE_REGEX, "Postal code must be 5 digits"),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(1, "Emergency contact name is required"),
  relationship: z.enum(RELATIONSHIP_OPTIONS),
});

export const patientFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: dateOfBirthSchema,
  gender: z.enum(GENDER_OPTIONS),
  phoneNumber: z.string().regex(THAI_PHONE_REGEX, "Enter a valid Thai phone number"),
  email: z.email("Enter a valid email address"),
  address: addressSchema,
  preferredLanguage: z.enum(PREFERRED_LANGUAGE_OPTIONS),
  nationality: z.string().min(1, "Nationality is required"),
  emergencyContact: emergencyContactSchema.optional(),
  religion: z.enum(RELIGION_OPTIONS).optional(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
