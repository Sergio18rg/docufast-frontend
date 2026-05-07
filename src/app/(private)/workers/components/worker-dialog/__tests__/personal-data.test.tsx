import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PersonalData } from "../personal-data";
import {
  createMockWorkerPayload,
  createMockServiceHandlers,
} from "@/__tests__/helpers";

describe("PersonalData", () => {
  const mockForm = createMockWorkerPayload({
    first_name: "John",
    last_name_1: "Doe",
    document_number: "12345678A",
  });
  const { updateField } = createMockServiceHandlers();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render and handle input changes", async () => {
    const user = userEvent.setup();

    render(
      <PersonalData
        form={mockForm}
        isViewMode={false}
        updateField={updateField}
      />,
    );

    expect(screen.getByDisplayValue("John")).toBeVisible();

    const firstNameInput = screen.getByDisplayValue("John");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Jane");

    expect(updateField).toHaveBeenCalled();
  });

  it("should disable inputs in view mode", () => {
    render(
      <PersonalData
        form={mockForm}
        isViewMode={true}
        updateField={updateField}
      />,
    );

    expect(screen.getByDisplayValue("John")).toBeDisabled();
  });
});
