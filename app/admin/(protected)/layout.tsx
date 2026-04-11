import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Адмін-панель" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await getAdminSession();
  if (!authenticated) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
