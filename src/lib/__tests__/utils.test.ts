import { getDefaultRouteByRole } from "../utils";
import { ROLES, ROUTES } from "@/constants";

describe("utils", () => {
  describe("getDefaultRouteByRole", () => {
    it("should return correct route for Admin role", () => {
      expect(getDefaultRouteByRole(ROLES.ADMIN)).toStrictEqual(
        ROUTES.private.dashboard,
      );
    });

    it("should return correct route for Worker role", () => {
      expect(getDefaultRouteByRole(ROLES.WORKER)).toStrictEqual(
        ROUTES.private.profile,
      );
    });

    it("should return correct route for External role", () => {
      expect(getDefaultRouteByRole(ROLES.EXTERNAL)).toStrictEqual(
        ROUTES.private.workers,
      );
    });
  });
});
