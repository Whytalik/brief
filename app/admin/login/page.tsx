import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Адмін-панель — Вхід" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="bg-slate-950 p-8 pb-12 text-center text-white">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur-sm">
              🔐
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Адмін-панель</h1>
            <p className="mt-2 text-sm font-medium text-slate-400">
              Ввійдіть, щоб керувати отриманими брифами
            </p>
          </div>

          <div className="-mt-6 rounded-t-[32px] bg-white p-8">
            <Suspense
              fallback={
                <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
