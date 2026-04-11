import { Button } from "@/components/ui/Button";
import { getAdminSession } from "@/lib/auth";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

export default async function Header() {
  const authenticated = await getAdminSession();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-white transition-all hover:opacity-90 active:scale-95"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-inner">
              <span className="text-xl">📋</span>
            </div>
            <span className="hidden text-lg tracking-tight sm:inline">
              Бриф на розробку веб-платформи
            </span>
          </Link>

          {authenticated && (
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/admin"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                Брифи
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {authenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 md:flex">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                  Адмін
                </span>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/admin/login">
              <Button variant="secondary" size="sm" leftIcon={<span>🔐</span>}>
                Адмін панель
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
