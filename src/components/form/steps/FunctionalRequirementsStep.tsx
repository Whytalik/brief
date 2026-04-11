import { FormSection } from "@/components/form/FormSection";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { BriefFormData } from "@/schemas/brief";
import { useFormContext } from "react-hook-form";

export function FunctionalRequirementsStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BriefFormData>();

  return (
    <FormSection
      title="Блок 7. Функціональні вимоги"
      description="Конкретний перелік того, що має вміти система."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="7.1 Які функції критично потрібні для запуску?"
          id="criticalFunctions"
          placeholder="Розставте пріоритети"
          {...register("criticalFunctions")}
          error={errors.criticalFunctions?.message}
          required
        />

        <TextAreaInput
          label="7.2 Чи потрібна робота з файлами (завантаження, зберігання, перегляд)?"
          id="fileHandling"
          placeholder="Зображення, PDF, документи?"
          {...register("fileHandling")}
          error={errors.fileHandling?.message}
          required
        />

        <TextAreaInput
          label="7.3 Чи потрібен експорт та імпорт даних?"
          id="exportImport"
          placeholder="Які формати потрібні?"
          {...register("exportImport")}
          error={errors.exportImport?.message}
          required
        />

        <TextAreaInput
          label="7.4 Наскільки складною має бути робота з даними (сортування, пошук, фільтрація)?"
          id="dataComplexity"
          placeholder="Опишіть рівень складності: простий пошук, фільтри за параметрами чи розширена фільтрація (як у Excel / Notion)."
          {...register("dataComplexity")}
          error={errors.dataComplexity?.message}
          required
        />
      </div>
    </FormSection>
  );
}
