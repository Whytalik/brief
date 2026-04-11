import { FormSection } from "@/components/form/FormSection";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { BriefFormData } from "@/schemas/brief";
import { useFormContext } from "react-hook-form";

export function CompetitionStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BriefFormData>();

  return (
    <FormSection
      title="Блок 5. Конкурентне середовище"
      description="Розуміння конкурентів допомагає знайти своє місце на ринку та уникнути чужих помилок."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="5.1 Кого ви вважаєте своїми основними конкурентами?"
          id="competitors"
          placeholder="Навіть непрямими, як-от Excel, Sheets, Notion..."
          {...register("competitors")}
          error={errors.competitors?.message}
          required
        />

        <TextAreaInput
          label="5.2 Що вони роблять добре, а в чому програють?"
          id="competitorsSWOT"
          placeholder="Короткий аналіз сильних та слабких сторін"
          {...register("competitorsSWOT")}
          error={errors.competitorsSWOT?.message}
          required
        />

        <TextAreaInput
          label="5.3 Яка ваша ключова конкурентнта перевага?"
          id="competitiveAdvantage"
          placeholder="Те, чого немає у інших або що ви робите значно краще"
          {...register("competitiveAdvantage")}
          error={errors.competitiveAdvantage?.message}
          required
        />
      </div>
    </FormSection>
  );
}
