import { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { LayoutDashboard, Users, Brain, CreditCard, Hexagon, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Dashboard", url: "/Dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "AI Performance", url: "/ai-performance", icon: Brain },
  { title: "Subscriptions", url: "/subscriptions", icon: CreditCard },
  { title: "XP Points", url: "/xp-points", icon: Hexagon },
  { title: "Email", url: "/email", icon: Mail },
];

interface SidebarProps {
  collapsed: boolean;
  onClose?: () => void;
}

interface TokenPayload {
  id: string;
  role: string;
  exp: number;
}

const Sidebar = ({ collapsed, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast({
        title: "Access denied",
        description: "You are not logged in.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.role !== "admin") {
        toast({
          title: "Access denied",
          description: "You are not an admin.",
          variant: "destructive"
        });
        navigate("/");
      }
    } catch {
      toast({
        title: "Access denied",
        description: "Invalid token.",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  return (
    <aside className={cn(
      "bg-gradient-dark fixed top-0 left-0 h-full flex flex-col z-50",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-center p-4">
        <img
          src="/1171275974.png"
          alt="Logo"
          className={cn(collapsed ? "h-10 w-10" : "h-16 w-40")}
        />
      </div>

      <nav className="flex-1 px-2 space-y-1 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span className="font-medium text-sm">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-4">
          <div className="bg-sidebar-accent rounded-lg p-4">
            <p className="text-sidebar-foreground text-xs opacity-70">Admin Panel v1.0</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
