import { type ReactNode, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, FolderKanban, FileText, UserRound, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/resume", label: "Resume", icon: FileText },
  { to: "/admin/profile", label: "Profile", icon: UserRound },
] as const;

export function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:hidden">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-red text-sm font-black text-white">
            S
          </span>
          <span className="font-semibold">
            Admin<span className="text-red">.</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-2 text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-card/40 p-5 md:flex">
          <SidebarContent onNavigate={() => {}} onSignOut={signOut} />
        </aside>

        {/* Sidebar (mobile drawer) */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
            <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-white/10 bg-background p-5">
              <SidebarContent
                onNavigate={() => setMobileOpen(false)}
                onSignOut={signOut}
              />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 p-5 md:p-10">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  onNavigate,
  onSignOut,
}: {
  onNavigate: () => void;
  onSignOut: () => void;
}) {
  return (
    <>
      <Link to="/admin" className="mb-8 hidden items-center gap-2 md:flex" onClick={onNavigate}>
        <span className="grid h-9 w-9 place-items-center rounded-md bg-red text-sm font-black text-white red-glow">
          S
        </span>
        <div>
          <div className="font-semibold leading-none">
            Admin<span className="text-red">.</span>
          </div>
          <div className="text-xs text-muted-foreground">Resume Dashboard</div>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeOptions={{ exact: item.to === "/admin" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
            activeProps={{
              className: "!bg-red/10 !text-red",
            }}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={onSignOut}
        className={cn(
          "mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white",
        )}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>

      <a
        href="/"
        className="mt-2 text-center text-xs text-muted-foreground hover:text-white"
      >
        ← Back to public site
      </a>
    </>
  );
}
