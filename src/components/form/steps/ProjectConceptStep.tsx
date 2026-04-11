import { FormSection } from "@/components/form/FormSection";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { TextInput } from "@/components/form/inputs/TextInput";
import { BriefFormData } from "@/schemas/brief";
import { useFormContext } from "react-hook-form";

export function ProjectConceptStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BriefFormData>();

  return (
    <FormSection
      title="Блок 2. Концепція проєкту"
      description="Цей блок допомагає зрозуміти головну ідею продукту, його місце на ринку та ключову цінність для користувачів."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="2.1 У чому головна ідея вашого продукту?"
          id="productIdea"
          placeholder="Сформулюйте одним-двома реченнями"
          {...register("productIdea")}
          error={errors.productIdea?.message}
          required
        />

        <TextAreaInput
          label="2.2 Яку проблему вирішує ваш продукт?"
          id="productProblem"
          placeholder="Що саме зараз не так, чого люди не можуть отримати або що їх дратує?"
          {...register("productProblem")}
          error={errors.productProblem?.message}
          required
        />

        <TextAreaInput
          label="2.3 Чим ваш підхід відрізняється від того, як люди справляються зараз (без вашого продукту)?"
          id="productDifference"
          placeholder="У чому ваша ключова відмінність?"
          {...register("productDifference")}
          error={errors.productDifference?.message}
          required
        />

        <TextInput
          label="2.4 Якби ви могли описати продукт одним словом або фразою, що б це було?"
          id="productOneLiner"
          placeholder="Коротко і яскраво"
          {...register("productOneLiner")}
          error={errors.productOneLiner?.message}
          required
        />

        <TextAreaInput
          label="2.5 Чи є у вас вже прототип або MVP? Якщо так, то що він вміє?"
          id="productMvpState"
          placeholder="Розкажіть про поточний стан"
          {...register("productMvpState")}
          error={errors.productMvpState?.message}
          required
        />

        <TextAreaInput
          label="2.6 Що для вас є головним критерієм успіху цього продукту?"
          id="productSuccessCriteria"
          placeholder="Кількість активних користувачів, виручка, зручність, швидкість?"
          {...register("productSuccessCriteria")}
          error={errors.productSuccessCriteria?.message}
          required
        />
      </div>
    </FormSection>
  );
}
