"use client";

import MainForm from "@/components/form/MainForm";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { BriefFormData } from "@/schemas/brief";
import { BriefStatus } from "@/generated/prisma";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Clock, Edit2, Trash2, X, Eye, FileText, Archive, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BriefPreview } from "./BriefPreview";

interface Brief {
  id: string;
  status: BriefStatus;
  rawData: BriefFormData;
  createdAt: Date;
  updatedAt: Date;
}

type ModalState =
  | { type: "status"; status: BriefStatus; label: string }
  | { type: "delete" }
  | null;

export default function BriefManager({ brief }: { brief: Brief }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(brief.status);
  const [currentRawData, setCurrentRawData] = useState(brief.rawData);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  const getNextAvailableStatuses = (status: BriefStatus): BriefStatus[] => {
    switch (status) {
      case "NEW":       return ["REVIEWING", "ARCHIVED"];
      case "REVIEWING": return ["ACCEPTED", "ARCHIVED"];
      case "ACCEPTED":  return ["ARCHIVED"];
      case "ARCHIVED":  return ["REVIEWING"];
      default:          return [];
    }
  };

  async function handleUpdate(data: BriefFormData) {
    try {
      const response = await fetch(`/api/brief/${brief.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawData: data }),
      });

      if (!response.ok) throw new Error("Помилка при оновленні");

      setCurrentRawData(data);
      setIsEditing(false);
      toast.success("Бриф успішно оновлено");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Сталася помилка");
    }
  }

  async function handleConfirm() {
    if (!modal) return;

    setIsActionLoading(true);
    try {
      if (modal.type === "status") {
        const response = await fetch(`/api/brief/${brief.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: modal.status }),
        });

        if (!response.ok) throw new Error("Помилка при зміні статусу");

        setCurrentStatus(modal.status);
        toast.success(`Статус змінено на «${modal.label}»`);
      } else {
        const response = await fetch(`/api/brief/${brief.id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Помилка при видаленні");

        toast.success("Бриф видалено");
        router.push("/admin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Сталася помилка");
    } finally {
      setIsActionLoading(false);
      setModal(null);
    }
  }

  const statusConfig = {
    NEW:       { label: "Новий",       icon: <Clock   size={14} />, color: "bg-blue-100    text-blue-700    border-blue-200    hover:bg-blue-200"    },
    REVIEWING: { label: "На розгляді", icon: <Eye     size={14} />, color: "bg-amber-100   text-amber-700   border-amber-200   hover:bg-amber-200"   },
    ACCEPTED:  { label: "Прийнято",    icon: <Check   size={14} />, color: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200" },
    ARCHIVED:  { label: "Архів",       icon: <Archive size={14} />, color: "bg-slate-100   text-slate-700   border-slate-200   hover:bg-slate-200"   },
  };

  const nextStatuses = getNextAvailableStatuses(currentStatus);

  const modalProps = modal
    ? modal.type === "delete"
      ? {
          title: "Видалити бриф?",
          description: "Цю дію неможливо скасувати. Бриф буде видалено назавжди.",
          confirmLabel: "Видалити",
          variant: "danger" as const,
        }
      : {
          title: "Змінити статус?",
          description: `Ви збираєтеся змінити статус брифу на «${modal.label}». Це вплине на його відображення в дашборді.`,
          confirmLabel: "Підтвердити",
          variant: "primary" as const,
        }
    : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 duration-500">
      <ConfirmModal
        open={!!modal}
        title={modalProps?.title ?? ""}
        description={modalProps?.description ?? ""}
        confirmLabel={modalProps?.confirmLabel}
        variant={modalProps?.variant}
        isLoading={isActionLoading}
        onConfirm={handleConfirm}
        onCancel={() => setModal(null)}
      />

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={isEditing ? "outline" : "primary"}
            onClick={() => setIsEditing(!isEditing)}
            leftIcon={isEditing ? <X size={16} /> : <Edit2 size={16} />}
          >
            {isEditing ? "Скасувати" : "Редагувати дані"}
          </Button>

          <div className="hidden h-8 w-px bg-slate-200 md:block" />

          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
              const isActive = currentStatus === status;
              const isAvailable = nextStatuses.includes(status);

              return (
                <Button
                  key={status}
                  variant={isActive ? "primary" : "ghost"}
                  size="sm"
                  className={cn(
                    isActive ? statusConfig[status].color : "text-slate-400",
                    !isActive && !isAvailable && "opacity-30 cursor-not-allowed grayscale",
                  )}
                  onClick={() => {
                    if (isActive || !isAvailable) return;
                    setModal({ type: "status", status, label: statusConfig[status].label });
                  }}
                  disabled={isActionLoading || (!isActive && !isAvailable)}
                  leftIcon={statusConfig[status].icon}
                >
                  {statusConfig[status].label}
                </Button>
              );
            })}
          </div>
        </div>

        <Button
          variant="danger"
          onClick={() => setModal({ type: "delete" })}
          leftIcon={<Trash2 size={16} />}
        >
          Видалити
        </Button>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Зміст брифу</h1>
              <p className="text-sm text-slate-500">Перегляд та керування відповідями клієнта</p>
            </div>
          </div>

          {isEditing && (
            <span className="flex animate-pulse items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              Режим редагування
            </span>
          )}
        </div>

        {isEditing ? (
          <MainForm
            initialData={currentRawData}
            readOnly={false}
            hideTurnstile={true}
            isStepped={false}
            onSubmitOverride={handleUpdate}
          />
        ) : (
          <BriefPreview data={currentRawData} />
        )}
      </div>
    </div>
  );
}
