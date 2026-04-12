import { SecurityLevel, WorkerStatus } from "@/types";

const WORKER_STATUSES: WorkerStatus[] = ["Active", "Absence", "Inactive"];

const SECURITY_LEVELS: SecurityLevel[] = ["Internal", "Private", "External"];

const SECURITY_LEVEL_STYLES: Record<SecurityLevel, string> = {
  Internal: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Private: "border-orange-200 bg-orange-50 text-orange-700",
  External: "border-red-200 bg-red-50 text-red-700",
};

const SECURITY_LEVEL_COLORS: Record<SecurityLevel, string> = {
  Internal: "text-emerald-700",
  Private: "text-orange-700",
  External: "text-red-700",
};

const STATUS_STYLES: Record<WorkerStatus, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Absence: "border-orange-200 bg-orange-50 text-orange-700",
  Inactive: "border-red-200 bg-red-50 text-red-700",
};

const STATUS_COLORS: Record<WorkerStatus, string> = {
  Active: "text-emerald-700",
  Absence: "text-orange-700",
  Inactive: "text-red-700",
};

export {
  SECURITY_LEVELS,
  WORKER_STATUSES,
  SECURITY_LEVEL_STYLES,
  STATUS_STYLES,
  STATUS_COLORS,
  SECURITY_LEVEL_COLORS,
};
