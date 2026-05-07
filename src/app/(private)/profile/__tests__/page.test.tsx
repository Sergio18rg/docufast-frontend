import { screen, waitFor } from "@testing-library/react";
import ProfilePage from "../page";
import { renderWithAuth } from "../../../../__tests__/helpers";

describe("ProfilePage", () => {
  it("should render title and description", async () => {
    renderWithAuth(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Profile")).toBeVisible();
      expect(
        screen.getByText(
          "Personal information and visible documents for your account.",
        ),
      ).toBeVisible();
    });
  });

  it("should render personal information section", async () => {
    renderWithAuth(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Personal information")).toBeVisible();
    });
  });
});
