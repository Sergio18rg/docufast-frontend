"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CustomTable,
  SearchBar,
  Title,
  ToggleButton,
} from "@/components";
import { CustomButton, ICONS } from "@/components/shared/custom-button";
import { useAuth } from "@/hooks";
import {
  createClient,
  deleteClient,
  getClients,
  restoreClient,
  updateClient,
  uploadClientDocument,
} from "@/services";
import type { ClientPayload, ClientSummary, DialogMode } from "@/types";
import { DIALOG_MODES, STATUS } from "../constants";
import { buildDocumentPayload, mapDocumentsForTable } from "../utils";
import { EMPTY_FORM, PREDEFINED_DOCUMENTS, TABLE } from "./constants";
import { clientNameStyle } from "./utils";
import { ClientDialog, mapClientToForm } from "./components";

const ClientsPage = () => {
  const { token } = useAuth();

  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(DIALOG_MODES.CREATE);
  const [selectedClient, setSelectedClient] = useState<ClientSummary | null>(
    null,
  );
  const [form, setForm] = useState<ClientPayload>(EMPTY_FORM);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File | null>>(
    {},
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showActive, setShowActive] = useState(true);
  const fetchedTokenRef = useRef<string | null>(null);

  const loadClients = async (currentToken = token) => {
    if (!currentToken) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await getClients(currentToken);
      setClients(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load clients",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token || fetchedTokenRef.current === token) return;
    fetchedTokenRef.current = token;
    loadClients(token);
  }, [token]);

  const openCreateDialog = () => {
    setDialogMode(DIALOG_MODES.CREATE);
    setSelectedClient(null);
    setForm(EMPTY_FORM);
    setPendingFiles({});
    setDialogOpen(true);
  };

  const openEditDialog = (client: ClientSummary) => {
    setDialogMode(DIALOG_MODES.EDIT);
    setSelectedClient(client);
    setForm(mapClientToForm(client));
    setPendingFiles({});
    setDialogOpen(true);
  };

  const openViewDialog = (client: ClientSummary) => {
    setDialogMode(DIALOG_MODES.VIEW);
    setSelectedClient(client);
    setForm(mapClientToForm(client));
    setPendingFiles({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedClient(null);
    setForm(EMPTY_FORM);
    setPendingFiles({});
  };

  const handleSubmit = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      const payload = buildDocumentPayload(form);
      let currentClient =
        dialogMode === DIALOG_MODES.EDIT && selectedClient
          ? (await updateClient(token, selectedClient.client_id, payload)).data
          : (await createClient(token, payload)).data;
      for (const document of payload.documents) {
        const selectedFile = pendingFiles[document.document_key];
        if (!selectedFile) continue;
        const uploadResponse = await uploadClientDocument(token, {
          clientId: currentClient.client_id,
          document,
          file: selectedFile,
        });
        currentClient = uploadResponse.data;
      }
      closeDialog();
      await loadClients(token);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save client",
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (client: ClientSummary) => {
    if (!token) return;
    if (!globalThis.confirm(`Mark ${client.business_name} as inactive?`))
      return;
    try {
      await deleteClient(token, client.client_id);
      await loadClients(token);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update client status",
      );
    }
  };

  const handleRestore = async (client: ClientSummary) => {
    if (!token) return;
    try {
      await restoreClient(token, client.client_id);
      await loadClients(token);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to restore client",
      );
    }
  };

  const filteredClients = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesStatus = showActive
        ? client.status === STATUS.ACTIVE
        : client.status === STATUS.INACTIVE;
      if (!matchesStatus) return false;
      if (!search) return true;

      const workers = (client.current_workers ?? [])
        .map((w) => w.full_name.toLowerCase())
        .join(" ");
      return (
        client.client_code.toLowerCase().includes(search) ||
        client.business_name.toLowerCase().includes(search) ||
        workers.includes(search)
      );
    });
  }, [clients, searchTerm, showActive]);

  const TABLE_ROWS = {
    ID: "client_id",
    ROW_ACTION: (client: ClientSummary) => openViewDialog(client),
    COLUMN_DEFINITION: [
      {
        key: "client_code",
        getProps: (client: ClientSummary) => ({
          primaryText: client.client_code,
        }),
      },
      {
        key: "business_name",
        getProps: (client: ClientSummary) => ({
          primaryText: client.business_name,
          helperText: client.contact_email || undefined,
          style: clientNameStyle(client.badge_color),
        }),
        render: "TextCell",
      },
      {
        key: "employees",
        getProps: (client: ClientSummary) => ({
          primaryText: String(
            client.current_workers_count ?? client.current_workers?.length ?? 0,
          ),
        }),
      },
      {
        key: "documents",
        render: "DocumentsCell",
        getProps: (client: ClientSummary) => ({
          documents: mapDocumentsForTable(
            client.documents,
            PREDEFINED_DOCUMENTS,
          ),
        }),
      },
    ],
    ACTIONS: {
      onEdit: (client: ClientSummary) => openEditDialog(client),
      onDelete: (client: ClientSummary) =>
        client.status === STATUS.INACTIVE
          ? handleRestore(client)
          : handleDelete(client),
      getDeleteIcon: (client: ClientSummary) =>
        client.status === STATUS.INACTIVE ? ICONS.RESTORE : ICONS.DELETE,
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <Title
          title="Clients"
          description="Clients management with users, workers and controlled documentation."
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            placeholder="Search by client ID, client name or worker"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <ToggleButton enabled={showActive} setEnabled={setShowActive} />
          <CustomButton
            text="Add client"
            icon={ICONS.ADD}
            onClick={openCreateDialog}
          />
        </div>
      </div>
      {errorMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}
      <Card>
        <CardContent className="pt-6">
          <CustomTable
            headers={TABLE.HEADERS}
            tableData={filteredClients}
            isLoading={isLoading}
            tableRows={TABLE_ROWS}
          />
        </CardContent>
      </Card>
      <ClientDialog
        open={dialogOpen}
        mode={dialogMode}
        client={selectedClient}
        form={form}
        setForm={setForm}
        pendingFiles={pendingFiles}
        setPendingFiles={setPendingFiles}
        isSaving={isSaving}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default ClientsPage;
