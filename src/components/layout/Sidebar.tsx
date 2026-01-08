import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, Brain, CreditCard, Hexagon, Mail,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "AI Performance", url: "/ai-performance", icon: Brain },
  { title: "Subscriptions", url: "/subscriptions", icon: CreditCard },
  { title: "XP Points", url: "/six-points", icon: Hexagon },
  { title: "Email System", url: "/email", icon: Mail },
];

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isMobile = false, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
   <aside
  className={cn(
    "bg-gradient-dark h-screen transition-all duration-300 flex flex-col fixed top-0 left-0 z-40",
    collapsed ? "w-16" : "w-64"
  )}
>
  {/* Collapse button */}
  <div className="p-4 flex justify-end flex-shrink-0">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setCollapsed(!collapsed)}
      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
    </Button>
  </div>

  {/* Logo */}
  {!collapsed && (
    <div className="flex items-center justify-center p-4 flex-shrink-0">
      <img src="/1171275974.png" alt="Logo" className="h-16 w-40" />
    </div>
  )}

  {/* Menu items */}
  <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
    {menuItems.map((item) => {
      const isActive = location.pathname === item.url;
      return (
        <NavLink
          key={item.title}
          to={item.url}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
            isActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <item.icon
            className={cn(
              "h-5 w-5 flex-shrink-0 transition-transform duration-200",
              !isActive && "group-hover:scale-110"
            )}
          />
          {!collapsed && <span className="font-medium text-sm">{item.title}</span>}
        </NavLink>
      );
    })}
  </nav>

  {/* Footer */}
  {!collapsed && (
    <div className="p-4 flex-shrink-0">
      <div className="bg-sidebar-accent rounded-lg p-4">
        <p className="text-sidebar-foreground text-xs opacity-70">
          Admin Panel v1.0
        </p>
      </div>
    </div>
  )}
</aside>

  );
};

export default Sidebar;
