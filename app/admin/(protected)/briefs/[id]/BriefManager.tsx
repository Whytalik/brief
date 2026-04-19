"use client";

import MainForm from "@/components/form/MainForm";
import { Button } from "@/components/ui/Button";
import { BriefFormData } from "@/schemas/brief";
import { BriefStatus } from "@/generated/prisma";
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

export default function BriefManager({ brief }: { brief: Brief }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(brief.status);
  const [currentRawData, setCurrentRawData] = useState(brief.rawData);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState<{ status: BriefStatus; label: string } | null>(null);

  // Status sequence logic
  const getNextAvailableStatuses = (status: BriefStatus): BriefStatus[] => {
    switch (status) {
      case "NEW":
        return ["REVIEWING", "ARCHIVED"];
      case "REVIEWING":
        return ["ACCEPTED", "ARCHIVED"];
      case "ACCEPTED":
        return ["ARCHIVED"];
      case "ARCHIVED":
        return ["REVIEWING"]; // Allow restoring from archive back to review
      default:
        return [];
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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Сталася помилка");
    }
  }

  async function confirmStatusChange() {
    if (!showStatusModal) return;
    
    setIsUpdatingStatus(true);
    const newStatus = showStatusModal.status;
    
    try {
      const response = await fetch(`/api/brief/${brief.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Помилка при зміні статусу");

      setCurrentStatus(newStatus);
      setShowStatusModal(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Сталася помилка");
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        "Ви впевнені, що хочете видалити цей бриф? Цю дію неможливо скасувати.",
      )
    )
      return;

    try {
      const response = await fetch(`/api/brief/${brief.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Помилка при видаленні");

      router.push("/admin");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Сталася помилка");
    }
  }

  const statusConfig = {
    NEW: { label: "Новий", icon: <Clock size={14} />, color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" },
    REVIEWING: { label: "На розгляді", icon: <Eye size={14} />, color: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200" },
    ACCEPTED: { label: "Прийнято", icon: <Check size={14} />, color: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200" },
    ARCHIVED: { label: "Архів", icon: <Archive size={14} />, color: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200" },
  };

  const nextStatuses = getNextAvailableStatuses(currentStatus);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 duration-500">
      {/* Confirmation Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">Змінити статус?</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Ви збираєтеся змінити статус брифу на <span className="font-bold text-slate-900">&quot;{showStatusModal.label}&quot;</span>. Це вплине на його відображення в дашборді.
            </p>
            <div className="mt-8 flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowStatusModal(null)}
                disabled={isUpdatingStatus}
              >
                Скасувати
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={confirmStatusChange}
                isLoading={isUpdatingStatus}
              >
                Підтвердити
              </Button>
            </div>
          </div>
        </div>
      )}

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
                    !isActive && !isAvailable && "opacity-30 cursor-not-allowed grayscale"
                  )}
                  onClick={() => {
                    if (isActive) return;
                    if (isAvailable) setShowStatusModal({ status, label: statusConfig[status].label });
                  }}
                  disabled={isUpdatingStatus || (!isActive && !isAvailable)}
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
          onClick={handleDelete}
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
