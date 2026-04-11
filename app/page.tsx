import MainForm from "@/components/form/MainForm";

export const metadata = { title: "Бриф на розробку веб-платформи" };

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Бриф на розробку веб-платформи
            </h1>
            <p className="text-sm leading-7 text-slate-600">
              Бриф-анкета є ключовим документом, з якого розпочинається робота
              над складним веб-додатком, зокрема SaaS-платформою. Саме тому ще
              до початку розробки критично важливо чітко та детально зафіксувати
              бачення майбутнього продукту.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                  Навіщо заповнювати цей бриф?
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                  <li>
                    <strong>
                      Щоб усі учасники процесу мали спільне розуміння.
                    </strong>{" "}
                    Бриф дозволяє замовнику та команді розробників працювати в
                    єдиному контексті.
                  </li>
                  <li>
                    <strong>Щоб сформувати технічну архітектуру.</strong> Надані
                    відповіді допомагають визначити необхідні технічні рішення.
                  </li>
                  <li>
                    <strong>Щоб об’єктивно оцінити обсяг робіт.</strong>{" "}
                    Структурована інформація дає змогу коректно оцінити масштаб
                    проєкту.
                  </li>
                  <li>
                    <strong>Щоб мінімізувати подальші переробки.</strong>{" "}
                    Детальне опрацювання вимог на початковому етапі дозволяє
                    уникнути змін.
                  </li>
                </ul>
              </div>

              <div className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                  Як працювати з анкетою?
                </h2>
                <p className="text-sm leading-6 text-slate-700">
                  Рекомендується надавати розгорнуті відповіді, використовувати
                  конкретні приклади та додавати референси. Уся зібрана
                  інформація буде використана як основа для формування
                  фінального технічного завдання.
                </p>
              </div>
            </div>

            <MainForm />
          </div>
        </section>
      </div>
    </main>
  );
}
