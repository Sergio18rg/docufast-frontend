import { render, screen } from "@testing-library/react";
import { CustomButton, ICONS } from "../custom-button";

describe("CustomButton", () => {
  it("should render button with text", () => {
    render(<CustomButton text="Click me" />);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeVisible();
  });

  it("should render button with icon and text", () => {
    render(<CustomButton text="Add" icon={ICONS.ADD} />);
    expect(screen.getByRole("button", { name: /add/i })).toBeVisible();
  });
});
