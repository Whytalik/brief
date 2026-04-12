"use client";

import { BriefFormData } from "@/schemas/brief";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface BriefPreviewProps {
  data: BriefFormData;
}

const SECTIONS = [
  { id: "contact", title: "1. Контактна інформація" },
  { id: "concept", title: "2. Концепція проєкту" },
  { id: "goals", title: "3. Бізнес-цілі" },
  { id: "audience", title: "4. Цільова аудиторія" },
  { id: "competition", title: "5. Конкуренція" },
  { id: "data", title: "6. Архітектура даних" },
  { id: "functional", title: "7. Функціональні вимоги" },
  { id: "flow", title: "8. Шлях користувача" },
  { id: "visual", title: "9. Візуальний дизайн" },
  { id: "content", title: "10. Контент" },
  { id: "integrations", title: "11. Інтеграції" },
  { id: "security", title: "12. Безпека" },
  { id: "implementation", title: "13. Терміни та умови" },
];

export function BriefPreview({ data }: BriefPreviewProps) {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observers = SECTIONS.map((section) => {
      const element = document.getElementById(section.id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(section.id);
            }
          });
        },
        {
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0,
        }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const isEmpty = (value: any) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
  };

  const Field = ({ label, value }: { label: string; value: any }) => {
    if (isEmpty(value)) return null;

    const displayValue = (val: any) => {
      if (val === "yes") return "Так";
      if (val === "no") return "Ні";
      if (val === "partially") return "Частково";
      if (val === "not_sure") return "Не впевнений";
      if (val === "none") return "Немає";
      if (val === "on_premise") return "On-premise (власні сервери)";
      if (val === "cloud") return "Cloud (хмарні сервери)";
      if (val === "other") return "Інше";
      return String(val);
    };

    return (
      <div className="group border-b border-slate-100 py-6 last:border-0">
        <dt className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600 transition-colors group-hover:text-slate-900">
          {label}
        </dt>
        <dd className="text-base leading-relaxed text-slate-950">
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {value.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700"
                >
                  {displayValue(item)}
                </span>
              ))}
            </div>
          ) : typeof value === "string" && value.includes("\n") ? (
            <div className="whitespace-pre-wrap py-1">
              {value}
            </div>
          ) : (
            <span className="font-medium">{displayValue(value)}</span>
          )}
        </dd>
      </div>
    );
  };

  const Section = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => {
    const hasContent = (children as any[]).some((child) => child !== null);
    if (!hasContent) return null;

    return (
      <section id={id} className="mb-16 scroll-mt-24">
        <h2 className="mb-6 flex items-center gap-3 text-xl font-black text-slate-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-black text-white">
            {title.split(".")[0]}
          </span>
          {title.split(".")[1].trim()}
        </h2>
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <dl className="space-y-1">{children}</dl>
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row relative">
      {/* Navigation Sidebar */}
      <aside className="lg:w-72 shrink-0">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-hide">
          <nav className="space-y-1">
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Навігація
            </p>
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                  setActiveSection(section.id);
                }}
                className={cn(
                  "w-full px-4 py-3 text-left text-xs font-bold transition-all rounded-xl",
                  activeSection === section.id
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Section id="contact" title="1. Контактна інформація">
          <Field label="1.1 Ваше ім’я." value={data.name} />
          <Field label="1.2 Номер телефону." value={data.phone} />
          <Field label="1.3 Email" value={data.email} />
          <Field label="1.4 Зручний спосіб зв’язку." value={data.contactMethods} />
          <Field label="1.5 Години для зв’язку." value={data.contactHours} />
          {data.stakeholders && (data.stakeholders as any[]).length > 0 && (
            <div className="py-6 border-b border-slate-100 last:border-0">
              <dt className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-600">
                1.6 Чи є інші учасники проєкту?
              </dt>
              <dd className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {(data.stakeholders as any[]).map((s, i) => (
                  <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/30 p-4">
                    <p className="text-sm font-bold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{s.role} • {s.contact}</p>
                  </div>
                ))}
              </dd>
            </div>
          )}
        </Section>

        <Section id="concept" title="2. Концепція проєкту">
          <Field label="2.1 У чому головна ідея вашого продукту?" value={data.productIdea} />
          <Field label="2.2 Яку проблему вирішує ваш продукт?" value={data.productProblem} />
          <Field label="2.3 Чим ваш підхід відрізняється від того, як люди справляються зараз (без вашого продукту)?" value={data.productDifference} />
          <Field label="2.4 Якби ви могли описти продукт одним словом або фразою, що б це було?" value={data.productOneLiner} />
          <Field label="2.5 Чи є у вас вже прототип або MVP? Якщо так, то що він вміє?" value={data.productMvpState} />
          <Field label="2.6 Що для вас є головним критерієм успіху цього продукту?" value={data.productSuccessCriteria} />
        </Section>

        <Section id="goals" title="3. Бізнес-цілі">
          <Field label="3.1 Які ключові бізнес-цілі ви ставите перед продуктом?" value={data.businessGoals} />
          <Field label="3.2 Чи планується монетизація? Якщо так, то яка модель?" value={data.monetization} />
          <Field label="3.3 Чи потрібна інтеграція з платіжними системами?" value={data.paymentSystems} />
          <Field label="3.4 Які ризики можуть завадити бізнес-успіху, на вашу думку?" value={data.businessRisks} />
        </Section>

        <Section id="audience" title="4. Цільова аудиторія">
          <Field label="4.1 Опишіть portrait вашого користувача." value={data.idealUser} />
          <Field label="4.2 Які сегменти аудиторії ви хотіли б охопити в першу чергу?" value={data.audienceSegments} />
          <Field label="4.3 Чи є користувач технічно підготовленим?" value={data.technicalLevel} />
          <Field label="4.4 Як користувачі дізнаються про ваш продукт? Чи є канали залучення?" value={data.acquisitionChannels} />
        </Section>

        <Section id="competition" title="5. Конкуренція">
          <Field label="5.1 Кого ви вважаєте своїми основними конкурентами?" value={data.competitors} />
          <Field label="5.2 Що вони роблять добре, а в чому програють?" value={data.competitorsSWOT} />
          <Field label="5.3 Яка ваша ключова конкурентнта перевага?" value={data.competitiveAdvantage} />
        </Section>

        <Section id="data" title="6. Архітектура даних">
          <Field label="6.1 Чим саме ви будете керувати у системі?" value={data.dataObjects} />
          <Field label="6.2 Чи пов’язані ці елементи між собою? Якщо так, то як саме?" value={data.dataRelationships} />
          <Field label="6.3 Чи планується робота з великими обсягами даних?" value={data.bigData} />
          <Field label="6.4 Чи потрібна історія змін або версійність даних?" value={data.dataVersioning} />
        </Section>

        <Section id="functional" title="7. Функціональні вимоги">
          <Field label="7.1 Які функції критично потрібні для запуску?" value={data.criticalFunctions} />
          <Field label="7.2 Чи потрібна робота з файлами (завантаження, зберігання, перегляд)?" value={data.fileHandling} />
          <Field label="7.3 Чи потрібен експорт та імпорт даних?" value={data.exportImport} />
          <Field label="7.4 Наскільки складною має бути робота з даними (сортування, пошук, фільтрація)?" value={data.dataComplexity} />
        </Section>

        <Section id="flow" title="8. Шлях користувача">
          <Field label="8.1 Чи матимуть користувачі у системі різні ролі? Якщо так, то уточніть які саме." value={data.roles} />
          <Field label="8.2 Опишіть 3–5 головних сценаріїв використання продукту." value={data.userScenarios} />
          <Field label="8.3 Який сценарій є найбільш критичним для успіху?" value={data.criticalScenario} />
          <Field label="8.4 Чи потрібен гостьовий доступ або публічні сторінки?" value={data.guestAccess} />
          <Field label="8.5 Як має відбуватися знайомство нового користувача з продуктом?" value={data.onboardingType} />
          <Field label="8.6 Інші способи знайомства" value={data.onboardingOther} />
        </Section>

        <Section id="visual" title="9. Візуальний дизайн">
          <Field label="9.1 Чи є у вас впізнаваний бренд (логотип, кольори шрифти)?" value={data.brandInfo} />
          <Field label="9.2 Чи є референси (приклади інтерфейсів), які вам подобаються?" value={data.designReferences} />
          <Field label="9.3 Яке загальне враження має створювати дизайн?" value={data.designImpression} />
          <Field label="9.4 Чи потрібна адаптація под мобільні пристрої?" value={data.designResponsive} />
          <Field label="9.5 Чи важливо, щоб продукту був зручний для всіх користувач, включно з людьми з обмеженими можливостями?" value={data.designAccessibility} />
          <Field label="9.6 Чи має інтерфейс бути насиченим переходами та анімаціями?" value={data.designAnimations} />
        </Section>

        <Section id="content" title="10. Контент">
          <Field label="10.1 Хто готуватиме тексти для інтерфейсу (лейбли, підказки, повідомлення)?" value={data.contentCopywriter} />
          <Field label="10.2 Чи потрібна багатомовність? Якщо так, які мови?" value={data.contentLanguages} />
          <Field label="10.3 Чи будуть в системі зразки даних або демо-контент для нових користувачів?" value={data.contentSamples} />
        </Section>

        <Section id="integrations" title="11. Інтеграції">
          <Field label="11.1 З якими сервісами потрібна інтеграція?" value={data.externalIntegrationsList} />
          <Field label="11.2 Чи має продукт бути відкритим для сторонніх розробників (мати API або систему плагінів)?" value={data.customScripting} />
          <Field label="11.3 Як система має комунікувати з користувачем?" value={data.notifications} />
        </Section>

        <Section id="security" title="12. Безпека">
          <Field label="12.1 Які дані є найбільш чутливими?" value={data.securitySensitiveData} />
          <Field label="12.2 Чи є особливі вимоги до безпеки або законодавства?" value={data.securityRequirements} />
        </Section>

        <Section id="implementation" title="13. Терміни та умови">
          <Field label="13.1 Чи є у вас готові специфікації (ТЗ, макети, діаграми)?" value={data.specifications} />
          <Field label="13.2 Чи є особливі вимоги до хостингу (де буде розміщено продукт)?" value={data.hostingRequirements} />
          <Field label="13.3 Уточнення щодо хостингу" value={data.hostingNote} />
          <Field label="13.4 Які терміни ви вважаєте реалістичними для MVP?" value={data.mvpTimeline} />
          <Field label="13.5 Який бюджет ви орієнтовно закладаєте?" value={data.budgetRange} />
          <Field label="13.6 Чи буде технічна підтримка користувачів після запуску?" value={data.supportPostLaunch} />
          <Field label="13.7 Як ви бачите процес збору зворотного відгуку?" value={data.feedbackProcess} />
        </Section>
      </div>
    </div>
  );
}
