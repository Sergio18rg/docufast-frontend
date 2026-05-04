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
import type {
  ClientDocument,
  ClientPayload,
  ClientSummary,
  SecurityLevel,
} from "@/types";
import { useAuth } from "@/hooks";
import { API_BASE_URL } from "@/services";
import {
  removeClientDocument,
  uploadClientDocument,
} from "@/services/clients.service";
import { DocumentLoader } from "@/components/shared/document-loader";
import { FileText, ImageIcon } from "lucide-react";
import {
  SECURITY_LEVEL_COLORS,
  SECURITY_LEVEL_STYLES,
  SECURITY_LEVELS,
} from "@/app/(private)/constants";
import {
  getDocumentVisual,
  isImage,
  getHighlightedFieldClassName,
} from "@/app/(private)/utils";
import { EMPTY_DOCUMENT } from "../../constants";
import { mapClientToForm } from "./client-dialog";

const DocumentsData = ({
  form,
  isViewMode,
  setForm,
  pendingFiles,
  setPendingFiles,
  client,
  highlightedFields = {},
  isExtractingData = false,
  onLoadDataFromDocuments,
}: {
  form: ClientPayload;
  isViewMode: boolean;
  setForm: React.Dispatch<React.SetStateAction<ClientPayload>>;
  pendingFiles: Record<string, File | null>;
  setPendingFiles: React.Dispatch<
    React.SetStateAction<Record<string, File | null>>
  >;
  client: ClientSummary | null;
  highlightedFields?: Record<string, boolean>;
  isExtractingData?: boolean;
  onLoadDataFromDocuments?: () => void;
}) => {
  const { token } = useAuth();

  const updateDocument = (
    documentKey: string,
    patch: Partial<ClientDocument>,
  ) =>
    setForm((current) => ({
      ...current,
      documents: current.documents.map((document) =>
        document.document_key === documentKey
          ? { ...document, ...patch }
          : document,
      ),
    }));

  const handleAddAdditionalDocument = () => {
    if (!isViewMode)
      setForm((c) => ({ ...c, documents: [...c.documents, EMPTY_DOCUMENT()] }));
  };

  const handleDocumentFileChange = (documentKey: string, file: File | null) => {
    if (!isViewMode) setPendingFiles((c) => ({ ...c, [documentKey]: file }));
  };

  const handleInlineUpload = async (document: ClientDocument) => {
    if (!token || !client?.client_id) return;

    const selectedFile = pendingFiles[document.document_key];
    if (!selectedFile) return;

    const response = await uploadClientDocument(token, {
      clientId: client.client_id,
      document,
      file: selectedFile,
    });

    setForm(mapClientToForm(response.data));
    setPendingFiles((c) => ({ ...c, [document.document_key]: null }));
  };

  const handleRemoveDocument = async (document: ClientDocument) => {
    if (isViewMode) return;

    if (!document.client_document_id) {
      setForm((current) => ({
        ...current,
        documents: document.is_predefined
          ? current.documents.map((doc) =>
              doc.document_key === document.document_key
                ? EMPTY_DOCUMENT({
                    key: doc.document_key,
                    name: doc.document_name,
                  })
                : doc,
            )
          : current.documents.filter(
              (doc) => doc.document_key !== document.document_key,
            ),
      }));
      setPendingFiles((current) => ({
        ...current,
        [document.document_key]: null,
      }));
      return;
    }

    if (!token || !client?.client_id) return;

    const response = await removeClientDocument(
      token,
      client.client_id,
      document.client_document_id,
    );
    setForm(mapClientToForm(response.data));
    setPendingFiles((current) => ({
      ...current,
      [document.document_key]: null,
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
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
              text="Add additional"
              variant="outline"
              icon={ICONS.ADD}
              onClick={handleAddAdditionalDocument}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {form.documents.map((document) => {
          const visual = getDocumentVisual(document.status);
          const Icon =
            document.file_name && isImage(document.mime_type)
              ? ImageIcon
              : FileText;
          const StatusIcon = visual.icon;
          const disabled = isViewMode;
          const filePending = pendingFiles[document.document_key] ?? null;
          const canRemove = document.is_predefined
            ? Boolean(document.client_document_id)
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
                  type="date"
                  disabled={isViewMode}
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
                    entityId={client?.client_id ?? null}
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
