import { ToggleLeft, ToggleRight } from "lucide-react";
import { Toggle } from "../ui/toggle";

const COLORS = {
  GREEN_ENABLED:
    "border-emerald-200 bg-emerald-50 text-emerald-700 hover:text-emerald-800",
  RED_DISABLED:
    "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800",
};

const ToggleButton = ({
  enabled,
  setEnabled,
  enabledText = "Showing active",
  disabledText = "Showing inactive",
  ariaLabel = "Toggle active/inactive",
}: {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  enabledText?: string;
  disabledText?: string;
  ariaLabel?: string;
}) => {
  return (
    <Toggle
      pressed={enabled}
      onPressedChange={(pressed) => setEnabled(pressed)}
      variant="outline"
      className={enabled ? COLORS.GREEN_ENABLED : COLORS.RED_DISABLED}
      aria-label={ariaLabel}
    >
      {enabled ? (
        <ToggleLeft className={`h-4 w-4 ${COLORS.GREEN_ENABLED}`} />
      ) : (
        <ToggleRight className={`h-4 w-4 ${COLORS.RED_DISABLED}`} />
      )}
      <span className="grid">
        <span
          style={{ gridArea: "1/1" }}
          className={enabled ? "visible" : "invisible"}
        >
          {enabled ? enabledText : disabledText}
        </span>
        <span
          style={{ gridArea: "1/1" }}
          className={enabled ? "invisible" : "visible"}
        >
          {disabledText}
        </span>
      </span>
    </Toggle>
  );
};

export { ToggleButton };
