import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClientsPage from "../page";
import {
  renderWithAuth,
  setupMocksBeforeEach,
} from "../../../../__tests__/helpers";

const mockGetClients = jest.fn();

jest.mock("../../../../services", () => ({
  getClients: () => mockGetClients(),
  createClient: jest.fn(),
  updateClient: jest.fn(),
  deleteClient: jest.fn(),
  restoreClient: jest.fn(),
  uploadClientDocument: jest.fn(),
}));

describe("ClientsPage", () => {
  setupMocksBeforeEach(mockGetClients);

  it("should render title and search bar", async () => {
    renderWithAuth(<ClientsPage />);

    await waitFor(() => {
      expect(screen.getByText("Clients")).toBeVisible();
      expect(screen.getByPlaceholderText(/search by client id/i)).toBeVisible();
    });
  });

  it("should open dialog when clicking add client button", async () => {
    const user = userEvent.setup();

    renderWithAuth(<ClientsPage />);

    const addButton = await screen.findByText("Add client");
    await user.click(addButton);

    expect(await screen.findByText("Create Client")).toBeVisible();
  });
});
