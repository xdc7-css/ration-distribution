import { ClipboardCheck, Hourglass, Package2, Users } from "lucide-react";
import { getDashboardStats } from "@/lib/db";
import { formatNumber, monthOptions } from "@/lib/utils";
import { StatCard } from "@/components/stat-card";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="إجمالي العوائل"
          value={formatNumber(stats.totalFamilies)}
          description="عدد العوائل الفعالة"
          icon={<Users className="size-6" />}
        />
        <StatCard
          title="إجمالي الأفراد"
          value={formatNumber(stats.totalMembers)}
          description="مجموع الأفراد الحالي"
          icon={<Users className="size-6" />}
        />
        <StatCard
          title="العوائل المستلمة"
          value={formatNumber(stats.deliveredFamilies)}
          description={`خلال ${monthOptions[stats.month - 1]} ${stats.year}`}
          icon={<ClipboardCheck className="size-6" />}
        />
        <StatCard
          title="العوائل المعلّقة"
          value={formatNumber(stats.pendingFamilies)}
          description="لم تستلم بعد هذا الشهر"
          icon={<Hourglass className="size-6" />}
        />
      </div>

      <section className="rounded-[28px] border border-slate-200/70 bg-white/85 shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              إجمالي المواد الموزعة لهذا الشهر
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {monthOptions[stats.month - 1]} {stats.year}
            </p>
          </div>

          {stats.totalsByItem?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.totalsByItem.map((item: any) => (
                <div
                  key={item.item_name_snapshot}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-2 text-violet-600">
                    <Package2 className="size-4" />
                    <span className="font-medium">
                      {item.item_name_snapshot}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-slate-900">
                    {formatNumber(item.delivered_total)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              لا توجد بيانات توزيع لهذا الشهر بعد
            </div>
          )}
        </div>
      </section>
    </div>
  );
}