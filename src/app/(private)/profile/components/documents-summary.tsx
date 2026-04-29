import { API_BASE_URL } from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components";
import { CustomButton, ICONS } from "@/components/shared/custom-button";
import type { WorkerDocument } from "@/types";
import { FileText, ImageIcon } from "lucide-react";
import { getDocumentVisual, isImage } from "@/app/(private)/utils";

const DocumentsSummary = ({ documents }: { documents: WorkerDocument[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {documents.length ? (
          documents.map((document) => {
            const visual = getDocumentVisual(document.status);
            const StatusIcon = visual.icon;
            const Icon = isImage(document.mime_type) ? ImageIcon : FileText;
            const fileUrl = document.file_url
              ? `${API_BASE_URL}${document.file_url}`
              : null;

            return (
              <div
                key={`${document.document_key}-${document.document_id ?? document.worker_document_id ?? "placeholder"}`}
                className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-full bg-slate-100 p-2">
                    <Icon className="h-4 w-4 text-slate-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                      {document.document_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {document.document_key}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:justify-end">
                  <div>
                    <p className="text-xs text-slate-500">Expiry date</p>
                    <p className="text-sm font-medium">
                      {document.expiration_date
                        ? String(document.expiration_date).slice(0, 10)
                        : "-"}
                    </p>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${visual.badge}`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    <span>{document.status}</span>
                  </div>

                  {fileUrl && (
                    <a href={fileUrl} target="_blank" rel="noreferrer">
                      <CustomButton
                        variant="outline"
                        icon={ICONS.DOWNLOAD}
                        text="Download"
                      />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">
            No visible documents available.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export { DocumentsSummary };
