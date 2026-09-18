import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/_layout")({
  component: ProtectedAdminLayout,
});

function ProtectedAdminLayout() {
  return (
    <AuthGuard>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AuthGuard>
  );
}
