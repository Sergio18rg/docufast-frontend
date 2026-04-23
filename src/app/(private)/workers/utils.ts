import { DOCUMENT_STATUS } from "../constants";
import { getDocumentByKey, getDocumentVisual } from "../utils";
import { PREDEFINED_DOCUMENTS } from "./constants";
import { Worker } from "@/types";

const filterClientVisibleDocuments = (worker: Worker) =>
  (worker.documents ?? []).filter(
    (document) => document.security_level === "External",
  );

const mapClientWorkerDocumentsForTable = (worker: Worker) =>
  PREDEFINED_DOCUMENTS.flatMap((definition) => {
    const document = getDocumentByKey(
      filterClientVisibleDocuments(worker),
      definition.key,
    );

    if (!document) return [];

    const visual = getDocumentVisual(
      document.status ?? DOCUMENT_STATUS.NOT_UPLOADED,
    );

    return [
      {
        key: definition.key,
        label: definition.shortLabel,
        icon: visual.icon,
        color: visual.color,
      },
    ];
  });

export { filterClientVisibleDocuments, mapClientWorkerDocumentsForTable };
