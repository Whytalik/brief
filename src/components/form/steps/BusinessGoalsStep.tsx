import { FormSection } from "@/components/form/FormSection";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { BriefFormData } from "@/schemas/brief";
import { useFormContext } from "react-hook-form";

export function BusinessGoalsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BriefFormData>();

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

        <TextAreaInput
          label="3.3 Чи потрібна інтеграція з платіжними системами?"
          id="paymentSystems"
          placeholder="Stripe, PayPal, Fondy, LiqPay тощо."
          {...register("paymentSystems")}
          error={errors.paymentSystems?.message}
          required
        />

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
