"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

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
      return <span className="badge text-slate-400 border border-slate-200">{status}</span>;
  }
}

function FormattedDate({ date }: { date: Date | string }) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    setFormatted(new Date(date).toLocaleString("uk-UA"));
  }, [date]);

  return <span>{formatted || "..."}</span>;
}

type TabType = "ALL" | "NEW" | "REVIEWING" | "ACCEPTED" | "ARCHIVED";

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    total: number;
    new: number;
    reviewing: number;
    accepted: number;
    archived: number;
    recent: { id: string; status: string; createdAt: string }[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/brief");
        const result = await response.json();
        const briefs = result.data || [];

        setData({
          total: briefs.length,
          new: briefs.filter((b: { status: string }) => b.status === "NEW").length,
          reviewing: briefs.filter((b: { status: string }) => b.status === "REVIEWING").length,
          accepted: briefs.filter((b: { status: string }) => b.status === "ACCEPTED").length,
          archived: briefs.filter((b: { status: string }) => b.status === "ARCHIVED").length,
          recent: briefs,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />
      </div>
    );
  }

  const filteredBriefs =
    activeTab === "ALL"
      ? data?.recent
      : data?.recent.filter((b) => b.status === activeTab);

  const tabConfigs: Record<TabType, { label: string; activeClass: string }> = {
    ALL: { label: "Всі", activeClass: "bg-white text-slate-950 shadow-sm" },
    NEW: { label: "Нові", activeClass: "bg-blue-600 text-white shadow-md shadow-blue-100" },
    REVIEWING: { label: "На розгляді", activeClass: "bg-amber-500 text-white shadow-md shadow-amber-100" },
    ACCEPTED: { label: "Прийняті", activeClass: "bg-emerald-600 text-white shadow-md shadow-emerald-100" },
    ARCHIVED: { label: "Архів", activeClass: "bg-slate-600 text-white shadow-md shadow-slate-100" },
  };

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>
          <p className="mt-1 text-sm text-slate-500">
            Огляд усіх отриманих брифів
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Оновити дані
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Всього"
          value={data?.total || 0}
          color="text-slate-900"
        />
        <StatCard
          label="Нові"
          value={data?.new || 0}
          color="text-blue-600"
        />
        <StatCard
          label="На розгляді"
          value={data?.reviewing || 0}
          color="text-amber-600"
        />
        <StatCard
          label="Прийняті"
          value={data?.accepted || 0}
          color="text-emerald-600"
        />
        <StatCard
          label="Архів"
          value={data?.archived || 0}
          color="text-slate-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            Список брифів
          </h2>
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
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50",
                )}
              >
                {tabConfigs[tab].label}
              </Button>
            ))}
          </div>
        </div>

        {!filteredBriefs || filteredBriefs.length === 0 ? (
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
                {filteredBriefs.map((brief) => (
                  <tr key={brief.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-3 font-mono text-xs text-slate-500">
                      {brief.id}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={brief.status} />
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      <FormattedDate date={brief.createdAt} />
                    </td>
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
    </div>
  );
}
