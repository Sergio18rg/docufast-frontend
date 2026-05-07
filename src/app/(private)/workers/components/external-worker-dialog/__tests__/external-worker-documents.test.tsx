import { render, screen } from "@testing-library/react";
import { ExternalWorkerDocuments } from "../external-worker-documents";
import { createMockWorkerDocument } from "@/__tests__/helpers";

jest.mock("../../../../../../services", () => ({
  API_BASE_URL: "http://localhost:3000",
}));

describe("ExternalWorkerDocuments", () => {
  it("should show message when no documents", () => {
    render(<ExternalWorkerDocuments documents={[]} />);

    expect(screen.getByText("No external documents available.")).toBeVisible();
  });

  it("should render documents list", () => {
    const mockDocuments = [createMockWorkerDocument()];

    render(<ExternalWorkerDocuments documents={mockDocuments} />);

    expect(screen.getByText("DNI")).toBeVisible();
    expect(screen.getByText("identity_document")).toBeVisible();
    expect(screen.getByText("Download")).toBeVisible();
  });
});
