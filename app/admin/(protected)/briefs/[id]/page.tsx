import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { BriefFormData } from "@/schemas/brief";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BriefManager from "./BriefManager";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function BriefDetailPage({ params }: Props) {
  const { id } = await params;

  const brief = await prisma.brief.findUnique({ where: { id } });
  if (!brief) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ChevronLeft size={16} />}
          >
            Назад до списку
          </Button>
        </Link>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            ID Брифа
          </p>
          <p className="font-mono text-xs text-slate-500">{brief.id}</p>
        </div>
      </div>

      <BriefManager brief={{ ...brief, rawData: brief.rawData as BriefFormData }} />
    </div>
  );
}
