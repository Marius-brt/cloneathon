"use client";

import { socialIcons } from "@/components/icons";
import { useFormLoadingState } from "@/components/providers/form-loading-state";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/config/auth-client";
import type { SocialProvider } from "@/lib/types";
import { providerNames } from "@/lib/utils";
import { useCallback, useMemo } from "react";

export function ProviderBtn({
  provider,
  callback
}: { provider: SocialProvider; callback?: string }) {
  const { isFieldLoading, isFormLoading, setLoading } = useFormLoadingState(provider);
  const Icon = useMemo(() => socialIcons[provider] || null, [provider]);

  const onClick = useCallback(async () => {
    setLoading(true);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: callback ?? "/"
    });

    if (error) {
      //toast("An error occured during your connection", "error");

      setLoading(false);
    }
  }, [provider, callback, setLoading]);

  return (
    <Button
      variant="outline"
      loading={isFieldLoading}
      onClick={onClick}
      icon={Icon ? <Icon /> : undefined}
      disabled={isFormLoading}
    >
      Sign in with {providerNames[provider]}
    </Button>
  );
}
