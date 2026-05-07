import { screen } from "@testing-library/react";
import { CompanyData } from "../company-data";
import {
  renderWithAuth,
  setupMocksBeforeEach,
  createMockWorkerPayload,
  createMockServiceHandlers,
} from "@/__tests__/helpers";

const mockGetClients = jest.fn();
const mockGetVehicles = jest.fn();

jest.mock("../../../../../../services", () => ({
  getClients: () => mockGetClients(),
  getVehicles: () => mockGetVehicles(),
}));

describe("CompanyData", () => {
  const mockForm = createMockWorkerPayload({
    company_worker_code: "W001",
    email: "john@test.com",
  });
  const { updateField } = createMockServiceHandlers();

  setupMocksBeforeEach(mockGetClients, mockGetVehicles);

  it("should render company data section", () => {
    renderWithAuth(
      <CompanyData
        form={mockForm}
        isViewMode={false}
        updateField={updateField}
        worker={null}
      />,
    );

    expect(screen.getByText("Company data")).toBeVisible();
  });
});
