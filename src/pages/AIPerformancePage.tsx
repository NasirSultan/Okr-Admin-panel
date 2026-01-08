import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { Brain, Users, Target, Flag, TrendingUp, Activity, Zap, Award } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { getWeeklyAiPerformance } from "@/api/ApiManager";

const iconMap = {
  overall: Brain,
  solo: Target,
  team: Users,
  campaign: Flag
};

const keys = ["overall", "solo", "team", "campaign"];

const AIPerformancePage = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    getWeeklyAiPerformance().then(result => {
      setData(result);
      setLoading(false);
    });

    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartData = keys.map(key => ({
    metric: key.charAt(0).toUpperCase() + key.slice(1),
    value: data[key] ? Math.round(data[key].averageScore) : 0
  }));

  const overallData = data.overall || {};
  const overallScore = overallData.averageScore || 0;

  const getScoreColor = (score) => {
    if (score > 90) return "text-red-500";
    if (score >= 80) return "text-green-500";
    return "text-yellow-500";
  };

  const getScoreBg = (score) => {
    if (score > 90) return "from-red-500/20 to-red-500/5";
    if (score >= 80) return "from-green-500/20 to-green-500/5";
    return "from-yellow-500/20 to-yellow-500/5";
  };

  const getBarColor = (score) => {
    if (score > 90) return "#ef4444";
    if (score >= 80) return "#22c55e";
    return "#eab308";
  };


  useEffect(() => {
  const fetchData = async () => {
    const cache = localStorage.getItem("aiPerformanceCache");
    const cacheDate = localStorage.getItem("aiPerformanceCacheDate");
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (cache && cacheDate === today) {
      setData(JSON.parse(cache));
      setLoading(false);
    } else {
      const result = await getWeeklyAiPerformance();
      setData(result);
      setLoading(false);
      localStorage.setItem("aiPerformanceCache", JSON.stringify(result));
      localStorage.setItem("aiPerformanceCacheDate", today);
    }
  };

  fetchData();
}, []);

  return (
    <AdminLayout>
      <div className="space-y-8 pb-8 p-2">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">AI Performance Analytics</h2>
            <p className="text-muted-foreground">Real-time intelligence metrics and insights</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>

        {/* Hero - Overall Performance */}
        <div className={`relative rounded-2xl border bg-gradient-to-br ${getScoreBg(overallScore)} p-8 overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-700 to-red-500 flex items-center justify-center shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Overall AI Performance</h2>
                  <p className="text-sm text-muted-foreground">System-wide intelligence score</p>
                </div>
              </div>
              <Award className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="h-20 w-32 bg-muted/50 rounded-lg animate-pulse" />
                <div className="h-6 w-48 bg-muted/50 rounded animate-pulse" />
                <div className="h-4 w-full max-w-md bg-muted/50 rounded animate-pulse" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className={`text-7xl font-bold ${getScoreColor(overallScore)}`}>{Math.round(overallScore)}</span>
                    <span className="text-3xl text-muted-foreground">/ 100</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Zap className={`w-5 h-5 ${getScoreColor(overallScore)}`} />
                    <span className="text-lg font-semibold">{overallData.aiPerformanceStatus}</span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">{overallData.description}</p>

                  <div className="mt-6 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">Tracking weekly</span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="text-sm text-muted-foreground">Last updated: Just now</div>
                  </div>
                </div>

                {/* Mini visualization */}
                <div className="hidden lg:block">
                  <div className="h-48 bg-background/50 rounded-xl p-4 backdrop-blur-sm border">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(0,0,0,0.8)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                          formatter={value => [`${value}%`, "Score"]}
                        />
                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance Breakdown */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-600" />
            Performance Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {keys.slice(1).map(key => {
              const Icon = iconMap[key];
              const item = data[key] || {};
              const score = item.averageScore || 0;

              return (
                <div
                  key={key}
                  className="group rounded-xl border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className={`h-1 bg-gradient-to-r ${getScoreBg(score).replace(/from-|to-/g, 'from-').replace('/20', '').replace('/5', '')}`} />
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreBg(score)} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col items-end text-lg font-semibold">
                        <span className="capitalize">{key}</span>
                        <span className={getScoreColor(score)}>{Math.round(score)}%</span>
                      </div>
                    </div>

                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-5 w-full bg-muted rounded animate-pulse" />
                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium mb-3 text-foreground/80">{item.aiPerformanceStatus}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${score > 90 ? 'bg-red-500' : score >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Comparative Chart */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="p-6 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-violet-600" />
                  Comparative Analysis
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Performance metrics across all categories</p>
              </div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500" /><span>Excellent (80-90)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-500" /><span>Good (&lt;80)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500" /><span>Critical (&gt;90)</span></div>
              </div>
            </div>
          </div>

          <div className="p-6 h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout={isSmallScreen ? "horizontal" : "vertical"}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#888" />
                <XAxis
                  type={isSmallScreen ? "category" : "number"}
                  dataKey={isSmallScreen ? "metric" : undefined}
                  domain={[0, 100]}
                  tick={{ fill: '#888', fontSize: 12 }}
                />
                <YAxis
                  type={isSmallScreen ? "number" : "category"}
                  dataKey={isSmallScreen ? "value" : "metric"}
                  width={isSmallScreen ? 40 : 100}
                  tick={{ fill: '#444', fontSize: 13, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
                  contentStyle={{
                    background: 'rgba(0,0,0,0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white'
                  }}
                  formatter={value => [`${value}%`, "Score"]}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 8, 8, 0]}
                  maxBarSize={isSmallScreen ? 30 : 40}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={`url(#grad-${index})`} />
                  ))}
                </Bar>
                <defs>
                  {chartData.map((entry, index) => {
                    const baseColor = getBarColor(entry.value);
                    return (
                      <linearGradient
                        id={`grad-${index}`}
                        key={index}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor={baseColor} stopOpacity={0.8} />
                        <stop offset="50%" stopColor={baseColor} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={baseColor} stopOpacity={0.2} />
                      </linearGradient>
                    );
                  })}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AIPerformancePage;
