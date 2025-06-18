"use client";

import { useModels } from "@/components/providers/models.provider";
import { Button } from "@/components/ui/button";
import type { Attachment } from "@ai-sdk/ui-utils";
import { Plus } from "lucide-react";
import { type ChangeEvent, useCallback, useRef } from "react";

const MAX_FILES = 4;

async function getBase64(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result?.toString().split(",")[1]);
    reader.readAsDataURL(file);
  });
}

export function FileBtn({
  files,
  setFiles
}: {
  files: Attachment[];
  setFiles: (files: Attachment[]) => void;
}) {
  const { acceptedFileTypes } = useModels();

  const ref = useRef<HTMLInputElement>(null);

  const openFileDialog = useCallback(() => {
    ref.current?.click();
  }, []);

  const onChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length || files.length + e.target.files.length > MAX_FILES) {
        return;
      }

      const newFiles: Attachment[] = [];
      for (const file of e.target.files) {
        const base64 = await getBase64(file);

        newFiles.push({
          name: file.name,
          contentType: file.type,
          url: `data:${file.type};base64,${base64}`
        });
      }

      setFiles([...files, ...newFiles]);
    },
    [files, setFiles]
  );

  return (
    <>
      <Button
        size={"icon"}
        variant={"outline"}
        type="button"
        className="hover:!bg-popover !size-8 [&_svg]:!size-3.5 rounded-lg bg-muted dark:bg-transparent"
        icon={Plus}
        disabled={!!(files && files.length >= MAX_FILES) || !acceptedFileTypes}
        onClick={openFileDialog}
        aria-label="Upload file"
      />
      {acceptedFileTypes && (
        <input
          type="file"
          multiple
          className="sr-only"
          aria-label="Upload file"
          accept={acceptedFileTypes}
          onChange={onChange}
          ref={ref}
        />
      )}
    </>
  );
}
