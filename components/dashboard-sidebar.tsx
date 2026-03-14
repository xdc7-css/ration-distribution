"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";

import {
  Boxes,
  ClipboardList,
  Home,
  Package,
  Users,
  FileSpreadsheet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const links: { href: Route; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "لوحة التحكم", icon: Home },
  { href: "/dashboard/families", label: "العوائل", icon: Users },
  { href: "/dashboard/items", label: "المواد", icon: Package },
  {
    href: "/dashboard/distribution",
    label: "التوزيع الشهري",
    icon: ClipboardList,
  },
  { href: "/dashboard/reports", label: "التقارير", icon: FileSpreadsheet },
  { href: "/dashboard/backups", label: "النسخ الاحتياطي", icon: Boxes },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-4 lg:hidden">
        <div className="glass rounded-3xl border border-white/60 p-3 shadow-glass">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/70 p-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Image
                src="/icons/items/calculator.png"
                alt="logo"
                width={48}
                height={48}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold">{APP_NAME}</p>
              <p className="text-xs text-muted-foreground">إدارة داخلية خاصة</p>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {links.map((link) => {
              const Icon = link.icon;
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center gap-2 rounded-2xl px-3 py-3 text-center text-xs font-medium transition",
                    active
                      ? "bg-primary text-white shadow-soft"
                      : "bg-white/70 hover:bg-white"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="leading-5">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <aside className="glass sticky top-4 hidden h-[calc(100vh-2rem)] w-full max-w-[300px] shrink-0 flex-col rounded-3xl border border-white/60 p-5 shadow-glass lg:flex">
        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-white/70 p-4">
          <div className="rounded-2xl bg-primary/10 p-2">
            <Image
              src="/icons/items/calculator.png"
              alt="logo"
              width={64}
              height={64}
            />
          </div>

         <div className="min-w-0 flex-1">
  <p className="text-right text-lg font-extrabold leading-7 text-slate-900 whitespace-normal break-words">
    {APP_NAME}
  </p>
  <p className="mt-1 text-sm text-slate-500">
    إدارة داخلية خاصة
  </p>
</div>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  active
                    ? "bg-primary text-white shadow-soft"
                    : "hover:bg-white/70"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}