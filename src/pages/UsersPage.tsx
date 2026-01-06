import { useState } from "react";
import { Search, Filter, MoreHorizontal, UserPlus } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const users = [
  { id: 1, name: "John Smith", email: "john@example.com", status: "active", joined: "2024-01-15", subscription: "Pro" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", status: "active", joined: "2024-01-12", subscription: "Basic" },
  { id: 3, name: "Mike Wilson", email: "mike@example.com", status: "inactive", joined: "2024-01-10", subscription: "Pro" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", status: "active", joined: "2024-01-08", subscription: "Enterprise" },
  { id: 5, name: "James Brown", email: "james@example.com", status: "pending", joined: "2024-01-05", subscription: "Basic" },
  { id: 6, name: "Lisa Anderson", email: "lisa@example.com", status: "active", joined: "2024-01-03", subscription: "Pro" },
  { id: 7, name: "David Martinez", email: "david@example.com", status: "active", joined: "2024-01-01", subscription: "Enterprise" },
  { id: 8, name: "Jennifer Taylor", email: "jennifer@example.com", status: "inactive", joined: "2023-12-28", subscription: "Basic" },
];

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      inactive: "secondary",
      pending: "outline",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">User Management</h2>
            <p className="text-muted-foreground">Manage and monitor all users</p>
          </div>
          <Button variant="gradient">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.subscription}</TableCell>
                  <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
