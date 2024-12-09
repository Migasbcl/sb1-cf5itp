import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/lib/types";
import { DashboardLayout } from "./DashboardLayout";
import { StatCard } from "./StatCard";
import { Calendar, Users, UserCheck } from "lucide-react";
import { getDashboardStats } from "@/lib/dashboard";
import { Button } from "@/components/ui/button";
import { EventList } from "./EventList";

interface DashboardStats {
  activeEvents: number;
  totalPromoters: number;
  totalTeams: number;
}

export function OrganizerDashboard({ user }: { user: User }) {
  const [stats, setStats] = useState<DashboardStats>({
    activeEvents: 0,
    totalPromoters: 0,
    totalTeams: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.uid) return;
      
      try {
        const dashboardStats = await getDashboardStats(user.uid);
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        setStats({
          activeEvents: 0,
          totalPromoters: 0,
          totalTeams: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.uid]);

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Visão geral da sua organização
            </p>
          </div>
          <Button onClick={() => navigate("/criar-evento")}>
            Criar Evento
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Eventos Ativos"
            value={loading ? "-" : stats.activeEvents}
            icon={Calendar}
            description="Eventos em andamento"
          />
          <StatCard
            title="Promotores"
            value={loading ? "-" : stats.totalPromoters}
            icon={UserCheck}
            description="Promotores cadastrados"
          />
          <StatCard
            title="Equipes"
            value={loading ? "-" : stats.totalTeams}
            icon={Users}
            description="Equipes ativas"
          />
        </div>

        {user.organization && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-6">Eventos</h3>
            <EventList organizationId={user.organization} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}