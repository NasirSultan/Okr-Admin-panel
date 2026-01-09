import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, MoreHorizontal, UserCheck, UserX, Users } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUsers, deleteUser, toggleBlockUser } from "../api/userManagement";

const USERS_CACHE_KEY = "cachedUsers";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState({ block: null, delete: null });
  const [filter, setFilter] = useState<"all" | "active" | "suspended">("all");
  const [toast, setToast] = useState({ message: "", type: "", show: false });
  const navigate = useNavigate();

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast({ message: "", type, show: false }), 3000);
  };

  const loadUsers = async () => {
    const cached = localStorage.getItem(USERS_CACHE_KEY);
    if (cached) {
      setUsers(JSON.parse(cached));
    } else {
      try {
        const data = await getUsers();
        setUsers(data.data);
        localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(data.data));
      } catch {
        showToast("Failed to fetch users", "error");
      }
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateCache = (updatedUsers: any[]) => {
    setUsers(updatedUsers);
    localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(updatedUsers));
  };

  const handleDelete = async (id: number) => {
    setLoading((prev) => ({ ...prev, delete: id }));
    try {
      await deleteUser(id);
      showToast("User deleted successfully");
      const updated = users.filter((user) => user.id !== id);
      updateCache(updated);
    } catch {
      showToast("Failed to delete user", "error");
    } finally {
      setLoading((prev) => ({ ...prev, delete: null }));
    }
  };

  const handleToggleBlock = async (id: number, isBlocked: boolean) => {
    setLoading((prev) => ({ ...prev, block: id }));
    try {
      await toggleBlockUser(id);
      showToast(isBlocked ? "User unblocked" : "User suspended");
      const updated = users.map((user) =>
        user.id === id ? { ...user, isBlocked: !isBlocked, status: !isBlocked ? "suspended" : "active" } : user
      );
      updateCache(updated);
    } catch {
      showToast("Failed to update block status", "error");
    } finally {
      setLoading((prev) => ({ ...prev, block: null }));
    }
  };

  const handleDetail = (id: number) => {
    localStorage.setItem("userId", id.toString());
    navigate("/user-detail");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && !user.isBlocked;
    if (filter === "suspended") return matchesSearch && user.isBlocked;
    return true;
  });

  // Counts for cards
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.isBlocked).length;
  const suspendedUsers = users.filter((u) => u.isBlocked).length;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in p-2">

        {toast.show && (
          <div
            className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
          >
            {toast.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">User Management</h2>
            <p className="text-muted-foreground">Manage and monitor all users</p>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative p-4 bg-card border border-border rounded-lg flex flex-col gap-2 hover:border-blue-500">
            <Users className="absolute top-2 right-2 h-8 w-8 text-blue-500" />
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-lg font-bold">{totalUsers.toLocaleString()}</p>
            <p className="text-xs text-green-500">+12.5% from last month</p>
          </div>

          <div className="relative p-4 bg-card border border-border rounded-lg flex flex-col gap-2 hover:border-green-500">
            <UserCheck className="absolute top-2 right-2 h-8 w-8 text-green-500" />
            <p className="text-sm text-muted-foreground">Active Users</p>
            <p className="text-lg font-bold">{activeUsers.toLocaleString()}</p>
            <p className="text-xs text-green-500">+8.3% from last month</p>
          </div>

          <div className="relative p-4 bg-card border border-border rounded-lg flex flex-col gap-2 hover:border-red-500">
            <UserX className="absolute top-2 right-2 h-8 w-8 text-red-500" />
            <p className="text-sm text-muted-foreground">Suspended Users</p>
            <p className="text-lg font-bold">{suspendedUsers.toLocaleString()}</p>
            <p className="text-xs text-red-500">-1.2% from last month</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={filter === "active" ? "default" : "outline"} onClick={() => setFilter("active")}>Active</Button>
            <Button variant={filter === "suspended" ? "destructive" : "outline"} onClick={() => setFilter("suspended")}>Suspended</Button>
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
          </div>
        </div>

        {/* Table for small screens */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mt-4">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No users found</div>
          ) : (
           <div className="divide-y divide-border">
  {filteredUsers.map((user) => (
    <div key={user.id} className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-2">

      {/* Status for small screens (top-right) */}
      <p className={`absolute top-3 right-2 text-xs font-semibold sm:hidden ${user.isBlocked ? "text-red-500" : "text-green-500"}`}>
        {user.isBlocked ? "Suspended" : "Active"}
      </p>

      {/* Name, Email, and Status for md/lg screens */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-1">
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className={`text-xs font-semibold hidden sm:inline ${user.isBlocked ? "text-red-500" : "text-green-500"}`}>
          {user.isBlocked ? "Suspended" : "Active"}
        </p>
      </div>

      {/* Buttons aligned to right end */}
      <div className="flex gap-2 mt-2 sm:mt-0 justify-end">
        <Button
          variant={user.isBlocked ? "destructive" : "default"}
          onClick={() => handleToggleBlock(user.id, user.isBlocked)}
          disabled={loading.block === user.id}
        >
          {loading.block === user.id ? "..." : user.isBlocked ? "Unsuspend" : "Suspend"}
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDelete(user.id)}
          disabled={loading.delete === user.id}
        >
          {loading.delete === user.id ? "..." : "Delete"}
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="icon" onClick={() => handleDetail(user.id)}>
          <Eye className="h-4 w-4" />
        </Button>
      </div>

    </div>
  ))}
</div>


          )}
        </div>

      </div>
    </AdminLayout>



  );
};

export default UsersPage;
