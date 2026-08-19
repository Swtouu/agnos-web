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

// "message" strings below are i18n translation keys, not literal text — translated at display time.
const dateOfBirthSchema = z
  .string()
  .min(1, "patientForm.validation.dateOfBirthRequired")
  .refine((val) => !Number.isNaN(Date.parse(val)), "patientForm.validation.dateOfBirthInvalid")
  .refine((val) => new Date(val).getTime() <= Date.now(), "patientForm.validation.dateOfBirthFuture")
  .refine((val) => {
    const years = (Date.now() - new Date(val).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return years <= 120;
  }, "patientForm.validation.dateOfBirthImplausible");

export const addressSchema = z.object({
  houseNoStreet: z.string().min(1, "patientForm.validation.houseNoStreetRequired"),
  subDistrict: z.string().min(1, "patientForm.validation.subDistrictRequired"),
  district: z.string().min(1, "patientForm.validation.districtRequired"),
  province: z.string().min(1, "patientForm.validation.provinceRequired"),
  postalCode: z.string().regex(THAI_POSTAL_CODE_REGEX, "patientForm.validation.postalCodeInvalid"),
});

// Fields are optional here (RHF sends "" not undefined) — required-together lives in superRefine.
export const emergencyContactSchema = z
  .object({
    name: z.string().optional(),
    relationship: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    const hasName = Boolean(val.name?.trim());
    const hasRelationship = Boolean(val.relationship);
    if (!hasName && !hasRelationship) return;
    if (!hasName) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "patientForm.validation.emergencyContactNameRequired",
      });
    }
    if (!hasRelationship) {
      ctx.addIssue({
        code: "custom",
        path: ["relationship"],
        message: "patientForm.validation.emergencyContactRelationshipRequired",
      });
    } else if (!(RELATIONSHIP_OPTIONS as readonly string[]).includes(val.relationship as string)) {
      ctx.addIssue({
        code: "custom",
        path: ["relationship"],
        message: "patientForm.validation.emergencyContactRelationshipInvalid",
      });
    }
  });

export const patientFormSchema = z.object({
  firstName: z.string().min(1, "patientForm.validation.firstNameRequired"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "patientForm.validation.lastNameRequired"),
  dateOfBirth: dateOfBirthSchema,
  gender: z.enum(GENDER_OPTIONS, "patientForm.validation.genderRequired"),
  phoneNumber: z.string().regex(THAI_PHONE_REGEX, "patientForm.validation.phoneInvalid"),
  email: z.email("patientForm.validation.emailInvalid"),
  address: addressSchema,
  preferredLanguage: z.enum(PREFERRED_LANGUAGE_OPTIONS, "patientForm.validation.preferredLanguageRequired"),
  nationality: z.string().min(1, "patientForm.validation.nationalityRequired"),
  emergencyContact: emergencyContactSchema.optional(),
  // Union (not preprocess/transform) keeps input/output types symmetric for zodResolver — same "" bug as above.
  religion: z.union([z.enum(RELIGION_OPTIONS), z.literal("")]).optional(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
