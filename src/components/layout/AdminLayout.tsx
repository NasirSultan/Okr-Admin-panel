import { ReactNode, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar 
        isMobile={false} 
      />
      
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 p-2 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <Sidebar 
            isMobile={true} 
            onClose={() => setMobileSidebarOpen(false)} 
          />
          <div 
            className="flex-1 bg-black/30"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
