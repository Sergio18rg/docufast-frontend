import {
  Download,
  Paperclip,
  Pencil,
  Plus,
  Trash2,
  Upload,
  RotateCcw,
} from "lucide-react";
import { Button } from "../ui/button";

const ICONS = {
  NONE: null,
  ADD: <Plus className="mr-2 h-4 w-4" />,
  EDIT: <Pencil className="h-4 w-4" />,
  DELETE: <Trash2 className="h-4 w-4 text-red-600" />,
  DOWNLOAD: <Download className="mr-2 h-4 w-4" />,
  FILE: <Paperclip className="mr-2 h-4 w-4" />,
  UPLOAD: <Upload className="mr-2 h-4 w-4" />,
  RESTORE: <RotateCcw className="h-4 w-4 text-emerald-600" />,
};

const CustomButton = ({
  text = "",
  icon = null,
  disabled = false,
  variant = "default",
  size = "default",
  type = "button",
  children,
  ...props
}: {
  text?: string;
  icon?: React.ReactNode;
} & React.ComponentProps<typeof Button>) => {
  return (
    <Button
      disabled={disabled}
      variant={variant}
      size={size}
      type={type}
      {...props}
    >
      {icon}
      {text}
      {children}
    </Button>
  );
};

export { CustomButton, ICONS };
