# Brief Collector (SaaS Platform Briefing Tool)

Сучасний інструмент для збору вимог та брифування замовників на розробку SaaS-платформ. Проєкт створено в рамках лабораторної роботи з курсу "Економіка та менеджмент програмних систем".

## 🚀 Технології

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescript.org/)
- **Database:** [Prisma](https://www.prisma.io/) з адаптером PostgreSQL
- **Validation:** [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Security:** [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (анти-бот) + JWT Auth для адмінки

## ✨ Особливості

- **13 логічних блоків:** Повне покриття бізнес та технічних вимог.
- **Розумна валідація:** Поля адаптуються під вибір користувача (наприклад, Email стає обов'язковим лише якщо обрано відповідний канал зв'язку).
- **Збереження чернетки:** Дані форми зберігаються в `localStorage`, що дозволяє не втратити прогрес при перезавантаженні.
- **Адмін-панель:** Захищений розділ для перегляду та керування поданими брифами.
- **B2B Success Page:** Професійна сторінка після відправки з чіткими наступними кроками.

## 🛠️ Встановлення та запуск

1.  **Клонуйте репозиторій:**
    ```bash
    git clone https://github.com/Whytalik/brief.git
    cd brief
    ```

2.  **Встановіть залежності:**
    ```bash
    npm install
    ```

3.  **Налаштуйте середовище:**
    Створіть файл `.env` на основі `.env.example` та заповніть необхідні ключі (Database URL, Turnstile keys, JWT secret).

4.  **Підготуйте базу даних:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Запустіть у режимі розробки:**
    ```bash
    npm run dev
    ```

## 📂 Структура брифу

Детальний опис усіх запитань та типів полів доступний у файлі [docs/brief-structure.json](./docs/brief-structure.json).

## 🛡️ Адмінка

Для доступу до панелі керування перейдіть за адресою `/admin`. Пароль хешується за допомогою `bcrypt`. Інструкція з генерації хешу є в `.env.example`.

---
Розроблено Віталієм (Whytalik)
