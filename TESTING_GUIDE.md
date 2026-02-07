# Firebase Integration Testing Guide

## ✅ What's Been Completed

All three order-related pages are now fully integrated with Firebase:

1. **BookingPage.tsx** - Creates orders in Firebase
2. **MyOrdersPage.tsx** - Fetches customer orders from Firebase
3. **AdminOrdersPage.tsx** - Fetches all orders and updates order status in Firebase

## 🧪 Testing Steps

### Step 1: Create a Customer Account
1. Navigate to `/register`
2. Create a new customer account:
   - Email: `customer@test.com`
   - Password: `password123`
   - Name: `Test Customer`
   - Phone: `+1234567890`
   - Role: `customer`

### Step 2: Login as Customer
1. Navigate to `/login`
2. Login with customer credentials
3. You should see the customer dashboard

### Step 3: Create a Booking
1. Navigate to `/book` (or click "Book Appointment" from home)
2. **Step 1**: Select a service and appointment date
   - Choose any service (e.g., "Blouse Stitching")
   - Select a future date
   - Click "Next"
3. **Step 2**: Choose measurement option
   - Option A: Select "Measure at Shop" (simpler)
   - Option B: Select "Enter My Own" and fill in measurements
   - Click "Submit Booking"
4. You should see a success alert with an Order ID

### Step 4: Verify Order in Firebase Console
1. Open Firebase Console: https://console.firebase.google.com/
2. Go to your project
3. Navigate to **Firestore Database**
4. Look for the **orders** collection (it should now exist!)
5. Click on the collection to see your order document
6. Verify the order data:
   - `customerId` matches your user ID
   - `serviceId` matches the selected service
   - `status` is "pending"
   - `appointmentDate` is correct
   - `measurements` (if provided)
   - `specialInstructions`

### Step 5: View Order as Customer
1. While logged in as customer, navigate to `/my-orders`
2. You should see your newly created order
3. Verify the order details are displayed correctly

### Step 6: Login as Admin
1. Logout from customer account
2. Login as admin:
   - Email: `admin@example.com`
   - Password: `password123`

### Step 7: View and Update Order as Admin
1. Navigate to `/admin/orders`
2. You should see the customer's order
3. Verify all order details are displayed:
   - Order ID
   - Service name
   - Customer name and contact info
   - Appointment date
   - Current status
   - Measurements (if provided)
4. **Test Status Update**:
   - Use the dropdown to change order status (e.g., from "pending" to "confirmed")
   - The status should update immediately
   - Check Firebase Console to verify the status changed in the database

### Step 8: Verify Real-Time Updates
1. Keep admin page open
2. Open Firebase Console in another tab
3. Manually change the order status in Firebase Console
4. Refresh the admin page - you should see the updated status

## 🎯 Expected Results

✅ Orders collection appears in Firestore after first booking
✅ Customer can create bookings successfully
✅ Customer can view their orders in "My Orders" page
✅ Admin can view all orders in "Admin Orders" page
✅ Admin can update order status using the dropdown
✅ Status updates are saved to Firebase immediately
✅ All order data (customer, service, measurements) displays correctly

## 🐛 Troubleshooting

### "The query requires an index" Error (My Orders Page)
This is NORMAL on first use! Firestore needs a composite index for customer orders.

**Quick Fix:**
1. Look at the error message on the "My Orders" page
2. Click the long Firebase Console URL in the error
3. Click "Create Index" button
4. Wait 2-5 minutes for the index to build
5. Refresh the page - error should be gone!

See `FIX_INDEX_ERROR.md` for detailed instructions.

### Orders collection not appearing?
- Make sure you completed Step 3 (Create a Booking)
- Check browser console for errors
- Verify Firebase rules are published (open rules for testing)

### Permission denied errors?
- Check that your Firestore rules are set to allow read/write for testing
- Verify you're logged in with a valid account

### Data not loading?
- Check browser console for errors
- Verify your `.env` file has correct Firebase credentials
- Make sure Firebase Authentication and Firestore are enabled in Firebase Console

## 📋 Next Steps After Testing

Once everything works:

1. **Apply Secure Firestore Rules**:
   - Copy content from `firestore.rules` file
   - Paste into Firebase Console → Firestore Database → Rules
   - Click "Publish"
   - Test that role-based access still works

2. **Optional Enhancements**:
   - Add real-time order updates using `subscribeToOrders()`
   - Add order cancellation feature
   - Add email notifications
   - Add payment integration
   - Add image upload for design references

## 🔒 Security Rules

The `firestore.rules` file contains production-ready security rules that:
- Allow customers to only read/write their own orders
- Allow admins to read/write all orders
- Validate data structure and required fields
- Prevent unauthorized access

Apply these rules after testing with open rules!
