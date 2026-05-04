import { PredefinedDocument, VehicleDocument, VehiclePayload } from "@/types";
import { createBaseDocument } from "../utils";
import { STATUS } from "../constants";

const COMPANY_OWNER = {
  Rumofast: { color: "#16a34a" },
  Demetrio: { color: "#eab308" },
  SixT: { color: "#f97316" },
  Telefurgo: { color: "#0891b2" },
  DFM: { color: "#2563eb" },
  Covey: { color: "#1e3a8a" },
  LiderRent: { color: "#7c3aed" },
  Other: { color: "#92400e" },
};

const PREDEFINED_DOCUMENTS = [
  { key: "vehicle_contract", name: "Contract", shortLabel: "Contract" },
  { key: "itv", name: "ITV", shortLabel: "ITV" },
  { key: "technical_sheet", name: "Technical sheet", shortLabel: "Sheet" },
  {
    key: "circulation_permit",
    name: "Circulation permit",
    shortLabel: "Permit",
  },
  { key: "regage", name: "REGAGE", shortLabel: "REGAGE" },
  { key: "certificate", name: "Certificate", shortLabel: "Cert" },
];

const EMPTY_DOCUMENT = (definition?: PredefinedDocument): VehicleDocument => ({
  vehicle_document_id: null,
  ...createBaseDocument(definition),
});

const EMPTY_FORM: VehiclePayload = {
  license_plate: "",
  company_owner: "Rumofast",
  vehicle_type: "Dry",
  contract_start_date: "",
  contract_end_date: "",
  status: STATUS.ACTIVE,
  notes: "",
  documents: PREDEFINED_DOCUMENTS.map((d) => EMPTY_DOCUMENT(d)),
};

const TABLE = {
  HEADERS: [
    "Vehicle ID",
    "Company",
    "Vehicle type",
    "Workers",
    "Documents",
    "Actions",
  ],
};

export {
  COMPANY_OWNER,
  PREDEFINED_DOCUMENTS,
  EMPTY_DOCUMENT,
  EMPTY_FORM,
  TABLE,
};
