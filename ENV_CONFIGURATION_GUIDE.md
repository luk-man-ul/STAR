# 🔧 Environment Variables Configuration Guide

## ✅ Setup Complete!

Your shop contact information is now managed through environment variables in the `.env` file. This is the **best practice** for managing configuration.

## 📝 How to Update Your Shop Information

### Step 1: Edit the `.env` File

Open `.env` in your project root and update these values:

```env
# Shop Contact Information
VITE_SHOP_NAME=Star Tailors                    # ← Your shop name
VITE_SHOP_ADDRESS=123 Fashion Street...        # ← Your full address
VITE_SHOP_PHONE=+919876543210                  # ← Your phone (with +)
VITE_SHOP_WHATSAPP=919876543210                # ← WhatsApp (without +)
VITE_SHOP_EMAIL=contact@startailors.com        # ← Your email
VITE_SHOP_LANDMARKS=Near City Mall...           # ← Nearby landmarks

# Google Maps
VITE_GOOGLE_MAPS_EMBED_URL=https://...         # ← Google Maps embed URL
VITE_GOOGLE_MAPS_LINK=https://goo.gl/maps/...  # ← Google Maps share link

# Business Hours (JSON format - keep the format exactly as shown)
VITE_BUSINESS_HOURS=[{"day":"Monday - Friday","time":"10:00 AM - 8:00 PM"},{"day":"Saturday","time":"10:00 AM - 6:00 PM"},{"day":"Sunday","time":"Closed"}]
```

### Step 2: Get Google Maps URLs

#### For Embed URL (VITE_GOOGLE_MAPS_EMBED_URL):
1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your shop address
3. Click **"Share"** button
4. Click **"Embed a map"** tab
5. Copy the **entire URL** from `src="..."` in the iframe code
6. Paste it as `VITE_GOOGLE_MAPS_EMBED_URL`

#### For Share Link (VITE_GOOGLE_MAPS_LINK):
1. In Google Maps, click **"Share"** button
2. Click **"Copy link"** button
3. Paste it as `VITE_GOOGLE_MAPS_LINK`

### Step 3: Update Business Hours

The business hours are in JSON format. Follow this pattern:

```json
[
  {"day":"Monday - Friday","time":"10:00 AM - 8:00 PM"},
  {"day":"Saturday","time":"10:00 AM - 6:00 PM"},
  {"day":"Sunday","time":"Closed"}
]
```

**Important**: Keep it on ONE line, no line breaks!

### Step 4: Restart Development Server

After updating `.env`, you **MUST** restart your development server:

1. Stop the server (Ctrl+C)
2. Run `npm run dev` again
3. Refresh your browser

## 🎯 Where This Information Appears

Your environment variables are used in:

1. **Locate Shop Page** (`/locate`)
   - Shop address
   - Phone number
   - Email
   - WhatsApp
   - Business hours
   - Google Maps

2. **Star Chatbot** (Floating button)
   - Phone number
   - WhatsApp number
   - Email

## ✅ Benefits of Using Environment Variables

1. **Single Source of Truth**: Update once, changes everywhere
2. **Security**: Sensitive info not hardcoded in source files
3. **Easy Deployment**: Different values for dev/staging/production
4. **Version Control**: Can exclude `.env` from git (already in `.gitignore`)
5. **Professional**: Industry standard practice

## 🔒 Security Note

The `.env` file is already in `.gitignore`, so it won't be committed to version control. This is good for:
- API keys
- Passwords
- Private information

However, shop contact info (phone, email, address) is **public information** that appears on your website, so it's safe to include.

## 📋 Quick Reference

| Variable | Example | Used In |
|----------|---------|---------|
| `VITE_SHOP_NAME` | Star Tailors | Locate Page |
| `VITE_SHOP_ADDRESS` | 123 Fashion Street... | Locate Page |
| `VITE_SHOP_PHONE` | +919876543210 | Locate Page, Chatbot |
| `VITE_SHOP_WHATSAPP` | 919876543210 | Locate Page, Chatbot |
| `VITE_SHOP_EMAIL` | contact@startailors.com | Locate Page, Chatbot |
| `VITE_SHOP_LANDMARKS` | Near City Mall | Locate Page |
| `VITE_GOOGLE_MAPS_EMBED_URL` | https://www.google.com/maps/embed?pb=... | Locate Page (map) |
| `VITE_GOOGLE_MAPS_LINK` | https://goo.gl/maps/... | Locate Page (directions) |
| `VITE_BUSINESS_HOURS` | JSON array | Locate Page |

## 🚀 Next Steps

1. Update all values in `.env` with your actual shop information
2. Get your Google Maps URLs
3. Restart the development server
4. Test the Locate page and chatbot
5. Verify all information displays correctly

## ❓ Troubleshooting

**Q: Changes not showing up?**
A: Restart the development server (Ctrl+C, then `npm run dev`)

**Q: Map not displaying?**
A: Check that `VITE_GOOGLE_MAPS_EMBED_URL` is the full embed URL from Google Maps

**Q: Business hours showing wrong?**
A: Ensure JSON format is correct (no line breaks, proper quotes)

**Q: Phone/email not working?**
A: Check for typos in `.env` file

## 📝 Example `.env` File

```env
# Shop Contact Information
VITE_SHOP_NAME=Elegant Tailors
VITE_SHOP_ADDRESS=456 MG Road, Indiranagar, Bangalore, Karnataka 560038
VITE_SHOP_PHONE=+918012345678
VITE_SHOP_WHATSAPP=918012345678
VITE_SHOP_EMAIL=info@eleganttailors.com
VITE_SHOP_LANDMARKS=Next to Indiranagar Metro Station, Above Cafe Coffee Day

# Google Maps
VITE_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8267060175384!2d77.60063931482213!3d12.971598990856934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin
VITE_GOOGLE_MAPS_LINK=https://goo.gl/maps/abc123

# Business Hours
VITE_BUSINESS_HOURS=[{"day":"Monday - Saturday","time":"9:00 AM - 9:00 PM"},{"day":"Sunday","time":"10:00 AM - 6:00 PM"}]
```

## ✅ Status

All files have been updated to use environment variables:
- ✅ `.env` - Configuration added
- ✅ `src/pages/LocateShopPage.tsx` - Uses env variables
- ✅ `src/components/StarChatbot.tsx` - Uses env variables
- ✅ No TypeScript errors
- ✅ Fallback values provided for development

**You're all set! Just update the `.env` file with your actual information.**
