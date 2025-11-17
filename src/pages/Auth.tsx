import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("user"); // signup role
  const [loginRole, setLoginRole] = useState("user"); // login role (for UI + optional validation)

  useEffect(() => {
    const errorMessage = (location.state as { error?: string } | null)?.error;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      toast.error(authError.message);
      setIsLoading(false);
      return;
    }

    if (!authData.user) {
      toast.error("Authentication failed. Please try again.");
      setIsLoading(false);
      return;
    }

    // Fetch user role using RPC (bypasses RLS with security definer)
    const { data: rpcRole, error: roleError } = await supabase
      .rpc('get_user_role', { _user_id: authData.user.id });

    if (roleError) {
      toast.error("Error fetching user role. Please contact support.");
      await supabase.auth.signOut();
      setIsLoading(false);
      return;
    }

    const fetchedRole = rpcRole as 'admin' | 'user' | null;

    if (!fetchedRole) {
      toast.error("No role assigned to this account. Please contact support.");
      await supabase.auth.signOut();
      setIsLoading(false);
      return;
    }

    // Do not block login based on the selected UI role; rely on DB role

    toast.success("Login successful!");
    
    // Navigate based on role from database
    if (fetchedRole === "admin") {
      navigate("/admin/dashboard", { replace: true });
      setIsLoading(false);
      return;
    }
    navigate("/dashboard", { replace: true });
    setIsLoading(false);
    return;
    
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
          role: role, // let DB trigger handle inserting into user_roles
        }
      }
    });

    if (authError) {
      toast.error(authError.message);
      setIsLoading(false);
      return;
    }

    if (!authData.user) {
      toast.error("Signup failed. Please try again.");
      setIsLoading(false);
      return;
    }

    // Fetch role via RPC (trigger should have created it)
    const { data: createdRole, error: fetchRoleError } = await supabase.rpc('get_user_role', { _user_id: authData.user.id });

    if (fetchRoleError) {
      toast.error("Error setting user role. Please contact support.");
      setIsLoading(false);
      return;
    }

    const effectiveRole = (createdRole as 'admin' | 'user' | null) ?? (role as 'admin' | 'user');

    toast.success("Account created successfully!");
    navigate(effectiveRole === "admin" ? "/admin/dashboard" : "/dashboard");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="p-8 card-shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SmartBook</span>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-role">Role</Label>
                  <Select value={loginRole} onValueChange={setLoginRole}>
                    <SelectTrigger id="login-role" className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="student@university.edu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="signup-role" className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="student@university.edu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
