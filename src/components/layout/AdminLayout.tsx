import { ReactNode, useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const sidebarWidth = 256;

  const handleToggleSidebar = () => {
    if (isSmallScreen) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex relative">
      {(mobileSidebarOpen || !isSmallScreen) && (
        <Sidebar
          collapsed={isSmallScreen ? false : collapsed}
          onClose={() => setMobileSidebarOpen(false)}
        />
      )}

      {mobileSidebarOpen && isSmallScreen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: !isSmallScreen ? (collapsed ? 80 : sidebarWidth) : 0 }}
      >
        <Header onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 p-2 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
