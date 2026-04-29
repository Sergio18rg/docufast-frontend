import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomInput,
} from "@/components";
import type { AuthUser } from "@/types";

const ProfileData = ({ user }: { user: AuthUser }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Personal information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-2">
        <CustomInput
          label="First name"
          disabled
          value={user.first_name ?? ""}
        />
        <CustomInput label="Surname" disabled value={user.last_name_1 ?? ""} />
        <CustomInput
          label="Second surname"
          disabled
          value={user.last_name_2 ?? ""}
        />
        <CustomInput
          label="Identification document"
          disabled
          value={user.document_number ?? ""}
        />
        <CustomInput
          label="Social security number"
          disabled
          value={user.social_security_number ?? ""}
        />
        <CustomInput
          label="Birthday"
          type="date"
          disabled
          value={user.birth_date ? String(user.birth_date).slice(0, 10) : ""}
        />
        <CustomInput
          label="Address"
          disabled
          value={user.address ?? ""}
          wrapperStyle="space-y-2 xl:col-span-2"
        />
        <CustomInput label="Email" disabled value={user.email ?? ""} />
        <CustomInput label="Contact phone" disabled value={user.phone ?? ""} />
        <CustomInput
          label="Emergency contact name"
          disabled
          value={user.emergency_contact_name ?? ""}
        />
        <CustomInput
          label="Emergency contact phone"
          disabled
          value={user.emergency_contact_phone ?? ""}
        />
        <CustomInput
          label="Joined in"
          type="date"
          disabled
          value={
            user.contract_start_date
              ? String(user.contract_start_date).slice(0, 10)
              : ""
          }
        />
        <CustomInput
          label="Assigned vehicle"
          disabled
          value={user.current_vehicle?.license_plate ?? ""}
        />
        <CustomInput
          label="Assigned client"
          disabled
          value={user.client?.business_name ?? ""}
        />
      </CardContent>
    </Card>
  );
};

export { ProfileData };
