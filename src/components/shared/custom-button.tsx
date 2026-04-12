import {
  Download,
  Paperclip,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "../ui/button";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "../ui/button";

const ICONS = {
  NONE: null,
  ADD: <Plus className="mr-2 h-4 w-4" />,
  EDIT: <Pencil className="h-4 w-4" />,
  DELETE: <Trash2 className="h-4 w-4 text-red-600" />,
  DOWNLOAD: <Download className="mr-2 h-4 w-4" />,
  FILE: <Paperclip className="mr-2 h-4 w-4" />,
  UPLOAD: <Upload className="mr-2 h-4 w-4" />,
};

const CustomButton = ({
  onClick,
  text = "",
  icon = null,
  disabled = false,
  variant = "default",
  size = "default",
  children,
}: {
  onClick?: () => void;
  text?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  children?: React.ReactNode;
}) => {
  return (
    <Button onClick={onClick} disabled={disabled} variant={variant} size={size}>
      {icon}
      {text}
      {children}
    </Button>
  );
};

export { CustomButton, ICONS };
