# 🚀 Deployment & Build Guide - MK'26 Wedding Portal

## New Build System (Best Practices)

After recent security updates, the build system has been reorganized for better reliability and deployment flow.

---

## 📋 Available Scripts

### Development Scripts

```bash
npm run dev           # Start dev server (localhost:3000)
npm run lint          # Check code quality
```

### Build & Deployment Scripts

```bash
npm run build         # Compile Next.js (DB-independent, safe for CI/CD)
npm run migrate       # Run database migrations only
npm run setup         # Setup: migrate DB + generate Prisma client
npm run deploy        # Full deployment: setup + build (safest option)
```

---

## 🔄 Deployment Workflows

### **Option A: Recommended (Separate Concerns)**

Best for production deployments with safety checks:

```bash
# 1. Ensure dependencies are installed
npm install

# 2. Run database migrations (can fail without blocking app build)
npm run migrate
# ✅ If this fails, you can debug DB issues before building the app

# 3. Build the application (fast, no external dependencies)
npm run build

# 4. Start the server
npm run start
```

**Why this is best:**
- ✅ Build won't fail if database is temporarily unavailable
- ✅ You can debug database issues separately
- ✅ Matches industry standard CI/CD pipelines
- ✅ Each step can be monitored independently

---

### **Option B: Quick Deploy (All-in-One)**

For experienced deployments or staging environments:

```bash
npm run deploy
```

This runs: `npm run setup && npm run build && npm run start`

---

### **Option C: First-Time Setup (Development)**

When cloning the repo for the first time:

```bash
npm install          # Install dependencies (runs "postinstall" automatically)
npm run setup        # Create/migrate database
npm run dev          # Start dev server
```

The `postinstall` hook automatically runs `prisma generate` when you install packages.

---

## 📝 Script Reference

| Script | What It Does | When To Use |
|--------|-------------|-----------|
| `npm run dev` | Start dev server with hot reload | Local development |
| `npm run build` | Compile Next.js + generate Prisma | Before deploying or in CI/CD |
| `npm run start` | Run production server | After `build` on production |
| `npm run lint` | Check code quality | Before committing code |
| `npm run setup` | Migrate DB + generate Prisma | First-time setup or re-syncing DB |
| `npm run migrate` | Run DB migrations only | When only DB changes needed |
| `npm run deploy` | Full deploy: setup → build | One-command deployment |

---

## 🔒 Environment Setup

### Required Files

1. **`.env.local`** (Local secrets - NOT committed to git)
   ```env
   DATABASE_URL="postgresql://..."
   POSTGRES_PRISMA_URL="postgresql://..."
   POSTGRES_URL_NON_POOLING="postgresql://..."
   EMAIL_USER="..."
   EMAIL_APP_PASSWORD="..."
   RESEND_API_KEY="..."
   ADMIN_PIN="5273"
   ```

2. **`.env`** (Public values - committed to git)
   ```env
   NEXT_PUBLIC_YOUTUBE_LIVE_ID="dQw4w9WgXcQ"
   # NOTE: Sensitive values in .env.local (not committed)
   ```

**Important:** 
- ✅ `.env.local` is in `.gitignore` (safe)
- ✅ Database credentials only in `.env.local`
- ✅ YouTube ID in `.env` (can be public)

---

## 🐛 Troubleshooting

### Build Fails: "DATABASE_URL not configured"

**Cause:** Missing or invalid `.env.local`

**Fix:**
```bash
# Create .env.local with your database URL
echo 'DATABASE_URL="postgresql://..."' > .env.local
npm run migrate
npm run build
```

### Build Fails: "Cannot find module '@prisma/client'"

**Cause:** Prisma client not generated

**Fix:**
```bash
npm run setup
```

### Migration Fails But I Need To Build

**Cause:** Database is temporarily down

**Fix (Production-Safe):**
```bash
# Build without waiting for migration
npm run build

# Once database is back up, migrate separately
npm run migrate
```

---

## 🚨 CI/CD Pipeline (GitHub Actions Example)

For automated deployment:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Run database migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npm run migrate
      
      - name: Build application
        run: npm run build
      
      - name: Deploy
        run: npm run start
```

**Key points:**
- `npm run migrate` runs separately (can timeout/fail gracefully)
- `npm run build` only compiles (always succeeds if code is valid)
- Clear separation of concerns

---

## 📅 Pre-Wedding Deployment Checklist

**June 19 (2 days before wedding):**

- [ ] Pull latest code
- [ ] Run `npm install`
- [ ] Run `npm run migrate` ← Verify database works
- [ ] Run `npm run build` ← Verify app compiles
- [ ] Run `npm run start` ← Test production server
- [ ] Check `/live` page with placeholder video ID
- [ ] Test `/reservations` flow
- [ ] Test admin PIN access

**June 21 (Wedding Day)**

- [ ] Run `npm run migrate` (ensure database is fresh)
- [ ] Run `npm run build` (final production build)
- [ ] Run `npm run start` (launch server)
- [ ] Verify YouTube live stream is working
- [ ] Test all guest flows

---

## ✅ Best Practices

1. ✅ Always run `npm install` after pulling code
2. ✅ Run `npm run migrate` before `npm run build`
3. ✅ Keep `.env.local` safe (never commit secrets)
4. ✅ Use `npm run deploy` for complete setup
5. ✅ Test locally with `npm run dev` before pushing
6. ✅ Monitor error logs during streaming
7. ✅ Keep database backup before deployment

---

## 📞 Need Help?

- **Dev server won't start:** `npm run setup` then `npm run dev`
- **Build fails:** Check `.env.local` has valid `DATABASE_URL`
- **Database migration fails:** Verify Neon connection is active
- **Deploy stuck:** Try `npm run migrate` separately, then `npm run build`

---

**Last Updated:** June 11, 2026
**Next Review:** June 21, 2026 (post-wedding analysis)
