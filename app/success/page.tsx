"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="animate-in fade-in zoom-in mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm duration-500">
        <div className="space-y-10">
          <div className="space-y-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
              ✅
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">
              Успішно надіслано
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Дякуємо за ваш час!
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-7 text-slate-600">
              Ваш бриф успішно доставлено нашій команді. Ми цінуємо надану вами
              інформацію та вже готуємося до знайомства з вашим проєктом.
            </p>
          </div>

          <div className="flex justify-center border-t border-slate-100 pt-10">
            <Button onClick={() => router.push("/")} size="lg">
              Повернутися на головну
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
