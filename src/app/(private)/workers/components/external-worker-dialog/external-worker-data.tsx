import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomInput,
} from "@/components";
import { Worker } from "@/types";

const ExternalWorkerData = ({ worker }: { worker: Worker }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Worker data</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-2">
        <CustomInput
          label="First name"
          disabled
          value={worker.first_name ?? ""}
        />
        <CustomInput
          label="Surname"
          disabled
          value={worker.last_name_1 ?? ""}
        />
        <CustomInput
          label="Second surname"
          disabled
          value={worker.last_name_2 ?? ""}
        />
        <CustomInput
          label="Identification document"
          disabled
          value={worker.document_number ?? ""}
        />
        <CustomInput
          label="Birthday"
          type="date"
          disabled
          value={
            worker.birth_date ? String(worker.birth_date).slice(0, 10) : ""
          }
        />
        <CustomInput
          label="Current vehicle"
          disabled
          value={worker.current_vehicle?.license_plate ?? ""}
        />
        <CustomInput
          label="Vehicle type"
          disabled
          value={worker.current_vehicle?.vehicle_type ?? ""}
          wrapperStyle="space-y-2 xl:col-span-2"
        />
      </CardContent>
    </Card>
  );
};

export { ExternalWorkerData };
