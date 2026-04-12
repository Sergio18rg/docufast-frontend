import { Input } from "../ui/input";
import { Label } from "../ui/label";

const CustomInput = ({
  wrapperStyle = "space-y-2",
  label,
  value = "",
  ...props
}: {
  label: string;
  wrapperStyle?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className={wrapperStyle}>
      <Label>{label}</Label>
      <Input value={value || ""} {...props} />
    </div>
  );
};

export { CustomInput };
