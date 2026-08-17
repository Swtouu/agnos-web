import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Agnos Patient Intake</h1>
      <div className="flex gap-4">
        <Link href="/patient" className="rounded bg-blue-600 px-4 py-2 text-white">
          I&apos;m a patient
        </Link>
        <Link href="/staff" className="rounded bg-slate-700 px-4 py-2 text-white">
          I&apos;m staff
        </Link>
      </div>
    </main>
  );
}
