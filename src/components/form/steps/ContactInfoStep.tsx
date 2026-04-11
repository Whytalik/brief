import { FormSection } from "@/components/form/FormSection";
import { MultiSelect, Option } from "@/components/form/inputs/MultiSelect";
import { TelInput } from "@/components/form/inputs/TelInput";
import { TextInput } from "@/components/form/inputs/TextInput";
import { RepeatingFieldset } from "@/components/form/RepeatingFieldset";
import { BriefFormData } from "@/schemas/brief";
import { Controller, useFormContext } from "react-hook-form";

const contactOptions: Option[] = [
  { label: "Дзвінки", value: "calls" },
  { label: "Email", value: "email" },
  { label: "Telegram", value: "telegram" },
  { label: "Viber", value: "viber" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Інше", value: "other" },
];

export function ContactInfoStep() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<BriefFormData>();

  const contactMethods = watch("contactMethods") || [];
  const isEmailRequired = contactMethods.includes("email");

  return (
    <FormSection
      title="Блок 1. Контактна інформація"
      description="Щоб ми могли оперативно уточнювати деталі та не заважати вам у невідповідний час, будь ласка, заповніть цю інформацію."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <TextInput
          label="1.1 Ваше ім’я."
          id="name"
          placeholder="Як до вас звертатися"
          {...register("name")}
          error={errors.name?.message}
          required
        />

        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <TelInput
              label="1.2 Номер телефону."
              id="phone"
              placeholder="+380 (__) ___-__-__"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.phone?.message}
              required
            />
          )}
        />

        <TextInput
          label={`1.3 Email ${isEmailRequired ? "*" : "(optional)"}`}
          id="email"
          placeholder="example@mail.com"
          {...register("email")}
          error={errors.email?.message}
          required={isEmailRequired}
        />

        <Controller
          control={control}
          name="contactMethods"
          render={({ field }) => (
            <MultiSelect
              label="1.4 Зручний спосіб зв’язку."
              placeholder="Оберіть один або кілька варіантів"
              options={contactOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.contactMethods?.message}
              required
            />
          )}
        />

        <TextInput
          label="1.5 Години для зв’язку."
          id="contactHours"
          placeholder="Наприклад: Пн-Пт, з 9 до 18 годину"
          {...register("contactHours")}
          error={errors.contactHours?.message}
          required
        />
      </div>

      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-950">
            1.5 Чи є інші учасники проєкту?
          </h3>
          <p className="text-sm leading-6 text-slate-600">
            Перелічіть усіх, хто впливає на рішення або кого варто тримати в
            курсі. Це може бути керівник, власник, технічний директор, ключові
            консультанти тощо.
          </p>
        </div>
        <RepeatingFieldset name="stakeholders" label="Список учасників" />
      </div>
    </FormSection>
  );
}
