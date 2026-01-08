import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userManagement";
import * as jwtDecode from "jwt-decode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("adminUser");

    if (token && user) {
      try {
        const decoded: TokenPayload = (jwtDecode as any).default(token);
        if (decoded.role === "admin") {
          navigate("/");
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("adminUser");
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("adminUser");
      }
    }
  }, [navigate]);

const showToast = (options: {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}) => {
  const isSmallScreen = window.innerWidth < 640;

  toast({
    ...options,
    position: isSmallScreen ? "top-center" : "bottom-center"
  });
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.access_token) {
        const decoded: TokenPayload = (jwtDecode as any).default(response.access_token);

        if (decoded.role === "admin") {
          localStorage.setItem("accessToken", response.access_token);
          localStorage.setItem("adminUser", JSON.stringify(response.user));

          showToast({
            title: "Welcome back!",
            description: "You have successfully logged in."
          });

          navigate("/Dashboard");
        } else {
          showToast({
            title: "Access denied",
            description: "You are not an admin.",
            variant: "destructive"
          });
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        showToast({
          title: "Login failed",
          description: "Email or password is incorrect.",
          variant: "destructive"
        });
      } else {
        showToast({
          title: "Login error",
          description: error.message || "Something went wrong",
          variant: "destructive"
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md sm:max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Shield className="h-8 w-8 text-red-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to access the dashboard</p>
        </div>

        <Card className="bg-white shadow-xl rounded-2xl border border-gray-200 p-6 sm:p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl font-semibold">Sign In</CardTitle>
            <CardDescription className="text-gray-500">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
