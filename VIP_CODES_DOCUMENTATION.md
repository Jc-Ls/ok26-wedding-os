# 🎫 VIP Codes System Documentation

## Overview

The M'K26 Wedding Operating System uses a **VIP Code authentication system** to manage guest reservations and access control. Each guest receives a unique 9-character alphanumeric code that allows them to:
- ✅ Make a reservation
- ✅ Access the menu and place food orders
- ✅ Check in at the event
- ✅ Earn a unique ticket ID

---

## 📊 Current Status

**As of June 12, 2026:**
- **Total Codes Generated:** 300
- **Format:** `MK26-XXXXX` (e.g., `MK26-AC9ZV`)
- **Codes Available:** 300 (none used yet)
- **Codes Used:** 0
- **Database:** PostgreSQL on Neon (table: `VipPass`)

---

## 🔑 Code Format

```
MK26-AC9ZV
├─ MK26    = Wedding identifier (Michael & Khadijat, 2026)
└─ AC9ZV   = 5-character random alphanumeric
            (excluding O, 0, I, L to prevent confusion)
```

**Character Set:** `ABCDEFGHJKMNPQRSTUVWXYZ123456789`
- Total possible combinations: ~34 million
- Current codes: 300

---

## 📋 Code List

All 300 generated codes are stored in: **`vip_codes.csv`**

**Sample Codes:**
```
MK26-AC9ZV
MK26-MH3ZD
MK26-AW35W
MK26-UF6KE
MK26-G8FDX
... (295 more codes)
```

---

## 🗄️ Database Schema

**Table:** `VipPass`

```sql
CREATE TABLE "VipPass" (
  id        String   @id @default(cuid())
  code      String   @unique              -- The 9-char code (MK26-XXXXX)
  isUsed    Boolean  @default(false)      -- Tracks if code has been claimed
  usedBy    String?                       -- Name of guest who used this code
  usedAt    DateTime?                     -- Timestamp when code was claimed
  createdAt DateTime @default(now())      -- When code was generated
)
```

---

## 🔄 Code Lifecycle

```
Generated (isUsed: false)
    ↓
Guest fills reservation form with code
    ↓
API validates code exists & is unused
    ↓
Code marked as isUsed: true, usedAt: [timestamp], usedBy: [guestName]
    ↓
Guest record created with code as ticketId
    ↓
Guest receives confirmation email with VIP code
    ↓
Guest can now order from menu using this code
```

---

## 🛠️ How Codes Were Generated

### Command
```bash
node generate-300-codes.js
```

### What It Does
1. **Clears** old codes from `VipPass` table
2. **Generates** 300 new unique codes
3. **Inserts** all codes into database
4. **Exports** codes to `vip_codes.csv`

### Script Location
📁 `generate-300-codes.js`

### Output
```
🔧 Generating 300 reservation codes...
🧹 Clearing old VipPass data...
📝 Creating code batch...
💾 Inserting 300 codes into database...
   ✓ 50/300 codes inserted
   ✓ 100/300 codes inserted
   ... (continues)
✅ All 300 codes inserted!
📊 Exporting to CSV...

====================================
✅ SUCCESS! 300 codes generated
📁 Saved to: vip_codes.csv
📊 Total codes: 300
====================================
```

---

## 🔍 Validation System

### Validation Rules

**VIP Code Validation** (`validateVipCode` in `src/lib/validation.ts`)

```typescript
✅ Must be text
✅ Must match format: alphanumeric + hyphens
✅ Must be 6-50 characters long
❌ Must NOT contain special characters (except hyphen)
```

**Format Check:**
- Regex: `/^[A-Z0-9\-]+$/`
- Example PASS: `MK26-AC9ZV` ✅
- Example FAIL: `MK26 AC9ZV` ❌ (space not allowed)

### Validation Flow

```
User enters code: "MK26-AC9ZV"
    ↓
validateVipCode() checks format
    ↓
Format valid? → Convert to UPPERCASE
    ↓
Query database: SELECT * FROM VipPass WHERE code = 'MK26-AC9ZV'
    ↓
Code exists? → Check isUsed flag
    ↓
isUsed = false? → ✅ VALID (proceed with reservation)
isUsed = true?  → ❌ ALREADY CLAIMED (error message)
Code not found? → ❌ INVALID CODE (error message)
```

---

## 📡 API Endpoints

### 1. **Reserve Endpoint**
**POST** `/api/reserve`

**Request Body:**
```json
{
  "name": "IDAYAT AMO",
  "phone": "09866545098",
  "email": "jare@example.com",
  "vipCode": "MK26-AC9ZV",
  "guestCategory": "Bride's Guest"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "ticketId": "MK26-AC9ZV",
  "name": "IDAYAT AMO",
  "guestCategory": "Bride's Guest",
  "emailSent": true
}
```

**Error Responses:**
```json
// Code not found
{ "error": "Invalid VIP Code. Please check your invitation." }

// Code already used
{ "error": "This VIP Code has already been claimed." }

// Invalid format
{ "error": "VIP Code format invalid" }
```

---

### 2. **Debug Endpoint**
**GET** `/api/debug/check-vip`

**Response:**
```json
{
  "totalCodes": 300,
  "usedCodes": 0,
  "availableCodes": 300,
  "sampleUnusedCodes": [
    { "code": "MK26-YEF7V", "isUsed": false },
    { "code": "MK26-3E7QK", "isUsed": false },
    ...
  ],
  "sampleUsedCodes": []
}
```

### Check Specific Code
**POST** `/api/debug/check-vip`

**Request:**
```json
{ "code": "MK26-AC9ZV" }
```

**Response (if found):**
```json
{
  "status": "FOUND",
  "code": "MK26-AC9ZV",
  "isUsed": false,
  "usedBy": null,
  "usedAt": null,
  "message": "Code is valid and available"
}
```

---

## 📧 Reservation Flow

### Step 1: User Fills Form
- Name
- Phone
- Email (optional)
- **VIP Code** ← Must match one in database
- Guest Category (Bride's Guest / Groom's Guest)

### Step 2: Backend Validation
1. Validate code format
2. Check if code exists in database
3. Check if code is already used
4. Create Guest record
5. Mark code as used
6. Send confirmation email

### Step 3: Confirmation Screen
Guest sees:
- ✅ Reservation confirmed
- Guest name
- Attending as: [Category]
- **VIP Pass Code** displayed
- Instructions to scan table QR code at reception

### Step 4: Email Notification
Guest receives email with:
- Confirmation message
- VIP Code (highlighted)
- Reservation reference number
- Instructions

---

## 🔐 Security Features

1. **Code Uniqueness**
   - Each code is unique in database
   - Cannot be duplicated

2. **One-Time Use**
   - Once a code is used, `isUsed` flag set to `true`
   - Cannot be reused for another reservation

3. **Timestamp Tracking**
   - Records when code was claimed
   - Records who claimed it

4. **Rate Limiting**
   - Max 50 reservations per minute per IP address
   - Prevents brute force attacks

5. **Input Validation**
   - Sanitizes all inputs
   - Prevents SQL injection
   - Validates format before database query

---

## 🔧 Regenerating Codes

If you need to **generate NEW codes** (e.g., lost or for additional guests):

### Step 1: Run Generator
```bash
node generate-300-codes.js
```

⚠️ **WARNING:** This will:
- ✅ DELETE all old codes from database
- ✅ Generate 300 new codes
- ⚠️ Any reservations using old codes will fail

### Step 2: Distribute New Codes
Update your code list from `vip_codes.csv`

### Step 3: Notify Guests
If codes have already been distributed, you must notify guests of the new codes.

---

## 📊 Monitoring & Tracking

### Check Code Usage Status
```
GET /api/debug/check-vip
```

**Returns:**
- Total codes generated
- Number of codes claimed
- Number of codes still available
- Sample of available and used codes

### Real-Time Monitoring
To monitor code usage in real-time:

**Dashboard Query:**
```sql
SELECT 
  COUNT(*) as total_codes,
  COUNT(CASE WHEN isUsed = true THEN 1 END) as used_codes,
  COUNT(CASE WHEN isUsed = false THEN 1 END) as available_codes
FROM "VipPass";
```

---

## 📝 Code Distribution Best Practices

### ✅ Recommended
1. **Email** - Send codes individually to invited guests
2. **QR Code** - Generate QR codes linking to `/reservations?code=MK26-AC9ZV`
3. **Physical Cards** - Print codes on invitation cards
4. **WhatsApp** - Share via WhatsApp for quick access
5. **SMS** - Send via SMS for critical guests

### ❌ Avoid
1. ❌ Posting codes publicly on social media
2. ❌ Reusing codes across multiple events
3. ❌ Sharing one code with multiple guests
4. ❌ Using sequential patterns (easy to guess)

---

## 🎯 Summary

| Metric | Value |
|--------|-------|
| Total Codes Generated | 300 |
| Codes Available | 300 |
| Codes Used | 0 |
| Format | `MK26-XXXXX` |
| Generation Date | June 12, 2026 |
| Database | PostgreSQL (Neon) |
| API Endpoint | `/api/reserve` |
| Status | ✅ Production Ready |

---

## 📞 Support

If a guest has issues:

1. **"Invalid VIP Code"** → Code not in database
   - Check if code exists in `vip_codes.csv`
   - Check for typos (0 vs O, 1 vs I, etc.)

2. **"Code Already Claimed"** → Code was already used
   - Generate new code from available list
   - Check if guest already made reservation

3. **Code Not Received** → Distribution issue
   - Resend from `vip_codes.csv`
   - Use alternative delivery method

---

**Documentation Last Updated:** June 12, 2026
**Status:** ✅ Active & Working
