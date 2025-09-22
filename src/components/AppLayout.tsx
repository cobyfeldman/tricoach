import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export function AppLayout() {
  const { profile } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger aria-label="Toggle sidebar" />
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Welcome, {profile?.full_name || 'User'}
                </span>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="User profile">
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Sign out" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}