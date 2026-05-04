import { DialogMode, DocumentStatus, SecurityLevel, Status } from "@/types";

const VEHICLE_TYPE = {
  Dry: { label: "Dry", color: "#ced3db" },
  Reefer: { label: "Reefer", color: "#9be0e8" },
  Truck: { label: "Truck", color: "#e8be9b" },
  Other: { label: "Other", color: "#b59be8" },
};

const STATUSES: Status[] = ["Active", "Absence", "Inactive"];

const STATUS: Record<string, Status> = {
  ACTIVE: "Active",
  ABSENCE: "Absence",
  INACTIVE: "Inactive",
};

const SECURITY_LEVELS: SecurityLevel[] = ["Internal", "Private", "External"];

const DIALOG_MODES = {
  CREATE: "create",
  EDIT: "edit",
  VIEW: "view",
} as Record<string, DialogMode>;

const STATUS_STYLES: Record<Status, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Absence: "border-orange-200 bg-orange-50 text-orange-700",
  Inactive: "border-red-200 bg-red-50 text-red-700",
};

const STATUS_COLORS = {
  Active: "text-emerald-700",
  Absence: "text-orange-700",
  Inactive: "text-red-700",
  Default: "text-slate-700",
};

const DOCUMENT_STATUS = {
  NOT_UPLOADED: "Not uploaded",
  VALID: "Valid",
  EXPIRED: "Expired",
  EXPIRING_SOON: "Expiring soon",
} as Record<string, DocumentStatus>;

const SECURITY_LEVEL_COLORS: Record<SecurityLevel, string> = {
  Internal: "text-emerald-700",
  Private: "text-orange-700",
  External: "text-red-700",
};

const SECURITY_LEVEL_STYLES: Record<SecurityLevel, string> = {
  Internal: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Private: "border-orange-200 bg-orange-50 text-orange-700",
  External: "border-red-200 bg-red-50 text-red-700",
};

export {
  VEHICLE_TYPE,
  DIALOG_MODES,
  STATUSES,
  SECURITY_LEVELS,
  STATUS_STYLES,
  STATUS_COLORS,
  DOCUMENT_STATUS,
  SECURITY_LEVEL_COLORS,
  SECURITY_LEVEL_STYLES,
  STATUS,
};
