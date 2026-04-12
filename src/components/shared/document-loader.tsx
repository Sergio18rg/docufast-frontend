import { Document } from "@/types";
import { Label } from "../ui/label";
import { CustomButton, ICONS } from "./custom-button";

const DocumentLoader = ({
  document,
  filePending,
  entityId,
  handleDocumentFileChange,
  handleInlineUpload,
}: {
  document: Document;
  filePending: File | null;
  entityId: number | null;
  handleDocumentFileChange: (documentKey: string, file: File | null) => void;
  handleInlineUpload: (document: Document) => void;
}) => {
  return (
    <div className="space-y-2 xl:col-span-4">
      <Label>{document.is_predefined ? "Update file" : "Upload file"}</Label>
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="min-h-9 flex-1 rounded-md border px-3 py-2 text-sm text-slate-600">
          {filePending?.name ?? document.file_name ?? "No file selected"}
        </div>
        <input
          id={`file-${document.document_key}`}
          type="file"
          className="hidden"
          onChange={(e) =>
            handleDocumentFileChange(
              document.document_key,
              e.target.files?.[0] ?? null,
            )
          }
        />
        <CustomButton
          text="Choose file"
          variant="outline"
          onClick={() =>
            (
              globalThis.document?.getElementById(
                `file-${document.document_key}`,
              ) as HTMLInputElement | null
            )?.click()
          }
          icon={ICONS.FILE}
        />
        {!!entityId && (
          <CustomButton
            text="Upload"
            disabled={!filePending}
            onClick={() => handleInlineUpload(document)}
            icon={ICONS.UPLOAD}
          />
        )}
      </div>
    </div>
  );
};

export { DocumentLoader };
