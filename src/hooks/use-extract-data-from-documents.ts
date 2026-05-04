import { useEffect, useRef, useState } from "react";
import type { Document, EntityType, HighlightedFieldMap } from "@/types";
import { extractDataFromDocuments } from "@/services";
import { useAuth } from "./use-auth";

const FIELDS_BY_ENTITY: Record<EntityType, ReadonlyArray<string>> = {
  Client: ["business_name", "contract_start_date", "contract_end_date"],
  Vehicle: ["license_plate", "contract_start_date", "contract_end_date"],
  Worker: [
    "first_name",
    "last_name_1",
    "last_name_2",
    "document_number",
    "birth_date",
    "address",
    "social_security_number",
    "contract_start_date",
    "contract_end_date",
  ],
};

const mergeExtractedDocumentDates = ({
  documents,
  extractedDocuments,
  highlightedFields,
}: {
  documents: Document[];
  extractedDocuments: Array<{
    document_key: string;
    issue_date?: string | null;
    expiration_date?: string | null;
  }>;
  highlightedFields: HighlightedFieldMap;
}) => {
  const extractedByKey = new Map(
    extractedDocuments.map((document) => [document.document_key, document]),
  );

  const nextHighlightedFields = { ...highlightedFields };
  const nextDocuments = documents.map((document) => {
    const extractedDocument = extractedByKey.get(document.document_key);
    if (!extractedDocument) return document;

    const nextIssueDate = extractedDocument.issue_date || document.issue_date;
    const nextExpirationDate =
      extractedDocument.expiration_date || document.expiration_date;

    nextHighlightedFields[`document:${document.document_key}:issue_date`] =
      getUpdatedFieldHighlight({
        previousValue: document.issue_date,
        nextValue: extractedDocument.issue_date,
      });
    nextHighlightedFields[`document:${document.document_key}:expiration_date`] =
      getUpdatedFieldHighlight({
        previousValue: document.expiration_date,
        nextValue: extractedDocument.expiration_date,
      });

    return {
      ...document,
      issue_date: nextIssueDate,
      expiration_date: nextExpirationDate,
    };
  });

  return { documents: nextDocuments, highlightedFields: nextHighlightedFields };
};

const normalizeComparableValue = (value?: string | null) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

const getUpdatedFieldHighlight = ({
  previousValue,
  nextValue,
}: {
  previousValue?: string | null;
  nextValue?: string | null;
}) => {
  const normalizedPrevious = normalizeComparableValue(previousValue);
  const normalizedNext = normalizeComparableValue(nextValue);

  const hasNextValue = !!normalizedNext;
  const isModified = hasNextValue && normalizedPrevious !== normalizedNext;

  return isModified;
};

const useExtractDataFromDocuments = <TForm extends { documents: Document[] }>({
  open,
  entityType,
  form,
  pendingFiles,
  setForm,
}: {
  open: boolean;
  entityType: EntityType;
  form: TForm;
  pendingFiles: Record<string, File | null>;
  setForm: (value: TForm) => void;
}) => {
  const { token } = useAuth();
  const [isExtractingData, setIsExtractingData] = useState(false);
  const [highlightedFields, setHighlightedFields] =
    useState<HighlightedFieldMap>({});

  // Resetear highlights cuando se cierra el dialog para que se borre el color verde de los campos
  const prevOpenRef = useRef(open);

  useEffect(() => {
    // Solo resetear cuando el dialog pasa de abierto a cerrado
    if (prevOpenRef.current && !open) setHighlightedFields({});
    prevOpenRef.current = open;
  }, [open]);

  const handleLoadDataFromDocuments = async () => {
    if (!token) return;
    setIsExtractingData(true);
    try {
      const response = await extractDataFromDocuments({
        token,
        entityType,
        documents: form.documents,
        pendingFiles,
      });
      const extracted = response.data;
      console.log(response.data);
      const nextHighlightedFields: HighlightedFieldMap = {};
      const nextForm: TForm = { ...form };
      const fields = FIELDS_BY_ENTITY[entityType];

      fields.forEach((fieldKey) => {
        const extractedValue = extracted.fields[fieldKey];
        const isModified = getUpdatedFieldHighlight({
          previousValue: form[fieldKey as keyof TForm] as
            | string
            | null
            | undefined,
          nextValue: extractedValue,
        });
        nextHighlightedFields[fieldKey] = isModified;
        if (isModified && extractedValue) {
          nextForm[fieldKey as keyof TForm] =
            extractedValue as TForm[keyof TForm];
        }
      });

      const mergedDocuments = mergeExtractedDocumentDates({
        documents: nextForm.documents,
        extractedDocuments: extracted.documents,
        highlightedFields: nextHighlightedFields,
      });
      nextForm.documents = mergedDocuments.documents as TForm["documents"];
      setHighlightedFields(mergedDocuments.highlightedFields);
      setForm(nextForm);
    } finally {
      setIsExtractingData(false);
    }
  };

  return { isExtractingData, highlightedFields, handleLoadDataFromDocuments };
};

export { useExtractDataFromDocuments };
