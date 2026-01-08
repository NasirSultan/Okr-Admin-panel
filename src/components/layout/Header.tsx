import { Bell, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminUser");
    navigate("/", { replace: true });
  };

  return (
    <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

      <div className="flex items-center gap-2">
  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
    <span className="text-primary-foreground font-bold text-sm">
      {adminUser.name ? adminUser.name[0] : "A"}
    </span>
  </div>
  <h1 className="font-display font-bold text-xl text-foreground">
    Admin
  </h1>
</div>

      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        <div className="h-8 w-px bg-border mx-2" />

        {adminUser.name && (
          <Button variant="ghost" className="gap-2 flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">{adminUser.name}</span>
          </Button>
        )}

        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
