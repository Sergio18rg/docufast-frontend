import type { Worker } from "@/types";
import { ICONS } from "@/components/shared/custom-button";
import { PREDEFINED_DOCUMENTS } from "../constants";
import { DOCUMENT_STATUS } from "../../constants";
import {
  clientBadgeStyle,
  getDocumentByKey,
  getDocumentVisual,
  vehicleBadgeStyle,
} from "../../utils";
import { mapClientWorkerDocumentsForTable } from "../utils";

type UseTableRowsParams = {
  openViewDialog: (worker: Worker) => void;
  openEditDialog: (worker: Worker) => void;
  handleRestore: (worker: Worker) => void;
  handleDelete: (worker: Worker) => void;
};

const useTableRows = ({
  openViewDialog,
  openEditDialog,
  handleRestore,
  handleDelete,
}: UseTableRowsParams) => {
  const EXTERNAL_TABLE_ROWS = {
    ID: "worker_id",
    ROW_ACTION: (worker: Worker) => openViewDialog(worker),
    COLUMN_DEFINITION: [
      {
        key: "first_name",
        getProps: (worker: Worker) => ({
          primaryText: `${worker.first_name} ${worker.last_name_1}`,
        }),
      },
      {
        key: "document_number",
        getProps: (worker: Worker) => ({
          primaryText: worker.document_number,
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
          documents: mapClientWorkerDocumentsForTable(worker),
        }),
      },
    ],
  };

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

  return { EXTERNAL_TABLE_ROWS, TABLE_ROWS };
};

export { useTableRows };
