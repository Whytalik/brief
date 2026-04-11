# Brief Collector (SaaS Platform Briefing Tool)

A modern tool for gathering requirements and briefing clients for SaaS platform development. This project was created as part of a laboratory work for the "Economics and Management of Software Systems" course.

## 🚀 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescript.org/)
- **Database:** [Prisma](https://www.prisma.io/) with PostgreSQL adapter
- **Validation:** [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Security:** [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (anti-bot) + JWT Auth for the admin panel

## ✨ Features

- **13 Logical Blocks:** Comprehensive coverage of business and technical requirements.
- **Smart Validation:** Fields adapt based on user selection (e.g., Email becomes mandatory only if chosen as a contact method).
- **Draft Persistence:** Form data is saved to `localStorage`, preventing progress loss on page reload.
- **Protected Admin Panel:** Secure area to view and manage submitted briefs.
- **B2B Success Page:** Professional post-submission page with clear next steps for the client.

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Whytalik/brief.git
    cd brief
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment:**
    Create a `.env` file based on `.env.example` and fill in the required keys (Database URL, Turnstile keys, JWT secret).

4.  **Prepare the database:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run in development mode:**
    ```bash
    npm run dev
    ```

## 📂 Brief Structure

A detailed description of all questions and field types is available in the [docs/brief-structure.json](./docs/brief-structure.json) file.

## 🛡️ Admin Panel

To access the management panel, go to `/admin`. Passwords are hashed using `bcrypt`. Instructions for generating the hash can be found in `.env.example`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---
Developed by Vitalii (Whytalik)
