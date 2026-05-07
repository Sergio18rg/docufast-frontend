import nextJest from "next/jest.js";

export default nextJest({ dir: "./" })({
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/src/__tests__/helpers/",
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/components/ui/**",
    "!src/app/**/layout.tsx",
    "!src/__tests__/helpers/**",
  ],
});
