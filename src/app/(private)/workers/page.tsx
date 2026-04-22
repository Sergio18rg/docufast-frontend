"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildPayload, mapWorkerToForm, WorkerDialog } from "./components";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks";
import {
  createWorker,
  deleteWorker,
  getWorkers,
  restoreWorker,
  updateWorker,
  uploadWorkerDocument,
} from "@/services";
import type { Worker, DialogMode, WorkerPayload } from "@/types";
import { PREDEFINED_DOCUMENTS, EMPTY_FORM, TABLE } from "./constants";
import { CustomButton, ICONS } from "@/components/shared/custom-button";
import { SearchBar } from "@/components/shared/search-bar";
import { CustomTable, Title, ToggleButton } from "@/components";
import { DIALOG_MODES, DOCUMENT_STATUS } from "../constants";
import {
  clientBadgeStyle,
  getDocumentByKey,
  getDocumentVisual,
  vehicleBadgeStyle,
} from "../utils";

const WorkersPage = () => {
  const { token } = useAuth();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(DIALOG_MODES.CREATE);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [form, setForm] = useState<WorkerPayload>(EMPTY_FORM);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File | null>>(
    {},
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showActive, setShowActive] = useState(true);
  const fetchedTokenRef = useRef<string | null>(null);

  const loadWorkers = async (currentToken = token) => {
    if (!currentToken) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await getWorkers(currentToken);
      setWorkers(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load workers",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isTokenInvalidOrAlreadyLoaded =
      !token || fetchedTokenRef.current === token;
    if (isTokenInvalidOrAlreadyLoaded) return;
    fetchedTokenRef.current = token;
    loadWorkers(token);
  }, [token]);

  const openCreateDialog = () => {
    setDialogMode(DIALOG_MODES.CREATE);
    setSelectedWorker(null);
    setForm(EMPTY_FORM);
    setPendingFiles({});
    setDialogOpen(true);
  };

  const openEditDialog = (worker: Worker) => {
    setDialogMode(DIALOG_MODES.EDIT);
    setSelectedWorker(worker);
    setForm(mapWorkerToForm(worker));
    setPendingFiles({});
    setDialogOpen(true);
  };

  const openViewDialog = (worker: Worker) => {
    setDialogMode(DIALOG_MODES.VIEW);
    setSelectedWorker(worker);
    setForm(mapWorkerToForm(worker));
    setPendingFiles({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedWorker(null);
    setForm(EMPTY_FORM);
    setPendingFiles({});
  };

  const handleSubmit = async () => {
    if (!token) return;
    setIsSaving(true);
    setErrorMessage("");
    try {
      const payload = buildPayload(form);
      const workerResponse =
        dialogMode === DIALOG_MODES.EDIT && selectedWorker
          ? await updateWorker(token, selectedWorker.worker_id, payload)
          : await createWorker(token, payload);

      let currentWorker = workerResponse.data;
      for (const document of payload.documents) {
        const selectedFile = pendingFiles[document.document_key];
        if (!selectedFile) continue;
        const uploadResponse = await uploadWorkerDocument(token, {
          workerId: currentWorker.worker_id,
          document,
          file: selectedFile,
        });
        currentWorker = uploadResponse.data;
      }

      closeDialog();
      await loadWorkers(token);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save worker",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestore = async (worker: Worker) => {
    if (!token) return;
    try {
      await restoreWorker(token, worker.worker_id);
      await loadWorkers(token);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to restore worker",
      );
    }
  };

  const handleDelete = async (worker: Worker) => {
    if (!token) return;
    if (
      !globalThis.confirm(
        `Mark ${worker.first_name} ${worker.last_name_1} as inactive?`,
      )
    )
      return;
    try {
      await deleteWorker(token, worker.worker_id);
      await loadWorkers(token);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update worker status",
      );
    }
  };

  const filteredWorkers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return workers.filter((worker) => {
      const matchesStatus = showActive
        ? worker.status === "Active"
        : worker.status === "Inactive";
      if (!matchesStatus) return false;
      if (!normalizedSearch) return true;

      const fullName =
        `${worker.first_name} ${worker.last_name_1} ${worker.last_name_2 ?? ""}`.toLowerCase();
      const documentNumber = (worker.document_number ?? "").toLowerCase();
      const companyCode = worker.company_worker_code.toLowerCase();

      return (
        fullName.includes(normalizedSearch) ||
        documentNumber.includes(normalizedSearch) ||
        companyCode.includes(normalizedSearch)
      );
    });
  }, [workers, searchTerm, showActive]);

  const TABLE_ROWS = {
    ID: "worker_id",
    ROW_ACTION: (worker: Worker) => openViewDialog(worker),
    COLUMN_DEFINITION: [
      {
        key: "first_name",
        getProps: (worker: Worker) => ({
          primaryText: `${worker.first_name} ${worker.last_name_1}`,
          helperText: worker.email || "No email",
        }),
      },
      {
        key: "document_number",
        getProps: (worker: Worker) => ({
          primaryText: worker.document_number,
        }),
      },
      {
        key: "company_worker_code",
        getProps: (worker: Worker) => ({
          primaryText: worker.company_worker_code,
        }),
      },
      {
        key: "business_name",
        render: "BadgeCell",
        getProps: (worker: Worker) => ({
          text: worker.client?.business_name,
          style: worker.client
            ? clientBadgeStyle(worker.client.badge_color)
            : undefined,
        }),
      },
      {
        key: "license_plate",
        getProps: (worker: Worker) => ({
          primaryText: worker.current_vehicle?.license_plate,
        }),
      },
      {
        key: "vehicle_type",
        render: "BadgeCell",
        getProps: (worker: Worker) => ({
          text: worker.current_vehicle?.vehicle_type,
          style: worker.current_vehicle
            ? vehicleBadgeStyle(worker.current_vehicle.vehicle_type)
            : undefined,
        }),
      },
      {
        key: "documents",
        render: "DocumentsCell",
        getProps: (worker: Worker) => ({
          documents: PREDEFINED_DOCUMENTS.map((definition) => {
            const document = getDocumentByKey(
              worker.documents,
              definition.key,
            ) ?? {
              status: DOCUMENT_STATUS.NOT_UPLOADED,
            };
            const visual = getDocumentVisual(document.status);
            return {
              key: definition.key,
              label: definition.shortLabel,
              icon: visual.icon,
              color: visual.color,
            };
          }),
        }),
      },
    ],
    ACTIONS: {
      onEdit: (worker: Worker) => openEditDialog(worker),
      onDelete: (worker: Worker) =>
        worker.status === "Inactive"
          ? handleRestore(worker)
          : handleDelete(worker),
      getDeleteIcon: (worker: Worker) =>
        worker.status === "Inactive" ? ICONS.RESTORE : ICONS.DELETE,
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <Title
          title="Workers"
          description="Workers management with company data and controlled documentation."
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            placeholder="Search by name, identity document or company ID"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <ToggleButton enabled={showActive} setEnabled={setShowActive} />
          <CustomButton
            text="Add Worker"
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
            tableData={filteredWorkers}
            isLoading={isLoading}
            tableRows={TABLE_ROWS}
          />
        </CardContent>
      </Card>

      <WorkerDialog
        open={dialogOpen}
        mode={dialogMode}
        worker={selectedWorker}
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

export default WorkersPage;
