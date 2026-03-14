"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Family } from "@/lib/types";
import { upsertFamilyAction } from "@/server/family-actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState = { error: "", success: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto">
      {pending ? "جارٍ الحفظ..." : "حفظ العائلة"}
    </Button>
  );
}

export function FamilyForm({
  family,
  onDone,
}: {
  family?: Partial<Family>;
  onDone?: () => void;
}) {
  const [state, formAction] = useActionState(upsertFamilyAction, initialState);

  return (
    <Card className="rounded-3xl border border-white/60 bg-white/75 shadow-sm backdrop-blur">
      <CardHeader>
        <CardTitle>{family?.id ? "تعديل العائلة" : "إضافة عائلة"}</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" defaultValue={family?.id} />

          <div>
            <label className="mb-2 block text-sm font-medium">رمز العائلة</label>
            <Input name="family_code" defaultValue={family?.family_code} required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">اسم العائلة</label>
            <Input name="family_name" defaultValue={family?.family_name} required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">عدد الأفراد</label>
            <Input
              name="members_count"
              type="number"
              min={1}
              defaultValue={family?.members_count ?? 1}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">رقم الهاتف</label>
            <Input name="phone" defaultValue={family?.phone ?? ""} />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium">المنطقة</label>
            <Input name="area" defaultValue={family?.area ?? ""} />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              defaultChecked={family?.is_active ?? true}
              className="size-4"
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              فعالة
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium">ملاحظات</label>
            <Textarea name="notes" defaultValue={family?.notes ?? ""} />
          </div>

          {state.error ? (
            <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>
          ) : null}

          {state.success ? (
            <p className="text-sm text-emerald-600 sm:col-span-2">{state.success}</p>
          ) : null}

          <div className="sm:col-span-2">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}