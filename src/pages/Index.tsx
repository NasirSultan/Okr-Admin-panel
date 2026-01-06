import { Users, Brain, CreditCard } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import StatCard from "@/components/dashboard/StatCard";
import UserActivityChart from "@/components/dashboard/UserActivityChart";
import ActionButtons from "@/components/dashboard/ActionButtons";

const Index = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value="24,563"
            change="+12.5% from last month"
            changeType="positive"
            icon={Users}
            link="/users"
            delay={0}
          />
          <StatCard
            title="AI Performance"
            value="98.7%"
            change="+2.1% improvement"
            changeType="positive"
            icon={Brain}
            link="/ai-performance"
            delay={100}
          />
          <StatCard
            title="Total Subscriptions"
            value="8,432"
            change="+5.3% from last month"
            changeType="positive"
            icon={CreditCard}
            link="/subscriptions"
            delay={150}
          />
        </div>

        {/* Chart */}
        <UserActivityChart />

        {/* Action Buttons */}
        <ActionButtons />
      </div>
    </AdminLayout>
  );
};

export default Index;
