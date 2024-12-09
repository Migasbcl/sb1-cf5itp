import { User } from "@/lib/types";
import { DashboardLayout } from "./DashboardLayout";

export function PromoterDashboard({ user }: { user: User }) {
  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard do Promotor</h2>
          <p className="text-muted-foreground">
            Em desenvolvimento...
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}