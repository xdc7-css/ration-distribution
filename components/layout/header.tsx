import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/server/auth-actions";

export function Header() {
  return (
    <header className="glass mb-6 rounded-3xl border border-white/60 p-4 shadow-glass">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-bold sm:text-xl">لوحة الإدارة</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            إدارة العوائل والمواد والتوزيع الشهري
          </p>
        </div>

        <form action={signOutAction} className="w-full sm:w-auto">
          <Button
            type="submit"
            variant="outline"
            className="w-full gap-2 sm:w-auto"
          >
            <LogOut className="size-4" />
            تسجيل الخروج
          </Button>
        </form>
      </div>
    </header>
  );
}