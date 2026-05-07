import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "../search-bar";

describe("SearchBar", () => {
  it("should render with placeholder", () => {
    render(
      <SearchBar
        searchTerm=""
        setSearchTerm={jest.fn()}
        placeholder="Search items..."
      />,
    );

    expect(screen.getByPlaceholderText("Search items...")).toBeVisible();
  });

  it("should call setSearchTerm on input change", async () => {
    const user = userEvent.setup();
    const setSearchTerm = jest.fn();

    render(<SearchBar searchTerm="" setSearchTerm={setSearchTerm} />);

    const input = screen.getByPlaceholderText("Search...");
    await user.type(input, "test");

    expect(setSearchTerm).toHaveBeenCalled();
  });
});
