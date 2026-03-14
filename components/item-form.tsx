"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Item } from "@/lib/types";
import { upsertItemAction } from "@/server/item-actions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackagePlus } from "lucide-react";

const initialState = { error: "", success: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="h-11 w-full sm:w-auto">
      {pending ? "جارٍ الحفظ..." : "حفظ المادة"}
    </Button>
  );
}

export function ItemForm({
  item,
  embedded = false,
}: {
  item?: Partial<Item>;
  embedded?: boolean;
}) {
  const [state, formAction] = useActionState(upsertItemAction, initialState);

  const formBody = (
    <CardContent className={embedded ? "p-0" : "p-5 sm:p-6"}>
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="id" defaultValue={item?.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              اسم المادة
            </label>
            <Input
              name="name"
              defaultValue={item?.name}
              placeholder="مثال: رز"
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              الوحدة
            </label>
            <Input
              name="unit"
              defaultValue={item?.unit}
              placeholder="كغم / لتر / علبة"
              required
              className="bg-white"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              الكمية الافتراضية
            </label>
            <Input
              name="default_quantity"
              type="number"
              step="0.01"
              min={0}
              defaultValue={item?.default_quantity ?? 0}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              نوع الحساب
            </label>
            <Select
              name="calculation_type"
              defaultValue={item?.calculation_type ?? "per_person"}
              className="bg-white"
            >
              <option value="per_person">لكل فرد</option>
              <option value="per_family">لكل عائلة</option>
            </Select>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <label
            htmlFor="item_active"
            className="flex cursor-pointer items-center gap-3"
          >
            <input
              id="item_active"
              name="is_active"
              type="checkbox"
              defaultChecked={item?.is_active ?? true}
              className="size-4 rounded"
            />
            <div>
              <p className="text-sm font-medium text-slate-800">فعالة</p>
              <p className="text-xs text-slate-500">
                عند التفعيل ستظهر المادة ضمن الاستخدامات اليومية.
              </p>
            </div>
          </label>
        </div>

        {state.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {state.error}
          </div>
        ) : null}

        {state.success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {state.success}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            تأكد من اسم المادة والوحدة قبل الحفظ لتجنب التكرار.
          </p>

          <SubmitButton />
        </div>
      </form>
    </CardContent>
  );

  if (embedded) {
    return <div className="space-y-5">{formBody}</div>;
  }

  return (
    <Card className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/90 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-l from-violet-50/70 via-white to-white pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <PackagePlus className="size-5" />
          </div>

          <div>
            <CardTitle className="text-xl font-extrabold text-slate-900">
              {item?.id ? "تعديل المادة" : "إضافة مادة"}
            </CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              أدخل تفاصيل المادة كما ستُستخدم في التوزيع.
            </p>
          </div>
        </div>
      </CardHeader>

      {formBody}
    </Card>
  );
}