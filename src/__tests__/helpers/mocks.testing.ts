import type { AuthUser, Worker, WorkerPayload, WorkerDocument } from "@/types";
import { STATUS } from "@/app/(private)/constants";

const createMockUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  user_id: 1,
  email: "admin@test.com",
  role: "Administrator",
  ...overrides,
});

const createMockAuthValue = (overrides?: {
  user?: AuthUser;
  token?: string;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}) => ({
  user: overrides?.user ?? createMockUser(),
  token: overrides?.token ?? "test-token",
  isAuthenticated: overrides?.isAuthenticated ?? true,
  isLoading: overrides?.isLoading ?? false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
});

const createMockWorkerDocument = (
  overrides?: Partial<WorkerDocument>,
): WorkerDocument => ({
  worker_document_id: 1,
  document_id: null,
  document_key: "identity_document",
  document_name: "DNI",
  is_predefined: true,
  is_active: true,
  file_url: "/documents/test.pdf",
  file_name: "test.pdf",
  mime_type: "application/pdf",
  security_level: "Internal",
  status: "Valid",
  issue_date: "2020-01-01",
  expiration_date: "2030-01-01",
  notes: null,
  ...overrides,
});

const createMockWorkerPayload = (
  overrides?: Partial<WorkerPayload>,
): WorkerPayload => ({
  company_worker_code: "",
  first_name: "John",
  last_name_1: "Doe",
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
  documents: [],
  ...overrides,
});

const createMockWorker = (overrides?: Partial<Worker>): Worker => ({
  worker_id: 1,
  company_worker_code: "W001",
  first_name: "John",
  last_name_1: "Doe",
  last_name_2: null,
  email: null,
  phone: null,
  document_number: null,
  social_security_number: null,
  birth_date: null,
  address: null,
  emergency_contact_name: null,
  emergency_contact_phone: null,
  contract_start_date: null,
  contract_end_date: null,
  status: STATUS.ACTIVE,
  notes: null,
  client_id: null,
  current_vehicle_id: null,
  client: null,
  current_vehicle: null,
  documents: [],
  ...overrides,
});

const createMockServiceHandlers = () => ({
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  setForm: jest.fn(),
  setPendingFiles: jest.fn(),
  updateField: jest.fn(),
});

export {
  createMockUser,
  createMockAuthValue,
  createMockWorkerPayload,
  createMockWorker,
  createMockWorkerDocument,
  createMockServiceHandlers,
};
