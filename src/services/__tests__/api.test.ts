import { getApiErrorMessage } from "../api";
import axios from "axios";

describe("api", () => {
  describe("getApiErrorMessage", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should extract message from Axios error response", () => {
      const error = {
        response: {
          data: { message: "Validation failed" },
        },
        message: "Request failed",
      };

      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      expect(getApiErrorMessage(error)).toStrictEqual("Validation failed");
    });

    it("should handle Error instances", () => {
      const error = new Error("Something went wrong");
      expect(getApiErrorMessage(error)).toStrictEqual("Something went wrong");
    });

    it("should use fallback for unknown errors", () => {
      expect(getApiErrorMessage({ unknown: "error" })).toStrictEqual(
        "Request failed",
      );
    });
  });
});
