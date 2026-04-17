import { Document } from "./generic.types";

type VehicleType = "Dry" | "Reefer" | "Truck" | "Other";
type VehicleStatus = "Active" | "Absence" | "Inactive";

interface VehicleWorkerSummary {
  worker_id: number;
  first_name: string;
  last_name_1: string;
  full_name: string;
}

interface VehicleDocument extends Document {
  vehicle_document_id?: number | null;
}

interface VehicleSummary {
  vehicle_id: number;
  license_plate: string;
  vehicle_type: VehicleType;
  company_owner: string;
  contract_start_date?: string | null;
  contract_end_date?: string | null;
  status: VehicleStatus;
  notes?: string | null;
  current_workers?: VehicleWorkerSummary[];
  documents?: VehicleDocument[];
}

interface VehiclePayload {
  license_plate: string;
  company_owner: string;
  vehicle_type: VehicleType;
  contract_start_date?: string;
  contract_end_date?: string;
  status: VehicleStatus;
  notes?: string;
  documents: VehicleDocument[];
}

export type {
  VehicleType,
  VehicleStatus,
  VehicleWorkerSummary,
  VehicleDocument,
  VehicleSummary,
  VehiclePayload,
};
