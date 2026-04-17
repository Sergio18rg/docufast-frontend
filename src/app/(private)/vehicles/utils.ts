import { COMPANY_OWNER } from "./constants";

const companyBadgeStyle = (company?: string) => {
  const safeCompany = (
    company && company in COMPANY_OWNER ? company : "Other"
  ) as keyof typeof COMPANY_OWNER;
  const color = COMPANY_OWNER[safeCompany]?.color ?? COMPANY_OWNER.Other.color;
  return { backgroundColor: `${color}22`, borderColor: color, color };
};

export { companyBadgeStyle };
