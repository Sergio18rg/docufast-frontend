import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CustomSelect = ({
  label,
  disabled,
  valueSelect,
  onValueChange,
  triggerStyles,
  colors,
  options,
}: {
  label: string;
  options: string[];
  disabled?: boolean;
  valueSelect: string;
  onValueChange: (value: string) => void;
  triggerStyles: Record<string, string>;
  colors: Record<string, string>;
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        disabled={disabled}
        value={valueSelect}
        onValueChange={onValueChange}
      >
        <SelectTrigger className={`w-full ${triggerStyles[valueSelect]}`}>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            return (
              <SelectItem key={option} value={option}>
                <span className={colors[option] || "text-slate-700"}>
                  {option}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export { CustomSelect };
