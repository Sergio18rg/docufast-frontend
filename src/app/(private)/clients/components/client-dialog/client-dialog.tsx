"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomButton,
  CustomInput,
  CustomSelect,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ErrorMessage,
  Label,
} from "@/components";
import {
  DIALOG_MODES,
  STATUSES,
  STATUS_COLORS,
  STATUS_STYLES,
} from "@/app/(private)/constants";
import {
  getDialogTitle,
  normalizeDate,
  getHighlightedFieldClassName,
} from "@/app/(private)/utils";
import type { ClientPayload, ClientSummary, DialogMode, Status } from "@/types";
import { EMPTY_DOCUMENT, PREDEFINED_DOCUMENTS } from "../../constants";
import { DocumentsData } from "./documents-data";
import DisplayWorkers from "@/app/(private)/components/display-workers";
import { useExtractDataFromDocuments } from "@/hooks";

export const mapClientToForm = (client: ClientSummary): ClientPayload => ({
  client_code: client.client_code,
  business_name: client.business_name,
  contact_email: client.contact_email || "",
  contact_phone: client.contact_phone || "",
  badge_color: client.badge_color,
  contract_start_date: normalizeDate(client.contract_start_date),
  contract_end_date: normalizeDate(client.contract_end_date),
  status: client.status,
  notes: client.notes ?? "",
  documents: [
    ...PREDEFINED_DOCUMENTS.map(
      (definition) =>
        client.documents?.find((d) => d.document_key === definition.key) ??
        EMPTY_DOCUMENT(definition),
    ),
    ...(client.documents
      ?.filter(
        (d) => !PREDEFINED_DOCUMENTS.some((p) => p.key === d.document_key),
      )
      .map((d) => ({
        ...d,
        issue_date: normalizeDate(d.issue_date),
        expiration_date: normalizeDate(d.expiration_date),
      })) ?? []),
  ],
});

const ClientDialog = ({
  open,
  mode,
  client,
  form,
  setForm,
  pendingFiles,
  setPendingFiles,
  isSaving,
  onClose,
  onSubmit,
  errorMessage,
}: {
  open: boolean;
  mode: DialogMode;
  client: ClientSummary | null;
  form: ClientPayload;
  setForm: React.Dispatch<React.SetStateAction<ClientPayload>>;
  pendingFiles: Record<string, File | null>;
  setPendingFiles: React.Dispatch<
    React.SetStateAction<Record<string, File | null>>
  >;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
  errorMessage?: string;
}) => {
  const isViewMode = mode === DIALOG_MODES.VIEW;
  const { isExtractingData, highlightedFields, handleLoadDataFromDocuments } =
    useExtractDataFromDocuments({
      open,
      entityType: "Client",
      form,
      pendingFiles,
      setForm,
    });

  const updateField = <K extends keyof ClientPayload>(
    field: K,
    value: ClientPayload[K],
  ) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl pt-0">
        <DialogHeader className="sticky top-0 z-10 bg-white pb-4 pt-4">
          <DialogTitle className="text-2xl font-semibold pl-2">
            {getDialogTitle(mode, "Client")}
          </DialogTitle>
          {errorMessage && <ErrorMessage message={errorMessage} />}
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Client data</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 xl:grid-cols-2">
              <CustomInput
                label="ID"
                disabled={isViewMode}
                value={form.client_code}
                onChange={(e) =>
                  updateField("client_code", e.target.value.toUpperCase())
                }
              />
              <CustomInput
                label="Name"
                disabled={isViewMode}
                className={getHighlightedFieldClassName(
                  highlightedFields,
                  "business_name",
                )}
                value={form.business_name}
                onChange={(e) => updateField("business_name", e.target.value)}
              />
              <CustomInput
                label="Email"
                disabled={isViewMode}
                value={form.contact_email}
                onChange={(e) => updateField("contact_email", e.target.value)}
              />
              <CustomInput
                label="Phone"
                disabled={isViewMode}
                value={form.contact_phone || ""}
                onChange={(e) => updateField("contact_phone", e.target.value)}
              />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Corporate color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    disabled={isViewMode}
                    value={form.badge_color}
                    onChange={(e) => updateField("badge_color", e.target.value)}
                    className="h-10 w-14 rounded-md border bg-transparent"
                  />
                  <CustomInput
                    label=""
                    disabled
                    value={form.badge_color}
                    wrapperStyle="flex-1 space-y-0"
                  />
                </div>
              </div>
              <CustomSelect
                label="Status"
                disabled={isViewMode}
                valueSelect={form.status}
                onValueChange={(v) => updateField("status", v as Status)}
                options={STATUSES}
                triggerStyles={STATUS_STYLES}
                colors={STATUS_COLORS}
              />
              <CustomInput
                label="Contract start"
                type="date"
                disabled={isViewMode}
                className={getHighlightedFieldClassName(
                  highlightedFields,
                  "contract_start_date",
                )}
                value={form.contract_start_date || ""}
                onChange={(e) =>
                  updateField("contract_start_date", e.target.value)
                }
              />
              <CustomInput
                label="Contract end"
                type="date"
                disabled={isViewMode}
                className={getHighlightedFieldClassName(
                  highlightedFields,
                  "contract_end_date",
                )}
                value={form.contract_end_date || ""}
                onChange={(e) =>
                  updateField("contract_end_date", e.target.value)
                }
              />
              <CustomInput
                label="Notes"
                disabled={isViewMode}
                wrapperStyle="space-y-2 xl:col-span-2"
                value={form.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </CardContent>
          </Card>

          <DisplayWorkers workers={client?.current_workers} />

          <DocumentsData
            form={form}
            isViewMode={isViewMode}
            setForm={setForm}
            pendingFiles={pendingFiles}
            setPendingFiles={setPendingFiles}
            client={client}
            highlightedFields={highlightedFields}
            isExtractingData={isExtractingData}
            onLoadDataFromDocuments={() => void handleLoadDataFromDocuments()}
          />

          <div className="flex justify-end gap-3">
            <CustomButton
              text={isViewMode ? "Close" : "Cancel"}
              variant="outline"
              onClick={onClose}
            />
            {!isViewMode && (
              <CustomButton
                text={
                  isSaving
                    ? "Saving..."
                    : mode === DIALOG_MODES.CREATE
                      ? "Create client"
                      : "Save changes"
                }
                onClick={() => void onSubmit()}
                disabled={isSaving}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ClientDialog };
