import { render, screen } from "@testing-library/react";
import { CustomSelect } from "../custom-select";

describe("CustomSelect", () => {
  const mockProps = {
    label: "Status",
    options: ["Active", "Inactive"],
    valueSelect: "Active",
    onValueChange: jest.fn(),
    triggerStyles: {
      Active: "bg-green-50",
      Inactive: "bg-red-50",
    },
    colors: {
      Active: "text-green-700",
      Inactive: "text-red-700",
    },
  };

  it("should render label and select", () => {
    render(<CustomSelect {...mockProps} />);

    expect(screen.getByText("Status")).toBeVisible();
  });
});
