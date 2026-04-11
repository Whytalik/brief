import { FormSection } from "@/components/form/FormSection";
import { MultiSelect, Option } from "@/components/form/inputs/MultiSelect";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { TextInput } from "@/components/form/inputs/TextInput";
import { BriefFormData } from "@/schemas/brief";
import { Controller, useFormContext, useWatch } from "react-hook-form";

const paymentOptions: Option[] = [
  { label: "Stripe", value: "stripe" },
  { label: "PayPal", value: "paypal" },
  { label: "Fondy", value: "fondy" },
  { label: "LiqPay", value: "liqpay" },
  { label: "Інше", value: "other" },
];

export function BusinessGoalsStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BriefFormData>();
  const paymentSystems = useWatch({ control, name: "paymentSystems" });

  return (
    <FormSection
      title="Блок 3. Бізнес-цілі"
      description="Розуміння бізнес-контексту допомагає приймати правильні технічні рішення."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="3.1 Які ключові бізнес-цілі ви ставите перед продуктом?"
          id="businessGoals"
          placeholder="Чого ви хочете досягти через 6 місяців, рік, три роки?"
          {...register("businessGoals")}
          error={errors.businessGoals?.message}
          required
        />

        <TextAreaInput
          label="3.2 Чи планується монетизація? Якщо так, то яка модель?"
          id="monetization"
          placeholder="Підписка, freemium, разові платежі, інше"
          {...register("monetization")}
          error={errors.monetization?.message}
          required
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            control={control}
            name="paymentSystems"
            render={({ field }) => (
              <MultiSelect
                label="3.3 Чи потрібна інтеграція з платіжними системами?"
                placeholder="Оберіть варіанти"
                options={paymentOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.paymentSystems?.message}
                required
              />
            )}
          />

          <TextInput
            label="Інші платіжні системи"
            id="paymentSystemsOther"
            placeholder="Вкажіть, якщо обрали 'Інше'"
            {...register("paymentSystemsOther")}
            error={errors.paymentSystemsOther?.message}
            required={paymentSystems?.includes("other")}
          />
        </div>

        <TextAreaInput
          label="3.4 Які ризики можуть завадити бізнес-успіху, на вашу думку?"
          id="businessRisks"
          placeholder="Будьте відвертими, це допоможе їх уникнути"
          {...register("businessRisks")}
          error={errors.businessRisks?.message}
          required
        />
      </div>
    </FormSection>
  );
}
