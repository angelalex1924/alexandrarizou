# 🔐 Οδηγός Setup Admin Panel για Ωράρια

Αυτός ο οδηγός περιγράφει **όλα τα αρχεία και dependencies** που χρειάζονται για να λειτουργήσει το admin panel με το σύστημα ωραρίων.

---

## 📁 Αρχεία που ΠΡΕΠΕΙ να πάρεις για Admin Panel:

### 1. **Admin Page Component**
📄 `app/admin/page.tsx`
- **Τι κάνει**: Κύριο admin page με navigation tabs
- **Dependencies**: 
  - `useAuth` hook (από `AuthContext`)
  - `AdminSignInPage` component
  - `HolidayScheduleAdmin` component
  - `framer-motion` (animations)
  - `lucide-react` (icons)
  - `next/navigation` (router)

**ΣΗΜΑΝΤΙΚΟ**: Μπορείς να πάρεις μόνο το **κομμάτι που αφορά τα ωράρια** (tab button + content), αν δεν θέλεις ολόκληρο το admin panel.

### 2. **Authentication Context** (Υποχρεωτικό)
📄 `contexts/AuthContext.tsx`
- **Τι κάνει**: Firebase Authentication context για login/logout
- **Dependencies**: 
  - `firebase/auth`
  - `@/lib/firebase` (για το `auth` export)

**Εναλλακτικά**: Αν έχεις ήδη authentication system, μπορείς να προσαρμόσεις το `useAuth` hook.

### 3. **Admin Sign-In Component** (Υποχρεωτικό)
📄 `components/ui/admin-sign-in.tsx`
- **Τι κάνει**: Sign-in form για admin users
- **Dependencies**: 
  - `useAuth` hook
  - `firebase/auth`

---

## 🔧 Minimal Admin Setup (Μόνο για Ωράρια)

Αν θέλεις **μόνο το admin panel για τα ωράρια** (χωρίς ολόκληρο admin system), μπορείς να δημιουργήσεις ένα απλό admin page:

### Option 1: Standalone Admin Page

```typescript
// app/admin-schedules/page.tsx
"use client"

import HolidayScheduleAdmin from '@/components/HolidayScheduleAdmin';

export default function AdminSchedulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ειδικά Ωράρια</h1>
        <HolidayScheduleAdmin />
      </div>
    </div>
  );
}
```

**Πλεονεκτήματα**:
- ✅ Απλό, standalone
- ✅ Δεν χρειάζεται authentication (αν δεν το θέλεις)
- ✅ Εύκολο setup

**Μειονεκτήματα**:
- ❌ Χωρίς authentication (οποιοσδήποτε μπορεί να το δει)
- ❌ Χωρίς navigation

### Option 2: With Authentication (Recommended)

```typescript
// app/admin-schedules/page.tsx
"use client"

import { useAuth } from '@/contexts/AuthContext';
import { AdminSignInPage } from '@/components/ui/admin-sign-in';
import HolidayScheduleAdmin from '@/components/HolidayScheduleAdmin';

export default function AdminSchedulesPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <AdminSignInPage heroImageSrc="/assets/logo.png" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ειδικά Ωράρια</h1>
        <HolidayScheduleAdmin />
      </div>
    </div>
  );
}
```

---

## 📋 Full Admin Panel Integration

Αν θέλεις να προσθέσεις το tab στο **υπάρχον admin panel**:

### Step 1: Add Import
```typescript
import HolidayScheduleAdmin from '@/components/HolidayScheduleAdmin';
import { Snowflake } from 'lucide-react';
```

### Step 2: Add Tab Button (Desktop)
```typescript
<button
  onClick={() => setActiveTab('christmas-schedule')}
  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
    activeTab === 'christmas-schedule'
      ? 'bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg'
      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
  }`}
>
  <Snowflake className="w-4 h-4" />
  <span>Ειδικά Ωράρια</span>
</button>
```

### Step 3: Add Tab Button (Mobile)
```typescript
<button
  onClick={() => setActiveTab('christmas-schedule')}
  className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-lg transition-all duration-300 col-span-2 sm:col-span-1 ${
    activeTab === 'christmas-schedule'
      ? 'bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg'
      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
  }`}
>
  <Snowflake className="w-5 h-5" />
  <span className="text-xs font-medium">Ειδικά Ωράρια</span>
</button>
```

### Step 4: Add Tab Content
```typescript
{activeTab === 'christmas-schedule' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <HolidayScheduleAdmin />
  </motion.div>
)}
```

---

## 🔥 Firebase Authentication Setup

### 1. Enable Authentication in Firebase Console
1. Πήγαινε στο Firebase Console
2. Authentication → Get Started
3. Enable **Email/Password** sign-in method

### 2. Create Admin User
1. Authentication → Users → Add User
2. Προσθήκη email/password για admin

### 3. Firestore Security Rules
Βεβαιώσου ότι τα rules επιτρέπουν writes μόνο για authenticated users:

```javascript
match /holiday_schedules/{document} {
  allow read: if true;
  allow write: if request.auth != null;  // Μόνο authenticated users
}
```

---

## 📦 Dependencies για Admin Panel

### Required:
```json
{
  "dependencies": {
    "firebase": "^10.x",
    "framer-motion": "^10.x",
    "lucide-react": "^0.x",
    "next": "^14.x",
    "react": "^18.x"
  }
}
```

---

## 🎯 Quick Setup Checklist

### Minimal Setup (Standalone):
- [ ] Copy `components/HolidayScheduleAdmin.tsx`
- [ ] Copy `hooks/useChristmasSchedule.ts`
- [ ] Create simple admin page (Option 1)
- [ ] Setup Firestore collection + rules
- [ ] Test create/edit/delete schedules

### With Authentication:
- [ ] Copy `contexts/AuthContext.tsx`
- [ ] Copy `components/ui/admin-sign-in.tsx`
- [ ] Copy `components/HolidayScheduleAdmin.tsx`
- [ ] Copy `hooks/useChristmasSchedule.ts`
- [ ] Create admin page with auth (Option 2)
- [ ] Setup Firebase Authentication
- [ ] Create admin user
- [ ] Setup Firestore collection + rules
- [ ] Test login → create/edit/delete schedules

### Full Integration:
- [ ] Copy όλα τα admin files
- [ ] Add tab button στο existing admin panel
- [ ] Add tab content
- [ ] Test integration

---

## 🔐 Authentication Alternatives

Αν **ΔΕΝ** θέλεις Firebase Authentication, μπορείς να:

1. **Remove Authentication**: 
   - Αφαίρεσε το `if (!user)` check
   - Αλλαξε τα Firestore rules σε `allow write: if true;` (για development)

2. **Use Different Auth System**:
   - Προσάρμοσε το `useAuth` hook
   - Προσάρμοσε το `AdminSignInPage` component

3. **Password Protection**:
   - Χρησιμοποίησε simple password check (ασφαλές μόνο για development)

---

## 📝 Code Snippets

### Minimal Admin Page (No Auth)
```typescript
"use client"

import HolidayScheduleAdmin from '@/components/HolidayScheduleAdmin';

export default function SchedulesAdmin() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ειδικά Ωράρια</h1>
        <HolidayScheduleAdmin />
      </div>
    </div>
  );
}
```

### With Simple Password Protection
```typescript
"use client"

import { useState } from 'react';
import HolidayScheduleAdmin from '@/components/HolidayScheduleAdmin';

const ADMIN_PASSWORD = 'your-secret-password'; // Change this!

export default function SchedulesAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Λάθος password!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ειδικά Ωράρια</h1>
        <HolidayScheduleAdmin />
      </div>
    </div>
  );
}
```

---

## ⚠️ Important Notes

1. **Security**: Αν χρησιμοποιείς authentication, βεβαιώσου ότι τα Firestore rules είναι σωστά ρυθμισμένα.

2. **Firebase Config**: Βεβαιώσου ότι το `lib/firebase.ts` έχει το σωστό Firebase configuration.

3. **Paths**: Update όλα τα imports ανάλογα με τη δομή του project σου.

4. **Styling**: Το admin panel χρησιμοποιεί Tailwind CSS. Βεβαιώσου ότι είναι configured.

---

## 🚀 Next Steps

1. Επίλεξε το setup που θέλεις (Minimal / With Auth / Full Integration)
2. Αντιγράψε τα απαραίτητα αρχεία
3. Setup Firebase Authentication (αν χρειάζεται)
4. Test το admin panel
5. Create πρώτο holiday schedule!

---

**Τελευταία ενημέρωση**: 2024



