import { getCurrentMonthYear, monthOptions, formatNumber } from "@/lib/utils";
import { getMonthlyReport } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportExportButtons } from "@/components/report-export-buttons";
import { ExportFamilyReportButton } from "@/components/export-family-report-button";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const current = getCurrentMonthYear();
  const params = await searchParams;
  const month = Number(params.month ?? current.month);
  const year = Number(params.year ?? current.year);
  const report = await getMonthlyReport(month, year);

  const totals = new Map<string, { unit: string; total: number }>();

  for (const record of report as any[]) {
    for (const item of record.monthly_distribution_items) {
      const existing = totals.get(item.item_name_snapshot) ?? {
        unit: item.unit_snapshot,
        total: 0,
      };
      existing.total += Number(item.delivered_quantity);
      totals.set(item.item_name_snapshot, existing);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border border-white/60 bg-white/75 shadow-sm backdrop-blur">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>التقارير</CardTitle>
            <CardDescription>
              {monthOptions[month - 1]} {year}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="overflow-x-auto">
            <div className="min-w-fit">
              <ReportExportButtons month={month} year={year} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...totals.entries()].map(([name, value]) => (
              <div
                key={name}
                className="rounded-2xl border bg-white/70 p-4 shadow-sm"
              >
                <p className="font-medium">{name}</p>
                <p className="mt-2 text-2xl font-bold">
                  {formatNumber(value.total)}
                </p>
                <p className="text-xs text-muted-foreground">{value.unit}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {report.map((row: any) => (
              <div
                key={row.id}
                className="rounded-2xl border bg-white/60 p-4 shadow-sm"
              >
                <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold">{row.families.family_name}</p>

                    <p className="text-xs leading-6 text-muted-foreground">
                      {row.families.family_code} • أفراد وقت التسليم:{" "}
                      {row.members_count_at_delivery}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:items-end">
                    <p className="text-xs text-muted-foreground">
                      {row.families.area ?? "-"}
                    </p>

                    <div className="w-full sm:w-auto">
                      <ExportFamilyReportButton familyId={row.family_id} />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {row.monthly_distribution_items.map((item: any) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-white p-3 text-sm shadow-sm"
                    >
                      <p className="font-medium">{item.item_name_snapshot}</p>
                      <p className="mt-1 text-muted-foreground">
                        {formatNumber(item.delivered_quantity)}{" "}
                        {item.unit_snapshot}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}