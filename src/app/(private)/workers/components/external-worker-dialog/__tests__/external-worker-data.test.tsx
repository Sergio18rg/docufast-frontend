import { render, screen } from "@testing-library/react";
import { ExternalWorkerData } from "../external-worker-data";
import { createMockWorker } from "@/__tests__/helpers";

describe("ExternalWorkerData", () => {
  it("should render worker data with disabled inputs", () => {
    const mockWorker = createMockWorker({
      first_name: "Jane",
      last_name_1: "Smith",
      document_number: "98765432B",
    });

    render(<ExternalWorkerData worker={mockWorker} />);

    expect(screen.getByDisplayValue("Jane")).toBeDisabled();
    expect(screen.getByDisplayValue("Smith")).toBeDisabled();
    expect(screen.getByDisplayValue("98765432B")).toBeDisabled();
  });
});
