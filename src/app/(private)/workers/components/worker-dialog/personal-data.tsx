import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CustomInput,
} from "@/components";
import { WorkerPayload } from "@/types";
import { getHighlightedFieldClassName } from "@/app/(private)/utils";

interface PersonalDataProps {
  form: WorkerPayload;
  isViewMode: boolean;
  highlightedFields?: Record<string, boolean>;
  updateField: (
    field: keyof WorkerPayload,
    value: WorkerPayload[keyof WorkerPayload],
  ) => void;
}

const PersonalData = ({
  form,
  isViewMode,
  highlightedFields = {},
  updateField,
}: PersonalDataProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Personal data</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CustomInput
          label="First name"
          disabled={isViewMode}
          className={getHighlightedFieldClassName(
            highlightedFields,
            "first_name",
          )}
          value={form.first_name}
          onChange={(e) => updateField("first_name", e.target.value)}
        />
        <CustomInput
          label="First surname"
          disabled={isViewMode}
          className={getHighlightedFieldClassName(
            highlightedFields,
            "last_name_1",
          )}
          value={form.last_name_1}
          onChange={(e) => updateField("last_name_1", e.target.value)}
        />
        <CustomInput
          label="Second surname"
          disabled={isViewMode}
          className={getHighlightedFieldClassName(
            highlightedFields,
            "last_name_2",
          )}
          value={form.last_name_2}
          onChange={(e) => updateField("last_name_2", e.target.value)}
        />
        <CustomInput
          label="Identification document"
          disabled={isViewMode}
          className={getHighlightedFieldClassName(
            highlightedFields,
            "document_number",
          )}
          value={form.document_number}
          onChange={(e) => updateField("document_number", e.target.value)}
        />
        <CustomInput
          label="Social Security number"
          disabled={isViewMode}
          className={getHighlightedFieldClassName(
            highlightedFields,
            "social_security_number",
          )}
          value={form.social_security_number}
          onChange={(e) =>
            updateField("social_security_number", e.target.value)
          }
        />
        <CustomInput
          label="Birthday"
          disabled={isViewMode}
          type="date"
          className={getHighlightedFieldClassName(
            highlightedFields,
            "birth_date",
          )}
          value={form.birth_date}
          onChange={(e) => updateField("birth_date", e.target.value)}
        />
        <CustomInput
          label="Address"
          disabled={isViewMode}
          className={getHighlightedFieldClassName(highlightedFields, "address")}
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
          wrapperStyle="space-y-2 md:col-span-2"
        />

        <CustomInput
          label="Email"
          disabled={isViewMode}
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
        <CustomInput
          label="Contact phone"
          disabled={isViewMode}
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
        />

        <CustomInput
          label="Emergency contact name"
          disabled={isViewMode}
          value={form.emergency_contact_name}
          onChange={(e) =>
            updateField("emergency_contact_name", e.target.value)
          }
        />

        <CustomInput
          label="Emergency contact phone"
          disabled={isViewMode}
          value={form.emergency_contact_phone}
          onChange={(e) =>
            updateField("emergency_contact_phone", e.target.value)
          }
        />
      </CardContent>
    </Card>
  );
};

export { PersonalData };
