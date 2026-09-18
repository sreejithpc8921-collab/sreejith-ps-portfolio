import { type ReactNode, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/hooks/use-session";

/**
 * Wraps protected admin content. Renders a loading state until the client
 * has resolved the Supabase session, then either renders `children` or
 * redirects to the login page. Checking on the client (rather than in a
 * route `beforeLoad`) avoids any SSR/localStorage session mismatch.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session === null) {
      navigate({ to: "/admin/login" });
    }
  }, [session, navigate]);

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-red border-t-transparent" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
