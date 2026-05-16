# Decode Horsemanship - Architecture & Infrastructure

> **Last Updated:** 2026-04-23
> This is a living document. Update it when infrastructure or architecture changes.

## Overview

**Project:** decode-next
**Framework:** Next.js 16.2.4 with React 19
**Hosting:** Vercel
**Database:** Supabase (PostgreSQL)
**Payments:** Stripe
**Email:** Resend

---

## Infrastructure

### Vercel (Hosting)

- **Project URL:** https://www.decodehorsemanship.com
- **Git Repository:** github.com/dawnTestCode/decode-horsemanship-next
- **Branch:** main (auto-deploys on push)

**Environment Variables (set in Vercel Dashboard):**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_SITE_URL` | https://www.decodehorsemanship.com |
| `RESEND_API_KEY` | Resend API key for emails |
| `OWNER_EMAIL` | Owner notification email (optional) |

---

### Supabase (Database & Edge Functions)

- **Project URL:** https://ejmpxawxwapumcmkdcrx.supabase.co
- **Region:** us-east-2

#### Database Tables

| Table | Purpose |
|-------|---------|
| `groundwork_sessions` | Admin-managed Groundwork session dates |
| `groundwork_registrations` | Participant registrations and payment status |
| `summer_camp_sessions` | Summer camp session dates |
| `summer_camp_registrations` | Summer camp registrations |
| `horses` | Horse catalog |
| `gallery` | Gallery images |
| `programs` | Workshop definitions |
| `enrollments` | Program enrollments |
| `inquiries` | Contact form submissions |

#### Edge Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `admin-auth` | HTTP | Admin authentication |
| `enrollment-checkout` | HTTP | Workshop enrollment checkout |
| `enrollment-programs` | HTTP | Fetch Workshop data |
| `enrollment-webhook` | Stripe webhook | Handle EAL enrollment payments |
| `groundwork-reminder` | pg_cron (daily 14:00 UTC) | Send reminder emails 7 days before session |
| `summer-camp-balance-checkout` | HTTP | Create Stripe checkout for camp balance |
| `summer-camp-balance-reminder` | pg_cron (daily 14:00 UTC) | Send balance reminder emails 14 days before camp |
| `summer-camp-checkout` | HTTP | Create Stripe checkout for camp registration |

#### Scheduled Jobs (pg_cron)

View all cron jobs:
```sql
SELECT jobid, jobname, schedule, active FROM cron.job;
```

| Job Name | Schedule | Function Called |
|----------|----------|-----------------|
| `summer-camp-balance-reminder` | `0 14 * * *` | `/functions/v1/summer-camp-balance-reminder` |
| `groundwork-reminder` | `0 14 * * *` | `/functions/v1/groundwork-reminder` |

**Note:** Both jobs require the service role key in the Authorization header.

#### Secrets (Edge Functions)

Set in Supabase Dashboard → Edge Functions → Secrets:

| Secret | Used By |
|--------|---------|
| `RESEND_API_KEY` | groundwork-reminder, summer-camp-balance-reminder |

---

### Stripe (Payments)

- **Dashboard:** https://dashboard.stripe.com

#### Webhooks

| Endpoint | Events |
|----------|--------|
| `https://www.decodehorsemanship.com/api/webhooks/stripe` | `checkout.session.completed` |

#### Products

Products are created inline during checkout (no pre-created products needed).

#### Promotion Codes

- Created in Stripe Dashboard → Products → Coupons
- Only enabled for **balance payments** (not deposits)

---

### Resend (Email)

- **Dashboard:** https://resend.com

#### Sending Domains

| From Address | Purpose |
|--------------|---------|
| `hello@decodehorsemanship.com` | General emails |
| `groundwork@decodehorsemanship.com` | Groundwork program emails |

#### Email Types

| Email | Trigger | Sent From |
|-------|---------|-----------|
| Groundwork Confirmation | Stripe webhook (deposit paid) | Next.js API |
| Groundwork Owner Notification | Stripe webhook (deposit paid) | Next.js API |
| Groundwork Reminder | pg_cron (7 days before) | Edge Function |
| Summer Camp Balance Reminder | pg_cron (14 days before) | Edge Function |

---

## Code Structure

```
decode-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (home)/             # Homepage
│   │   ├── admin/              # Admin dashboard
│   │   ├── api/                # API routes
│   │   │   ├── groundwork-checkout/
│   │   │   ├── groundwork-balance-checkout/
│   │   │   └── webhooks/stripe/
│   │   ├── eal/                # Workshop pages
│   │   ├── groundwork/         # Groundwork program pages
│   │   ├── horses/[id]/        # Horse detail pages
│   │   ├── summer-camp/        # Summer camp pages
│   │   └── volunteer/          # Volunteer portal
│   ├── components/
│   │   ├── admin/              # Admin panel components
│   │   ├── home/               # Homepage sections
│   │   ├── layout/             # Layout components
│   │   ├── ui/                 # Shadcn/ui components
│   │   └── volunteer/          # Volunteer components
│   ├── config/
│   │   └── siteConfig.ts       # Site-wide configuration
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── email.ts            # Resend email functions
│   │   ├── supabase.ts         # Supabase client
│   │   └── utils.ts            # Utility functions
│   └── types/                  # TypeScript definitions
├── supabase/
│   ├── functions/              # Edge Functions (Deno)
│   │   └── groundwork-reminder/
│   └── migrations/             # Database migrations
├── public/                     # Static assets
├── ARCHITECTURE.md             # This file
├── CLAUDE.md                   # AI assistant instructions
└── tsconfig.json               # TypeScript config (excludes supabase/functions)
```

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/groundwork-checkout` | POST | Create Stripe checkout for deposit |
| `/api/groundwork-balance-checkout` | POST | Create Stripe checkout for balance (promo codes enabled) |
| `/api/webhooks/stripe` | POST | Handle Stripe webhook events |

---

## Page Routes

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/groundwork` | Groundwork program info |
| `/groundwork/register` | Registration form |
| `/groundwork/success` | Registration confirmation |
| `/groundwork/pay-balance` | Balance payment (enter confirmation code) |
| `/groundwork/pay-balance/success` | Balance payment confirmation |
| `/summer-camp` | Summer camp info |
| `/summer-camp/register` | Summer camp registration |
| `/summer-camp/pay-balance` | Summer camp balance payment |
| `/eal` | Workshop overview |
| `/eal/corporate` | Corporate programs |
| `/eal/personal` | Personal development |
| `/eal/youth` | Youth programs |
| `/horses/[id]` | Individual horse page |

### Protected Pages

| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard (password protected) |
| `/volunteer` | Volunteer portal (password protected) |

---

## Data Flow

### Groundwork Registration Flow

```
1. User fills form at /groundwork/register
2. POST /api/groundwork-checkout
   - Generates confirmation code (GW-XXXXXX)
   - Creates Stripe checkout session
3. User pays $200 deposit on Stripe
4. Stripe webhook fires (checkout.session.completed)
5. POST /api/webhooks/stripe
   - Creates row in groundwork_registrations
   - Sends confirmation email via Resend
   - Sends owner notification
6. User redirected to /groundwork/success
```

### Balance Payment Flow

```
1. User visits /groundwork/pay-balance
2. Enters confirmation code
3. Fetches registration from Supabase
4. POST /api/groundwork-balance-checkout
   - Creates Stripe checkout with promo codes enabled
5. User pays balance on Stripe
6. Stripe webhook fires
7. POST /api/webhooks/stripe
   - Updates status to 'paid_in_full'
   - Sets balance_due to 0
8. User redirected to /groundwork/pay-balance/success
```

### Reminder Email Flow

```
1. pg_cron runs daily at 14:00 UTC
2. Calls Edge Function via HTTP POST
3. Edge Function queries registrations
   - Session 6-8 days away
   - Status: deposit_paid or paid_in_full
   - reminder_sent_at is NULL
4. Sends reminder email via Resend
5. Updates reminder_sent_at timestamp
```

---

## Maintenance Tasks

### View Cron Jobs
```sql
SELECT jobid, jobname, schedule, active FROM cron.job;
```

### Unschedule a Cron Job
```sql
SELECT cron.unschedule('job-name-here');
```

### Schedule a New Cron Job
```sql
SELECT cron.schedule(
  'job-name',
  '0 14 * * *',
  'SELECT net.http_post(url := ''https://ejmpxawxwapumcmkdcrx.supabase.co/functions/v1/function-name'', headers := ''{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}''::jsonb, body := ''{}''::jsonb);'
);
```

### Deploy Edge Function
```bash
supabase functions deploy function-name
```

### Test Edge Function
Use the "Test" button in Supabase Dashboard → Edge Functions → [function] or:
```bash
curl -X POST https://ejmpxawxwapumcmkdcrx.supabase.co/functions/v1/function-name \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

---

## Troubleshooting

### Edge Function Returns 401
- Check Authorization header has valid service role key
- Verify key starts with `eyJ...` (JWT format)
- Check Supabase Dashboard → Settings → API for correct key

### Webhook Not Firing
- Check Stripe Dashboard → Developers → Webhooks for failures
- Verify webhook secret matches `STRIPE_WEBHOOK_SECRET` env var
- Check Vercel function logs

### Cron Job Not Running
- Verify job is active: `SELECT * FROM cron.job WHERE jobname = 'job-name';`
- Check Edge Function logs in Supabase Dashboard
- Verify service role key in cron command is correct

### Email Not Sending
- Check Resend Dashboard for failures
- Verify `RESEND_API_KEY` is set in both Vercel and Supabase Edge Function secrets
- Check sending domain is verified in Resend
