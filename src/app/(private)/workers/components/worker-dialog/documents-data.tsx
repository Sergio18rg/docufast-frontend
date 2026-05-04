import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomButton,
  CustomInput,
  CustomSelect,
  ICONS,
  Label,
} from "@/components";
import { SecurityLevel, Worker, WorkerDocument, WorkerPayload } from "@/types";
import { EMPTY_DOCUMENT } from "../../constants";
import { FileText, ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks";
import {
  removeWorkerDocument,
  uploadWorkerDocument,
} from "@/services/workers.service";
import { mapWorkerToForm } from "./worker-dialog";
import { API_BASE_URL } from "@/services";
import { DocumentLoader } from "@/components/shared/document-loader";
import {
  getDocumentVisual,
  isImage,
  getHighlightedFieldClassName,
} from "@/app/(private)/utils";
import {
  DOCUMENT_STATUS,
  SECURITY_LEVEL_COLORS,
  SECURITY_LEVEL_STYLES,
  SECURITY_LEVELS,
} from "@/app/(private)/constants";

const DocumentsData = ({
  form,
  disabled,
  isViewMode,
  setForm,
  pendingFiles,
  setPendingFiles,
  worker,
  highlightedFields = {},
  isExtractingData = false,
  onLoadDataFromDocuments,
}: {
  form: WorkerPayload;
  disabled?: boolean;
  isViewMode: boolean;
  setForm: React.Dispatch<React.SetStateAction<WorkerPayload>>;
  pendingFiles: Record<string, File | null>;
  setPendingFiles: React.Dispatch<
    React.SetStateAction<Record<string, File | null>>
  >;
  worker: Worker;
  highlightedFields?: Record<string, boolean>;
  isExtractingData?: boolean;
  onLoadDataFromDocuments?: () => void;
}) => {
  const { token } = useAuth();

  const handleAddAdditionalDocument = () => {
    if (isViewMode) return;
    setForm((current) => ({
      ...current,
      documents: [...current.documents, EMPTY_DOCUMENT()],
    }));
  };

  const handleDocumentFileChange = (documentKey: string, file: File | null) => {
    if (isViewMode) return;
    setPendingFiles((current) => ({ ...current, [documentKey]: file }));
  };

  const handleRemoveDocument = async (document: WorkerDocument) => {
    if (isViewMode) return;

    if (worker?.worker_id && document.worker_document_id && token) {
      const response = await removeWorkerDocument(
        token,
        worker.worker_id,
        document.worker_document_id,
      );
      setForm(mapWorkerToForm(response.data));
      return;
    }

    setForm((current) => ({
      ...current,
      documents: current.documents.filter(
        (item) => item.document_key !== document.document_key,
      ),
    }));
  };

  const updateDocument = (
    documentKey: string,
    patch: Partial<WorkerDocument>,
  ) =>
    setForm((current) => ({
      ...current,
      documents: current.documents.map((document) =>
        document.document_key === documentKey
          ? { ...document, ...patch }
          : document,
      ),
    }));

  const handleInlineUpload = async (document: WorkerDocument) => {
    const file = pendingFiles[document.document_key];

    if (!worker?.worker_id || !token || !file) return;

    const response = await uploadWorkerDocument(token, {
      workerId: worker.worker_id,
      document,
      file,
    });

    setForm(mapWorkerToForm(response.data));
    setPendingFiles((current) => ({
      ...current,
      [document.document_key]: null,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-xl">Documents</CardTitle>
          {!isViewMode && (
            <div className="flex items-center gap-2">
              <CustomButton
                text={
                  isExtractingData ? "Loading..." : "Load data from documents"
                }
                variant="outline"
                icon={ICONS.UPLOAD}
                onClick={onLoadDataFromDocuments}
                disabled={isExtractingData}
              />
              <CustomButton
                text="Add additional document"
                icon={ICONS.ADD}
                onClick={handleAddAdditionalDocument}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {form.documents.map((document) => {
          const visual = getDocumentVisual(document.status);
          const Icon =
            document.document_key === "worker_photo" ||
            isImage(document.mime_type)
              ? ImageIcon
              : FileText;
          const StatusIcon = visual.icon;
          const filePending = pendingFiles[document.document_key];

          const canRemove = document.is_predefined
            ? document.status !== DOCUMENT_STATUS.NOT_UPLOADED &&
              Boolean(document.file_url || document.worker_document_id)
            : true;

          return (
            <div
              key={document.document_key}
              className="space-y-4 rounded-xl border p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-slate-100 p-2">
                    <Icon className="h-4 w-4 text-slate-700" />
                  </div>
                  <div>
                    <p
                      className={`text-base ${document.is_predefined ? "font-bold" : "font-medium"}`}
                    >
                      {document.document_name || "Additional document"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {document.is_predefined ? "Predefined" : "Additional"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {document.file_url && (
                    <a
                      href={`${API_BASE_URL}${document.file_url}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <CustomButton
                        variant="outline"
                        size="sm"
                        icon={ICONS.DOWNLOAD}
                        text="Download"
                      />
                    </a>
                  )}
                  {!isViewMode && canRemove && (
                    <CustomButton
                      variant="outline"
                      size="sm"
                      icon={ICONS.DOWNLOAD}
                      text={document.is_predefined ? "Remove file" : "Remove"}
                      onClick={() => void handleRemoveDocument(document)}
                    />
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <CustomInput
                  label="Type"
                  disabled
                  value={
                    document.is_predefined
                      ? document.document_name
                      : "Additional"
                  }
                />
                <CustomInput
                  label="Name"
                  disabled={disabled || document.is_predefined}
                  value={document.document_name}
                  onChange={(e) =>
                    updateDocument(document.document_key, {
                      document_name: e.target.value,
                    })
                  }
                />
                <CustomSelect
                  label="Security level"
                  disabled={isViewMode}
                  valueSelect={document.security_level}
                  onValueChange={(value) =>
                    updateDocument(document.document_key, {
                      security_level: value as SecurityLevel,
                    })
                  }
                  options={SECURITY_LEVELS}
                  triggerStyles={SECURITY_LEVEL_STYLES}
                  colors={SECURITY_LEVEL_COLORS}
                />
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div
                    className={`flex h-9 items-center gap-2 rounded-md border px-3 py-2 text-sm ${visual.badge}`}
                  >
                    <StatusIcon className={`h-4 w-4 ${visual.color}`} />
                    {document.status}
                  </div>
                </div>
                <CustomInput
                  label="Issue Date"
                  type="date"
                  disabled={isViewMode}
                  className={getHighlightedFieldClassName(
                    highlightedFields,
                    `document:${document.document_key}:issue_date`,
                  )}
                  value={document.issue_date || ""}
                  onChange={(e) =>
                    updateDocument(document.document_key, {
                      issue_date: e.target.value,
                    })
                  }
                />
                <CustomInput
                  label="Expiry Date"
                  disabled={isViewMode}
                  type="date"
                  className={getHighlightedFieldClassName(
                    highlightedFields,
                    `document:${document.document_key}:expiration_date`,
                  )}
                  value={document.expiration_date || ""}
                  onChange={(e) =>
                    updateDocument(document.document_key, {
                      expiration_date: e.target.value,
                    })
                  }
                />
                <CustomInput
                  label="Notes"
                  wrapperStyle="space-y-2 xl:col-span-2"
                  disabled={isViewMode}
                  value={document.notes || ""}
                  onChange={(e) =>
                    updateDocument(document.document_key, {
                      notes: e.target.value,
                    })
                  }
                />
                {!isViewMode && (
                  <DocumentLoader
                    document={document}
                    filePending={filePending}
                    entityId={worker?.worker_id ?? null}
                    handleDocumentFileChange={handleDocumentFileChange}
                    handleInlineUpload={handleInlineUpload}
                  />
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export { DocumentsData };
