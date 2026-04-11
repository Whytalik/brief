import { FormSection } from "@/components/form/FormSection";
import {
  RadioGroupInput,
  RadioOption,
} from "@/components/form/inputs/RadioGroupInput";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { BriefFormData } from "@/schemas/brief";
import { Controller, useFormContext, useWatch } from "react-hook-form";

const yesNoOptions: RadioOption[] = [
  { label: "Так", value: "yes" },
  { label: "Ні", value: "no" },
];

export function IntegrationsStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BriefFormData>();

  return (
    <FormSection
      title="Блок 11. Інтеграції"
      description="Зв'язок із зовнішніми сервісами та архітектура системи."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="11.1 З якими сервісами потрібна інтеграція?"
          id="externalIntegrationsList"
          placeholder="Наприклад: Slack, CRM, Google Workspace тощо. Залиште порожнім, якщо не впевнені."
          {...register("externalIntegrationsList")}
          error={errors.externalIntegrationsList?.message}
        />

        <Controller
          control={control}
          name="customScripting"
          render={({ field }) => (
            <RadioGroupInput
              label="11.2 Чи має продукт бути відкритим для сторонніх розробників (мати API або систему плагінів)?"
              options={yesNoOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.customScripting?.message}
              required
            />
          )}
        />

        <TextAreaInput
          label="11.3 Як система має комунікувати з користувачем?"
          id="notifications"
          placeholder="Email, Push-повідомлення, SMS, Telegram тощо. Наприклад: 'Надсилати листа при реєстрації'."
          {...register("notifications")}
          error={errors.notifications?.message}
          required
        />
      </div>
    </FormSection>
  );
}
