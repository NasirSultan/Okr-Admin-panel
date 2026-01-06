import { CreditCard, TrendingUp, Users, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AdminLayout from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";

const revenueData = [
  { month: "Jan", revenue: 45000, subscriptions: 1200 },
  { month: "Feb", revenue: 52000, subscriptions: 1350 },
  { month: "Mar", revenue: 48000, subscriptions: 1280 },
  { month: "Apr", revenue: 61000, subscriptions: 1520 },
  { month: "May", revenue: 55000, subscriptions: 1400 },
  { month: "Jun", revenue: 67000, subscriptions: 1680 },
  { month: "Jul", revenue: 72000, subscriptions: 1820 },
];

const plans = [
  { name: "Basic", price: "$9/mo", users: 3240, percentage: 38, color: "hsl(210, 80%, 55%)" },
  { name: "Pro", price: "$29/mo", users: 4120, percentage: 49, color: "hsl(12, 79%, 43%)" },
  { name: "Enterprise", price: "$99/mo", users: 1072, percentage: 13, color: "hsl(142, 70%, 45%)" },
];

const stats = [
  { title: "Total Revenue", value: "$72,450", icon: DollarSign, change: "+18.2%" },
  { title: "Active Subscriptions", value: "8,432", icon: CreditCard, change: "+5.3%" },
  { title: "Avg. Revenue/User", value: "$8.60", icon: TrendingUp, change: "+3.1%" },
  { title: "Paying Users", value: "8,432", icon: Users, change: "+12%" },
];

const SubscriptionsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Subscriptions</h2>
          <p className="text-muted-foreground">Track subscription metrics and revenue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.title}
              className="bg-card rounded-xl p-6 border border-border animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-success">{stat.change}</span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">Revenue Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                  <XAxis dataKey="month" stroke="hsl(220, 10%, 45%)" />
                  <YAxis stroke="hsl(220, 10%, 45%)" tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 15%, 88%)",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(12, 79%, 43%)" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(12, 79%, 43%)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">Plan Distribution</h3>
            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{plan.name}</span>
                      <Badge variant="secondary">{plan.price}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{plan.users.toLocaleString()} users</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${plan.percentage}%`, backgroundColor: plan.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubscriptionsPage;
