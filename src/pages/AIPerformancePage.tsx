import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Brain, Zap, Clock, CheckCircle } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";

const performanceData = [
  { metric: "Accuracy", value: 98.7 },
  { metric: "Response Time", value: 92 },
  { metric: "User Satisfaction", value: 96 },
  { metric: "Task Completion", value: 94 },
];

const usageData = [
  { name: "Chat", value: 45, color: "hsl(12, 79%, 43%)" },
  { name: "Analysis", value: 25, color: "hsl(210, 80%, 55%)" },
  { name: "Generation", value: 20, color: "hsl(142, 70%, 45%)" },
  { name: "Other", value: 10, color: "hsl(38, 92%, 50%)" },
];

const stats = [
  { title: "Model Accuracy", value: "98.7%", icon: Brain, change: "+2.1%" },
  { title: "Avg Response Time", value: "1.2s", icon: Clock, change: "-0.3s" },
  { title: "Tasks Processed", value: "156K", icon: Zap, change: "+15%" },
  { title: "Success Rate", value: "99.2%", icon: CheckCircle, change: "+0.5%" },
];

const AIPerformancePage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">AI Performance</h2>
          <p className="text-muted-foreground">Monitor AI model metrics and usage</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">Performance Metrics</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(220, 10%, 45%)" />
                  <YAxis dataKey="metric" type="category" stroke="hsl(220, 10%, 45%)" width={120} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 15%, 88%)",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "Score"]}
                  />
                  <Bar dataKey="value" fill="hsl(12, 79%, 43%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">Usage Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {usageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AIPerformancePage;
