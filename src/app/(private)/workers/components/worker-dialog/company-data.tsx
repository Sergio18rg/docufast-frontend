import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CustomInput,
  SearchableSelect,
  CustomSelect,
} from "@/components";
import { useAuth } from "@/hooks";
import { getClients, getVehicles } from "@/services";
import {
  ClientSummary,
  VehicleSummary,
  Worker,
  WorkerPayload,
  Status,
} from "@/types";
import {
  STATUS,
  STATUS_COLORS,
  STATUS_STYLES,
  VEHICLE_TYPE,
} from "@/app/(private)/constants";
interface CompanyDataProps {
  form: WorkerPayload;
  isViewMode: boolean;
  updateField: (
    field: keyof WorkerPayload,
    value: WorkerPayload[keyof WorkerPayload],
  ) => void;
  worker: Worker | null;
}

const CompanyData = ({
  form,
  isViewMode,
  updateField,
  worker,
}: CompanyDataProps) => {
  const { token } = useAuth();
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (isViewMode || !token || loadedRef.current) {
      return;
    }

    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const [clientsResponse, vehiclesResponse] = await Promise.all([
          getClients(token),
          getVehicles(token),
        ]);
        setClients(clientsResponse.data);
        setVehicles(
          vehiclesResponse.data.filter(
            (vehicle) => vehicle.status === "Active",
          ),
        );
        loadedRef.current = true;
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [isViewMode, token]);

  // En modo vista mostrar solo el actual, en modo edit todos los disponibles
  const isWorkerInactive = form.status === "Inactive";

  const displayClients =
    isViewMode && worker?.client ? [worker.client] : clients;
  const displayVehicles =
    worker?.current_vehicle &&
    !vehicles.some(
      (vehicle) => vehicle.vehicle_id === worker.current_vehicle?.vehicle_id,
    )
      ? [worker.current_vehicle, ...vehicles]
      : vehicles;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Company data</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-2">
        <CustomInput
          label="Company code"
          disabled={isViewMode}
          value={form.company_worker_code}
          onChange={(e) => updateField("company_worker_code", e.target.value)}
        />
        <CustomSelect
          label="Status"
          disabled={isViewMode}
          valueSelect={form.status}
          onValueChange={(value) => updateField("status", value as Status)}
          options={STATUS}
          triggerStyles={STATUS_STYLES}
          colors={STATUS_COLORS}
        />
        <SearchableSelect
          label="Current vehicle"
          placeholder={isLoadingData ? "Loading vehicles..." : "Select vehicle"}
          searchPlaceholder="Search by plate..."
          items={displayVehicles}
          selectedId={form.current_vehicle_id ?? null}
          onSelect={(value) => updateField("current_vehicle_id", value)}
          getId={(vehicle: VehicleSummary) => vehicle.vehicle_id}
          getLabel={(vehicle: VehicleSummary) => vehicle.license_plate}
          getDescription={(vehicle: VehicleSummary) => vehicle.vehicle_type}
          getColor={(vehicle: VehicleSummary) =>
            VEHICLE_TYPE[vehicle.vehicle_type].color
          }
          disabled={isViewMode || isLoadingData || isWorkerInactive}
        />
        <SearchableSelect
          label="Current client"
          placeholder={isLoadingData ? "Loading clients..." : "Select client"}
          searchPlaceholder="Search by client..."
          items={displayClients}
          selectedId={form.client_id ?? null}
          onSelect={(value) => updateField("client_id", value)}
          getId={(client: ClientSummary) => client.client_id}
          getLabel={(client: ClientSummary) => client.business_name}
          getDescription={(client: ClientSummary) =>
            client.contact_email || "No email"
          }
          getColor={(client: ClientSummary) => client.badge_color}
          disabled={isViewMode || isLoadingData || isWorkerInactive}
        />
        <CustomInput
          label="Contract Start"
          type="date"
          disabled={isViewMode}
          value={form.contract_start_date}
          onChange={(e) => updateField("contract_start_date", e.target.value)}
        />
        <CustomInput
          label="Contract End"
          type="date"
          disabled={isViewMode}
          value={form.contract_end_date}
          onChange={(e) => updateField("contract_end_date", e.target.value)}
        />
        <CustomInput
          label="Notes"
          disabled={isViewMode}
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          wrapperStyle="space-y-2 xl:col-span-2"
        />
      </CardContent>
    </Card>
  );
};

export { CompanyData };
