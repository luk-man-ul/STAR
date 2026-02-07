# 🔧 Fix Admin Login Issue

## Problem: "Invalid email or password"

This error means the admin user is not properly set up in Firebase. Let's fix it!

---

## 🔍 Step 1: Diagnose the Issue

1. **Open your app:** http://localhost:3000
2. **Open browser console** (Press F12)
3. **Run this command:**
   ```javascript
   checkFirebaseSetup()
   ```

This will show you what's missing.

---

## ✅ Step 2: Fix the Issue

### Option A: Create Admin User Properly (Recommended)

#### Part 1: Create User in Firebase Authentication

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Click **"Add user"**
3. Enter:
   - **Email:** `admin@example.com`
   - **Password:** `password123`
4. Click **"Add user"**
5. **IMPORTANT:** Copy the **User UID** (it looks like: `abc123xyz456...`)

#### Part 2: Create User Document in Firestore

1. Go to **Firebase Console** → **Firestore Database**
2. Click **"Start collection"** (if first time) or find the `users` collection
3. Collection ID: `users`
4. Click **"Next"**
5. **Document ID:** Paste the **User UID** you copied above
6. Add these fields:

| Field | Type | Value |
|-------|------|-------|
| `email` | string | `admin@example.com` |
| `name` | string | `Admin User` |
| `phone` | string | `+1234567890` |
| `role` | string | `admin` |
| `createdAt` | timestamp | (click "timestamp" and select current time) |
| `updatedAt` | timestamp | (click "timestamp" and select current time) |

7. Click **"Save"**

---

### Option B: Use Registration Page (Easier but creates customer)

1. Go to: http://localhost:3000/register
2. Fill in the form:
   - Name: Admin User
   - Email: admin@example.com
   - Phone: +1234567890
   - Password: password123
   - Confirm Password: password123
3. Click "Create Account"
4. **Then manually change role to admin:**
   - Go to Firebase Console → Firestore Database → users collection
   - Find the user document (search by email)
   - Edit the `role` field from `customer` to `admin`
   - Save

---

## 🧪 Step 3: Test Login

1. Go to: http://localhost:3000/login
2. Enter:
   - Email: `admin@example.com`
   - Password: `password123`
3. Click "Sign In"
4. ✅ Should redirect to Admin Dashboard

---

## 🐛 Still Not Working?

### Check 1: Verify User Exists in Authentication
```
Firebase Console → Authentication → Users
Should see: admin@example.com
```

### Check 2: Verify User Document Exists in Firestore
```
Firebase Console → Firestore Database → users collection
Should see: Document with admin user's UID
Should have: role field set to "admin"
```

### Check 3: Check Browser Console for Errors
```
Press F12 → Console tab
Look for red error messages
```

### Check 4: Verify .env Configuration
```
Open .env file
Check all Firebase config values are correct
No quotes around values
No extra spaces
```

### Check 5: Check Security Rules
```
Firebase Console → Firestore Database → Rules tab
Should have rules from firestore.rules file
Click "Publish" if not published
```

---

## 💡 Common Mistakes

### Mistake 1: User UID Mismatch
❌ **Problem:** User UID in Firestore doesn't match Authentication UID
✅ **Fix:** Use the exact UID from Authentication when creating Firestore document

### Mistake 2: Missing User Document
❌ **Problem:** User exists in Authentication but not in Firestore
✅ **Fix:** Create user document in Firestore with matching UID

### Mistake 3: Wrong Role
❌ **Problem:** Role field is "customer" instead of "admin"
✅ **Fix:** Edit Firestore document and change role to "admin"

### Mistake 4: Typo in Email
❌ **Problem:** Email in Authentication doesn't match email in Firestore
✅ **Fix:** Make sure both have exact same email

### Mistake 5: Wrong Password
❌ **Problem:** Using wrong password
✅ **Fix:** Reset password in Firebase Console → Authentication → Users → (click user) → Reset password

---

## 🎯 Quick Verification Checklist

After fixing, verify:

- [ ] User exists in Firebase Authentication
- [ ] User document exists in Firestore users collection
- [ ] Document ID matches Authentication UID
- [ ] Email matches in both places
- [ ] Role field is set to "admin"
- [ ] createdAt and updatedAt fields exist
- [ ] Security rules are published
- [ ] .env file is configured correctly
- [ ] Dev server is running

---

## 🚀 Alternative: Create Test Admin via Console

If you want to quickly test, run this in browser console:

```javascript
// This will show you what's in your database
checkFirebaseSetup()
```

Then follow the instructions it provides.

---

## 📞 Need More Help?

If still having issues, check:

1. **Browser Console Errors:**
   - Press F12
   - Look for red error messages
   - Share the error message

2. **Firebase Console:**
   - Check Authentication → Users
   - Check Firestore Database → users collection
   - Verify data is correct

3. **Network Tab:**
   - Press F12 → Network tab
   - Try to login
   - Look for failed requests
   - Check response messages

---

## ✅ Success!

Once login works, you should:
1. See "Admin Dashboard" page
2. Have admin navigation (Dashboard, Orders, Customers, Services)
3. Be able to see all orders (not just your own)

---

**Still stuck?** Let me know the exact error message and I'll help you fix it!
