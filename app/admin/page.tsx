import { getAdminStats, getRecentActivity } from "@/lib/AdminAction";
import RealTimeDashboard from "@/components/admin/AdminRealTime";

export default async function AdminOverview() {
  const stats = await getAdminStats();
  const activities = await getRecentActivity();

  return (
    <RealTimeDashboard 
      initialStats={stats} 
      initialActivities={activities} 
    />
  );
}