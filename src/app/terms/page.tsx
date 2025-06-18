import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="prose dark:prose-invert mx-auto flex h-dvh max-w-screen-md flex-col items-center justify-center">
      <h1>Terms of Service</h1>
      <p>Just don't make shit please.</p>
      <Link href="/">Go back</Link>
    </div>
  );
}
