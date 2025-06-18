import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="prose dark:prose-invert mx-auto flex h-dvh max-w-screen-md flex-col items-center justify-center">
      <h1>Privacy Policy</h1>
      <p className="max-w-md text-center">
        We don't collect any data from you. We don't even store your API key. We don't
        event have a database. We don't even use internet.
      </p>
      <Link href="/">Go back</Link>
    </div>
  );
}
