import {
  DialogMode,
  Document,
  DocumentStatus,
  PredefinedDocument,
} from "@/types";
import {
  AlertTriangle,
  CheckCircle2,
  CircleOff,
  OctagonAlert,
} from "lucide-react";
import { DOCUMENT_STATUS, VEHICLE_TYPE } from "./constants";

const getDocumentVisual = (status: DocumentStatus) => {
  if (status === DOCUMENT_STATUS.VALID) {
    return {
      icon: CheckCircle2,
      color: "text-emerald-600",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (status === DOCUMENT_STATUS.EXPIRING_SOON) {
    return {
      icon: AlertTriangle,
      color: "text-orange-500",
      badge: "border-orange-200 bg-orange-50 text-orange-700",
    };
  }

  if (status === DOCUMENT_STATUS.EXPIRED) {
    return {
      icon: OctagonAlert,
      color: "text-red-600",
      badge: "border-red-200 bg-red-50 text-red-700",
    };
  }

  return {
    icon: CircleOff,
    color: "text-slate-400",
    badge: "border-slate-200 bg-slate-50 text-slate-600",
  };
};

const vehicleBadgeStyle = (type?: string) => {
  const safeType = (
    type && type in VEHICLE_TYPE ? type : "Other"
  ) as keyof typeof VEHICLE_TYPE;
  const color = VEHICLE_TYPE[safeType]?.color ?? VEHICLE_TYPE.Other.color;
  return { backgroundColor: color, borderColor: color, color: "#1f2937" };
};

const createBaseDocument = (definition?: PredefinedDocument): Document => ({
  document_key:
    definition?.key ?? `additional-${Math.random().toString(36).slice(2, 10)}`,
  document_name: definition?.name ?? "",
  is_predefined: !!definition,
  security_level: "Private",
  status: DOCUMENT_STATUS.NOT_UPLOADED,
  issue_date: new Date().toISOString().slice(0, 10),
  expiration_date: new Date().toISOString().slice(0, 10),
  notes: "",
  file_name: null,
  file_url: null,
  mime_type: null,
});

const getDialogTitle = (mode: DialogMode, suffix = "Worker"): string => {
  if (mode === "create") return `Create ${suffix}`;
  if (mode === "edit") return `Edit ${suffix}`;
  if (mode === "view") return `View ${suffix}`;
  return "";
};

const normalizeDate = (value?: string | null) =>
  value ? value.slice(0, 10) : "";

const isImage = (mimeType?: string | null) => mimeType?.startsWith("image/");

const clientBadgeStyle = (color = "#94a3b8") => {
  return {
    backgroundColor: `${color}22`,
    borderColor: color,
    color: color,
  };
};

const getDocumentByKey = <T extends { document_key: string }>(
  documents: T[] | undefined,
  key: string,
): T | undefined =>
  documents?.find((document) => document.document_key === key);

export {
  getDocumentVisual,
  vehicleBadgeStyle,
  createBaseDocument,
  getDialogTitle,
  normalizeDate,
  isImage,
  clientBadgeStyle,
  getDocumentByKey,
};
