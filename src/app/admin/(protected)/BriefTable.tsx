"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BriefRow = { id: string; status: string; createdAt: string };
type TabType = "ALL" | "NEW" | "REVIEWING" | "ACCEPTED" | "ARCHIVED";

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "NEW":
      return <span className="badge-new">Новий</span>;
    case "REVIEWING":
      return <span className="badge-reviewing">На розгляді</span>;
    case "ACCEPTED":
      return <span className="badge-accepted">Прийнято</span>;
    case "ARCHIVED":
      return <span className="badge-archived">Архів</span>;
    default:
      return (
        <span className="badge border border-slate-200 text-slate-400">
          {status}
        </span>
      );
  }
}

const tabConfigs: Record<TabType, { label: string; activeClass: string }> = {
  ALL: { label: "Всі", activeClass: "bg-white text-slate-950 shadow-sm" },
  NEW: {
    label: "Нові",
    activeClass: "bg-blue-600 text-white shadow-md shadow-blue-100",
  },
  REVIEWING: {
    label: "На розгляді",
    activeClass: "bg-amber-500 text-white shadow-md shadow-amber-100",
  },
  ACCEPTED: {
    label: "Прийняті",
    activeClass: "bg-emerald-600 text-white shadow-md shadow-emerald-100",
  },
  ARCHIVED: {
    label: "Архів",
    activeClass: "bg-slate-600 text-white shadow-md shadow-slate-100",
  },
};

export function BriefTable({ briefs }: { briefs: BriefRow[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("ALL");

  const filtered =
    activeTab === "ALL" ? briefs : briefs.filter((b) => b.status === activeTab);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          Список брифів
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.refresh()}
          >
            Оновити дані
          </Button>
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-200/50 p-1">
            {(Object.keys(tabConfigs) as TabType[]).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "primary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "h-8 rounded-md border-none px-4 py-1 font-bold shadow-none transition-all duration-300",
                  activeTab === tab
                    ? tabConfigs[tab].activeClass
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700",
                )}
              >
                {tabConfigs[tab].label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-slate-400">
          Брифів у цій категорії поки немає.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Статус</th>
                <th className="px-6 py-3">Створено</th>
                <th className="px-6 py-3 text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((brief) => (
                <tr key={brief.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-3 font-mono text-xs text-slate-500">
                    {brief.id}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={brief.status} />
                  </td>
                  <td className="px-6 py-3 text-slate-500">{brief.createdAt}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/briefs/${brief.id}`}>
                      <Button variant="outline" size="sm">
                        Відкрити
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
