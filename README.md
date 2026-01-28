# Fixa - Hyperlocal Job Marketplace

A complete hyperlocal job marketplace connecting people who need tasks done with skilled workers nearby. Built with Bun, Next.js, React Native, and PostgreSQL.

## 🏗️ Project Structure

```
FIXA/
├── packages/
│   ├── api/          # Backend API (Express + Bun)
│   ├── web/          # Web Frontend (Next.js)
│   └── mobile/       # Mobile App (React Native/Expo)
└── fixa-blueprint.md # Complete project blueprint
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) installed
- PostgreSQL database (local or Neon)
- Node.js 18+ (for Expo)

### 1. Install Dependencies

```bash
# Install root dependencies
bun install

# Install API dependencies
cd packages/api && bun install

# Install web dependencies
cd ../web && bun install

# Install mobile dependencies
cd ../mobile && bun install
```

### 2. Set Up Database

1. Create a PostgreSQL database (or use Neon)
2. Copy `.env.example` to `.env` in `packages/api/`
3. Update `DATABASE_URL` in `.env`

```bash
cd packages/api
cp .env.example .env
# Edit .env with your database URL
```

### 3. Run Database Migrations

```bash
cd packages/api
bun run db:push
```

### 4. Seed Demo Accounts

```bash
cd packages/api
bun run db:seed
```

This will create 3 demo accounts:
- **Admin**: Phone `+27123456789`, Password `demo123`
- **Client**: Phone `+27123456790`, Password `demo123`
- **Worker**: Phone `+27123456791`, Password `demo123`

### 5. Start Development Servers

**Terminal 1 - API Server:**
```bash
cd packages/api
bun run dev
```

**Terminal 2 - Web Frontend:**
```bash
cd packages/web
bun run dev
```

**Terminal 3 - Mobile App:**
```bash
cd packages/mobile
bun run start
```

## 📱 Features

### Core Modules

- ✅ **Authentication & User Management** - Phone verification, role-based access
- ✅ **Job Posting System** - Create, manage, and track jobs
- ✅ **Job Discovery** - Browse nearby jobs with map/list views
- ✅ **Credit System & Bidding** - Workers bid using credits
- ✅ **Matching & Hiring** - Accept bids, manage job lifecycle
- ✅ **Communication** - In-app messaging between clients and workers
- ✅ **Ratings & Trust** - Rate completed jobs, build trust scores
- ✅ **Wallet & Earnings** - Track earnings, request payouts
- ✅ **Admin Dashboard** - User management, dispute resolution

### Tech Stack

**Backend:**
- Bun runtime
- Express.js
- Drizzle ORM
- PostgreSQL (Neon)
- JWT authentication

**Web:**
- Next.js 14
- React 18
- Tailwind CSS
- Zustand (state management)
- React Query

**Mobile:**
- React Native
- Expo
- React Navigation
- AsyncStorage

## 🔧 Configuration

### Environment Variables

**API (`packages/api/.env`):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/fixa
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development
```

**Web (`packages/web/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Mobile (`packages/mobile/.env`):**
```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-phone` - Verify phone with OTP
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs/nearby` - Get nearby jobs
- `GET /api/jobs/my-posts` - Get my jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job
- `POST /api/jobs/:id/cancel` - Cancel job
- `POST /api/jobs/:id/complete` - Complete job

### Bids
- `POST /api/bids/jobs/:jobId/bids` - Create bid
- `GET /api/bids/jobs/:jobId/bids` - Get job bids
- `POST /api/bids/:id/accept` - Accept bid
- `POST /api/bids/:id/withdraw` - Withdraw bid

### Credits
- `GET /api/credits/balance` - Get credit balance
- `GET /api/credits/transactions` - Get transactions
- `POST /api/credits/purchase` - Purchase credits
- `GET /api/credits/calculate-bid-cost/:jobId` - Calculate bid cost

### Wallet
- `GET /api/wallet` - Get wallet
- `GET /api/wallet/transactions` - Get transactions
- `POST /api/wallet/payout` - Request payout

### Ratings
- `POST /api/ratings/jobs/:jobId/rate` - Rate job
- `GET /api/ratings/received` - Get received ratings

### Messages
- `GET /api/messages/jobs/:jobId/messages` - Get messages
- `POST /api/messages/jobs/:jobId/messages` - Send message

## 🗄️ Database Schema

All tables are defined using Drizzle ORM:
- `users` - User accounts
- `worker_profiles` - Worker-specific data
- `categories` - Job categories
- `jobs` - Job postings
- `bids` - Worker bids
- `credits` - Credit balances
- `credit_transactions` - Credit history
- `wallets` - Worker wallets
- `wallet_transactions` - Wallet history
- `payouts` - Payout requests
- `ratings` - Job ratings
- `messages` - Chat messages
- `disputes` - Dispute records
- `notifications` - User notifications

## 🧪 Testing

```bash
# Run API tests (when implemented)
cd packages/api
bun test

# Run web tests
cd packages/web
bun test
```

## 📦 Deployment

### Backend
Deploy to any Node.js/Bun-compatible platform (Railway, Render, etc.)

### Web
Deploy to Vercel, Netlify, or any static hosting

### Mobile
Build with Expo:
```bash
cd packages/mobile
expo build:android
expo build:ios
```

## 📄 License

MIT

## 🤝 Contributing

This is a complete implementation of the Fixa blueprint. All modules are functional and ready for customization.

---

**Built with ❤️ using Bun, Next.js, and React Native**

