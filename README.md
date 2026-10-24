# Supabase + Next.js Demo App

This is a full-stack web application built with Next.js, React, TypeScript, and Supabase. It demonstrates modern web development practices including authentication, role-based access control, and database integration.

## Getting Started

### 1. Install Node.js
Make sure you have Node.js installed (version 18 or higher is recommended). You can download it from [nodejs.org](https://nodejs.org/).

### 2. Install pnpm
This project uses [pnpm](https://pnpm.io/) as the package manager for faster and more reliable installs. If you don't have pnpm, follow the official installation guide:

👉 [Install pnpm](https://pnpm.io/installation)

### 3. Clone and Open the Project
Clone this repository and open the project folder in your terminal or code editor.

### 4. Install Dependencies
Run the following command in the project root:

```
pnpm install
```

### 5. Start the Development Server
Run:

```
pnpm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables
Copy `.env.example` to `.env.local` and fill in your own values:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `EMAIL_USER`, `EMAIL_PASS` | The Gmail address that sends quotation emails, and a [Gmail App Password](https://support.google.com/accounts/answer/185833) for it (not your normal password) |
| `NEXT_PUBLIC_SITE_URL` *(optional)* | Your deployed URL, used for links in emails (defaults to the request's origin) |

Never commit `.env.local` — it's already in `.gitignore`.

## Trying it out
Sign up through the app to create accounts: one as a **user** (patient) and one as a **pharmacy**.
Shared demo credentials are deliberately not published here.

---

## Features

This application demonstrates several key features and best practices:

- **Authentication & Authorization**: Complete sign-up, sign-in, email verification, and password reset functionality
- **Role-based Access Control (RBAC)**: Secure user and admin role separation
- **Supabase Integration**: Real-time database operations with PostgreSQL
- **Row Level Security (RLS)**: Database-level security policies ensuring data privacy
- **Modern UI Components**: Built with shadcn/ui and Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first approach with excellent UX

The app features robust security with Supabase Row Level Security (RLS) policies to ensure data privacy and secure separation between different user roles. Users only see and interact with data relevant to their permissions, with all access enforced at the database level.

This demonstrates the power of modern full-stack development tools and best practices for building secure, scalable web applications.

Feel free to explore the application and its features. If you have any questions or issues, please open an issue or contact the maintainer.