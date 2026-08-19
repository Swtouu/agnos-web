export const LOCALES = ["en", "th"] as const;
export type Locale = (typeof LOCALES)[number];

// Option *values* (stored/validated) stay English — only the displayed label translates.
// See lib/validation/patient-form.ts for the source-of-truth value lists.
const optionLabels = {
  gender: {
    Male: { en: "Male", th: "ชาย" },
    Female: { en: "Female", th: "หญิง" },
    Other: { en: "Other", th: "อื่น ๆ" },
    "Prefer not to say": { en: "Prefer not to say", th: "ไม่ระบุ" },
  },
  religion: {
    Buddhist: { en: "Buddhist", th: "พุทธ" },
    Christian: { en: "Christian", th: "คริสต์" },
    Islam: { en: "Islam", th: "อิสลาม" },
    Hindu: { en: "Hindu", th: "ฮินดู" },
    Other: { en: "Other", th: "อื่น ๆ" },
    "Prefer not to say": { en: "Prefer not to say", th: "ไม่ระบุ" },
  },
  preferredLanguage: {
    Thai: { en: "Thai", th: "ไทย" },
    English: { en: "English", th: "อังกฤษ" },
    Other: { en: "Other", th: "อื่น ๆ" },
  },
  relationship: {
    Parent: { en: "Parent", th: "บิดา/มารดา" },
    Spouse: { en: "Spouse", th: "คู่สมรส" },
    Sibling: { en: "Sibling", th: "พี่น้อง" },
    Child: { en: "Child", th: "บุตร" },
    Friend: { en: "Friend", th: "เพื่อน" },
    Other: { en: "Other", th: "อื่น ๆ" },
  },
} as const;

const dict = {
  brand: { en: "Agnos Patient Intake", th: "Agnos ระบบรับข้อมูลผู้ป่วย" },

  header: {
    switchToLight: { en: "Switch to light theme", th: "สลับเป็นธีมสว่าง" },
    switchToDark: { en: "Switch to dark theme", th: "สลับเป็นธีมมืด" },
  },

  landing: {
    badge: { en: "Real-time patient intake", th: "รับข้อมูลผู้ป่วยแบบเรียลไทม์" },
    heading: { en: "Patient forms, synced live to your front desk.", th: "ฟอร์มผู้ป่วย ซิงก์ถึงเคาน์เตอร์แบบเรียลไทม์" },
    subheading: {
      en: "Patients fill in their details on any device. Staff watch it happen in real time, no refresh, no waiting.",
      th: "ผู้ป่วยกรอกข้อมูลจากอุปกรณ์ใดก็ได้ เจ้าหน้าที่เห็นข้อมูลทันทีแบบเรียลไทม์ ไม่ต้องรีเฟรช ไม่ต้องรอ",
    },
    patientCardTitle: { en: "I'm a patient", th: "ฉันเป็นผู้ป่วย" },
    patientCardDesc: { en: "Fill in your intake form", th: "กรอกแบบฟอร์มข้อมูลผู้ป่วย" },
    patientCardAction: { en: "Start", th: "เริ่มกรอกข้อมูล" },
    staffCardTitle: { en: "I'm staff", th: "ฉันเป็นเจ้าหน้าที่" },
    staffCardDesc: { en: "Monitor patients live", th: "ติดตามข้อมูลผู้ป่วยแบบเรียลไทม์" },
    staffCardAction: { en: "Open dashboard", th: "เปิดแดชบอร์ด" },
  },

  patientForm: {
    title: { en: "Patient Intake Form", th: "แบบฟอร์มข้อมูลผู้ป่วย" },
    subtitle: { en: "Your answers sync to the front desk as you type.", th: "คำตอบของคุณจะซิงก์ถึงเคาน์เตอร์ทันทีขณะพิมพ์" },
    reconnecting: {
      en: "Reconnecting... your changes will sync once the connection is back.",
      th: "กำลังเชื่อมต่อใหม่... การเปลี่ยนแปลงจะซิงก์เมื่อเชื่อมต่อสำเร็จ",
    },
    optional: { en: "(optional)", th: "(ไม่บังคับ)" },
    submit: { en: "Submit", th: "ส่งข้อมูล" },
    submitting: { en: "Submitting...", th: "กำลังส่งข้อมูล..." },
    submitFailedFallback: { en: "Submission failed — please try again.", th: "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
    submitTimeout: {
      en: "Submission timed out — check your connection and try again",
      th: "ส่งข้อมูลหมดเวลา กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง",
    },
    sessionLabel: { en: "Session", th: "รหัสเซสชัน" },
    thankYouTitle: { en: "Thank you", th: "ขอบคุณค่ะ" },
    thankYouBody: { en: "Your information has been submitted to staff.", th: "ข้อมูลของคุณถูกส่งถึงเจ้าหน้าที่แล้ว" },

    sections: {
      name: { en: "Name", th: "ชื่อ-นามสกุล" },
      personalDetails: { en: "Personal Details", th: "ข้อมูลส่วนตัว" },
      contact: { en: "Contact", th: "ข้อมูลติดต่อ" },
      address: { en: "Address", th: "ที่อยู่" },
      emergencyContact: { en: "Emergency Contact (optional)", th: "ผู้ติดต่อฉุกเฉิน (ไม่บังคับ)" },
    },

    fields: {
      firstName: { en: "First Name", th: "ชื่อจริง" },
      middleName: { en: "Middle Name", th: "ชื่อกลาง" },
      lastName: { en: "Last Name", th: "นามสกุล" },
      dateOfBirth: { en: "Date of Birth", th: "วันเกิด" },
      gender: { en: "Gender", th: "เพศ" },
      nationality: { en: "Nationality", th: "สัญชาติ" },
      preferredLanguage: { en: "Preferred Language", th: "ภาษาที่ใช้สื่อสาร" },
      religion: { en: "Religion", th: "ศาสนา" },
      phoneNumber: { en: "Phone Number", th: "เบอร์โทรศัพท์" },
      email: { en: "Email", th: "อีเมล" },
      houseNoStreet: { en: "House No. / Street", th: "บ้านเลขที่ / ถนน" },
      subDistrict: { en: "Sub-district (Tambon)", th: "ตำบล/แขวง" },
      subDistrictPlaceholder: { en: "Type a sub-district...", th: "พิมพ์ชื่อตำบล..." },
      district: { en: "District (Amphoe)", th: "อำเภอ/เขต" },
      province: { en: "Province (Changwat)", th: "จังหวัด" },
      postalCode: { en: "Postal Code", th: "รหัสไปรษณีย์" },
      emergencyContactName: { en: "Name", th: "ชื่อ" },
      emergencyContactRelationship: { en: "Relationship", th: "ความสัมพันธ์" },
    },

    selectPlaceholder: { en: "Select...", th: "เลือก..." },

    validation: {
      firstNameRequired: { en: "First name is required", th: "กรุณากรอกชื่อจริง" },
      lastNameRequired: { en: "Last name is required", th: "กรุณากรอกนามสกุล" },
      dateOfBirthRequired: { en: "Date of birth is required", th: "กรุณาระบุวันเกิด" },
      dateOfBirthInvalid: { en: "Invalid date", th: "วันที่ไม่ถูกต้อง" },
      dateOfBirthFuture: { en: "Date of birth cannot be in the future", th: "วันเกิดต้องไม่ใช่วันที่ในอนาคต" },
      dateOfBirthImplausible: { en: "Please enter a valid date of birth", th: "กรุณากรอกวันเกิดที่ถูกต้อง" },
      genderRequired: { en: "Please select a gender", th: "กรุณาเลือกเพศ" },
      preferredLanguageRequired: { en: "Please select a preferred language", th: "กรุณาเลือกภาษาที่ใช้สื่อสาร" },
      phoneInvalid: { en: "Enter a valid Thai phone number", th: "กรุณากรอกเบอร์โทรศัพท์ไทยที่ถูกต้อง" },
      emailInvalid: { en: "Enter a valid email address", th: "กรุณากรอกอีเมลที่ถูกต้อง" },
      nationalityRequired: { en: "Nationality is required", th: "กรุณาระบุสัญชาติ" },
      houseNoStreetRequired: { en: "House number / street is required", th: "กรุณากรอกบ้านเลขที่ / ถนน" },
      subDistrictRequired: { en: "Sub-district is required", th: "กรุณาระบุตำบล/แขวง" },
      districtRequired: { en: "District is required", th: "กรุณาระบุอำเภอ/เขต" },
      provinceRequired: { en: "Province is required", th: "กรุณาระบุจังหวัด" },
      postalCodeInvalid: { en: "Postal code must be 5 digits", th: "รหัสไปรษณีย์ต้องมี 5 หลัก" },
      emergencyContactNameRequired: {
        en: "Emergency contact name is required",
        th: "กรุณากรอกชื่อผู้ติดต่อฉุกเฉิน",
      },
      emergencyContactRelationshipRequired: {
        en: "Relationship is required",
        th: "กรุณาระบุความสัมพันธ์",
      },
      emergencyContactRelationshipInvalid: {
        en: "Select a valid relationship",
        th: "กรุณาเลือกความสัมพันธ์ที่ถูกต้อง",
      },
    },
  },

  staff: {
    dashboardTitle: { en: "Staff Dashboard", th: "แดชบอร์ดเจ้าหน้าที่" },
    searchPlaceholder: { en: "Search by name...", th: "ค้นหาจากชื่อ..." },
    noSessions: { en: "No sessions.", th: "ไม่มีเซสชัน" },
    selectSessionPrompt: { en: "Select a session to view details", th: "เลือกเซสชันเพื่อดูรายละเอียด" },
    back: { en: "Back", th: "ย้อนกลับ" },
    unnamedPatient: { en: "Unnamed patient", th: "ไม่ระบุชื่อผู้ป่วย" },
    sessionPrefix: { en: "Session", th: "เซสชัน" },
    addressSection: { en: "Address", th: "ที่อยู่" },
    emergencyContactSection: { en: "Emergency Contact", th: "ผู้ติดต่อฉุกเฉิน" },
    statusActive: { en: "Actively filling in", th: "กำลังกรอกข้อมูล" },
    statusInactive: { en: "Inactive", th: "ไม่มีการเคลื่อนไหว" },
    statusSubmitted: { en: "Submitted", th: "ส่งข้อมูลแล้ว" },
    filterAll: { en: "all", th: "ทั้งหมด" },
    filterActive: { en: "active", th: "กำลังกรอก" },
    filterInactive: { en: "inactive", th: "ไม่เคลื่อนไหว" },
    filterSubmitted: { en: "submitted", th: "ส่งแล้ว" },
  },
} as const;

export type TranslationKey = keyof typeof dict;

export { dict, optionLabels };
