import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number | string | null | undefined) {
  const num = Number(value ?? 0);
  return new Intl.NumberFormat("ar-IQ", {
    maximumFractionDigits: 2,
  }).format(num);
}

export function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export const monthOptions = [
  "1 — كانون الثاني",
  "2 — شباط",
  "3 — آذار",
  "4 — نيسان",
  "5 — أيار",
  "6 — حزيران",
  "7 — تموز",
  "8 — آب",
  "9 — أيلول",
  "10 — تشرين الأول",
  "11 — تشرين الثاني",
  "12 — كانون الأول",
];