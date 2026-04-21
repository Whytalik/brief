"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";
import { Button } from "@/components/ui/Button";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          Пароль доступу
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            disabled={pending}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {state.error && (
        <div
          role="alert"
          className="animate-in fade-in slide-in-from-top-1 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
        >
          <span className="text-lg">✕</span>
          <p className="font-medium">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        isLoading={pending}
        className="h-14 w-full shadow-lg shadow-slate-200"
      >
        Увійти в систему
      </Button>
    </form>
  );
}
