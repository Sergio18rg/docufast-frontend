import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkerDialog } from "../worker-dialog";
import {
  renderWithAuth,
  createMockWorkerPayload,
  createMockServiceHandlers,
} from "@/__tests__/helpers";

jest.mock("../../../../../../services", () => ({
  API_BASE_URL: "http://localhost:3000",
  extractDataFromDocuments: jest.fn(),
  getClients: jest.fn().mockResolvedValue({ data: [] }),
  getVehicles: jest.fn().mockResolvedValue({ data: [] }),
}));

describe("WorkerDialog", () => {
  const mockForm = createMockWorkerPayload();
  const { setForm, setPendingFiles, onClose, onSubmit } =
    createMockServiceHandlers();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correct title based on mode", async () => {
    const { rerender } = renderWithAuth(
      <WorkerDialog
        open={true}
        mode="create"
        worker={null}
        form={mockForm}
        setForm={setForm}
        pendingFiles={{}}
        setPendingFiles={setPendingFiles}
        isSaving={false}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Create Worker")).toBeVisible();
    });

    rerender(
      <WorkerDialog
        open={true}
        mode="edit"
        worker={null}
        form={mockForm}
        setForm={setForm}
        pendingFiles={{}}
        setPendingFiles={setPendingFiles}
        isSaving={false}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Edit Worker")).toBeVisible();
    });
  });

  it("should call onSubmit and onClose handlers", async () => {
    const user = userEvent.setup();

    renderWithAuth(
      <WorkerDialog
        open={true}
        mode="create"
        worker={null}
        form={mockForm}
        setForm={setForm}
        pendingFiles={{}}
        setPendingFiles={setPendingFiles}
        isSaving={false}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );

    await user.click(await screen.findByText("Create worker"));
    expect(onSubmit).toHaveBeenCalled();

    await user.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("should disable button when saving", async () => {
    renderWithAuth(
      <WorkerDialog
        open={true}
        mode="create"
        worker={null}
        form={mockForm}
        setForm={setForm}
        pendingFiles={{}}
        setPendingFiles={setPendingFiles}
        isSaving={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );

    expect(await screen.findByText("Saving...")).toBeDisabled();
  });
});
