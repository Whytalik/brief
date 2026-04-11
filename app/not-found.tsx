export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-slate-200">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-800">
        Сторінку не знайдено
      </h1>
      <p className="mt-2 text-slate-500">
        На жаль, сторінка, яку ви шукаєте, не існує.
      </p>
      <a
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
      >
        ← Повернутися на головну
      </a>
    </main>
  );
}
