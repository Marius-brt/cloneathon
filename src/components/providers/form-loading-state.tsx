"use client";

import { type ReactNode, createContext, useCallback, useContext, useState } from "react";

const FormLoadingStateContext = createContext<{
  value: string | undefined;
  setValue: (formKey: string | undefined) => void;
}>({
  value: undefined,
  setValue: () => undefined
});

export function FormLoadingState({
  children
}: {
  children: ReactNode;
}) {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <FormLoadingStateContext.Provider value={{ value, setValue }}>
      {children}
    </FormLoadingStateContext.Provider>
  );
}

export function useFormLoadingState(fieldName: string) {
  const form = useContext(FormLoadingStateContext);

  if (!form) {
    throw new Error(
      "useFormLoadingState must be used within a FormLoadingState provider"
    );
  }

  const setLoading = useCallback(
    (value: boolean) => {
      form.setValue(value ? fieldName : undefined);
    },
    [fieldName, form.setValue]
  );

  return {
    isFormLoading: form.value !== undefined,
    isFieldLoading: form.value === fieldName,
    setLoading,
    clearLoading: () => form.setValue(undefined)
  };
}
