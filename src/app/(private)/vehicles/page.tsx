"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CustomTable,
  SearchBar,
  Title,
  ToggleButton,
} from "@/components";
import { CustomButton, ICONS } from "@/components/shared/custom-button";
import { useAuth } from "@/hooks";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  restoreVehicle,
  updateVehicle,
  uploadVehicleDocument,
} from "@/services";
import type { DialogMode, VehiclePayload, VehicleSummary } from "@/types";
import { EMPTY_FORM, PREDEFINED_DOCUMENTS, TABLE } from "./constants";
import { companyBadgeStyle } from "./utils";
import { VehicleDialog, mapVehicleToForm } from "./components";
import { DIALOG_MODES, STATUS } from "../constants";
import {
  buildDocumentPayload,
  mapDocumentsForTable,
  vehicleBadgeStyle,
} from "../utils";

const VehiclesPage = () => {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(DIALOG_MODES.CREATE);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSummary | null>(
    null,
  );
  const [form, setForm] = useState<VehiclePayload>(EMPTY_FORM);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File | null>>(
    {},
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showActive, setShowActive] = useState(true);
  const fetchedTokenRef = useRef<string | null>(null);

  const loadVehicles = async (currentToken = token) => {
    if (!currentToken) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await getVehicles(currentToken);
      setVehicles(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load vehicles",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token || fetchedTokenRef.current === token) return;
    fetchedTokenRef.current = token;
    loadVehicles(token);
  }, [token]);

  const openCreateDialog = () => {
    setDialogMode(DIALOG_MODES.CREATE);
    setSelectedVehicle(null);
    setForm(EMPTY_FORM);
    setPendingFiles({});
    setDialogOpen(true);
  };

  const openEditDialog = (vehicle: VehicleSummary) => {
    setDialogMode(DIALOG_MODES.EDIT);
    setSelectedVehicle(vehicle);
    setForm(mapVehicleToForm(vehicle));
    setPendingFiles({});
    setDialogOpen(true);
  };
  const openViewDialog = (vehicle: VehicleSummary) => {
    setDialogMode(DIALOG_MODES.VIEW);
    setSelectedVehicle(vehicle);
    setForm(mapVehicleToForm(vehicle));
    setPendingFiles({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedVehicle(null);
    setForm(EMPTY_FORM);
    setPendingFiles({});
  };

  const handleSubmit = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      const payload = buildDocumentPayload(form);
      let currentVehicle =
        dialogMode === DIALOG_MODES.EDIT && selectedVehicle
          ? (await updateVehicle(token, selectedVehicle.vehicle_id, payload))
              .data
          : (await createVehicle(token, payload)).data;
      for (const document of payload.documents) {
        const selectedFile = pendingFiles[document.document_key];
        if (!selectedFile) continue;
        const uploadResponse = await uploadVehicleDocument(token, {
          vehicleId: currentVehicle.vehicle_id,
          document,
          file: selectedFile,
        });
        currentVehicle = uploadResponse.data;
      }
      closeDialog();
      await loadVehicles(token);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save vehicle",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (vehicle: VehicleSummary) => {
    if (!token) return;
    if (!globalThis.confirm(`Mark ${vehicle.license_plate} as inactive?`))
      return;
    try {
      await deleteVehicle(token, vehicle.vehicle_id);
      await loadVehicles(token);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update vehicle status",
      );
    }
  };

  const handleRestore = async (vehicle: VehicleSummary) => {
    if (!token) return;
    try {
      await restoreVehicle(token, vehicle.vehicle_id);
      await loadVehicles(token);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to restore vehicle",
      );
    }
  };

  const filteredVehicles = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      const matchesStatus = showActive
        ? vehicle.status === STATUS.ACTIVE
        : vehicle.status === STATUS.INACTIVE;
      if (!matchesStatus) return false;
      if (!search) return true;
      const workers = (vehicle.current_workers ?? [])
        .map((worker) => worker.full_name.toLowerCase())
        .join(" ");
      return (
        vehicle.license_plate.toLowerCase().includes(search) ||
        vehicle.company_owner.toLowerCase().includes(search) ||
        workers.includes(search)
      );
    });
  }, [vehicles, searchTerm, showActive]);

  const TABLE_ROWS = {
    ID: "vehicle_id",
    ROW_ACTION: (vehicle: VehicleSummary) => openViewDialog(vehicle),
    COLUMN_DEFINITION: [
      {
        key: "license_plate",
        getProps: (vehicle: VehicleSummary) => ({
          primaryText: vehicle.license_plate,
        }),
      },
      {
        key: "company_owner",
        render: "BadgeCell",
        getProps: (vehicle: VehicleSummary) => ({
          text: vehicle.company_owner,
          style: companyBadgeStyle(vehicle.company_owner),
        }),
      },
      {
        key: "vehicle_type",
        render: "BadgeCell",
        getProps: (vehicle: VehicleSummary) => ({
          text: vehicle.vehicle_type,
          style: vehicleBadgeStyle(vehicle.vehicle_type),
        }),
      },
      {
        key: "workers",
        getProps: (vehicle: VehicleSummary) => ({
          primaryText:
            vehicle.current_workers
              ?.map((worker) => worker.full_name)
              .join(", ") || "-",
        }),
      },
      {
        key: "documents",
        render: "DocumentsCell",
        getProps: (vehicle: VehicleSummary) => ({
          documents: mapDocumentsForTable(
            vehicle.documents,
            PREDEFINED_DOCUMENTS,
          ),
        }),
      },
    ],
    ACTIONS: {
      onEdit: (vehicle: VehicleSummary) => openEditDialog(vehicle),
      onDelete: (vehicle: VehicleSummary) =>
        vehicle.status === STATUS.INACTIVE
          ? handleRestore(vehicle)
          : handleDelete(vehicle),
      getDeleteIcon: (vehicle: VehicleSummary) =>
        vehicle.status === STATUS.INACTIVE ? ICONS.RESTORE : ICONS.DELETE,
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <Title
          title="Vehicles"
          description="Vehicles management with assignments and controlled documentation."
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            placeholder="Search by vehicle ID, company or worker"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <ToggleButton enabled={showActive} setEnabled={setShowActive} />
          <CustomButton
            text="Add vehicle"
            icon={ICONS.ADD}
            onClick={openCreateDialog}
          />
        </div>
      </div>
      {errorMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}
      <Card>
        <CardContent className="pt-6">
          <CustomTable
            headers={TABLE.HEADERS}
            tableData={filteredVehicles}
            isLoading={isLoading}
            tableRows={TABLE_ROWS}
          />
        </CardContent>
      </Card>
      <VehicleDialog
        open={dialogOpen}
        mode={dialogMode}
        vehicle={selectedVehicle}
        form={form}
        setForm={setForm}
        pendingFiles={pendingFiles}
        setPendingFiles={setPendingFiles}
        isSaving={isSaving}
        onClose={closeDialog}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default VehiclesPage;
