import { FormSection } from "@/components/form/FormSection";
import { FileUpload } from "@/components/form/inputs/FileUpload";
import { TextAreaInput } from "@/components/form/inputs/TextAreaInput";
import { BriefFormData } from "@/schemas/brief";
import { Controller, useFormContext } from "react-hook-form";

export function VisualDesignStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BriefFormData>();

  return (
    <FormSection
      title="Блок 9. Візуальний вигляд."
      description="Як виглядатиме інтерфейс, його стиль та настрій."
    >
      <div className="space-y-6">
        <TextAreaInput
          label="9.1 Чи є у вас впізнаваний бренд (логотип, кольори шрифти)?"
          id="brandInfo"
          placeholder="Якщо так, опишіть та додайте файли нижче (логотип, кольори, шрифти)"
          {...register("brandInfo")}
          error={errors.brandInfo?.message}
          required
        />

        <Controller
          control={control}
          name="brandFiles"
          render={({ field }) => (
            <FileUpload
              label="Файли бренду (логотип, брендбук)"
              onChange={field.onChange}
              error={errors.brandFiles?.message}
              multiple
              accept="image/*,application/pdf"
            />
          )}
        />

        <TextAreaInput
          label="9.2 Чи є референси (приклади інтерфейсів), які вам подобаються?"
          id="designReferences"
          placeholder="Посилання або опис того, що вам подобається в інших сервісах"
          {...register("designReferences")}
          error={errors.designReferences?.message}
          required
        />

        <TextAreaInput
          label="9.3 Яке загальне враження має створювати дизайн?"
          id="designImpression"
          placeholder="Професійний, мінімалістичний, яскравий, дружній тощо."
          {...register("designImpression")}
          error={errors.designImpression?.message}
          required
        />

        <TextAreaInput
          label="9.4 Чи потрібна адаптація под мобільні пристрої?"
          id="designResponsive"
          placeholder="Наскільки важливо, щоб продуктом було зручно користуватися зі смартфона?"
          {...register("designResponsive")}
          error={errors.designResponsive?.message}
          required
        />

        <TextAreaInput
          label="9.5 Чи важливо, щоб продукту був зручний для всіх користувач, включно з людьми з обмеженими можливостями?"
          id="designAccessibility"
          placeholder="Наприклад: зручність для людей з порушенням зору, підтримка озвучування тексту тощо."
          {...register("designAccessibility")}
          error={errors.designAccessibility?.message}
          required
        />

        <TextAreaInput
          label="9.6 Чи має інтерфейс бути насиченим переходами та анімаціями?"
          id="designAnimations"
          placeholder="Плавні появи, живі кнопки, чи максимально швидкий та статичний інтерфейс?"
          {...register("designAnimations")}
          error={errors.designAnimations?.message}
          required
        />
      </div>
    </FormSection>
  );
}
