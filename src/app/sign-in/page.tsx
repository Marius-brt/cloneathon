import { FormLoadingState } from "@/components/providers/form-loading-state";
import { MessageSquareIcon } from "lucide-react";
import Link from "next/link";
import { ProviderBtn } from "./_ui/provider-btn";

export default function SignInPage() {
  return (
    <section className="flex min-h-dvh bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <FormLoadingState>
        <div className="m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border bg-muted shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
          <div className="-m-px rounded-[calc(var(--radius)+.125rem)] border bg-card p-8 pb-6">
            <div className="text-center">
              <MessageSquareIcon className="mx-auto" />
              <h1 className="mt-4 mb-1 font-semibold text-xl">Sign In to Marius Chat</h1>
              <p className="text-sm">Welcome back! Sign in to continue</p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <ProviderBtn provider="google" />
              <ProviderBtn provider="github" />
            </div>
          </div>

          <div className="px-8 py-4 text-center text-muted-foreground text-xs [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
            By clicking continue, you agree to our{" "}
            <Link href="/terms">Terms of Service</Link> and{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </div>
        </div>
      </FormLoadingState>
    </section>
  );
}
