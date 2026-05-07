import { screen, render } from "@testing-library/react";
import { ExternalWorkerDialog } from "../external-worker-dialog";
import {
  createMockWorker,
  createMockServiceHandlers,
} from "@/__tests__/helpers";

jest.mock("../../../../../../services", () => ({
  API_BASE_URL: "http://localhost:3000",
}));

describe("ExternalWorkerDialog", () => {
  const { onClose } = createMockServiceHandlers();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render null when no worker", () => {
    const { container } = render(
      <ExternalWorkerDialog open={true} worker={null} onClose={onClose} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render dialog with worker data", () => {
    const mockWorker = createMockWorker({ first_name: "External Worker" });

    render(
      <ExternalWorkerDialog
        open={true}
        worker={mockWorker}
        onClose={onClose}
      />,
    );

    expect(screen.getByText("Worker data")).toBeVisible();
    expect(screen.getByText("Documents")).toBeVisible();
  });
});
