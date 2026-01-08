import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Users, Brain, CreditCard } from "lucide-react";
import { getWeeklyReport } from "../api/userManagement";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const CACHE_KEY = "weeklyReportCache";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 1 day in milliseconds

const Index = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Check cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const now = new Date().getTime();
          if (now - parsed.timestamp < CACHE_EXPIRY) {
            setReport(parsed.data);
            return;
          }
        }

        // Fetch from API if no cache or expired
        const data = await getWeeklyReport();
        setReport(data.data);

        // Save to cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: data.data, timestamp: new Date().getTime() })
        );
      } catch (error) {
        console.error("Failed to fetch weekly report:", error);
      }
    };
    fetchReport();
  }, []);

  const defaultStats = {
    totalUsers: 24000,
    aiPerformance: 95,
    totalSubscriptions: 8000
  };

  const stats = report
    ? {
        totalUsers: report.summary.totalUsers,
        aiPerformance: report.summary.aiPerformance,
        totalSubscriptions: report.summary.totalSubscriptions
      }
    : defaultStats;

  return (
    <AdminLayout>
      <div className="space-y-6  ">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Here is your weekly overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change="+12.5% from last month"
            changeType="positive"
            icon={Users}
            link="/users"
            delay={0}
          />
          <StatCard
            title="AI Performance"
            value={`${stats.aiPerformance}`}
            change="+2.1% improvement"
            changeType="positive"
            icon={Brain}
            link="/ai-performance"
            delay={100}
          />
          <StatCard
            title="Total Subscriptions"
            value={stats.totalSubscriptions.toLocaleString()}
            change="+5.3% from last month"
            changeType="positive"
            icon={CreditCard}
            link="/subscriptions"
            delay={150}
          />
        </div>

        {/* Chart */}
        {report && (
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm mt-6">
            <h3 className="text-lg font-semibold mb-4">User Activity (Weekly)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={report.weekly}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="activeUsersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(12, 79%, 43%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(12, 79%, 43%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="newUsersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(220, 10%, 45%)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(220, 10%, 45%)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 15%, 88%)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px hsl(220 20% 15% / 0.1)",
                    }}
                    labelStyle={{ color: "hsl(220, 20%, 15%)", fontWeight: 600 }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="activeUsers"
                    name="Active Users"
                    stroke="hsl(12, 79%, 43%)"
                    strokeWidth={2}
                    fill="url(#activeUsersGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="newRegistrations"
                    name="New Registrations"
                    stroke="hsl(210, 80%, 55%)"
                    strokeWidth={2}
                    fill="url(#newUsersGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Index;
