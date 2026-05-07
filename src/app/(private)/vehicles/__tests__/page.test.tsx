import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VehiclesPage from "../page";
import {
  renderWithAuth,
  setupMocksBeforeEach,
} from "../../../../__tests__/helpers";

const mockGetVehicles = jest.fn();

jest.mock("../../../../services", () => ({
  getVehicles: () => mockGetVehicles(),
  createVehicle: jest.fn(),
  updateVehicle: jest.fn(),
  deleteVehicle: jest.fn(),
  restoreVehicle: jest.fn(),
  uploadVehicleDocument: jest.fn(),
}));

describe("VehiclesPage", () => {
  setupMocksBeforeEach(mockGetVehicles);

  it("should render title and search bar", async () => {
    renderWithAuth(<VehiclesPage />);

    await waitFor(() => {
      expect(screen.getByText("Vehicles")).toBeVisible();
      expect(
        screen.getByPlaceholderText(/search by vehicle id/i),
      ).toBeVisible();
    });
  });

  it("should open dialog when clicking add vehicle button", async () => {
    const user = userEvent.setup();

    renderWithAuth(<VehiclesPage />);

    const addButton = await screen.findByText("Add vehicle");
    await user.click(addButton);

    expect(await screen.findByText("Create Vehicle")).toBeVisible();
  });
});
