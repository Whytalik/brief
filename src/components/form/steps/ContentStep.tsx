import { FormSection } from "@/components/form/FormSection";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { BriefFormData } from "@/schemas/brief";
import { useFormContext } from "react-hook-form";

export function ContentStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BriefFormData>();

  return (
    <FormSection
      title="Блок 10. Контентне наповнення"
      description="Тексти, переклади, навчальні матеріали."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="10.1 Хто готуватиме тексти для інтерфейсу (лейбли, підказки, повідомлення)?"
          id="contentCopywriter"
          placeholder="Команда розробників, замовник, копірайтер?"
          {...register("contentCopywriter")}
          error={errors.contentCopywriter?.message}
          required
        />

        <TextAreaInput
          label="10.2 Чи потрібна багатомовність? Якщо так, які мови?"
          id="contentLanguages"
          placeholder="Локалізація інтерфейсу"
          {...register("contentLanguages")}
          error={errors.contentLanguages?.message}
          required
        />

        <TextAreaInput
          label="10.3 Чи будуть в системі зразки даних або демо-контент для нових користувачів?"
          id="contentSamples"
          placeholder="Щоб одразу було зрозуміло, як працює система"
          {...register("contentSamples")}
          error={errors.contentSamples?.message}
          required
        />
      </div>
    </FormSection>
  );
}
