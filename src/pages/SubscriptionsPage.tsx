import { useEffect, useState } from "react"
import { CreditCard, TrendingUp, Users, DollarSign } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import AdminLayout from "@/components/layout/AdminLayout"
import { Badge } from "@/components/ui/badge"
import { getSubscriptionDashboard } from "../api/subscription"

const CACHE_KEY = "subscriptionDashboard"
const DATE_KEY = "subscriptionDashboardDate"

const SubscriptionsPage = () => {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)

      const today = new Date().toISOString().split("T")[0]
      const cachedData = localStorage.getItem(CACHE_KEY)
      const cachedDate = localStorage.getItem(DATE_KEY)

      if (cachedData && cachedDate === today) {
        setDashboard(JSON.parse(cachedData))
        setLoading(false)
        return
      }

      const data = await getSubscriptionDashboard()
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      localStorage.setItem(DATE_KEY, today)
      setDashboard(data)
      setLoading(false)
    }

    fetchDashboard()
  }, [])

  const stats = dashboard
    ? [
        { title: "Total Revenue", value: `$${dashboard.totalRevenue.toLocaleString()}`, icon: DollarSign, change: "+18.2%" },
        { title: "Active Subscriptions", value: dashboard.activeSubscriptions.toLocaleString(), icon: CreditCard, change: "+5.3%" },
        { title: "Avg. Revenue/User", value: `$${dashboard.avgRevenuePerUser.toFixed(2)}`, icon: TrendingUp, change: "+12%" },
        { title: "Paying Users", value: dashboard.payingUsers.toLocaleString(), icon: Users, change: "+12%" },
      ]
    : []

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in p-2">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Subscriptions</h2>
          <p className="text-muted-foreground">Track subscription metrics and revenue</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border animate-pulse h-28" />
            ))}
          </div>
        ) : (
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
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">Revenue Trend</h3>
            {loading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded-xl" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboard.revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                    <XAxis dataKey="month" stroke="hsl(220, 10%, 45%)" />
                    <YAxis stroke="hsl(220, 10%, 45%)" tickFormatter={value => `$${value}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(220, 15%, 88%)",
                        borderRadius: "8px"
                      }}
                      formatter={value => [`$${value.toLocaleString()}`, "Revenue"]}
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
            )}
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">Plan Distribution</h3>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard.planDistribution.map(plan => {
                  const totalUsers = dashboard.planDistribution.reduce((sum, p) => sum + p.users, 0)
                  const percentage = Math.round((plan.users / totalUsers) * 100)
                  const color =
                    plan.price === 0
                      ? "hsl(210, 80%, 55%)"
                      : plan.price < 20
                      ? "hsl(12, 79%, 43%)"
                      : "hsl(142, 70%, 45%)"

                  return (
                    <div key={plan.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{plan.name}</span>
                          <Badge variant="secondary">
                            {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {plan.users.toLocaleString()} users
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SubscriptionsPage
