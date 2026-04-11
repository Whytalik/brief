import { FormSection } from "@/components/form/FormSection";
import {
  RadioGroupInput,
  RadioOption,
} from "@/components/form/inputs/RadioGroupInput";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { BriefFormData } from "@/schemas/brief";
import { Controller, useFormContext } from "react-hook-form";

const dataComplexityOptions: RadioOption[] = [
  { label: "Простий пошук і сортування", value: "basic" },
  { label: "Фільтри за кількома параметрами", value: "filters" },
  { label: "Розширена фільтрація (як у Excel / Notion)", value: "advanced" },
];

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

        <Controller
          control={control}
          name="dataComplexity"
          render={({ field }) => (
            <RadioGroupInput
              label="7.4 Наскільки складною має бути робота з даними (сортування, пошук, фільтрація)?"
              options={dataComplexityOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.dataComplexity?.message}
              required
            />
          )}
        />

        <TextAreaInput
          label="Уточнення щодо роботи з даними"
          id="dataComplexityNote"
          placeholder="Параметри пошуку, фільтрації..."
          {...register("dataComplexityNote")}
          error={errors.dataComplexityNote?.message}
        />
      </div>
    </FormSection>
  );
}
