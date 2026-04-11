"use client";

import MainForm from "@/components/form/MainForm";
import { Button } from "@/components/ui/Button";
import { BriefFormData } from "@/schemas/brief";
import { CheckCircle, Clock, Edit2, Trash2, X, Eye, FileText, Archive, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BriefPreview } from "./BriefPreview";

interface Brief {
  id: string;
  status: "NEW" | "REVIEWING" | "ACCEPTED" | "ARCHIVED";
  rawData: any;
  createdAt: Date;
  updatedAt: Date;
}

export default function BriefManager({ brief }: { brief: Brief }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(brief.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  async function handleUpdate(data: BriefFormData) {
    try {
      const response = await fetch(`/api/brief/${brief.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawData: data }),
      });

      if (!response.ok) throw new Error("Помилка при оновленні");

      setIsEditing(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Сталася помилка");
    }
  }

  async function handleStatusChange(newStatus: string) {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/brief/${brief.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Помилка при зміні статусу");

      setCurrentStatus(newStatus as any);
      router.refresh();
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
      router.refresh();
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 duration-500">
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
            {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
              <Button
                key={status}
                variant={currentStatus === status ? "primary" : "ghost"}
                size="sm"
                className={currentStatus === status ? statusConfig[status].color : "text-slate-400"}
                onClick={() => handleStatusChange(status)}
                disabled={isUpdatingStatus}
                leftIcon={statusConfig[status].icon}
              >
                {statusConfig[status].label}
              </Button>
            ))}
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

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
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
            initialData={brief.rawData as BriefFormData}
            readOnly={false}
            hideTurnstile={true}
            onSubmitOverride={handleUpdate}
          />
        ) : (
          <BriefPreview data={brief.rawData as BriefFormData} />
        )}
      </div>
    </div>
  );
}
