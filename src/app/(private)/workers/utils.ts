import { DocumentStatus } from "@/types/worker.types";
import { VEHICLE_TYPE } from "./constants";
import {
  AlertTriangle,
  CheckCircle2,
  CircleOff,
  OctagonAlert,
} from "lucide-react";

const vehicleBadgeStyle = (type: keyof typeof VEHICLE_TYPE) => ({
  backgroundColor: VEHICLE_TYPE[type].color,
  borderColor: VEHICLE_TYPE[type].color,
  color: "#1f2937",
});

const clientBadgeStyle = (color: string) => ({
  backgroundColor: `${color}22`,
  borderColor: color,
  color,
});

const getDocumentVisual = (status: DocumentStatus) => {
  if (status === "Valid") {
    return {
      icon: CheckCircle2,
      color: "text-emerald-600",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (status === "Expiring soon") {
    return {
      icon: AlertTriangle,
      color: "text-orange-500",
      badge: "border-orange-200 bg-orange-50 text-orange-700",
    };
  }

  if (status === "Expired") {
    return {
      icon: OctagonAlert,
      color: "text-red-600",
      badge: "border-red-200 bg-red-50 text-red-700",
    };
  }

  return {
    icon: CircleOff,
    color: "text-slate-400",
    badge: "border-slate-200 bg-slate-50 text-slate-600",
  };
};

export { vehicleBadgeStyle, clientBadgeStyle, getDocumentVisual };
