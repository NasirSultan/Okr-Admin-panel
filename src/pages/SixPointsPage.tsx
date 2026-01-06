import { Hexagon, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const points = [
  { 
    id: 1, 
    title: "Security Compliance", 
    description: "All security protocols are up to date and verified",
    status: "completed",
    progress: 100,
    lastUpdated: "2024-01-15"
  },
  { 
    id: 2, 
    title: "Data Backup", 
    description: "Regular automated backups running smoothly",
    status: "completed",
    progress: 100,
    lastUpdated: "2024-01-15"
  },
  { 
    id: 3, 
    title: "Performance Optimization", 
    description: "System performance metrics within acceptable range",
    status: "in-progress",
    progress: 75,
    lastUpdated: "2024-01-14"
  },
  { 
    id: 4, 
    title: "User Feedback Review", 
    description: "Analyzing user feedback and implementing changes",
    status: "in-progress",
    progress: 60,
    lastUpdated: "2024-01-13"
  },
  { 
    id: 5, 
    title: "API Integration", 
    description: "Third-party API integrations status check",
    status: "warning",
    progress: 45,
    lastUpdated: "2024-01-12"
  },
  { 
    id: 6, 
    title: "Documentation Update", 
    description: "Technical documentation needs revision",
    status: "pending",
    progress: 20,
    lastUpdated: "2024-01-10"
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle className="h-5 w-5 text-success" />;
    case "in-progress": return <Clock className="h-5 w-5 text-info" />;
    case "warning": return <AlertTriangle className="h-5 w-5 text-warning" />;
    case "pending": return <XCircle className="h-5 w-5 text-muted-foreground" />;
    default: return null;
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    completed: "default",
    "in-progress": "secondary",
    warning: "outline",
    pending: "outline",
  };
  return <Badge variant={variants[status]}>{status.replace("-", " ")}</Badge>;
};

const SixPointsPage = () => {
  const completedCount = points.filter(p => p.status === "completed").length;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Six Points Review</h2>
            <p className="text-muted-foreground">Track key milestones and checkpoints</p>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border">
            <Hexagon className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">{completedCount}/6 Completed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((point, index) => (
            <div 
              key={point.id}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">{point.id}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{point.title}</h3>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </div>
                </div>
                {getStatusIcon(point.status)}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{point.progress}%</span>
                </div>
                <Progress value={point.progress} className="h-2" />
                <div className="flex items-center justify-between">
                  {getStatusBadge(point.status)}
                  <span className="text-xs text-muted-foreground">Updated: {point.lastUpdated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="gradient" size="lg">
            Generate Full Report
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SixPointsPage;
