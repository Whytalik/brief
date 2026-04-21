import { briefService } from "@/services/brief.service";
import { BriefTable } from "./BriefTable";

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

export default async function AdminDashboardPage() {
  const briefs = await briefService.getAll();

  const counts = {
    total: briefs.length,
    new: briefs.filter((b) => b.status === "NEW").length,
    reviewing: briefs.filter((b) => b.status === "REVIEWING").length,
    accepted: briefs.filter((b) => b.status === "ACCEPTED").length,
    archived: briefs.filter((b) => b.status === "ARCHIVED").length,
  };

  const briefRows = briefs.map((b) => ({
    id: b.id,
    status: b.status,
    createdAt: b.createdAt.toLocaleString("uk-UA"),
  }));

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>
        <p className="mt-1 text-sm text-slate-500">
          Огляд усіх отриманих брифів
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Всього" value={counts.total} color="text-slate-900" />
        <StatCard label="Нові" value={counts.new} color="text-blue-600" />
        <StatCard
          label="На розгляді"
          value={counts.reviewing}
          color="text-amber-600"
        />
        <StatCard
          label="Прийняті"
          value={counts.accepted}
          color="text-emerald-600"
        />
        <StatCard label="Архів" value={counts.archived} color="text-slate-500" />
      </div>

      <BriefTable briefs={briefRows} />
    </div>
  );
}
