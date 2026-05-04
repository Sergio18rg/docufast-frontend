"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomButton } from "@/components";
import type {
  Worker,
  DialogMode,
  WorkerDocument,
  WorkerPayload,
} from "@/types";
import { PREDEFINED_DOCUMENTS, EMPTY_DOCUMENT } from "../../constants";
import { PersonalData } from "./personal-data";
import { CompanyData } from "./company-data";
import { DocumentsData } from "./documents-data";
import { getDialogTitle, normalizeDate } from "@/app/(private)/utils";
import { useExtractDataFromDocuments } from "@/hooks";

const normalizeWorkerDocuments = (documents: WorkerDocument[]) => {
  const predefined = PREDEFINED_DOCUMENTS.map((definition) => {
    const existing = documents.find(
      (document) => document.document_key === definition.key,
    );
    return existing
      ? {
          ...existing,
          issue_date: normalizeDate(existing.issue_date),
          expiration_date: normalizeDate(existing.expiration_date),
        }
      : EMPTY_DOCUMENT(definition);
  });

  const additional = documents
    .filter(
      (document) =>
        !PREDEFINED_DOCUMENTS.some(
          (item) => item.key === document.document_key,
        ),
    )
    .map((document) => ({
      ...document,
      issue_date: normalizeDate(document.issue_date),
      expiration_date: normalizeDate(document.expiration_date),
    }));

  return [...predefined, ...additional];
};

export const mapWorkerToForm = (worker: Worker): WorkerPayload => ({
  company_worker_code: worker.company_worker_code,
  first_name: worker.first_name,
  last_name_1: worker.last_name_1,
  last_name_2: worker.last_name_2 ?? "",
  email: worker.email ?? "",
  phone: worker.phone ?? "",
  document_number: worker.document_number ?? "",
  social_security_number: worker.social_security_number ?? "",
  birth_date: normalizeDate(worker.birth_date),
  address: worker.address ?? "",
  emergency_contact_name: worker.emergency_contact_name ?? "",
  emergency_contact_phone: worker.emergency_contact_phone ?? "",
  contract_start_date: normalizeDate(worker.contract_start_date),
  contract_end_date: normalizeDate(worker.contract_end_date),
  status: worker.status,
  notes: worker.notes ?? "",
  client_id: worker.client_id ?? null,
  current_vehicle_id: worker.current_vehicle_id ?? null,
  documents: normalizeWorkerDocuments(worker.documents),
});

export const buildPayload = (form: WorkerPayload): WorkerPayload => ({
  ...form,
  documents: form.documents.map((document) => ({
    ...document,
    issue_date: document.issue_date || new Date().toISOString().slice(0, 10),
    expiration_date:
      document.expiration_date || new Date().toISOString().slice(0, 10),
  })),
});

export const WorkerDialog = ({
  open,
  mode,
  worker,
  form,
  setForm,
  pendingFiles,
  setPendingFiles,
  isSaving,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: DialogMode;
  worker: Worker | null;
  form: WorkerPayload;
  setForm: React.Dispatch<React.SetStateAction<WorkerPayload>>;
  pendingFiles: Record<string, File | null>;
  setPendingFiles: React.Dispatch<
    React.SetStateAction<Record<string, File | null>>
  >;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
}) => {
  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";
  const textButtonCreateOrEdit = isCreateMode
    ? "Create worker"
    : "Save changes";

  const { isExtractingData, highlightedFields, handleLoadDataFromDocuments } =
    useExtractDataFromDocuments({
      open,
      entityType: "Worker",
      form,
      pendingFiles,
      setForm,
    });

  const updateField = <K extends keyof WorkerPayload>(
    field: K,
    value: WorkerPayload[K],
  ) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {getDialogTitle(mode)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <PersonalData
            form={form}
            isViewMode={isViewMode}
            highlightedFields={highlightedFields}
            updateField={updateField}
          />

          <CompanyData
            form={form}
            isViewMode={isViewMode}
            highlightedFields={highlightedFields}
            updateField={updateField}
            worker={worker}
          />

          <DocumentsData
            form={form}
            disabled={isSaving}
            isViewMode={isViewMode}
            setForm={setForm}
            pendingFiles={pendingFiles}
            setPendingFiles={setPendingFiles}
            worker={worker as Worker}
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
                text={isSaving ? "Saving..." : textButtonCreateOrEdit}
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
