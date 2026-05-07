import { render, screen } from "@testing-library/react";
import { SearchableSelect } from "../serchable-select";

type TestItem = {
  id: number;
  name: string;
};

describe("SearchableSelect", () => {
  const mockItems: TestItem[] = [
    { id: 1, name: "Item One" },
    { id: 2, name: "Item Two" },
  ];

  const mockProps = {
    label: "Select Item",
    placeholder: "Choose an item",
    searchPlaceholder: "Search items...",
    items: mockItems,
    selectedId: null,
    onSelect: jest.fn(),
    getId: (item: TestItem) => item.id,
    getLabel: (item: TestItem) => item.name,
  };

  it("should render label", () => {
    render(<SearchableSelect {...mockProps} />);
    expect(screen.getByText("Select Item")).toBeVisible();
  });

  it("should display selected value", () => {
    const propsWithSelection = {
      ...mockProps,
      selectedId: 1,
    };

    render(<SearchableSelect {...propsWithSelection} />);

    expect(screen.getByText("Item One")).toBeVisible();
  });
});
