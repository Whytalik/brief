import { FormSection } from "@/components/form/FormSection";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { BriefFormData } from "@/schemas/brief";
import { useFormContext } from "react-hook-form";

export function SecurityStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BriefFormData>();

  return (
    <FormSection
      title="Блок 12. Безпека та конфіденційність"
      description="Захист даних користувачів та відповідність вимогам."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="12.1 Які дані є найбільш чутливими?"
          id="securitySensitiveData"
          placeholder="Особисті, фінансові, комерційні?"
          {...register("securitySensitiveData")}
          error={errors.securitySensitiveData?.message}
          required
        />

        <TextAreaInput
          label="12.2 Чи є особливі вимоги до безпеки або законодавства?"
          id="securityRequirements"
          placeholder="GDPR, ISO, особливі протоколи..."
          {...register("securityRequirements")}
          error={errors.securityRequirements?.message}
          required
        />
      </div>
    </FormSection>
  );
}
