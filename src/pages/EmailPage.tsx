import { useState } from "react";
import { Mail, Send, Inbox, Star, Trash2, Search, Plus } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const emails = [
  { 
    id: 1, 
    from: "john@example.com", 
    subject: "New User Registration Alert", 
    preview: "A new user has registered on the platform...", 
    time: "10:30 AM",
    read: false,
    starred: true
  },
  { 
    id: 2, 
    from: "support@system.com", 
    subject: "Weekly Analytics Report", 
    preview: "Here's your weekly performance summary...", 
    time: "9:15 AM",
    read: false,
    starred: false
  },
  { 
    id: 3, 
    from: "alerts@monitoring.io", 
    subject: "System Health Check Passed", 
    preview: "All systems are operational and running smoothly...", 
    time: "Yesterday",
    read: true,
    starred: false
  },
  { 
    id: 4, 
    from: "billing@payments.com", 
    subject: "Payment Processed Successfully", 
    preview: "Payment of $1,245.00 has been processed...", 
    time: "Yesterday",
    read: true,
    starred: true
  },
  { 
    id: 5, 
    from: "team@company.com", 
    subject: "Team Meeting Tomorrow", 
    preview: "Reminder: We have a team meeting scheduled for...", 
    time: "2 days ago",
    read: true,
    starred: false
  },
];

const folders = [
  { name: "Inbox", icon: Inbox, count: 24 },
  { name: "Sent", icon: Send, count: 0 },
  { name: "Starred", icon: Star, count: 5 },
  { name: "Trash", icon: Trash2, count: 3 },
];

const EmailPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("Inbox");

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Email Management</h2>
            <p className="text-muted-foreground">View and manage system emails</p>
          </div>
          <Button variant="gradient">
            <Plus className="h-4 w-4" />
            Compose
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {folders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => setSelectedFolder(folder.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  selectedFolder === folder.name 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card hover:bg-muted text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <folder.icon className="h-4 w-4" />
                  <span className="font-medium">{folder.name}</span>
                </div>
                {folder.count > 0 && (
                  <Badge variant={selectedFolder === folder.name ? "secondary" : "outline"}>
                    {folder.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Email List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search emails..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {filteredEmails.map((email, index) => (
                <div 
                  key={email.id}
                  className={`p-4 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-all duration-200 animate-slide-up ${
                    !email.read ? "bg-primary/5" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <button className={`p-1 rounded ${email.starred ? "text-warning" : "text-muted-foreground hover:text-warning"}`}>
                        <Star className={`h-4 w-4 ${email.starred ? "fill-current" : ""}`} />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-sm ${!email.read ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                          {email.from}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{email.time}</span>
                      </div>
                      <p className={`text-sm mb-1 ${!email.read ? "font-medium text-foreground" : "text-foreground"}`}>
                        {email.subject}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{email.preview}</p>
                    </div>
                    {!email.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmailPage;
