# Fixa - Complete Project Blueprint

## Executive Summary
**Fixa** is a hyperlocal job marketplace connecting people who need tasks done with skilled workers nearby. Workers bid using credits (platform's primary revenue driver), creating a competitive marketplace that ensures quality and fair pricing.

---

## 1. SYSTEM ARCHITECTURE

### 1.1 User Roles & Permissions

#### **Job Poster (Client)**
- Create unlimited job postings
- Review worker bids
- Chat with workers
- Rate completed jobs
- Manage active/past jobs
- Optional: Upgrade to Business account

#### **Worker (Service Provider)**
- Browse nearby jobs
- Bid using credits
- Manage service profile
- Track earnings
- Request payouts
- Optional: Upgrade to Pro account

#### **Admin**
- User management
- Dispute resolution
- Content moderation
- Analytics & reporting
- Credit & payment oversight
- Category management

---

## 2. CORE MODULES (Detailed Breakdown)

### 📱 MODULE 1: Authentication & User Management

#### 2.1.1 Registration Flow
```
Step 1: Choose role (Client / Worker / Both)
Step 2: Phone verification (OTP)
Step 3: Basic info (Name, Email)
Step 4: Location permission request
Step 5: Profile setup (role-specific)
```

#### 2.1.2 Client Profile
- **Basic Info**
  - Full name
  - Phone (verified)
  - Email
  - Profile photo
  - Default location
  - Notification preferences

- **Account Features**
  - Jobs posted (count)
  - Average rating given
  - Account type (Free/Business)
  - Member since date
  - Verified badge status

#### 2.1.3 Worker Profile
- **Professional Info**
  - Display name
  - Profile photo
  - Skills/Categories (multi-select)
  - Experience level (Beginner/Intermediate/Expert)
  - Hourly rate range
  - Bio (max 500 chars)
  - Portfolio photos (up to 10)
  - Service area radius (5km/10km/20km/50km)

- **Stats & Verification**
  - Jobs completed
  - Average rating
  - Response time
  - Acceptance rate
  - Badges earned
  - ID verification status
  - Selfie verification status

#### 2.1.4 Location Services
- Auto-detect GPS on signup
- Allow manual address input
- Store coordinates (lat/long)
- Privacy: Show approximate location (suburb level) until job accepted
- Workers can set service radius

---

### 💼 MODULE 2: Job Posting System

#### 2.2.1 Create Job Flow
```
Step 1: Select category
Step 2: Job title & description
Step 3: Set budget type (Fixed / Hourly / Negotiable)
Step 4: Add photos (optional, up to 5)
Step 5: Set urgency
Step 6: Confirm location
Step 7: Set visibility radius
Step 8: Review & post
```

#### 2.2.2 Job Fields (Database Schema)
```javascript
Job {
  id: UUID
  client_id: UUID (FK)
  category_id: UUID (FK)
  title: String (max 100 chars)
  description: Text (max 1000 chars)
  
  // Budget
  budget_type: Enum (FIXED, HOURLY, NEGOTIABLE)
  budget_amount: Decimal
  budget_min: Decimal (if negotiable)
  budget_max: Decimal (if negotiable)
  
  // Location
  location_lat: Float
  location_lng: Float
  location_address: String
  visibility_radius: Int (km)
  
  // Timing
  urgency: Enum (TODAY, THIS_WEEK, THIS_MONTH, FLEXIBLE)
  preferred_date: Date (optional)
  preferred_time: Time (optional)
  
  // Media
  photos: Array<String> (URLs)
  
  // Status
  status: Enum (OPEN, IN_PROGRESS, COMPLETED, CANCELLED, DISPUTED)
  created_at: Timestamp
  updated_at: Timestamp
  expires_at: Timestamp (48 hours default)
  
  // Metrics
  views_count: Int
  bids_count: Int
  hired_worker_id: UUID (FK, nullable)
}
```

#### 2.2.3 Job Categories (Hierarchical)
```
🏠 Home Services
  ├─ Cleaning
  ├─ Gardening
  ├─ Plumbing
  ├─ Electrical
  ├─ Painting
  └─ Carpentry

🚗 Transport & Delivery
  ├─ Moving Services
  ├─ Courier
  └─ Driver

🔧 Repairs & Maintenance
  ├─ Appliance Repair
  ├─ Phone/Computer Repair
  └─ General Handyman

💻 Digital Services
  ├─ Graphic Design
  ├─ Social Media
  └─ Content Writing

🎓 Lessons & Training
  ├─ Tutoring
  ├─ Music Lessons
  └─ Fitness Training

🎉 Events
  ├─ Photography
  ├─ Catering
  └─ DJ/Entertainment

🐕 Pet Services
  ├─ Dog Walking
  ├─ Pet Sitting
  └─ Grooming

💅 Beauty & Wellness
  ├─ Hair Styling
  ├─ Makeup
  └─ Massage

📋 Other
```

#### 2.2.4 Job Visibility Logic
- **Radius-based notification**
  - Only workers within set radius get notified
  - Workers can see jobs beyond radius but with distance indicator
  
- **Smart matching**
  - Prioritize workers with matching skills
  - Consider worker ratings
  - Factor in response time history

---

### 🔍 MODULE 3: Job Discovery (Workers)

#### 2.3.1 Discovery Interfaces

**A. Map View**
- Cluster nearby jobs
- Color-coded by category
- Show distance from worker
- Quick preview on tap

**B. List View**
- Sort by:
  - Distance (nearest first)
  - Budget (highest first)
  - Urgency (most urgent first)
  - Posted time (newest first)
  - Bid cost (lowest credits first)

- Filter by:
  - Category
  - Budget range
  - Distance (0-5km, 5-10km, 10-20km, 20+km)
  - Urgency
  - Bid cost

#### 2.3.2 Job Card Display
```
┌─────────────────────────────────┐
│ 🏠 Garden Cleanup               │
│ Posted 2h ago • 3.5km away      │
├─────────────────────────────────┤
│ R500 (Fixed) | Today            │
│                                 │
│ "Need someone to clear fallen   │
│  leaves and trim hedges..."     │
│                                 │
│ 📍 Hatfield, Pretoria           │
│ 👁️ 12 views • 3 bids            │
│                                 │
│ [Apply for 2 credits] ──────────│
└─────────────────────────────────┘
```

#### 2.3.3 Search & Recommendations
- Search by keywords
- "Jobs for you" (AI-matched based on skills & history)
- "Trending in your area"
- "Last chance" (expiring soon)

---

### 💰 MODULE 4: Credit System (Bidding Engine)

#### 2.4.1 Credit Economy Design

**Credit Cost Structure**
```javascript
const creditCosts = {
  budget: {
    0-500: 1 credit,
    501-1000: 2 credits,
    1001-2500: 3 credits,
    2501-5000: 4 credits,
    5000+: 5 credits
  },
  
  urgency_multiplier: {
    TODAY: 1.5x,
    THIS_WEEK: 1x,
    THIS_MONTH: 0.75x,
    FLEXIBLE: 0.5x
  },
  
  competition: {
    0-3_bids: base_cost,
    4-7_bids: base_cost + 1,
    8+_bids: base_cost + 2
  }
}
```

**Pro Worker Benefits**
- 20% discount on all bid costs
- 1 free daily "super bid" (highlighted to client)
- Unlimited bid revisions
- Early access to jobs (15min before free workers)

#### 2.4.2 Bid Submission Flow
```
1. Worker clicks "Apply"
2. System calculates credit cost
3. Shows preview:
   ┌──────────────────────────────┐
   │ Apply to this job            │
   ├──────────────────────────────┤
   │ Your proposal:               │
   │ ┌──────────────────────────┐ │
   │ │ I can complete this in   │ │
   │ │ 3 hours for R450...      │ │
   │ └──────────────────────────┘ │
   │                              │
   │ Cost: 2 credits              │
   │ Balance: 18 credits          │
   │                              │
   │ [Cancel] [Confirm & Apply]   │
   └──────────────────────────────┘
4. Credit deducted immediately
5. Bid goes live
6. Client notified
```

#### 2.4.3 Bid Data Structure
```javascript
Bid {
  id: UUID
  job_id: UUID (FK)
  worker_id: UUID (FK)
  
  // Proposal
  message: Text (max 500 chars)
  proposed_amount: Decimal
  estimated_duration: String ("2 hours", "1 day", etc)
  availability: String ("Available today at 2pm")
  
  // Metadata
  credits_spent: Int
  status: Enum (PENDING, ACCEPTED, REJECTED, WITHDRAWN)
  created_at: Timestamp
  
  // Worker snapshot (at time of bid)
  worker_rating: Float
  worker_jobs_completed: Int
}
```

#### 2.4.4 Credit Refund Policy
**Non-refundable scenarios:**
- Bid rejected by client
- Worker withdraws bid
- Job cancelled by client (after bids received)
- Job expires

**Refundable scenarios (auto):**
- Job cancelled before any bids
- Duplicate bid (system error)
- Worker account suspended unfairly (admin review)

---

### 💳 MODULE 5: Monetization & Payments (RevenueCat)

#### 2.5.1 Credit Packs (One-time purchases)
```javascript
creditPacks = [
  {
    id: "starter_pack",
    name: "Starter Pack",
    credits: 20,
    price: 49.00, // ZAR
    bonus: 0,
    popular: false
  },
  {
    id: "popular_pack",
    name: "Popular Pack",
    credits: 50,
    price: 99.00,
    bonus: 5, // +5 bonus credits
    popular: true,
    savings: "Save 17%"
  },
  {
    id: "pro_pack",
    name: "Pro Pack",
    credits: 120,
    price: 199.00,
    bonus: 20, // +20 bonus credits
    popular: false,
    savings: "Save 30%"
  },
  {
    id: "mega_pack",
    name: "Mega Pack",
    credits: 300,
    price: 399.00,
    bonus: 75, // +75 bonus credits
    popular: false,
    savings: "Save 47%",
    badge: "BEST VALUE"
  }
]
```

#### 2.5.2 Subscription Tiers

**For Workers:**
```javascript
workerSubscriptions = [
  {
    tier: "Free",
    price: 0,
    features: [
      "Browse all jobs",
      "Standard bid visibility",
      "Standard support",
      "Normal credit pricing"
    ]
  },
  {
    tier: "Pro Worker",
    price: 149.00, // per month
    features: [
      "20% off all bid credits",
      "1 free Super Bid daily",
      "Early job access (15min)",
      "Priority support",
      "Highlighted profile",
      "Custom badge",
      "Advanced analytics",
      "Unlimited bid revisions"
    ],
    popular: true
  },
  {
    tier: "Elite Worker",
    price: 299.00, // per month
    features: [
      "All Pro features",
      "30% off all bid credits",
      "3 free Super Bids daily",
      "Exclusive job access",
      "Dedicated account manager",
      "Premium badge",
      "Featured in search results",
      "No platform fees (first R5000/month)"
    ]
  }
]
```

**For Clients:**
```javascript
clientSubscriptions = [
  {
    tier: "Basic",
    price: 0,
    features: [
      "Post unlimited jobs",
      "Standard visibility",
      "Basic support"
    ]
  },
  {
    tier: "Business",
    price: 199.00, // per month
    features: [
      "All Basic features",
      "Priority job placement",
      "Bulk job posting",
      "Saved worker favorites",
      "Advanced filtering",
      "Recurring job templates",
      "Priority customer support",
      "Monthly usage reports"
    ],
    popular: true
  }
]
```

#### 2.5.3 Platform Fees (Service Charge)
```javascript
platformFees = {
  standard: {
    rate: 0.15, // 15% on job value
    appliesTo: "All completed jobs",
    paidBy: "Worker",
    
    calculation: "Job Amount × 15%",
    example: {
      jobValue: 1000,
      platformFee: 150,
      workerReceives: 850
    }
  },
  
  elite: {
    rate: 0.10, // 10% for Elite subscribers
    waiver: {
      monthlyEarnings: 5000,
      description: "First R5,000 earnings each month are fee-free"
    }
  }
}
```

#### 2.5.4 Payment Processing Flow
```
Job Completion Flow:
1. Client marks job as complete
2. Worker confirms completion
3. Platform processes payment:
   ┌──────────────────────────┐
   │ Job Value: R1,000        │
   │ Platform Fee: -R150 (15%)│
   │ Worker Earnings: R850    │
   └──────────────────────────┘
4. Amount held in worker wallet
5. Worker requests payout
6. Processed within 2-3 business days
```

---

### 🤝 MODULE 6: Matching & Hiring Process

#### 2.6.1 Client Review Dashboard
```
Job: "Garden Cleanup" - R500
Status: 5 bids received

┌─────────────────────────────────────┐
│ Sort by: [Best Match ▼]             │
├─────────────────────────────────────┤
│ ⭐ 4.8 | John M. | 2.1km away       │
│ 47 jobs • Elite Worker              │
│ "I specialize in garden main..."    │
│ R450 • Available today 2pm          │
│ [View Profile] [Accept Bid] ────────│
├─────────────────────────────────────┤
│ ⭐ 4.6 | Sarah K. | 5.3km away      │
│ 23 jobs • Pro Worker                │
│ "I have my own tools and ca..."     │
│ R480 • Available tomorrow           │
│ [View Profile] [Accept Bid] ────────│
└─────────────────────────────────────┘
```

#### 2.6.2 Hiring States
```javascript
jobStates = {
  OPEN: {
    description: "Accepting bids",
    clientActions: ["Review bids", "Edit job", "Cancel"],
    workerActions: ["Place bid"],
    duration: "48 hours or until hired"
  },
  
  IN_PROGRESS: {
    description: "Worker hired",
    clientActions: ["Chat", "Mark complete", "Report issue"],
    workerActions: ["Chat", "Confirm completion", "Report issue"],
    triggers: "Client accepts a bid"
  },
  
  PENDING_COMPLETION: {
    description: "Awaiting confirmation",
    clientActions: ["Confirm & rate", "Dispute"],
    workerActions: ["Wait for confirmation"],
    triggers: "Worker marks as complete"
  },
  
  COMPLETED: {
    description: "Job finished",
    clientActions: ["View receipt", "Rebook worker"],
    workerActions: ["View payment", "Request payout"],
    triggers: "Both parties confirm OR auto after 24hrs"
  },
  
  DISPUTED: {
    description: "Under review",
    clientActions: ["Provide evidence", "Chat with admin"],
    workerActions: ["Provide evidence", "Chat with admin"],
    triggers: "Either party reports issue"
  },
  
  CANCELLED: {
    description: "Job cancelled",
    refunds: {
      noBids: "N/A",
      withBids: "Credits non-refundable"
    }
  }
}
```

---

### 💬 MODULE 7: Communication System

#### 2.7.1 In-App Chat
```javascript
chatFeatures = {
  messaging: {
    text: true,
    photos: true,
    voiceNotes: true,
    location: true,
    quickReplies: [
      "On my way",
      "Running 10 min late",
      "Can we reschedule?",
      "Job complete"
    ]
  },
  
  visibility: {
    beforeHire: "Limited to bid discussion only",
    afterHire: "Full chat unlocked",
    afterCompletion: "Read-only after 30 days"
  },
  
  safety: {
    profanityFilter: true,
    reportAbuse: true,
    blockUser: true,
    autoFlagKeywords: ["bank details", "outside app", "cash only"]
  }
}
```

#### 2.7.2 Notification Strategy
```javascript
notifications = {
  push: {
    jobPosted: {
      to: "Workers in radius",
      message: "New garden job nearby - R500",
      priority: "high"
    },
    
    bidReceived: {
      to: "Client",
      message: "John M. bid R450 on your job",
      priority: "normal"
    },
    
    bidAccepted: {
      to: "Worker",
      message: "Your bid was accepted! 🎉",
      priority: "urgent"
    },
    
    jobStarting: {
      to: "Both",
      message: "Job starts in 1 hour",
      priority: "normal"
    },
    
    lowCredits: {
      to: "Worker",
      message: "Only 3 credits left - top up now",
      priority: "low"
    }
  },
  
  email: {
    weeklyDigest: "Jobs you missed",
    monthlyReport: "Your earnings summary",
    payoutProcessed: "R850 sent to your account"
  },
  
  sms: {
    bidAccepted: "Urgent updates only",
    payoutReady: "Payment confirmations"
  }
}
```

---

### ⭐ MODULE 8: Ratings & Trust System

#### 2.8.1 Rating Structure
```javascript
rating = {
  scale: "1-5 stars (0.5 increments)",
  
  categories: {
    worker: [
      "Quality of work",
      "Professionalism",
      "Communication",
      "Punctuality",
      "Value for money"
    ],
    
    client: [
      "Clear requirements",
      "Payment promptness",
      "Communication",
      "Respectful behavior"
    ]
  },
  
  timing: {
    prompt: "Immediately after completion",
    reminder: "24 hours if not rated",
    autoRating: "4 stars if no rating after 48 hours"
  },
  
  editWindow: "7 days",
  
  display: {
    overall: "Average of all ratings",
    breakdown: "Show category scores on profile",
    recentWeight: "Last 20 jobs weighted 2x"
  }
}
```

#### 2.8.2 Badge System
```javascript
badges = {
  verification: {
    phoneVerified: {
      icon: "✓",
      requirement: "Phone OTP completed"
    },
    idVerified: {
      icon: "🆔",
      requirement: "ID document approved"
    },
    selfieVerified: {
      icon: "📸",
      requirement: "Selfie match confirmed"
    }
  },
  
  performance: {
    topRated: {
      icon: "⭐",
      requirement: "4.8+ rating, 20+ jobs"
    },
    fastResponder: {
      icon: "⚡",
      requirement: "<15min average response"
    },
    reliable: {
      icon: "💯",
      requirement: "95%+ completion rate"
    },
    risingTalent: {
      icon: "🚀",
      requirement: "5+ five-star reviews in 30 days"
    }
  },
  
  milestone: {
    rookie: "5 jobs completed",
    professional: "50 jobs completed",
    expert: "200 jobs completed",
    master: "500 jobs completed"
  },
  
  subscription: {
    proWorker: "💎 Pro",
    eliteWorker: "👑 Elite",
    businessClient: "🏢 Business"
  }
}
```

#### 2.8.3 Trust Score Algorithm
```javascript
trustScore = {
  calculation: `
    Base: 50 points
    + (Average Rating × 10)
    + (Jobs Completed × 0.5)
    + Verification bonuses:
      - Phone: +5
      - ID: +10
      - Selfie: +10
    + Badge bonuses:
      - Each badge: +5
    - Cancellation penalty: -10 per cancel
    - Dispute penalty: -20 per dispute
    
    Max: 100 points
  `,
  
  display: {
    0-30: "New",
    31-60: "Building Trust",
    61-80: "Trusted",
    81-90: "Highly Trusted",
    91-100: "Elite Trusted"
  },
  
  impact: {
    searchRanking: "Higher scores rank better",
    bidVisibility: "Trusted workers highlighted",
    clientConfidence: "Shown prominently on bids"
  }
}
```

---

### 💵 MODULE 9: Wallet & Earnings Management

#### 2.9.1 Worker Wallet Structure
```javascript
wallet = {
  balances: {
    available: "Amount ready for payout",
    pending: "Jobs completed, awaiting confirmation",
    onHold: "Disputed amounts",
    lifetime: "Total earned on platform"
  },
  
  transactions: [
    {
      type: "EARNING",
      jobId: "abc123",
      amount: 850,
      fee: -150,
      net: 850,
      status: "AVAILABLE",
      date: "2025-01-15"
    },
    {
      type: "PAYOUT",
      method: "Bank Transfer",
      amount: -2500,
      status: "PROCESSING",
      date: "2025-01-20"
    }
  ]
}
```

#### 2.9.2 Payout Methods
```javascript
payoutOptions = {
  bankTransfer: {
    name: "Bank Transfer",
    minAmount: 100,
    processingTime: "2-3 business days",
    fee: 0,
    requirements: [
      "Bank account name",
      "Account number",
      "Bank name",
      "Branch code"
    ]
  },
  
  mobileMoney: {
    name: "Mobile Money (MTN/Vodacom)",
    minAmount: 50,
    processingTime: "Instant to 1 hour",
    fee: "R5 flat fee",
    requirements: [
      "Mobile number",
      "ID number"
    ]
  },
  
  instantEFT: {
    name: "Instant EFT (Premium)",
    minAmount: 500,
    processingTime: "Within 1 hour",
    fee: "R15 flat fee",
    requirements: [
      "Bank account details",
      "Elite subscription"
    ],
    availability: "Elite workers only"
  }
}
```

#### 2.9.3 Payout Flow
```
1. Worker initiates payout
   ┌──────────────────────────┐
   │ Available: R2,500        │
   │                          │
   │ Enter amount: R2,500     │
   │ Method: [Bank Transfer▼] │
   │                          │
   │ You'll receive: R2,500   │
   │ Processing: 2-3 days     │
   │                          │
   │ [Request Payout] ────────│
   └──────────────────────────┘

2. System validates
   - Sufficient balance
   - Account verified
   - No active disputes

3. Status updates:
   PENDING → PROCESSING → COMPLETED

4. Email confirmation sent

5. Worker can track in wallet history
```

#### 2.9.4 Client Payment Flow
```
When job is completed:

1. Auto-charge via RevenueCat
   - Stored payment method
   - Invoice generated

2. Payment split:
   ┌──────────────────────────┐
   │ Job Total: R1,000        │
   │                          │
   │ To Worker: R850          │
   │ Platform Fee: R150       │
   │                          │
   │ Paid via: •••• 4242      │
   └──────────────────────────┘

3. Receipt emailed

4. Payment reflected in both wallets
```

---

### 🛡️ MODULE 10: Admin Dashboard & Controls

#### 2.10.1 Admin Panel Sections

**A. User Management**
```javascript
userManagement = {
  overview: {
    totalUsers: "Count",
    activeToday: "Count",
    newThisWeek: "Count",
    suspendedAccounts: "Count"
  },
  
  actions: [
    "View user profile",
    "Verify documents manually",
    "Suspend account",
    "Ban permanently",
    "Refund credits",
    "Adjust trust score",
    "Send direct message",
    "View full history"
  ],
  
  filters: [
    "Role (Client/Worker/Both)",
    "Subscription tier",
    "Trust score range",
    "Registration date",
    "Last active",
    "Flagged accounts"
  ]
}
```

**B. Job & Bid Monitoring**
```javascript
jobMonitoring = {
  metrics: {
    activeJobs: "Count",
    avgBidsPerJob: "Number",
    avgJobValue: "Currency",
    completionRate: "Percentage",
    avgTimeToHire: "Hours"
  },
  
  flags: [
    "Jobs with no bids (24+ hours)",
    "Excessive bid prices",
    "Suspicious job descriptions",
    "High cancellation rate users",
    "Duplicate job postings"
  ],
  
  actions: [
    "Feature job",
    "Hide/remove job",
    "Contact poster",
    "Refund credits",
    "Ban category abuse"
  ]
}
```

**C. Dispute Resolution Center**
```javascript
disputeSystem = {
  queue: {
    priority: "Urgent/High/Medium/Low",
    autoAssign: "Round-robin to admins",
    sla: "24-hour response time"
  },
  
  disputeTypes: [
    "Work quality issue",
    "Payment dispute",
    "No-show worker",
    "Scope creep",
    "Safety concern",
    "Harassment/abuse",
    "Other"
  ],
  
  evidence: {
    chatLogs: "Full conversation history",
    photos: "Before/after images",
    timestamps: "Job timeline",
    ratings: "Historical ratings"
  },
  
  resolutions: [
    "Full refund to client",
    "Partial refund",
    "Release payment to worker",
    "Split payment",
    "No action",
    "Ban user",
    "Issue warning"
  ],
  
  appeals: "Users can appeal within 7 days"
}
```

**D. Financial Dashboard**
```javascript
financialDashboard = {
  revenue: {
    creditSales: "Total from credit purchases",
    subscriptions: "Recurring revenue",
    platformFees: "Service charges collected",
    total: "Sum of all revenue"
  },
  
  breakdown: {
    daily: "Today's earnings",
    weekly: "Last 7 days",
    monthly: "Current month",
    yearly: "Year to date"
  },
  
  topMetrics: [
    "Average transaction value",
    "Most popular credit pack",
    "Subscription conversion rate",
    "Churn rate",
    "Refund rate"
  ],
  
  exports: [
    "Revenue report (CSV)",
    "Tax summary",
    "Payout ledger",
    "Transaction log"
  ]
}
```

**E. Content Moderation**
```javascript
moderation = {
  autoFlags: {
    profanity: "Bad words in job descriptions",
    spam: "Duplicate/template content",
    contactInfo: "Phone/email in messages",
    externalLinks: "URLs to other platforms",
    suspiciousImages: "Inappropriate photos"
  },
  
  reviewQueue: {
    flaggedJobs: "Pending review",
    reportedUsers: "Community reports",
    autoModerated: "AI-flagged content"
  },
  
  actions: [
    "Approve",
    "Edit & approve",
    "Remove content",
    "Warn user",
    "Suspend account",
    "Whitelist (false positive)"
  ]
}
```

**F. Analytics & Insights**
```javascript
analytics = {
  userBehavior: {
    peakUsageTimes: "Hourly graph",
    popularCategories: "By region",
    avgSessionDuration: "Time spent",
    conversionFunnels: "Job post → completion rate"
  },
  
  geographic: {
    heatMap: "Jobs by location",
    topCities: "Most active areas",
    serviceGaps: "Underserved regions"
  },
  
  workerMetrics: {
    avgEarnings: "Per worker/month",
    topEarners: "Leaderboard",
    subscriptionROI: "Pro vs Free earnings"
  },
  
  clientMetrics: {
    repeatUsage: "How often clients post",
    avgSpend: "Per client",
    satisfaction: "Rating trends"
  }
}
```

---

## 3. DATABASE SCHEMA (Drizzle ORM)

### 3.1 Core Tables

```typescript
// users.ts
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: varchar('phone', { length: 20 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  
  role: varchar('role', { length: 20 }).notNull(), // 'client', 'worker', 'both', 'admin'
  
  // Profile
  fullName: varchar('full_name', { length: 100 }),
  profilePhoto: varchar('profile_photo', { length: 500 }),
  bio: text('bio'),
  
  // Location
  locationLat: real('location_lat'),
  locationLng: real('location_lng'),
  locationAddress: text('location_address'),
  serviceRadius: integer('service_radius'), // km, for workers
  
  // Verification
  phoneVerified: boolean('phone_verified').default(false),
  emailVerified: boolean('email_verified').default(false),
  idVerified: boolean('id_verified').default(false),
  selfieVerified: boolean('selfie_verified').default(false),
  
  // Subscription
  subscriptionTier: varchar('subscription_tier', { length: 20 }).default('free'),
  subscriptionExpiresAt: timestamp('subscription_expires_at'),
  
  // Status
  status: varchar('status', { length: 20 }).default('active'), // active, suspended, banned
  trustScore: integer('trust_score').default(50),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastActiveAt: timestamp('last_active_at')
});

// worker_profiles.ts
export const workerProfiles = pgTable('worker_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  // Professional Info
  skills: jsonb('skills'), // Array of category IDs
  experienceLevel: varchar('experience_level', { length: 20 }),
  hourlyRateMin: decimal('hourly_rate_min', { precision: 10, scale: 2 }),
  hourlyRateMax: decimal('hourly_rate_max', { precision: 10, scale: 2 }),
  portfolio: jsonb('portfolio'), // Array of image URLs
  
  // Stats
  jobsCompleted: integer('jobs_completed').default(0),
  averageRating: real('average_rating').default(0),
  responseTime: integer('response_time'), // minutes
  acceptanceRate: real('acceptance_rate').default(0),
  completionRate: real('completion_rate').default(0),
  
  // Earnings
  totalEarnings: decimal('total_earnings', { precision: 10, scale: 2 }).default('0'),
  
  // Badges
  badges: jsonb('badges'), // Array of badge codes
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// categories.ts
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  icon: varchar('icon', { length: 50 }),
  parentId: uuid('parent_id').references(() => categories.id),
  
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  
  createdAt: timestamp('created_at').defaultNow()
});

// jobs.ts
export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => users.id).notNull(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  
  // Job Details
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  
  // Budget
  budgetType: varchar('budget_type', { length: 20 }).notNull(), // fixed, hourly, negotiable
  budgetAmount: decimal('budget_amount', { precision: 10, scale: 2 }),
  budgetMin: decimal('budget_min', { precision: 10, scale: 2 }),
  budgetMax: decimal('budget_max', { precision: 10, scale: 2 }),
  
  // Location
  locationLat: real('location_lat').notNull(),
  locationLng: real('location_lng').notNull(),
  locationAddress: text('location_address'),
  visibilityRadius: integer('visibility_radius').default(10), // km
  
  // Timing
  urgency: varchar('urgency', { length: 20 }).notNull(),
  preferredDate: date('preferred_date'),
  preferredTime: time('preferred_time'),
  
  // Media
  photos: jsonb('photos'), // Array of URLs
  
  // Status
  status: varchar('status', { length: 20 }).default('open'),
  hiredWorkerId: uuid('hired_worker_id').references(() => users.id),
  
  // Metrics
  viewsCount: integer('views_count').default(0),
  bidsCount: integer('bids_count').default(0),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  completedAt: timestamp('completed_at')
});

// bids.ts
export const bids = pgTable('bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  workerId: uuid('worker_id').references(() => users.id).notNull(),
  
  // Proposal
  message: text('message').notNull(),
  proposedAmount: decimal('proposed_amount', { precision: 10, scale: 2 }).notNull(),
  estimatedDuration: varchar('estimated_duration', { length: 100 }),
  availability: varchar('availability', { length: 200 }),
  
  // Credits
  creditsSpent: integer('credits_spent').notNull(),
  
  // Status
  status: varchar('status', { length: 20 }).default('pending'),
  
  // Worker Snapshot
  workerRatingAtTime: real('worker_rating_at_time'),
  workerJobsCompletedAtTime: integer('worker_jobs_completed_at_time'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// credits.ts
export const credits = pgTable('credits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  balance: integer('balance').default(0),
  lifetimePurchased: integer('lifetime_purchased').default(0),
  lifetimeSpent: integer('lifetime_spent').default(0),
  
  updatedAt: timestamp('updated_at').defaultNow()
});

// credit_transactions.ts
export const creditTransactions = pgTable('credit_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  type: varchar('type', { length: 20 }).notNull(), // purchase, spend, refund, bonus
  amount: integer('amount').notNull(), // positive or negative
  
  // Context
  jobId: uuid('job_id').references(() => jobs.id),
  bidId: uuid('bid_id').references(() => bids.id),
  purchaseId: varchar('purchase_id', { length: 255 }), // RevenueCat transaction ID
  
  description: varchar('description', { length: 255 }),
  
  createdAt: timestamp('created_at').defaultNow()
});

// wallet.ts
export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).unique().notNull(),
  
  balanceAvailable: decimal('balance_available', { precision: 10, scale: 2 }).default('0'),
  balancePending: decimal('balance_pending', { precision: 10, scale: 2 }).default('0'),
  balanceOnHold: decimal('balance_on_hold', { precision: 10, scale: 2 }).default('0'),
  lifetimeEarnings: decimal('lifetime_earnings', { precision: 10, scale: 2 }).default('0'),
  
  updatedAt: timestamp('updated_at').defaultNow()
});

// wallet_transactions.ts
export const walletTransactions = pgTable('wallet_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletId: uuid('wallet_id').references(() => wallets.id).notNull(),
  
  type: varchar('type', { length: 20 }).notNull(), // earning, payout, refund, hold, release
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  
  // Context
  jobId: uuid('job_id').references(() => jobs.id),
  payoutId: uuid('payout_id'),
  
  description: text('description'),
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at').defaultNow()
});

// payouts.ts
export const payouts = pgTable('payouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  workerId: uuid('worker_id').references(() => users.id).notNull(),
  
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  fee: decimal('fee', { precision: 10, scale: 2 }).default('0'),
  netAmount: decimal('net_amount', { precision: 10, scale: 2 }).notNull(),
  
  method: varchar('method', { length: 50 }).notNull(), // bank, mobile_money, instant_eft
  details: jsonb('details'), // Account info (encrypted)
  
  status: varchar('status', { length: 20 }).default('pending'), // pending, processing, completed, failed
  
  createdAt: timestamp('created_at').defaultNow(),
  processedAt: timestamp('processed_at'),
  completedAt: timestamp('completed_at')
});

// ratings.ts
export const ratings = pgTable('ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  fromUserId: uuid('from_user_id').references(() => users.id).notNull(),
  toUserId: uuid('to_user_id').references(() => users.id).notNull(),
  
  // Ratings (1-5, 0.5 increments)
  overallRating: real('overall_rating').notNull(),
  
  // Category ratings
  qualityRating: real('quality_rating'),
  professionalismRating: real('professionalism_rating'),
  communicationRating: real('communication_rating'),
  punctualityRating: real('punctuality_rating'),
  valueRating: real('value_rating'),
  
  // Review
  review: text('review'),
  
  // Metadata
  canEdit: boolean('can_edit').default(true),
  editedAt: timestamp('edited_at'),
  
  createdAt: timestamp('created_at').defaultNow()
});

// messages.ts
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  recipientId: uuid('recipient_id').references(() => users.id).notNull(),
  
  content: text('content'),
  type: varchar('type', { length: 20 }).default('text'), // text, image, location, voice
  attachments: jsonb('attachments'),
  
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  
  createdAt: timestamp('created_at').defaultNow()
});

// disputes.ts
export const disputes = pgTable('disputes', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  raisedBy: uuid('raised_by').references(() => users.id).notNull(),
  againstUserId: uuid('against_user_id').references(() => users.id).notNull(),
  
  type: varchar('type', { length: 50 }).notNull(),
  description: text('description').notNull(),
  evidence: jsonb('evidence'), // Photos, screenshots, etc.
  
  status: varchar('status', { length: 20 }).default('open'), // open, investigating, resolved, closed
  priority: varchar('priority', { length: 20 }).default('medium'),
  
  assignedToAdmin: uuid('assigned_to_admin').references(() => users.id),
  resolution: text('resolution'),
  resolutionType: varchar('resolution_type', { length: 50 }),
  
  createdAt: timestamp('created_at').defaultNow(),
  resolvedAt: timestamp('resolved_at')
});

// notifications.ts
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  
  // Context
  jobId: uuid('job_id').references(() => jobs.id),
  bidId: uuid('bid_id').references(() => bids.id),
  
  // Metadata
  actionUrl: varchar('action_url', { length: 500 }),
  imageUrl: varchar('image_url', { length: 500 }),
  
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  
  createdAt: timestamp('created_at').defaultNow()
});
```

---

## 4. API ENDPOINTS STRUCTURE

### 4.1 Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/verify-phone
POST   /api/auth/verify-email
POST   /api/auth/refresh-token
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### 4.2 Users
```
GET    /api/users/me
PUT    /api/users/me
PUT    /api/users/me/location
POST   /api/users/me/photo
DELETE /api/users/me

GET    /api/users/:id
GET    /api/users/:id/reviews
GET    /api/users/:id/portfolio
```

### 4.3 Workers
```
GET    /api/workers/me/profile
PUT    /api/workers/me/profile
POST   /api/workers/me/portfolio
DELETE /api/workers/me/portfolio/:id

GET    /api/workers/me/stats
GET    /api/workers/me/badges
GET    /api/workers/nearby?lat=...&lng=...&radius=...
```

### 4.4 Jobs
```
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id

GET    /api/jobs/nearby?lat=...&lng=...
GET    /api/jobs/my-posts
GET    /api/jobs/:id/bids

POST   /api/jobs/:id/cancel
POST   /api/jobs/:id/complete
POST   /api/jobs/:id/dispute
```

### 4.5 Bids
```
GET    /api/bids/my-bids
POST   /api/jobs/:jobId/bids
PUT    /api/bids/:id
DELETE /api/bids/:id

POST   /api/bids/:id/accept
POST   /api/bids/:id/reject
POST   /api/bids/:id/withdraw
```

### 4.6 Credits
```
GET    /api/credits/balance
GET    /api/credits/transactions
POST   /api/credits/purchase
POST   /api/credits/calculate-bid-cost
```

### 4.7 Wallet
```
GET    /api/wallet
GET    /api/wallet/transactions
POST   /api/wallet/payout
GET    /api/wallet/payout/:id
```

### 4.8 Ratings
```
POST   /api/jobs/:jobId/rate
PUT    /api/ratings/:id
GET    /api/ratings/received
GET    /api/ratings/given
```

### 4.9 Messages
```
GET    /api/jobs/:jobId/messages
POST   /api/jobs/:jobId/messages
PUT    /api/messages/:id/read
```

### 4.10 Notifications
```
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
DELETE /api/notifications/:id
```

### 4.11 Admin
```
GET    /api/admin/dashboard
GET    /api/admin/users
PUT    /api/admin/users/:id/verify
PUT    /api/admin/users/:id/suspend
PUT    /api/admin/users/:id/ban

GET    /api/admin/jobs
PUT    /api/admin/jobs/:id/feature
DELETE /api/admin/jobs/:id

GET    /api/admin/disputes
PUT    /api/admin/disputes/:id/assign
PUT    /api/admin/disputes/:id/resolve

GET    /api/admin/analytics
GET    /api/admin/revenue
```

---

## 5. TECH STACK IMPLEMENTATION

### 5.1 Frontend (React Native / Expo)
```
fixa-app/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── VerifyPhoneScreen.tsx
│   │   ├── jobs/
│   │   │   ├── JobFeedScreen.tsx
│   │   │   ├── JobMapScreen.tsx
│   │   │   ├── JobDetailScreen.tsx
│   │   │   ├── CreateJobScreen.tsx
│   │   │   └── MyJobsScreen.tsx
│   │   ├── bids/
│   │   │   ├── BidListScreen.tsx
│   │   │   ├── CreateBidScreen.tsx
│   │   │   └── MyBidsScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   └── PortfolioScreen.tsx
│   │   ├── wallet/
│   │   │   ├── WalletScreen.tsx
│   │   │   ├── PayoutScreen.tsx
│   │   │   └── TransactionsScreen.tsx
│   │   ├── credits/
│   │   │   ├── CreditsScreen.tsx
│   │   │   └── PurchaseCreditsScreen.tsx
│   │   └── chat/
│   │       └── ChatScreen.tsx
│   ├── components/
│   │   ├── JobCard.tsx
│   │   ├── BidCard.tsx
│   │   ├── UserAvatar.tsx
│   │   ├── RatingStars.tsx
│   │   ├── BadgeDisplay.tsx
│   │   └── Map/
│   │       ├── JobMap.tsx
│   │       └── JobMarker.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── location.ts
│   │   ├── notifications.ts
│   │   └── revenuecat.ts
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── jobsSlice.ts
│   │   │   ├── bidsSlice.ts
│   │   │   └── walletSlice.ts
│   │   └── store.ts
│   ├── hooks/
│   │   ├── useLocation.ts
│   │   ├── useJobs.ts
│   │   └── useCredits.ts
│   └── utils/
│       ├── distance.ts
│       ├── currency.ts
│       └── validation.ts
```

### 5.2 Backend (Node.js + Express)
```
fixa-api/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── jobsController.ts
│   │   ├── bidsController.ts
│   │   ├── creditsController.ts
│   │   ├── walletController.ts
│   │   └── adminController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validateRequest.ts
│   │   ├── rateLimiter.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   └── (Drizzle schemas)
│   ├── services/
│   │   ├── authService.ts
│   │   ├── jobService.ts
│   │   ├── bidService.ts
│   │   ├── creditService.ts
│   │   ├── walletService.ts
│   │   ├── notificationService.ts
│   │   ├── paymentService.ts
│   │   └── locationService.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── jobs.ts
│   │   ├── bids.ts
│   │   ├── credits.ts
│   │   ├── wallet.ts
│   │   └── admin.ts
│   ├── jobs/ (Background jobs)
│   │   ├── expireJobs.ts
│   │   ├── processPayouts.ts
│   │   ├── sendNotifications.ts
│   │   └── updateRatings.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── revenuecat.ts
│   │   └── firebase.ts
│   └── utils/
│       ├── distance.ts
│       ├── validation.ts
│       └── logger.ts
```

### 5.3 Database (PostgreSQL via Neon + Drizzle)
```typescript
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### 5.4 Key Integrations

**RevenueCat Setup**
```typescript
// services/revenuecat.ts
import Purchases from 'react-native-purchases';

export const initRevenueCat = async () => {
  await Purchases.configure({
    apiKey: process.env.REVENUECAT_API_KEY!,
  });
};

export const purchaseCredits = async (packId: string) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packId);
    // Webhook will credit account
    return customerInfo;
  } catch (error) {
    throw error;
  }
};

export const subscribe = async (subscriptionId: string) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(subscriptionId);
    return customerInfo;
  } catch (error) {
    throw error;
  }
};
```

**Google Maps Integration**
```typescript
// components/JobMap.tsx
import MapView, { Marker, Circle } from 'react-native-maps';

export const JobMap = ({ jobs, userLocation }) => {
  return (
    <MapView
      initialRegion={{
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {jobs.map(job => (
        <Marker
          key={job.id}
          coordinate={{
            latitude: job.locationLat,
            longitude: job.locationLng,
          }}
          title={job.title}
          description={`R${job.budgetAmount}`}
        />
      ))}
      
      <Circle
        center={userLocation}
        radius={5000} // 5km
        strokeColor="rgba(0,122,255,0.5)"
        fillColor="rgba(0,122,255,0.1)"
      />
    </MapView>
  );
};
```

**Firebase Push Notifications**
```typescript
// services/notifications.ts
import messaging from '@react-native-firebase/messaging';

export const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    // Send token to backend
    await api.post('/api/notifications/register-device', { token });
  }
};

export const handleNotification = (remoteMessage) => {
  // Navigate to relevant screen
  console.log('Notification:', remoteMessage);
};
```

---

## 6. MONETIZATION STRATEGY (Detailed)

### 6.1 Revenue Streams
```javascript
revenueModel = {
  primary: {
    creditSales: {
      percentage: "65%",
      margin: "95%", // Virtual goods, minimal cost
      strategy: "Consumable purchases, non-refundable"
    },
    
    platformFees: {
      percentage: "25%",
      margin: "100%",
      calculation: "15% of every completed job"
    },
    
    subscriptions: {
      percentage: "10%",
      margin: "80%",
      mrr: "Monthly Recurring Revenue focus"
    }
  },
  
  projections: {
    year1: {
      users: 5000,
      activeWorkers: 2000,
      avgCreditsPerWorker: 30, // per month
      avgJobValue: 800,
      jobsPerMonth: 1500,
      
      revenue: {
        credits: "2000 × R99 (avg pack) = R198,000",
        platformFees: "1500 jobs × R800 × 15% = R180,000",
        subscriptions: "200 Pro workers × R149 = R29,800",
        total: "R407,800/month"
      }
    },
    
    year2: {
      users: 25000,
      revenue: "~R2M/month"
    }
  }
}
```

### 6.2 Pricing Psychology
```javascript
pricingStrategy = {
  creditPacks: {
    anchor: {
      pack: "Mega Pack (R399)",
      purpose: "Makes R199 pack seem like best value"
    },
    
    popular: {
      pack: "Popular Pack (R99)",
      highlight: true,
      reasoning: "Sweet spot for most users"
    },
    
    starter: {
      pack: "Starter Pack (R49)",
      purpose: "Low barrier to entry"
    },
    
    bonuses: {
      psychology: "Perceived extra value",
      implementation: "More credits for larger packs"
    }
  },
  
  subscriptions: {
    free: "Build trust, learn platform",
    pro: "For serious workers, clear ROI",
    elite: "VIP treatment, aspirational"
  }
}
```

---

## 7. LAUNCH STRATEGY

### 7.1 MVP Features (Phase 1 - Months 1-3)
```
✅ Core Must-Haves:
- Phone auth + basic profiles
- Post job (text + photo)
- Browse jobs (list + map)
- Bid with credits
- Credit purchase (RevenueCat)
- Accept bid
- In-app chat
- Mark job complete
- Basic ratings
- Push notifications

❌ Can Wait:
- ID/Selfie verification
- Subscriptions
- Disputes system
- Advanced analytics
- Portfolio
- Badges (beyond basic)
```

### 7.2 Beta Testing (Month 4)
```
- Recruit 50 beta users (25 clients, 25 workers)
- Focus areas:
  - Pretoria (your location)
  - 2-3 popular categories (Cleaning, Gardening, Handyman)
  
- Success metrics:
  - 70%+ job completion rate
  - <24hr avg time to hire
  - 4.0+ avg rating
  - 80%+ user retention (30 days)
```

### 7.3 Public Launch (Month 5)
```
Marketing channels:
- Facebook groups (local communities)
- Google Ads (local services keywords)
- Referral program:
  - Client: R50 credit for each referred client
  - Worker: 20 free credits for each referred worker
  
Initial focus:
- Pretoria → Johannesburg → Cape Town → Durban
```

---

## 8. RISK MITIGATION

### 8.1 Trust & Safety
```javascript
safetyMeasures = {
  fraud: {
    multipleBids: "Limit 3 bids per job per worker",
    fakeJobs: "Client phone verification required",
    creditAbuse: "IP tracking, device fingerprinting"
  },
  
  quality: {
    lowRatings: "Auto-suspend workers <3.0 rating after 10 jobs",
    noShows: "3 no-shows = 7-day suspension",
    spam: "AI content moderation"
  },
  
  payments: {
    chargebacks: "RevenueCat handles disputes",
    fraudPayouts: "Manual review for first payout",
    holds: "Hold payments for 48hrs on new accounts"
  }
}
```

### 8.2 Legal Compliance
```
- Terms of Service
- Privacy Policy (POPIA compliant for South Africa)
- Worker classification (independent contractors, not employees)
- Tax reporting (provide annual earnings statements)
- Insurance (recommend workers get liability insurance)
```

---

## 9. SUCCESS METRICS (KPIs)

### 9.1 User Metrics
```
- Monthly Active Users (MAU)
- Jobs posted per month
- Jobs completed per month
- Job completion rate
- Average time to hire
- Worker utilization rate
```

### 9.2 Financial Metrics
```
- Monthly Recurring Revenue (MRR)
- Average Revenue Per User (ARPU)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- LTV:CAC ratio (target 3:1)
```

### 9.3 Quality Metrics
```
- Average rating (workers & clients)
- Dispute rate (<5% target)
- Response time (workers)
- Repeat usage rate
```

---

## 10. FUTURE ENHANCEMENTS (Phase 2+)

### Post-MVP Features
```
🔮 Phase 2 (Months 6-12):
- In-app payments (replace external)
- Video profiles
- Skill tests & certifications
- Team/company accounts
- Recurring jobs
- Job templates
- Advanced search filters

🔮 Phase 3 (Year 2):
- AI job matching
- Dynamic pricing (surge pricing)
- Insurance marketplace
- Equipment rental
- Multi-language support
- API for third-party integrations
- White-label solution for cities
```

---

## NEXT STEPS

**Immediate Actions:**
1. ✅ Finalize name (Fixa locked)
2. ⚙️ Set up development environment
3. 🗄️ Design database schema (done above)
4. 🎨 Create wireframes/mockups
5. 💳 Register RevenueCat account
6. 🔥 Set up Firebase project
7. 🗺️ Get Google Maps API key
8. 💼 Register company (if needed)

**Week 1-2:**
- Build auth system
- Set up database
- Create basic UI shell

**Week 3-4:**
- Job posting module
- Job discovery module
- Credit purchase integration

**Month 2:**
- Bidding system
- Chat functionality
- Ratings system

**Month 3:**
- Polish & testing
- Beta recruitment
- Marketing prep

---

**Ready to start building? Let me know which area you want to dive into first! 🚀**
