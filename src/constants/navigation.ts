import { ROUTES } from "./routes";

const NAV_ITEMS = [
  { href: ROUTES.public.home, label: "public.home.nav" },
  { href: ROUTES.public.about, label: "public.about.nav" },
  { href: ROUTES.public.contact, label: "public.contact.nav" },
] as const;

export { NAV_ITEMS };
