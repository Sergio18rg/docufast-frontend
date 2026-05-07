import { render, screen } from "@testing-library/react";
import { CustomTable } from "../custom-table";

describe("CustomTable", () => {
  const mockTableRows = {
    COLUMN_DEFINITION: [],
  };

  it("should render table with loading state", () => {
    render(
      <CustomTable
        headers={["Name", "Email"]}
        tableData={[]}
        tableRows={mockTableRows}
        isLoading={true}
      />,
    );

    expect(screen.getByRole("status")).toBeVisible();
  });

  it("should render table headers", () => {
    render(
      <CustomTable
        headers={["Name", "Email"]}
        tableData={[]}
        tableRows={mockTableRows}
        isLoading={false}
      />,
    );

    expect(screen.getByText("Name")).toBeVisible();
    expect(screen.getByText("Email")).toBeVisible();
  });
});
