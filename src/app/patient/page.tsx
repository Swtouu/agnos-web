import { Suspense } from "react";
import { PatientForm } from "@/components/patient/PatientForm";

export default function PatientPage() {
  return (
    <Suspense>
      <PatientForm />
    </Suspense>
  );
}
