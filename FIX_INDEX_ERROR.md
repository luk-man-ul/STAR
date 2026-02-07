# Fix Firestore Index Error

## Problem
You're seeing an error: "The query requires an index. You can create it here: https://console.firebase.google.com/..."

This happens because Firestore needs a composite index to efficiently query orders by `customerId` and sort by `createdAt`.

## Quick Fix (Recommended)

### Option 1: Click the Link in the Error Message
1. Look at the error message in the "My Orders" page
2. Click the long URL that starts with `https://console.firebase.google.com/...`
3. This will open Firebase Console with the index pre-configured
4. Click **"Create Index"**
5. Wait 2-5 minutes for the index to build
6. Refresh your app - the error should be gone!

### Option 2: Create Index Manually
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Indexes** tab
4. Click **"Create Index"**
5. Configure the index:
   - **Collection ID**: `orders`
   - **Fields to index**:
     - Field: `customerId`, Order: `Ascending`
     - Field: `createdAt`, Order: `Descending`
   - **Query scope**: `Collection`
6. Click **"Create"**
7. Wait 2-5 minutes for the index to build

## Why This Happens

Firestore requires composite indexes when you:
- Query with a `where` clause AND
- Sort with `orderBy` on a different field

In our case:
```typescript
query(
  ordersRef,
  where('customerId', '==', customerId),  // Filter by customer
  orderBy('createdAt', 'desc')            // Sort by date
);
```

## Verification

After creating the index:
1. Wait 2-5 minutes for it to build (status will show "Building..." then "Enabled")
2. Refresh your app
3. Navigate to "My Orders" page
4. Orders should load without errors!

## Admin Orders Page

The admin orders page doesn't need this index because it only uses `orderBy` without a `where` clause. That's why it works (after fixing the ID display bug).

## Alternative: Temporary Workaround

If you want to test immediately without waiting for the index, you can temporarily modify the query to not use `orderBy`. But this is NOT recommended for production as orders won't be sorted by date.

**Don't do this - just create the index instead!**
