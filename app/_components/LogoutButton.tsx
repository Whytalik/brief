"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    router.push("/");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="border-transparent text-slate-400 hover:border-slate-700 hover:bg-white/5 hover:text-white"
    >
      Вийти
    </Button>
  );
}
