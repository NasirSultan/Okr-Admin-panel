import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { day: "Mon", activeUsers: 1200, newUsers: 85 },
  { day: "Tue", activeUsers: 1350, newUsers: 92 },
  { day: "Wed", activeUsers: 1180, newUsers: 78 },
  { day: "Thu", activeUsers: 1420, newUsers: 110 },
  { day: "Fri", activeUsers: 1580, newUsers: 125 },
  { day: "Sat", activeUsers: 980, newUsers: 65 },
  { day: "Sun", activeUsers: 850, newUsers: 48 },
];

const UserActivityChart = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground">User Activity</h3>
        <p className="text-sm text-muted-foreground">Active and new users over the last 7 days</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              dataKey="day" 
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
              tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
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
              dataKey="newUsers" 
              name="New Users"
              stroke="hsl(210, 80%, 55%)" 
              strokeWidth={2}
              fill="url(#newUsersGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserActivityChart;
