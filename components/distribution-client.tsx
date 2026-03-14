"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Search,
  Save,
  Users,
  CalendarDays,
  Package2,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  searchFamiliesApi,
  saveDistributionAction,
} from "@/server/distribution-actions";
import { formatNumber, monthOptions } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import type { Item } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type FamilyLite = {
  id: string;
  family_code: string;
  family_name: string;
  members_count: number;
  area: string | null;
};

type SaveMessage = {
  type: "success" | "error";
  text: string;
};

export function DistributionClient({
  items,
  initialMonth,
  initialYear,
}: {
  items: Item[];
  initialMonth: number;
  initialYear: number;
}) {
  const [query, setQuery] = useState("");
  const [families, setFamilies] = useState<FamilyLite[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<FamilyLite | null>(null);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [notes, setNotes] = useState("");
  const [membersCount, setMembersCount] = useState(1);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<SaveMessage | null>(null);
  const [isPending, startTransition] = useTransition();
  const [familyPickerOpen, setFamilyPickerOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const result = await searchFamiliesApi(query);
        setFamilies(result ?? []);
      } catch (error) {
        console.error("Family search failed:", error);
        setFamilies([]);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const calculatedItems = useMemo(() => {
    return items.map((item) => {
      const calculated =
        item.calculation_type === "per_person"
          ? Number(item.default_quantity) * membersCount
          : Number(item.default_quantity);

      return {
        ...item,
        calculated,
        delivered: overrides[item.id] ?? calculated,
      };
    });
  }, [items, membersCount, overrides]);

  const onFamilySelect = (family: FamilyLite) => {
    setSelectedFamily(family);
    setMembersCount(family.members_count);
    setOverrides({});
    setNotes("");
    setMessage(null);
    setFamilyPickerOpen(false);
  };

  const onSubmit = () => {
    if (!selectedFamily) return;

    setMessage(null);

    startTransition(async () => {
      try {
        const result = await saveDistributionAction({
          family_id: selectedFamily.id,
          month,
          year,
          members_count_at_delivery: membersCount,
          notes,
          items: calculatedItems.map((item) => ({
            item_id: item.id,
            calculated_quantity: item.calculated,
            delivered_quantity: Number(item.delivered),
          })),
        });

        if (result?.error) {
          setMessage({
            type: "error",
            text: result.error,
          });
          return;
        }

        setMessage({
          type: "success",
          text: result?.success ?? "تم حفظ سجل التوزيع بنجاح",
        });
      } catch (error) {
        console.error("Save distribution failed:", error);
        setMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "حدث خطأ أثناء حفظ سجل التوزيع",
        });
      }
    });
  };

  return (
    <>
      <div className="space-y-4">
        {/* بطاقة اختيار العائلة */}
        <Card className="overflow-hidden rounded-[30px] border border-white/10 bg-white/90 shadow-sm backdrop-blur">
          <CardHeader className="border-b border-slate-100 bg-white/80 pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <Users className="size-5" />
                </div>

                <div className="min-w-0">
                  <CardTitle className="text-xl font-extrabold text-slate-900">
                    اختيار العائلة
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm leading-6 text-slate-500">
                    اختر العائلة من نافذة البحث السريعة ثم أكمل التوزيع مباشرة.
                  </CardDescription>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setFamilyPickerOpen(true)}
                className="h-11 rounded-2xl bg-violet-600 px-4 text-white hover:bg-violet-700"
              >
                <Search className="me-2 size-4" />
                {selectedFamily ? "تغيير العائلة" : "اختيار عائلة"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6">
            {selectedFamily ? (
              <div className="rounded-[24px] border border-violet-200 bg-violet-50/70 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-slate-900">
                      {selectedFamily.family_name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedFamily.family_code}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span className="rounded-xl bg-white px-3 py-1 font-medium">
                        {selectedFamily.members_count} أفراد
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1 font-medium">
                        <MapPin className="size-3.5" />
                        {selectedFamily.area ?? "بدون منطقة"}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFamilyPickerOpen(true)}
                    className="h-10 rounded-2xl border-violet-200 bg-white hover:bg-violet-50"
                  >
                    تبديل
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-slate-500">
                لم يتم اختيار عائلة بعد
              </div>
            )}
          </CardContent>
        </Card>

        {/* التوزيع الشهري */}
        <Card className="min-w-0 overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/90 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-white pb-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Package2 className="size-5" />
              </div>

              <div className="min-w-0">
                <CardTitle className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  التوزيع الشهري
                </CardTitle>
                <CardDescription className="mt-1 text-sm leading-6 text-slate-500">
                  الحساب تلقائي مع إمكانية تعديل الكمية المسلّمة قبل الحفظ.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  الشهر
                </label>
                <Select
                  value={String(month)}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="bg-white"
                >
                  {monthOptions.map((label, index) => (
                    <option key={label} value={index + 1}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  السنة
                </label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  عدد الأفراد وقت التسليم
                </label>
                <Input
                  type="number"
                  min={1}
                  value={membersCount}
                  onChange={(e) => setMembersCount(Number(e.target.value))}
                  disabled={!selectedFamily}
                  className="bg-white"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <CalendarDays className="size-4" />
                  <p className="text-sm">العائلة المختارة</p>
                </div>
                <p className="break-words text-sm font-semibold text-slate-900 sm:text-base">
                  {selectedFamily?.family_name ?? "لم يتم الاختيار"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="hidden overflow-x-auto rounded-[24px] border border-slate-200 bg-white md:block">
                <div className="min-w-[760px]">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-4 text-right font-semibold">المادة</th>
                        <th className="px-4 py-4 text-right font-semibold">الوحدة</th>
                        <th className="px-4 py-4 text-right font-semibold">نوع الحساب</th>
                        <th className="px-4 py-4 text-right font-semibold">الكمية المحسوبة</th>
                        <th className="px-4 py-4 text-right font-semibold">الكمية المسلّمة</th>
                      </tr>
                    </thead>

                    <tbody>
                      {calculatedItems.map((item) => (
                        <tr key={item.id} className="border-t border-slate-200">
                          <td className="px-4 py-4 font-semibold text-slate-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-4 text-slate-600">{item.unit}</td>
                          <td className="px-4 py-4 text-slate-600">
                            {item.calculation_type === "per_person"
                              ? "لكل فرد"
                              : "لكل عائلة"}
                          </td>
                          <td className="px-4 py-4 text-slate-900">
                            {formatNumber(item.calculated)}
                          </td>
                          <td className="px-4 py-4">
                            <Input
                              type="number"
                              step="0.01"
                              min={0}
                              value={item.delivered}
                              onChange={(e) =>
                                setOverrides((prev) => ({
                                  ...prev,
                                  [item.id]: Number(e.target.value),
                                }))
                              }
                              className="bg-white"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-3 md:hidden">
                {calculatedItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{item.unit}</p>
                      </div>

                      <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {item.calculation_type === "per_person"
                          ? "لكل فرد"
                          : "لكل عائلة"}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">الكمية المحسوبة</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatNumber(item.calculated)}
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-medium text-slate-500">
                          الكمية المسلّمة
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          value={item.delivered}
                          onChange={(e) =>
                            setOverrides((prev) => ({
                              ...prev,
                              [item.id]: Number(e.target.value),
                            }))
                          }
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                ملاحظات
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white"
                placeholder="أضف أي ملاحظات تخص عملية التوزيع..."
              />
            </div>

            {message ? (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  message.type === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {message.text}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">
                راجع الكميات المسلّمة وعدد الأفراد قبل حفظ السجل.
              </p>

              <Button
                onClick={onSubmit}
                disabled={!selectedFamily || isPending}
                className="h-11 w-full gap-2 sm:w-auto"
              >
                <Save className="size-4" />
                {isPending ? "جارٍ الحفظ..." : "حفظ سجل التوزيع"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نافذة اختيار العائلة */}
      <Sheet open={familyPickerOpen} onOpenChange={setFamilyPickerOpen}>
        <SheetContent
          side="right"
          className="w-full border-l border-white/10 bg-white/95 p-0 sm:max-w-xl"
        >
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-slate-200 px-5 py-5 text-right sm:px-6">
              <SheetTitle className="text-xl font-extrabold text-slate-900">
                اختيار العائلة
              </SheetTitle>
              <SheetDescription className="mt-1 text-sm leading-6 text-slate-500">
                ابحث بالاسم أو رمز العائلة، ثم اختر العائلة للعودة مباشرة إلى التوزيع الشهري.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-hidden px-5 py-5 sm:px-6">
              <div className="relative mb-4">
                <Search className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12 rounded-2xl pr-11"
                  placeholder="ابحث بسرعة..."
                  autoFocus
                />
              </div>

              <div className="h-[calc(100vh-180px)] overflow-y-auto pe-1">
                <div className="space-y-2">
                  {families.length ? (
                    families.map((family) => {
                      const isActive = selectedFamily?.id === family.id;

                      return (
                        <button
                          key={family.id}
                          onClick={() => onFamilySelect(family)}
                          className={`w-full rounded-[22px] border p-4 text-right transition-all duration-200 ${
                            isActive
                              ? "border-violet-200 bg-violet-50 shadow-sm"
                              : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-base font-bold text-slate-900">
                                {family.family_name}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {family.family_code}
                              </p>
                            </div>

                            <div
                              className={`shrink-0 rounded-xl px-3 py-1 text-xs font-medium ${
                                isActive
                                  ? "bg-violet-100 text-violet-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {family.members_count} أفراد
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            <MapPin className="size-3.5 shrink-0" />
                            <span className="truncate">
                              {family.area ?? "بدون منطقة"}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center justify-end gap-1 text-xs font-medium text-violet-700">
                            <span>اختيار العائلة</span>
                            <ChevronLeft className="size-3.5" />
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                      لا توجد نتائج مطابقة حاليًا
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}