import { PredefinedDocument, WorkerDocument, WorkerPayload } from "@/types";
import { createBaseDocument } from "../utils";
import { STATUS } from "../constants";

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

const EMPTY_DOCUMENT = (definition?: PredefinedDocument): WorkerDocument => ({
  worker_document_id: null,
  ...createBaseDocument(definition),
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
  status: STATUS.ACTIVE,
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
  CLIENT_HEADERS: [
    "Name",
    "Identity document",
    "Vehicle ID",
    "Vehicle type",
    "Documents",
  ],
  DESCRIPTIONS: {
    ADMIN:
      "Workers management with documents, vehicle allocation and client assignment.",
    EXTERNAL:
      "Assigned workers overview with shared documentation visible to your organization.",
  },
};

export { PREDEFINED_DOCUMENTS, EMPTY_FORM, TABLE, EMPTY_DOCUMENT };
