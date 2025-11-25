# Firestore Rules Setup

Για να λειτουργήσουν όλες οι λειτουργίες, πρέπει να ενημερώσεις τα Firestore Security Rules.

## Επιλογή 1: Firebase Console (Προτεινόμενη)

1. Πήγαινε στο [Firebase Console](https://console.firebase.google.com/)
2. Επίλεξε το project "alexandra-rizou"
3. Πήγαινε στο **Firestore Database** → **Rules**
4. Αντιγράψε και επικόλλησε τα παρακάτω rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow reads and writes to newsletter_subscribers collection
    match /newsletter_subscribers/{document} {
      // Allow reads for everyone (for admin dashboard and API routes)
      allow read: if true;
      // Allow creates with validation
      allow create: if request.resource.data.email is string 
                     && request.resource.data.email.matches('.*@.*\\..*')
                     && request.resource.data.language is string
                     && request.resource.data.isActive == true;
      // Only allow updates/deletes from authenticated admin users
      allow update, delete: if request.auth != null;
    }
    
    // Allow reads for settings collection (for Christmas schedule)
    match /settings/{document} {
      allow read: if true;
      // Only allow writes from authenticated admin users
      allow write: if request.auth != null;
    }
    
    // Allow reads for holiday_schedules collection (for holiday schedules)
    match /holiday_schedules/{document} {
      allow read: if true;
      // Only allow writes from authenticated admin users
      allow write: if request.auth != null;
    }
    
    // Default rule: allow reads for authenticated users only
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // All writes should go through Admin SDK
    }
  }
}
```

5. Κάνε click **Publish**

## Επιλογή 2: Firebase CLI

Αν έχεις εγκατεστημένο το Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

## Σημείωση

Τα rules επιτρέπουν:
- ✅ **Reads** από όλους (για public data)
- ✅ **Creates** στο `newsletter_subscribers` collection (μόνο με valid email)
- ✅ **Reads** στο `holiday_schedules` collection (για να εμφανίζονται τα ωράρια)
- ❌ **Updates/Deletes** από client (μόνο μέσω Admin SDK)

Για admin operations (updates/deletes), χρησιμοποιείται το Admin SDK που έχει full permissions.

