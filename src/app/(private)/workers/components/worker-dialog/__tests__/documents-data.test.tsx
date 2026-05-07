import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocumentsData } from "../documents-data";
import {
  renderWithAuth,
  createMockWorkerPayload,
  createMockWorker,
  createMockServiceHandlers,
} from "@/__tests__/helpers";

jest.mock("../../../../../../services", () => ({
  API_BASE_URL: "http://localhost:3000",
  removeWorkerDocument: jest.fn(),
  uploadWorkerDocument: jest.fn(),
}));

describe("DocumentsData", () => {
  const mockForm = createMockWorkerPayload();
  const mockWorker = createMockWorker();
  const { setForm, setPendingFiles } = createMockServiceHandlers();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add document when clicking add button", async () => {
    const user = userEvent.setup();

    renderWithAuth(
      <DocumentsData
        form={mockForm}
        isViewMode={false}
        setForm={setForm}
        pendingFiles={{}}
        setPendingFiles={setPendingFiles}
        worker={mockWorker}
      />,
    );

    const addButton = screen.getByText("Add additional document");
    await user.click(addButton);

    expect(setForm).toHaveBeenCalled();
  });
});
