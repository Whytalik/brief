"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { briefFormSchema, type BriefFormData } from "@/schemas/brief";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { Check, ChevronLeft, ChevronRight, LayoutList, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";

// Import steps
import { BusinessGoalsStep } from "./steps/BusinessGoalsStep";
import { CompetitionStep } from "./steps/CompetitionStep";
import { ContactInfoStep } from "./steps/ContactInfoStep";
import { ContentStep } from "./steps/ContentStep";
import { DataArchitectureStep } from "./steps/DataArchitectureStep";
import { FunctionalRequirementsStep } from "./steps/FunctionalRequirementsStep";
import { ImplementationTermsStep } from "./steps/ImplementationTermsStep";
import { IntegrationsStep } from "./steps/IntegrationsStep";
import { ProjectConceptStep } from "./steps/ProjectConceptStep";
import { SecurityStep } from "./steps/SecurityStep";
import { TargetAudienceStep } from "./steps/TargetAudienceStep";
import { UserFlowStep } from "./steps/UserFlowStep";
import { VisualDesignStep } from "./steps/VisualDesignStep";

const STORAGE_KEY = "brief-form-draft";
const TOTAL_STEPS = 13;

interface MainFormProps {
  initialData?: Partial<BriefFormData>;
  readOnly?: boolean;
  onSubmitOverride?: (data: BriefFormData) => Promise<void>;
  hideTurnstile?: boolean;
  isStepped?: boolean;
}

export default function MainForm({
  initialData,
  readOnly = false,
  onSubmitOverride,
  hideTurnstile = false,
  isStepped = true,
}: MainFormProps = {}) {
  const router = useRouter();
  const [internalStepped, setInternalStepped] = useState(isStepped);
  const [currentStep, setCurrentStep] = useState(1);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const isExistingBrief = !!initialData;

  const methods = useForm<BriefFormData>({
    resolver: zodResolver(briefFormSchema),
    defaultValues: initialData || {
      contactMethods: [],
      paymentSystems: "",
      onboardingType: [],
      brandFiles: [],
      cfToken: hideTurnstile ? "bypass" : "",
    },
    disabled: readOnly,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = methods;

  // Restore state on mount - only for new briefs in stepped mode
  useEffect(() => {
    if (isExistingBrief || !internalStepped) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { cfToken, currentStep: savedStep, ...rest } = JSON.parse(saved);
        reset({ ...rest, cfToken: "" });
        if (savedStep) {
          setCurrentStep(Number(savedStep));
        }
      } catch (e) {
        console.error("Failed to restore form state", e);
      }
    }
  }, [isExistingBrief, internalStepped, reset]);

  // Save progress whenever data or step changes - only for new briefs in stepped mode
  useEffect(() => {
    if (isExistingBrief || !internalStepped) return;

    const subscription = watch((value) => {
      const { cfToken, brandFiles, ...rest } = value;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...rest, currentStep })
      );
    });
    return () => subscription.unsubscribe();
  }, [isExistingBrief, internalStepped, watch, currentStep]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (values: FieldValues) => {
    const data = values as BriefFormData;

    if (onSubmitOverride) {
      await onSubmitOverride(data);
      return;
    }

    try {
      if (!hideTurnstile && TURNSTILE_SITE_KEY && !data.cfToken) {
        alert("Будь ласка, пройдіть перевірку Turnstile");
        return;
      }

      const { cfToken, brandFiles, ...formData } = data;
      const processedFormData: any = { ...formData };

      if (brandFiles && Array.isArray(brandFiles)) {
        const base64Files = await Promise.all(
          brandFiles
            .filter((f) => f instanceof File)
            .map(async (f) => ({
              name: f.name,
              type: f.type,
              content: await fileToBase64(f),
            })),
        );
        processedFormData.brandFiles = base64Files;
      }

      const tokenToSend = hideTurnstile
        ? "bypass"
        : !TURNSTILE_SITE_KEY && process.env.NODE_ENV === "development"
          ? "dev-bypass-token"
          : cfToken;

      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawData: processedFormData,
          cfToken: tokenToSend,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Помилка при збереженні");
      }

      localStorage.removeItem(STORAGE_KEY);
      router.push("/success");
    } catch (error) {
      console.error("Submission error:", error);
      alert(error instanceof Error ? error.message : "Сталася помилка");
      if (!hideTurnstile) {
        setTurnstileKey((prev) => prev + 1);
        setValue("cfToken", "");
      }
    }
  };

  const nextStep = async () => {
    const stepFields = getFieldsForStep(currentStep);
    const isValid = await trigger(stepFields as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return [
          "name",
          "phone",
          "email",
          "contactMethods",
          "contactHours",
          "stakeholders",
        ];
      case 2:
        return [
          "productIdea",
          "productProblem",
          "productDifference",
          "productOneLiner",
          "productMvpState",
          "productSuccessCriteria",
        ];
      case 3:
        return [
          "businessGoals",
          "monetization",
          "paymentSystems",
          "businessRisks",
        ];
      case 4:
        return [
          "idealUser",
          "audienceSegments",
          "technicalLevel",
          "acquisitionChannels",
        ];
      case 5:
        return ["competitors", "competitorsSWOT", "competitiveAdvantage"];
      case 6:
        return [
          "dataObjects",
          "dataRelationships",
          "bigData",
          "dataVersioning",
        ];
      case 7:
        return [
          "criticalFunctions",
          "fileHandling",
          "exportImport",
          "dataComplexity",
        ];
      case 8:
        return [
          "roles",
          "userScenarios",
          "criticalScenario",
          "guestAccess",
          "onboardingType",
          "onboardingOther",
        ];
      case 9:
        return [
          "brandInfo",
          "designReferences",
          "designImpression",
          "designResponsive",
          "designAccessibility",
          "designAnimations",
        ];
      case 10:
        return ["contentCopywriter", "contentLanguages", "contentSamples"];
      case 11:
        return ["externalIntegrationsList", "customScripting", "notifications"];
      case 12:
        return ["securitySensitiveData", "securityRequirements"];
      case 13:
        return [
          "specifications",
          "hostingRequirements",
          "hostingNote",
          "mvpTimeline",
          "budgetRange",
          "supportPostLaunch",
          "feedbackProcess",
        ];
      default:
        return [];
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ContactInfoStep />;
      case 2:
        return <ProjectConceptStep />;
      case 3:
        return <BusinessGoalsStep />;
      case 4:
        return <TargetAudienceStep />;
      case 5:
        return <CompetitionStep />;
      case 6:
        return <DataArchitectureStep />;
      case 7:
        return <FunctionalRequirementsStep />;
      case 8:
        return <UserFlowStep />;
      case 9:
        return <VisualDesignStep />;
      case 10:
        return <ContentStep />;
      case 11:
        return <IntegrationsStep />;
      case 12:
        return <SecurityStep />;
      case 13:
        return <ImplementationTermsStep />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="my-10">
        <div className="mb-10 flex flex-col gap-6 px-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setInternalStepped(true)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                internalStepped
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Layers size={14} /> Покроково
            </button>
            <button
              type="button"
              onClick={() => setInternalStepped(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                !internalStepped
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LayoutList size={14} /> Однією сторінкою
            </button>
          </div>

          {internalStepped && (
            <div className="flex flex-1 flex-col gap-2 sm:max-w-[200px]">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span>Прогрес заповнення</span>
                <span>{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {internalStepped ? (
          <>
            <div className="px-8">{renderStep()}</div>

            {!readOnly && (
              <div className="mt-10 flex flex-col items-center gap-6 border-t border-slate-100 px-8 pt-10">
                <div className="flex w-full justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className={cn(currentStep === 1 && "invisible")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Назад
                  </Button>

                  {currentStep < TOTAL_STEPS ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={isSubmitting}
                    >
                      Далі <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex flex-col items-end gap-6">
                      {!hideTurnstile && TURNSTILE_SITE_KEY && (
                        <div className="flex flex-col items-end gap-2">
                          <Turnstile
                            key={turnstileKey}
                            siteKey={TURNSTILE_SITE_KEY}
                            onSuccess={(token) =>
                              setValue("cfToken", token, { shouldValidate: true })
                            }
                            onExpire={() => setValue("cfToken", "")}
                            onError={() => setValue("cfToken", "")}
                          />
                          {errors.cfToken && (
                            <p className="text-xs font-medium text-red-500">
                              {errors.cfToken.message}
                            </p>
                          )}
                        </div>
                      )}
                      <Button type="submit" isLoading={isSubmitting}>
                        <Check className="mr-2 h-4 w-4" /> Завершити та надіслати
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-16 px-8">
            <ContactInfoStep />
            <ProjectConceptStep />
            <BusinessGoalsStep />
            <TargetAudienceStep />
            <CompetitionStep />
            <DataArchitectureStep />
            <FunctionalRequirementsStep />
            <UserFlowStep />
            <VisualDesignStep />
            <ContentStep />
            <IntegrationsStep />
            <SecurityStep />
            <ImplementationTermsStep />

            {!readOnly && (
              <div className="sticky bottom-8 z-10 mt-12 flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  isLoading={isSubmitting}
                  className="shadow-2xl shadow-blue-200"
                >
                  <Check className="mr-2 h-5 w-5" /> {isExistingBrief ? "Зберегти зміни" : "Завершити та надіслати"}
                </Button>
              </div>
            )}
          </div>
        )}
      </form>
    </FormProvider>
  );
}
