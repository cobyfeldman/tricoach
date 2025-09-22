import { useAuth } from "@/contexts/AuthContext";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!profile) {
    return <OnboardingWizard onComplete={() => window.location.reload()} />;
  }

  return <>{children}</>;
}