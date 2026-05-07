import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkersPage from "../page";
import {
  renderWithAuth,
  setupMocksBeforeEach,
} from "../../../../__tests__/helpers";

// Mock de servicios
const mockGetWorkers = jest.fn();
const mockGetClients = jest.fn();
const mockGetVehicles = jest.fn();

jest.mock("../../../../services", () => ({
  getWorkers: () => mockGetWorkers(),
  createWorker: jest.fn(),
  updateWorker: jest.fn(),
  deleteWorker: jest.fn(),
  restoreWorker: jest.fn(),
  uploadWorkerDocument: jest.fn(),
  getClients: () => mockGetClients(),
  getVehicles: () => mockGetVehicles(),
}));

jest.mock("../hooks", () => ({
  useTableRows: () => ({
    EXTERNAL_TABLE_ROWS: { COLUMN_DEFINITION: [] },
    TABLE_ROWS: { COLUMN_DEFINITION: [] },
  }),
}));

describe("WorkersPage", () => {
  setupMocksBeforeEach(mockGetWorkers, mockGetClients, mockGetVehicles);

  it("should render title and search bar", async () => {
    renderWithAuth(<WorkersPage />);

    await waitFor(() => {
      expect(screen.getByText("Workers")).toBeVisible();
      expect(screen.getByPlaceholderText(/search by name/i)).toBeVisible();
    });
  });

  it("should open dialog when clicking add worker button", async () => {
    const user = userEvent.setup();

    renderWithAuth(<WorkersPage />);

    const addButton = await screen.findByText("Add Worker");
    await user.click(addButton);

    expect(await screen.findByText("Create Worker")).toBeVisible();
  });
});
