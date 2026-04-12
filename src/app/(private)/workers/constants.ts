import { WorkerDocument, WorkerPayload } from "@/types";
import { WorkerDialogMode } from "./types";

const DIALOG_MODES = {
  CREATE: "create",
  EDIT: "edit",
  VIEW: "view",
} as Record<string, WorkerDialogMode>;

const VEHICLE_TYPE = {
  Dry: { label: "Dry", color: "#ced3db" },
  Reefer: { label: "Reefer", color: "#9be0e8" },
  Truck: { label: "Truck", color: "#e8be9b" },
  Other: { label: "Other", color: "#b59be8" },
};

const PREDEFINED_DOCUMENTS = [
  { key: "identity_document", name: "Identity document", shortLabel: "ID" },
  { key: "worker_photo", name: "Photo", shortLabel: "Photo" },
  { key: "employment_contract", name: "Contract", shortLabel: "Contract" },
  { key: "driver_license", name: "Driving licence", shortLabel: "Licence" },
  {
    key: "social_security_registration",
    name: "Social Security registration",
    shortLabel: "SS",
  },
  { key: "driver_report", name: "Driver report", shortLabel: "Report" },
];

const EMPTY_DOCUMENT = (
  definition?: (typeof PREDEFINED_DOCUMENTS)[number],
): WorkerDocument => ({
  worker_document_id: null,
  document_key:
    definition?.key ?? `additional-${Math.random().toString(36).slice(2, 10)}`,
  document_name: definition?.name ?? "",
  is_predefined: !!definition,
  security_level: "Private",
  status: "Not uploaded",
  issue_date: new Date().toISOString().slice(0, 10),
  expiration_date: new Date().toISOString().slice(0, 10),
  notes: "",
  file_name: null,
  file_url: null,
  mime_type: null,
});

const EMPTY_FORM: WorkerPayload = {
  company_worker_code: "",
  first_name: "",
  last_name_1: "",
  last_name_2: "",
  email: "",
  phone: "",
  document_number: "",
  social_security_number: "",
  birth_date: "",
  address: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  contract_start_date: "",
  contract_end_date: "",
  status: "Active",
  notes: "",
  client_id: null,
  current_vehicle_id: null,
  documents: PREDEFINED_DOCUMENTS.map((document) => EMPTY_DOCUMENT(document)),
};

const TABLE = {
  HEADERS: [
    "Name / Email",
    "Identity document",
    "Company ID",
    "Client",
    "Vehicle ID",
    "Vehicle type",
    "Documents",
    "Actions",
  ],
};

export {
  VEHICLE_TYPE,
  PREDEFINED_DOCUMENTS,
  DIALOG_MODES,
  EMPTY_FORM,
  TABLE,
  EMPTY_DOCUMENT,
};
