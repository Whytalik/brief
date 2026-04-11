import { FormSection } from "@/components/form/FormSection";
import {
  RadioGroupInput,
  RadioOption,
} from "@/components/form/inputs/RadioGroupInput";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { BriefFormData } from "@/schemas/brief";
import { Controller, useFormContext } from "react-hook-form";

const bigDataOptions: RadioOption[] = [
  { label: "Так", value: "yes" },
  { label: "Ні", value: "no" },
  { label: "Не впевнений", value: "not_sure" },
];

export function DataArchitectureStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BriefFormData>();

  return (
    <FormSection
      title="Блок 6. Архітектура даних"
      description="Опишіть головні елементи, з якими працюватиме користувач. Це допоможе нам спроектувати надійну структуру системи."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="6.1 Чим саме ви будете керувати у системі?"
          id="dataObjects"
          placeholder="Наприклад: Клієнти, Проєкти, Замовлення, Товари, Документи тощо."
          {...register("dataObjects")}
          error={errors.dataObjects?.message}
          required
        />

        <TextAreaInput
          label="6.2 Чи пов’язані ці елементи між собою? Якщо так, то як саме?"
          id="dataRelationships"
          placeholder="Наприклад: один Клієнт може мати багато Замовлень, а кожне Замовлення містить кілька Товарів."
          {...register("dataRelationships")}
          error={errors.dataRelationships?.message}
          required
        />

        <Controller
          control={control}
          name="bigData"
          render={({ field }) => (
            <RadioGroupInput
              label="6.3 Чи планується робота з великими обсягами даних?"
              options={bigDataOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.bigData?.message}
              required
            />
          )}
        />

        <TextAreaInput
          label="6.4 Чи потрібна історія змін або версійність даних?"
          id="dataVersioning"
          placeholder="Чи важливо бачити, хто, коли і яку саме інформацію змінив у системі?"
          {...register("dataVersioning")}
          error={errors.dataVersioning?.message}
          required
        />
      </div>
    </FormSection>
  );
}
