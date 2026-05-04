"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomButton,
  CustomInput,
  CustomSelect,
} from "@/components";
import type {
  VehiclePayload,
  VehicleSummary,
  DialogMode,
  Status,
} from "@/types";
import {
  COMPANY_OWNER,
  EMPTY_DOCUMENT,
  PREDEFINED_DOCUMENTS,
} from "../../constants";
import {
  DIALOG_MODES,
  STATUSES,
  STATUS_COLORS,
  STATUS_STYLES,
  VEHICLE_TYPE,
} from "@/app/(private)/constants";
import { DocumentsData } from "./documents-data";
import {
  getDialogTitle,
  normalizeDate,
  getHighlightedFieldClassName,
} from "@/app/(private)/utils";
import DisplayWorkers from "@/app/(private)/components/display-workers";
import { useExtractDataFromDocuments } from "@/hooks";

export const mapVehicleToForm = (vehicle: VehicleSummary): VehiclePayload => ({
  license_plate: vehicle.license_plate,
  company_owner: vehicle.company_owner,
  vehicle_type: vehicle.vehicle_type,
  contract_start_date: normalizeDate(vehicle.contract_start_date),
  contract_end_date: normalizeDate(vehicle.contract_end_date),
  status: vehicle.status,
  notes: vehicle.notes ?? "",
  documents: [
    ...PREDEFINED_DOCUMENTS.map(
      (definition) =>
        vehicle.documents?.find((d) => d.document_key === definition.key) ??
        EMPTY_DOCUMENT(definition),
    ),
    ...(vehicle.documents
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

const VehicleDialog = ({
  open,
  mode,
  vehicle,
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
  vehicle: VehicleSummary | null;
  form: VehiclePayload;
  setForm: React.Dispatch<React.SetStateAction<VehiclePayload>>;
  pendingFiles: Record<string, File | null>;
  setPendingFiles: React.Dispatch<
    React.SetStateAction<Record<string, File | null>>
  >;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
}) => {
  const isViewMode = mode === DIALOG_MODES.VIEW;
  const { isExtractingData, highlightedFields, handleLoadDataFromDocuments } =
    useExtractDataFromDocuments({
      open,
      entityType: "Vehicle",
      form,
      pendingFiles,
      setForm,
    });

  const updateField = <K extends keyof VehiclePayload>(
    field: K,
    value: VehiclePayload[K],
  ) => setForm((current) => ({ ...current, [field]: value }));
  const companyOptions = Object.keys(COMPANY_OWNER);
  const typeOptions = Object.keys(VEHICLE_TYPE);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {getDialogTitle(mode, "Vehicle")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Vehicle data</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 xl:grid-cols-2">
              <CustomInput
                label="Plate"
                disabled={isViewMode}
                className={getHighlightedFieldClassName(
                  highlightedFields,
                  "license_plate",
                )}
                value={form.license_plate}
                onChange={(e) =>
                  updateField("license_plate", e.target.value.toUpperCase())
                }
              />
              <CustomSelect
                label="Status"
                disabled={isViewMode}
                valueSelect={form.status}
                onValueChange={(v) => updateField("status", v as Status)}
                options={STATUSES}
                triggerStyles={STATUS_STYLES}
                colors={STATUS_COLORS}
              />
              <CustomSelect
                label="Vehicle type"
                disabled={isViewMode}
                valueSelect={form.vehicle_type}
                onValueChange={(v) =>
                  updateField("vehicle_type", v as keyof typeof VEHICLE_TYPE)
                }
                options={typeOptions}
                triggerStyles={{ Dry: "", Reefer: "", Truck: "", Other: "" }}
                colors={{
                  Dry: "text-slate-700",
                  Reefer: "text-slate-700",
                  Truck: "text-slate-700",
                  Other: "text-slate-700",
                  Default: "text-slate-700",
                }}
              />
              <CustomSelect
                label="Company owner"
                disabled={isViewMode}
                valueSelect={form.company_owner}
                onValueChange={(v) =>
                  updateField("company_owner", v as keyof typeof COMPANY_OWNER)
                }
                options={companyOptions}
                triggerStyles={Object.fromEntries(
                  companyOptions.map((key) => [key, ""]),
                )}
                colors={Object.fromEntries(
                  companyOptions.map((key) => [key, "text-slate-700"]),
                )}
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

          <DisplayWorkers workers={vehicle?.current_workers} />

          <DocumentsData
            form={form}
            isViewMode={isViewMode}
            setForm={setForm}
            pendingFiles={pendingFiles}
            setPendingFiles={setPendingFiles}
            vehicle={vehicle}
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
                      ? "Create vehicle"
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

export { VehicleDialog };
