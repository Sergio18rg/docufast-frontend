import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleButton } from "../toggle-button";

describe("ToggleButton", () => {
  it("should render with enabled state", () => {
    render(<ToggleButton enabled={true} setEnabled={jest.fn()} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("should render with disabled state", () => {
    render(<ToggleButton enabled={false} setEnabled={jest.fn()} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("should toggle state on click", async () => {
    const user = userEvent.setup();
    const setEnabled = jest.fn();

    render(<ToggleButton enabled={false} setEnabled={setEnabled} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(setEnabled).toHaveBeenCalledWith(true);
  });
});
