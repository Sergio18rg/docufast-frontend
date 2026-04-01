"use client";

import Link from "next/link";
import { useAuth } from "@/hooks";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { ROUTES } from "@/constants";

import { User, Users, Truck, Building, BarChart, LogOut } from "lucide-react";

const GENERAL_MENU = {
  title: "General",
  items: [
    {
      title: "Profile",
      url: ROUTES.private.profile,
      icon: User,
    },
  ],
};

const WORKER_ITEM = {
  title: "Workers",
  url: ROUTES.private.workers,
  icon: Users,
};

const sidebarMenuByRole = {
  Administrator: [
    GENERAL_MENU,
    {
      title: "Admin",
      items: [
        {
          title: "Dashboard",
          url: ROUTES.private.dashboard,
          icon: BarChart,
        },
        WORKER_ITEM,
        {
          title: "Vehicles",
          url: ROUTES.private.vehicles,
          icon: Truck,
        },
        {
          title: "Clients",
          url: ROUTES.private.clients,
          icon: Building,
        },
      ],
    },
  ],

  Worker: [GENERAL_MENU],

  External: [
    {
      title: "Client",
      items: [WORKER_ITEM],
    },
  ],
};

export const AppSidebar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const menu = sidebarMenuByRole[user.role];

  return (
    <Sidebar>
      <SidebarContent>
        {menu.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-300" />

            <div className="text-sm">
              <p className="font-medium">{user.user_id}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="rounded-md p-2 hover:bg-slate-200 transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4 text-red-700" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
