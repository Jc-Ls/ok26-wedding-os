# 📡 Live Streaming Setup Guide - MK'26 Royal Wedding

## Quick Overview
Your wedding portal is **ready for YouTube Live streaming**. You just need to:
1. Create a YouTube channel (if you don't have one)
2. Set up a live event
3. Get the video ID
4. Update your portal (2 minutes)

---

## 🚀 COMPLETE SETUP (30 minutes total)

### PART 1: CREATE YOUTUBE CHANNEL (5 minutes)

**If you already have a YouTube channel:** Skip to PART 2

**If you DON'T have a YouTube channel:**
1. Go to **youtube.com**
2. Click your **Profile icon** (top-right corner)
3. Click **Create a channel**
4. Choose a channel name: "MK'26 Royal Wedding" or "Olowojares Wedding"
5. Click **Create**
6. Wait for confirmation (usually instant)

---

### PART 2: ENABLE LIVE STREAMING (5 minutes)

Your YouTube account needs to be verified for live streaming:

1. Go to **youtube.com/studio** (YouTube Creator Studio)
2. In the left menu, click **Create** → **Go live**
3. If you see a message: **"Enable live streaming"**
   - Click it and verify your account
   - You'll need to provide your phone number
   - Google will send a verification code
   - Enter the code
   - **Wait 24 hours** for verification (usually instant)

**After verification, you're ready to go live!**

---

### PART 3: CREATE YOUR LIVE EVENT (10 minutes)

#### **OPTION A: Schedule for a Specific Time** ⭐ RECOMMENDED
Best for weddings because you can schedule it in advance!

1. Go to **youtube.com/studio**
2. Click **Create** (+ icon on left) → **Go live**
3. Choose **"Schedule for later"**
4. Fill in these details:

   **Stream Details:**
   - **Title:** "MK'26 Royal Wedding Live"
   - **Description:** "Join us for the wedding celebration of Muhammed and Kaothar Olowojares. June 21, 2026"
   - **Thumbnail:** Upload the couple's photo (optional)
   - **Stream starts:** June 21, 2026 at your ceremony time
     - Example: 10:00 AM (adjust to your actual ceremony time)

   **Visibility Settings:**
   - Select **"Unlisted"** (IMPORTANT!)
     - Only people with the link can watch
     - NOT searchable on YouTube
     - Perfect for private weddings

   **Advanced Settings (optional):**
   - Enable chat: Yes (guests can comment)
   - Allow embedding: Yes (you can embed on your website)

5. Click **Create live event**
6. YouTube gives you the stream link

---

#### **OPTION B: Go Live Immediately** (If starting within an hour)

1. Go to **youtube.com/studio**
2. Click **Create** → **Go live now**
3. You'll see different streaming options:
   - **"Webcam"** - Stream from your computer's camera (easiest!)
   - **"Mobile"** - Stream from your phone using the YouTube app
   - **"Encoder"** - For professional streaming setups

4. Choose **"Webcam"** for simplicity
5. Click **Share screen** if you want to show slides
6. Click **Go live** when ready

---

### PART 4: GET YOUR VIDEO ID (2 minutes)

This is the unique code your portal needs to play your live stream.

**After creating the live event:**

1. Go to **youtube.com/studio**
2. Click on your live stream title
3. Look at the **URL** in your browser's address bar

   **Example URL:**
   ```
   https://youtube.com/watch?v=dQw4w9WgXcQ
   ```

4. Copy the part after `v=` 
   - In the example above: `dQw4w9WgXcQ`
   - This is your **Video ID**

**Save this ID - you'll need it in 2 minutes!**

---

### PART 5: UPDATE YOUR WEDDING PORTAL (2 minutes)

Now update the portal with your real video ID:

#### **Option 1: Easy (Using Environment Variable)**

1. Open `.env` file in the project root
2. Find this line:
   ```
   NEXT_PUBLIC_YOUTUBE_LIVE_ID="dQw4w9WgXcQ"
   ```
3. Replace `dQw4w9WgXcQ` with your actual video ID
4. Save the file
5. Restart the dev server or redeploy

#### **Example after update:**
```
NEXT_PUBLIC_YOUTUBE_LIVE_ID="aBcDeF12345"
```

That's it! Your livestream is now integrated! 🎉

---

## 📱 ON WEDDING DAY: HOW TO BROADCAST

### 30 minutes BEFORE ceremony starts:

1. Go to **youtube.com/studio**
2. Click on your scheduled live event
3. Click **"Go live"** button (top-right)
4. Choose your streaming method:
   - **Webcam:** From computer
   - **Mobile:** From phone
   - **Encoder:** Professional camera setup

5. Test your audio and video
   - Click **"Check your audio"**
   - Speak into microphone
   - Wait for feedback
6. Click **"Go live"**

### ✅ You're now broadcasting to guests!

Guests can:
- Visit the `/live` page on your wedding portal
- Watch the ceremony in real-time
- See countdown timer until ceremony
- Read event details
- View tips for best viewing

---

## 🎥 BROADCASTING OPTIONS

### Option 1: Webcam (EASIEST) ⭐
- Stream from your laptop with built-in camera
- Position laptop near the ceremony
- **Pros:** Simple, no additional equipment
- **Cons:** Limited angle, must stay near laptop

### Option 2: Mobile Phone (GOOD)
- Use YouTube Mobile app
- Have someone hold the phone to film
- **Pros:** Mobile, good quality, person can move around
- **Cons:** Requires someone dedicated to filming

### Option 3: Professional Camera + Encoder (BEST)
- Connect DSLR or professional video camera
- Use streaming encoder (OBS, Streamlabs, etc.)
- **Pros:** Professional quality, multiple angles possible
- **Cons:** More technical setup required

**RECOMMENDATION FOR YOUR WEDDING:**
Start with **Webcam** or **Mobile Phone** option. It's simple and reliable.

---

## 🔒 PRIVACY & SECURITY

### Who Can Watch?
- **Unlisted Setting:** Only people who have the link
- **Not searchable:** Won't appear in YouTube search
- **Controlled:** Only guests you invite can watch

### The Link to Share:
After going live, guests visit:
```
https://yoursitename.com/live
```

The embedded video is hidden from YouTube's public search.

---

## 🐛 TROUBLESHOOTING

### Problem: "Stream won't start"
- ✅ Verify your account is approved (24 hours)
- ✅ Check internet connection
- ✅ Try refreshing YouTube Studio

### Problem: "No audio"
- ✅ Check microphone is connected
- ✅ In YouTube Studio, click "Check your audio"
- ✅ Allow microphone permissions in browser

### Problem: "Video is black/not showing"
- ✅ Check webcam is not covered
- ✅ Check camera permissions in browser
- ✅ In YouTube Studio, click "Check your camera"

### Problem: "Portal won't show the livestream"
- ✅ Make sure you updated `.env` file with correct video ID
- ✅ Restart the development server
- ✅ Clear browser cache (Ctrl+Shift+Delete)
- ✅ Try in a different browser

### Problem: "Stream is freezing/laggy"
- ✅ Check internet connection speed (upload: 2.5+ Mbps recommended)
- ✅ Close other apps using internet
- ✅ Move closer to WiFi router
- ✅ Use wired Ethernet if possible

---

## 📊 MONITORING DURING STREAM

While streaming, you can see in YouTube Studio:
- **Viewer count:** How many people are watching
- **Chat:** Guest comments (if enabled)
- **Bitrate:** Stream quality (should be steady)
- **Stream health:** Green = good, Yellow = caution, Red = problems

---

## 🎬 AFTER THE CEREMONY

Your live stream is automatically saved to YouTube!

You can:
1. **Leave it up:** Guests can rewatch anytime
2. **Make it Private:** Change privacy settings later
3. **Download:** Save as video file
4. **Share:** Give the link to family who couldn't attend

---

## 💡 PRO TIPS FOR BEST RESULTS

✅ **Test beforehand:** Do a test stream 1 week before  
✅ **Good lighting:** Face light source, not backlit  
✅ **Stable internet:** Use wired connection if possible  
✅ **Dedicated photographer:** Have someone focused on filming  
✅ **Multiple angles:** If possible, have 2 devices filming  
✅ **Clear audio:** Speak clearly, minimize background noise  
✅ **Start early:** Go live 10 minutes before ceremony  
✅ **Have backup:** Keep phone charged with YouTube app ready  

---

## 📞 SUPPORT

**YouTube Help:**
- Visit **support.google.com/youtube**
- Search your issue

**For Your Portal:**
- Check `.env` file has correct video ID
- Restart dev server after changes
- Check browser console for errors (F12)

---

## ✨ NEXT STEPS

1. **Today:** Create YouTube channel (if needed) - 5 min
2. **This week:** Schedule your live event - 10 min
3. **June 20:** Test your setup - 30 min
4. **June 21:** Go live 30 min before ceremony

**Questions?** YouTube has excellent tutorials. Search: "YouTube Studio how to go live"

---

**Your portal is READY. Now just get your YouTube stream set up!** 🎉
