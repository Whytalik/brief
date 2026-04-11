import { FormSection } from "@/components/form/FormSection";
import {
  RadioGroupInput,
  RadioOption,
} from "@/components/form/inputs/RadioGroupInput";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { BriefFormData } from "@/schemas/brief";
import { Controller, useFormContext } from "react-hook-form";

const hostingOptions: RadioOption[] = [
  { label: "Немає вимог / покладаюся на вас", value: "none" },
  { label: "Потрібен власний сервер (on-premise)", value: "on_premise" },
  { label: "Потрібна конкретна хмарна платформа", value: "cloud" },
  { label: "Інше", value: "other" },
];

export function ImplementationTermsStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BriefFormData>();

  return (
    <FormSection
      title="Блок 13. Умови реалізації"
      description="Фінальні умови розробки та подальша підтримка продукту."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="13.1 Чи є у вас готові специфікації (ТЗ, макети, діаграми)?"
          id="specifications"
          placeholder="Що вже напрацьовано? (посилання на документи або опис)"
          {...register("specifications")}
          error={errors.specifications?.message}
          required
        />

        <Controller
          control={control}
          name="hostingRequirements"
          render={({ field }) => (
            <RadioGroupInput
              label="13.2 Чи є особливі вимоги до хостингу (де буде розміщено продукт)?"
              options={hostingOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.hostingRequirements?.message}
              required
            />
          )}
        />

        <TextAreaInput
          label="Уточнення щодо хостингу"
          id="hostingNote"
          placeholder="Наприклад: конкретна країна розміщення сервера або хмарний сервіс."
          {...register("hostingNote")}
          error={errors.hostingNote?.message}
        />

        <TextAreaInput
          label="13.3 Які терміни ви вважаєте реалістичними для MVP?"
          id="mvpTimeline"
          placeholder="Ваші очікування щодо часу розробки першої версії."
          {...register("mvpTimeline")}
          error={errors.mvpTimeline?.message}
          required
        />

        <TextAreaInput
          label="13.4 Який бюджет ви орієнтовно закладаєте?"
          id="budgetRange"
          placeholder="Це допоможе нам запропонувати оптимальний об'єм робіт."
          {...register("budgetRange")}
          error={errors.budgetRange?.message}
          required
        />

        <TextAreaInput
          label="13.5 Чи буде технічна підтримка користувачів після запуску?"
          id="supportPostLaunch"
          placeholder="Через які канали (чат, пошта тощо) і хто її буде надавати?"
          {...register("supportPostLaunch")}
          error={errors.supportPostLaunch?.message}
          required
        />

        <TextAreaInput
          label="13.6 Як ви бачите процес збору зворотного відгуку?"
          id="feedbackProcess"
          placeholder="Як користувачі будуть повідомляти про помилки чи побажання?"
          {...register("feedbackProcess")}
          error={errors.feedbackProcess?.message}
          required
        />
      </div>
    </FormSection>
  );
}
