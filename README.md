# SteadyGains Investments Platform

SteadyGains is a full-stack investment management platform engineered for both regular investors and platform administrators. Built with a React + Vite frontend and a Node.js + Prisma backend, the platform enables users to effortlessly manage their portfolios, subscribe to dynamic investment tiers, and view historically tracked ROI invoices.

## 🚀 Features

### For Investors (Users)
- **Portfolio Dashboard**: A beautiful, real-time overview of active holdings, total invested capital, and recent ROI payouts.
- **Multiple Investment Plans**: Users can actively browse and subscribe to multiple investment plans (e.g., "Active Growth", "Starter", etc.) simultaneously.
- **ROI Invoices**: A dedicated digital locker for monthly returns. Users can click to open, view, and print beautifully formatted, A4-styled ROI Invoices.
- **Transaction History**: An immutable ledger of all Deposits, Withdrawals, and Return transactions.

### For Administrators
- **Global Overview**: Platform-wide metrics including Total Capital, active users, and recent deposit streams.
- **User Management**: Deep-dive into individual investor profiles to monitor their active plans and manually adjust balances or approve/reject pending transfers.
- **💰 One-Click ROI Distribution**: Admins can open an investor's profile, click "Pay Monthly Return", and input an ROI percentage. The system automatically:
  1. Calculates the correct numeric return based on the investor's capital.
  2. Generates a permanent Invoice record.
  3. Credits the investor's ledger with the ROI payment.
- **CMS (Content Management System)**: Admins can dynamically edit the landing page copy (Hero text, stats, about us, and footer notes) directly from the dashboard without touching code.

## 🛠 Tech Stack

**Frontend:**
- **React.js (Vite)** – High performance, fast refresh UI.
- **Tailwind CSS** – Custom styled with a dark navy (`charcoal`) and `emerald-brand` aesthetic.
- **Recharts** – For rendering beautiful portfolio growth charts.
- **React Router** – Client-side routing with guarded User/Admin layouts.

**Backend:**
- **Node.js + Express** – Robust REST API.
- **Prisma ORM** – Type-safe database queries.
- **PostgreSQL** – Relational database storing Users, Plans, Portfolios, Transactions, and Invoices.
- **JSON Web Tokens (JWT)** – Secure, stateless authentication enforcing User & Admin access roles.

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shak0x90/steadygainsinvestments.git
   cd steadygainsinvestments
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   
   # Setup your .env file with DATABASE_URL and JWT_SECRET
   npx prisma migrate dev
   npm run seed  # Optional: seed initial plans/admin user
   npm run dev   # Starts backend on http://localhost:5000
   ```

3. **Frontend Setup:**
   ```bash
   # Open a new terminal back in the root directory
   npm install
   npm run dev   # Starts frontend on http://localhost:5173
   ```

## 🔐 Credentials

The application uses role-based access control. You can log in using these preset accounts:

| Role  | Email | Password |
| ------------- | ------------- | ------------- |
| Admin  | `admin@steadygains.com`  | `admin123` |
| Investor  | `demo@steadygains.com`  | `demo123` |

## 🖨 Print-Optimized UI
The platform goes beyond the screen. Investment Invoices feature a dedicated print CSS layout (`@media print`). When printing an invoice from the dashboard, dark motifs and website wrappers are stripped away, yielding a perfectly formatted, ink-saving, professional A4 physical document.