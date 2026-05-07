import { render, screen } from "@testing-library/react";
import { CustomInput } from "../custom-input";

describe("CustomInput", () => {
  it("should render label and input", () => {
    render(<CustomInput label="Email" value="" onChange={jest.fn()} />);

    expect(screen.getByText("Email")).toBeVisible();
    expect(screen.getByRole("textbox")).toBeVisible();
  });

  it("should display value", () => {
    render(<CustomInput label="Name" value="John Doe" onChange={jest.fn()} />);

    expect(screen.getByDisplayValue("John Doe")).toBeVisible();
  });
});
