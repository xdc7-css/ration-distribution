import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
};

export function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="mb-2 text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}