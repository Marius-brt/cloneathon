import { Badge } from "@/components/ui/badge";
import type { Attachment } from "@ai-sdk/ui-utils";
import { File, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useModels } from "../providers/models.provider";

export function FileList({
  files,
  setFiles
}: { files: Attachment[]; setFiles: (files: Attachment[]) => void }) {
  const { acceptedFileTypes } = useModels();

  const handleRemoveFile = useCallback(
    (file: Attachment) => {
      setFiles(files.filter((f) => f.name !== file.name));
    },
    [files, setFiles]
  );

  useEffect(() => {
    if (!acceptedFileTypes && files.length > 0) {
      setFiles([]);
    }
  }, [acceptedFileTypes, files, setFiles]);

  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 border-b bg-background p-2 max-sm:px-4 max-sm:pt-4">
      {Array.from(files).map((file) => (
        <Badge
          key={file.name}
          className="group [&_svg]:!pointer-events-auto flex items-center gap-1"
          variant={"secondary"}
        >
          <File className="!size-3.5 group-hover:hidden" />
          <X
            className="!size-3.5 hidden cursor-pointer group-hover:block"
            onClick={() => handleRemoveFile(file)}
          />
          <span className="max-w-[150px] truncate text-sm">{file.name}</span>
        </Badge>
      ))}
    </div>
  );
}
