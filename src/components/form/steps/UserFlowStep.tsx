import { FormSection } from "@/components/form/FormSection";
import { MultiSelect, Option } from "@/components/form/inputs/MultiSelect";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { TextInput } from "@/components/form/inputs/TextInput";
import { BriefFormData } from "@/schemas/brief";
import { Controller, useFormContext, useWatch } from "react-hook-form";

const onboardingOptions: Option[] = [
  { label: "Підказки (туторіал)", value: "tutorial" },
  { label: "Демо-дані", value: "demo" },
  { label: "Відео-інструкції", value: "video" },
  { label: "Поєднання підходів", value: "mixed" },
  { label: "Інше", value: "other" },
];

export function UserFlowStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BriefFormData>();
  const onboardingType = useWatch({ control, name: "onboardingType" });

  return (
    <FormSection
      title="Блок 8. Користувацькі сценарії (User Flow)"
      description="Як конкретні люди використовуватимуть продукт у реальному житті."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="8.1 Чи матимуть користувачі у системі різні ролі? Якщо так, то уточніть які саме."
          id="roles"
          placeholder="Наприклад: Адміністратор, Менеджер, Клієнт, Гість. Опишіть коротко рівень доступу для кожного."
          {...register("roles")}
          error={errors.roles?.message}
          required
        />

        <TextAreaInput
          label="8.2 Опишіть 3–5 головних сценаріїв використання продукту."
          id="userScenarios"
          placeholder="Що робить користувач, у якій послідовності?"
          {...register("userScenarios")}
          error={errors.userScenarios?.message}
          required
        />

        <TextAreaInput
          label="8.3 Який сценарій є найбільш критичним для успіху?"
          id="criticalScenario"
          placeholder="Що має працювати ідеально?"
          {...register("criticalScenario")}
          error={errors.criticalScenario?.message}
          required
        />

        <TextAreaInput
          label="8.4 Чи потрібен гостьовий доступ або публічні сторінки?"
          id="guestAccess"
          placeholder="Чи можна ділитися записами з іншими?"
          {...register("guestAccess")}
          error={errors.guestAccess?.message}
          required
        />

        <Controller
          control={control}
          name="onboardingType"
          render={({ field }) => (
            <MultiSelect
              label="8.5 Як має відбуватися знайомство нового користувача з продуктом?"
              placeholder="Оберіть варіанти"
              options={onboardingOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.onboardingType?.message}
              required
            />
          )}
        />

        <TextInput
          label="Інші способи знайомства"
          id="onboardingOther"
          placeholder="Вкажіть, якщо обрали 'Інше'"
          {...register("onboardingOther")}
          error={errors.onboardingOther?.message}
          required={onboardingType?.includes("other")}
        />
      </div>
    </FormSection>
  );
}
