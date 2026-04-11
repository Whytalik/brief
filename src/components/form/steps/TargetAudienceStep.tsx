import { FormSection } from "@/components/form/FormSection";
import {
  RadioGroupInput,
  RadioOption,
} from "@/components/form/inputs/RadioGroupInput";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { BriefFormData } from "@/schemas/brief";
import { Controller, useFormContext } from "react-hook-form";

const technicalLevelOptions: RadioOption[] = [
  { label: "Так", value: "yes" },
  { label: "Ні", value: "no" },
  { label: "Частково", value: "partially" },
];

export function TargetAudienceStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BriefFormData>();

  return (
    <FormSection
      title="Блок 4. Цільова аудиторія"
      description="Хто буде користуватися продуктом? Чітке розуміння аудиторії впливає на візуальний вигляд, функціонал і комунікацію."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="4.1 Опишіть портрет вашого користувача."
          id="idealUser"
          placeholder="Рід занять, досвід, больові точки..."
          {...register("idealUser")}
          error={errors.idealUser?.message}
          required
        />

        <TextAreaInput
          label="4.2 Які сегменти аудиторії ви хотіли б охопити в першу чергу?"
          id="audienceSegments"
          placeholder="На кого орієнтуватися на старті?"
          {...register("audienceSegments")}
          error={errors.audienceSegments?.message}
          required
        />

        <Controller
          control={control}
          name="technicalLevel"
          render={({ field }) => (
            <RadioGroupInput
              label="4.3 Чи є користувач технічно підготовленим?"
              options={technicalLevelOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.technicalLevel?.message}
              required
            />
          )}
        />

        <TextAreaInput
          label="4.4 Як користувачі дізнаються про ваш продукт? Чи є канали залучення?"
          id="acquisitionChannels"
          placeholder="Реклама, SEO, блог, соцмережі, партнерства..."
          {...register("acquisitionChannels")}
          error={errors.acquisitionChannels?.message}
          required
        />
      </div>
    </FormSection>
  );
}
