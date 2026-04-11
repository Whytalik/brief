import { z } from "zod";

const rawDataSchema = z
  .record(z.unknown())
  .refine((val) => Object.keys(val).length > 0, {
    message: "Дані не можуть бути порожніми",
  });

export const stakeholderSchema = z.object({
  name: z.string().min(1, "Ім'я обов'язкове"),
  role: z.string().min(1, "Роль обов'язкова"),
  contact: z.string().min(1, "Контакт обов'язковий"),
});

export const briefFormSchema = z
  .object({
    // Block 1
    name: z.string().min(2, "Будь ласка, введіть ваше ім'я"),
    email: z.string().optional().or(z.literal("")),
    phone: z.string().min(10, "Будь ласка, введіть коректний номер телефону"),
    contactMethods: z
      .array(z.string())
      .min(1, "Оберіть хоча б один спосіб зв'язку"),
    contactHours: z.string().min(1, "Вкажіть зручні години"),

    // Block 2
    productIdea: z.string().min(10, "Будь ласка, опишіть ідею детальніше"),
    productProblem: z.string().min(10, "Будь ласка, опишіть проблему детальніше"),
    productDifference: z.string().min(10, "Будь ласка, опишіть відмінність"),
    productOneLiner: z.string().min(2, "Короткий опис занадто короткий"),
    productMvpState: z.string().min(5, "Опишіть поточний стан"),
    productSuccessCriteria: z.string().min(10, "Опишіть критерії успіху"),

    // Block 3
    businessGoals: z.string().min(10, "Будь ласка, опишіть бізнес-цілі"),
    monetization: z.string().min(5, "Будь ласка, опишіть модель монетизації"),
    businessRisks: z.string().min(10, "Будь ласка, опишіть можливі ризики"),
    paymentSystems: z.array(z.string()).min(1, "Оберіть варіанти"),
    paymentSystemsOther: z.string().optional().or(z.literal("")),

    // Block 4
    idealUser: z.string().min(10, "Опишіть портрет користувача"),
    audienceSegments: z.string().min(10, "Опишіть сегменти"),
    technicalLevel: z.enum(["yes", "no", "partially"], {
      errorMap: () => ({ message: "Оберіть рівень підготовки" }),
    }),
    roles: z.string().min(5, "Опишіть ролі в системі"),
    acquisitionChannels: z.string().min(10, "Опишіть канали залучення"),

    // Block 5
    competitors: z.string().min(5, "Вкажіть конкурентів"),
    competitorsSWOT: z.string().min(10, "Опишіть сильні та слабкі сторони"),
    competitiveAdvantage: z.string().min(10, "Опишіть вашу перевагу"),

    // Block 6
    dataObjects: z.string().min(5, "Опишіть типи об'єктів"),
    dataRelationships: z.string().min(5, "Опишіть зв'язки"),
    bigData: z.enum(["yes", "no", "not_sure"], {
      errorMap: () => ({ message: "Оберіть варіант" }),
    }),
    dataVersioning: z.string().min(5, "Вкажіть потребу у версійності"),

    // Block 7
    criticalFunctions: z.string().min(10, "Опишіть критичні функції"),
    fileHandling: z.string().min(5, "Опишіть роботу з файлами"),
    exportImport: z.string().min(5, "Опишіть експорт/імпорт"),
    dataComplexity: z.string().min(5, "Будь ласка, опишіть складність роботи з даними"),

    // Block 8
    userScenarios: z.string().min(20, "Опишіть сценарії використання"),
    criticalScenario: z.string().min(10, "Опишіть критичний сценарій"),
    guestAccess: z.string().min(5, "Опишіть гостьовий доступ"),
    onboardingType: z.array(z.string()).min(1, "Оберіть хоча б один варіант"),
    onboardingOther: z.string().optional().or(z.literal("")),

    // Block 9
    brandInfo: z.string().min(5, "Опишіть бренд"),
    brandFiles: z.array(z.any()).optional(),
    designReferences: z.string().min(5, "Вкажіть референси"),
    designImpression: z.string().min(5, "Опишіть враження"),
    designResponsive: z.string().min(5, "Опишіть важливість мобільної версії"),
    designAccessibility: z.string().min(5, "Опишіть вимоги до доступності"),
    designAnimations: z.string().min(5, "Опишіть побажання щодо анімацій"),

    // Block 10
    contentCopywriter: z.string().min(5, "Вкажіть відповідального за контент"),
    contentLanguages: z.string().min(5, "Вкажіть мови"),
    contentSamples: z.string().min(5, "Вкажіть наявність зразків"),

    // Block 11
    externalIntegrationsList: z.string().optional().or(z.literal("")),
    customScripting: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "Оберіть варіант" }),
    }),
    notifications: z.string().min(5, "Опишіть систему сповіщень"),

    // Block 12
    securitySensitiveData: z.string().min(5, "Опишіть чутливі дані"),
    securityRequirements: z.string().min(5, "Опишіть особливі вимоги"),

    // Block 13
    specifications: z.string().min(5, "Вкажіть наявність ТЗ/макетів"),
    hostingRequirements: z.enum(["none", "on_premise", "cloud", "other"], {
      errorMap: () => ({ message: "Оберіть варіант хостингу" }),
    }),
    hostingNote: z.string().optional().or(z.literal("")),
    mvpTimeline: z.string().min(5, "Опишіть очікувані терміни"),
    budgetRange: z.string().min(5, "Опишіть бюджетний діапазон"),
    supportPostLaunch: z.string().min(5, "Опишіть план підтримки"),
    feedbackProcess: z.string().min(5, "Опишіть збір фідбеку"),

    cfToken: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentSystems.includes("other")) {
        return !!data.paymentSystemsOther && data.paymentSystemsOther.length > 0;
      }
      return true;
    },
    {
      message: "Будь ласка, вкажіть платіжні системи",
      path: ["paymentSystemsOther"],
    },
  )
  .refine(
    (data) => {
      if (data.onboardingType.includes("other")) {
        return !!data.onboardingOther && data.onboardingOther.length > 0;
      }
      return true;
    },
    {
      message: "Будь ласка, уточніть тип онбордингу",
      path: ["onboardingOther"],
    },
  )
  .refine(
    (data) => {
      if (data.contactMethods.includes("email")) {
        return !!data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      }
      return true;
    },
    {
      message: "Будь ласка, вкажіть коректну електронну адресу",
      path: ["email"],
    },
  );

export type BriefFormData = z.infer<typeof briefFormSchema>;

export const createBriefSchema = z.object({
  rawData: rawDataSchema,
  cfToken: z.string().min(1, "Токен перевірки Turnstile обов'язковий"),
});

export const updateBriefSchema = z
  .object({
    status: z.enum(["DRAFT", "SUBMITTED"]).optional(),
    rawData: rawDataSchema.optional(),
  })
  .refine((data) => data.status !== undefined || data.rawData !== undefined, {
    message: "Необхідно надати принаймні одне поле (статус або дані)",
  });
