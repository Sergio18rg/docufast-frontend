"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  CustomButton,
} from "@/components";
import { Worker } from "@/types";
import { getDialogTitle } from "@/app/(private)/utils";
import { ExternalWorkerData } from "./external-worker-data";
import { ExternalWorkerDocuments } from "./external-worker-documents";

const ExternalWorkerDialog = ({
  open,
  worker,
  onClose,
}: {
  open: boolean;
  worker: Worker | null;
  onClose: () => void;
}) => {
  if (!worker) return null;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {getDialogTitle("view")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ExternalWorkerData worker={worker} />
          <ExternalWorkerDocuments documents={worker.documents ?? []} />

          <div className="flex justify-end">
            <CustomButton text="Close" variant="outline" onClick={onClose} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ExternalWorkerDialog };
