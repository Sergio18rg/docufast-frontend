import { STATUS } from "../constants";
import { createBaseDocument } from "../utils";
import type {
  ClientDocument,
  ClientPayload,
  PredefinedDocument,
} from "@/types";

const PREDEFINED_DOCUMENTS: PredefinedDocument[] = [
  { key: "client_contract", name: "Contract", shortLabel: "CTR" },
];

const EMPTY_DOCUMENT = (definition?: PredefinedDocument): ClientDocument => ({
  ...createBaseDocument(definition),
  client_document_id: null,
});

const EMPTY_FORM: ClientPayload = {
  client_code: "",
  business_name: "",
  contact_email: "",
  contact_phone: "",
  badge_color: "#94a3b8",
  contract_start_date: "",
  contract_end_date: "",
  status: STATUS.ACTIVE,
  notes: "",
  documents: PREDEFINED_DOCUMENTS.map((d) => EMPTY_DOCUMENT(d)),
};

const TABLE = {
  HEADERS: ["Client ID", "Client Name", "Employees", "Documents", "Actions"],
};

export { PREDEFINED_DOCUMENTS, EMPTY_DOCUMENT, EMPTY_FORM, TABLE };
