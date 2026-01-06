import { useNavigate } from "react-router-dom";
import { Hexagon, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <Button 
        variant="action" 
        size="xl"
        onClick={() => navigate("/six-points")}
        className="flex-1 min-w-[200px]"
      >
        <Hexagon className="h-5 w-5 text-primary" />
        <span>Six Points Page</span>
      </Button>
      <Button 
        variant="action" 
        size="xl"
        onClick={() => navigate("/email")}
        className="flex-1 min-w-[200px]"
      >
        <Mail className="h-5 w-5 text-primary" />
        <span>Email Page</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
