# Firebase Setup Instructions

## Problem: "Missing or insufficient permissions" Error

This error occurs because Firestore has default deny-all security rules. You need to deploy proper security rules to allow authenticated admin users to write to the database.

## Solution: Deploy Firestore Security Rules

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Deploy Security Rules
```bash
# Deploy only Firestore rules
npm run deploy:rules

# Or deploy all Firebase resources
npm run deploy:all
```

### Step 4: Verify Rules Deployment
After deployment, check the Firebase Console:
1. Go to Firebase Console
2. Select your project (mintalitat)
3. Go to Firestore Database
4. Click on "Rules" tab
5. Verify the rules are deployed

## Security Rules Configuration

The deployed rules allow:
- **Read access** to all users for products and offers
- **Write access** only to authenticated admin user (`geogeo3377123@gmail.com`)

### Rules Content:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.email == 'geogeo3377123@gmail.com';
      allow create: if request.auth != null && request.auth.email == 'geogeo3377123@gmail.com';
      allow update: if request.auth != null && request.auth.email == 'geogeo3377123@gmail.com';
      allow delete: if request.auth != null && request.auth.email == 'geogeo3377123@gmail.com';
    }
    
    match /offers/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.email == 'geogeo3377123@gmail.com';
      allow create: if request.auth != null && request.auth.email == 'geogeo3377123@gmail.com';
      allow update: if request.auth != null && request.auth.email == 'geogeo3377123@gmail.com';
      allow delete: if request.auth != null && request.auth.email == 'geogeo3377123@gmail.com';
    }
  }
}
```

## Testing After Deployment

1. Make sure you're logged in as the admin user (`geogeo3377123@gmail.com`)
2. Try adding a product or offer
3. Check browser console for authentication logs:
   - `✅ User authenticated: geogeo3377123@gmail.com`
   - `✅ Product saved successfully`

## Troubleshooting

### If still getting permission errors:
1. Verify Firebase project ID matches (`mintalitat`)
2. Check admin email in all components matches the rules
3. Ensure user is properly authenticated
4. Verify rules deployed successfully

### Check Authentication Status:
Open browser console and look for:
- `✅ User authenticated: [email]` - Good
- `❌ No authenticated user found` - Need to login

### Alternative: Test Mode Rules (for development only)
If you want to allow all writes during development, use these rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Files Created/Modified:
- `firestore.rules` - Security rules definition
- `.firebaserc` - Firebase project configuration  
- `package.json` - Added deployment scripts
- `src/components/AddProductForm.jsx` - Added auth checks
- `src/components/OffersManager.jsx` - Added auth checks
