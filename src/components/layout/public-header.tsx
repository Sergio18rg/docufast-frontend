"use client";

import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
} from "@/components";
import { useIsMobile } from "@/hooks";
import { ROUTES, NAV_ITEMS } from "@/constants";
import { t } from "@/lib/t";

const styles = {
  desktopLink:
    "inline-flex h-10 items-center justify-center rounded-md px-4 text-base font-medium text-slate-900 transition-colors hover:text-slate-700",
  mobileLink:
    "flex items-center rounded-lg px-4 py-3 text-base font-medium text-slate-900 transition-colors hover:bg-slate-100",
  loginBase:
    "inline-flex items-center justify-center rounded-xl bg-slate-900 text-base font-medium text-white transition-colors hover:bg-slate-800",
} as const;

const Logo = () => (
  <Link href={ROUTES.public.home} className="flex items-center">
    <div className="relative h-16 w-32 md:h-20 md:w-40">
      <Image
        src="/images/login-truck.png"
        alt={t("common.logoAlt")}
        fill
        priority
        className="object-contain"
      />
    </div>
  </Link>
);

const DesktopNavigation = () => (
  <NavigationMenu viewport={false}>
    <NavigationMenuList className="gap-2">
      {NAV_ITEMS.map((item) => (
        <NavigationMenuItem key={item.href}>
          <NavigationMenuLink asChild>
            <Link href={item.href} className={styles.desktopLink}>
              {t(item.label)}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}

      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            href={ROUTES.public.login}
            className={`${styles.loginBase} ml-4 h-8 px-6`}
          >
            {t("common.login")}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

type MobileNavigationProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const MobileNavigation = ({ isOpen, setIsOpen }: MobileNavigationProps) => {
  const close = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("common.openMenu")}>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[80%] max-w-[320px]">
        <SheetHeader>
          <SheetTitle className="sr-only">
            {t("common.navigationMenu")}
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col px-6 pt-10 pb-6">
          <nav className="flex flex-col gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={styles.mobileLink}
              >
                {t(item.label)}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <Link
              href={ROUTES.public.login}
              onClick={close}
              className={`${styles.loginBase} w-full justify-center py-3`}
            >
              {t("common.login")}
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const PublicHeader = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-24 w-full max-w-400 items-center justify-between px-4 md:px-8">
        <Logo />
        {isMobile ? (
          <MobileNavigation isOpen={isSheetOpen} setIsOpen={setIsSheetOpen} />
        ) : (
          <DesktopNavigation />
        )}
      </div>
    </header>
  );
};
