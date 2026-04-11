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
  return status === "SUBMITTED" ? (
    <span className="badge-submitted">Відправлено</span>
  ) : (
    <span className="badge-draft">Чернетка</span>
  );
}

function FormattedDate({ date }: { date: Date | string }) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    setFormatted(new Date(date).toLocaleString("uk-UA"));
  }, [date]);

  return <span>{formatted || "..."}</span>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    total: number;
    submitted: number;
    draft: number;
    recent: any[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "DRAFT" | "SUBMITTED">(
    "ALL",
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/brief");
        const result = await response.json();
        const briefs = result.data || [];

        setData({
          total: briefs.length,
          submitted: briefs.filter((b: any) => b.status === "SUBMITTED").length,
          draft: briefs.filter((b: any) => b.status === "DRAFT").length,
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

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>
        <p className="mt-1 text-sm text-slate-500">
          Огляд усіх отриманих брифів
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Всього брифів"
          value={data?.total || 0}
          color="text-slate-900"
        />
        <StatCard
          label="Відправлено"
          value={data?.submitted || 0}
          color="text-emerald-600"
        />
        <StatCard
          label="Чернетки"
          value={data?.draft || 0}
          color="text-amber-600"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-800">
            Список брифів
          </h2>
          <div className="flex gap-1 rounded-lg bg-slate-200/50 p-1">
            {(["ALL", "DRAFT", "SUBMITTED"] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "outline" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "h-8 rounded-md border-none px-3 py-1 font-bold shadow-none",
                  activeTab === tab
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {tab === "ALL"
                  ? "Всі"
                  : tab === "DRAFT"
                    ? "Чернетки"
                    : "Відправлені"}
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
