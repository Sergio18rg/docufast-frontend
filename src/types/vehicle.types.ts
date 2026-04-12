type VehicleType = "Dry" | "Reefer" | "Truck" | "Other";

interface VehicleSummary {
  vehicle_id: number;
  license_plate: string;
  vehicle_type: VehicleType;
  status: string;
  notes?: string | null;
}

export type { VehicleType, VehicleSummary };
