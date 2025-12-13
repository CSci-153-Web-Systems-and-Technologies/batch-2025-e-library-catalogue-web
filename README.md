# BookIt 📚

**From Browse to Borrow, in a Click.**

BookIt is a modern library management system that bridges the gap between students and library resources. It features a dual-interface system for Students (Members) and Administrators, powered by real-time data and secure authentication.

---

## 📑 Table of Contents

* [🚀 Features](#-features)
    * [Student Features](#student-features)
    * [Admin Features](#admin-features)
* [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
* [💾 Database Schema](#-database-schema)
* [🏁 Getting Started](#-getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [🔑 Environment Variables](#-environment-variables)
* [🚀 Deployment](#-deployment)
    * [Deployment Checklist](#deployment-checklist)
    * [Deployment Table](#deployment-table)
* [🗓️ Releases](#%EF%B8%8F-releases)
    * [v1.0.0 Release Notes](#v100-release-notes)
* [💛 Contributing](#-contributing)

---

## 🚀 Features

### Student Features
* **Dashboard Overview:** Visual statistics for books borrowed, active reservations, and reading history.
* **Smart Catalog:** Searchable library with genre filters and sorting (Newest, Title, Author).
* **Reservation System:**
    * **Reserve:** Pick specific dates for available books.
    * **Hold (Waitlist):** Join the queue for currently borrowed books.
* **Profile Management:** Update avatars, personal details, and security settings.
* **Real-time Notifications:** Instant alerts for reservation approvals and due dates.

### Admin Features
* **Live Dashboard:** Real-time monitoring of total users, active loans, and pending requests.
* **Book Management:** CRUD operations for the library inventory (Add, Edit, Delete books).
* **Circulation Control:** One-click processes to approve reservations or mark books as returned.
* **Reporting:** Generate CSV reports for Inventory, Usage, Users, and Overdue items.

---

## 🛠️ Tech Stack

**Frontend:**
* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Custom themes, Dark/Light mode support)
* **Components:** Shadcn UI / Radix UI primitives

**Backend & Services:**
* **BaaS:** Supabase (PostgreSQL, Auth, Realtime, Storage)
* **Auth:** Supabase Auth (Email/Password + Server-side Session Management)
* **Realtime:** Postgres Changes (Live notifications & dashboard updates)

---

## 💾 Database Schema

The application relies on the following Supabase tables:

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| **profiles** | Extended user metadata linked to Auth | `id`, `email`, `full_name`, `role` (admin/member), `avatar_url` |
| **book** | The core library inventory catalog | `id`, `Title`, `Author`, `Genre (Subject)`, `ISBN-13`, `status`, `Location` |
| **reservations** | Manages pending requests and waitlists | `id`, `user_id`, `book_id`, `reservation_date`, `status` (pending/fulfilled) |
| **borrowings** | Tracks active loans and return history | `id`, `user_id`, `book_id`, `borrow_date`, `due_date`, `return_date` |
| **notifications** | System alerts for users | `id`, `user_id`, `title`, `message`, `is_read` |

---

## 🏁 Getting Started

### Prerequisites
* Node.js 18+
* A Supabase Project

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-e-library-catalogue-web.git
    cd bookit
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Database Setup:** Run the SQL definitions in your Supabase SQL Editor to create the tables listed above.

4. **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory. You must configure these keys for the app to function correctly.

| Variable Name | Description | Required? |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | **Yes** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Public API Key | **Yes** |
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g., https://bookit.vercel.app) | **Yes** |

> ⚠️ **Security Note:** Never commit `.env.local` to version control.

---

## 🚀 Deployment

The project is optimized for deployment on Vercel.

### Deployment Checklist
1. Push code to GitHub/GitLab.
2. Import project into Vercel.
3. Configure Environment Variables in the Vercel dashboard (copy all values from `.env.local`).
4. Build Command: `npm run build`
5. Output Directory: `.next` (Default)

### Deployment Table

| Environment | Status | Branch | URL |
| :--- | :--- | :--- | :--- |
| **Production** | 🟢 Live | `main` | https://batch-2025-e-library-catalogue-web-delta.vercel.app/ |
| **Staging** | 🟡 Testing | `develop` | internal |

---

## 🗓️ Releases

| Release Version | Date Released | Type |
| :--- | :--- | :--- |
| **v1.0.0** | 2025-12-13 | Initial Deployment (MVP) |

### v1.0.0 Release Notes
**What's New**
* **Initial Launch:** First stable deployment for functionality and user testing.
* **Core Features:**
    * **Role-Based Access:** Distinct dashboards for Members and Admins.
    * **Smart Filters:** Search and filter books by genre or sort by author/title.
    * **Real-time Sync:** Live updates for inventory status and notifications.
    * **Admin Tools:** Full CRUD capabilities for book management and reservation processing.

---

## 💛 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.