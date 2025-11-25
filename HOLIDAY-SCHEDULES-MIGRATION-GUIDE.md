# 📋 Οδηγός Μεταφοράς Συστήματος Ειδικών Ωραρίων

Αυτός ο οδηγός περιγράφει **όλα τα αρχεία, routes, dependencies και ρυθμίσεις** που χρειάζονται για να μεταφέρεις το σύστημα ειδικών ωραρίων (Holiday Schedules) σε άλλο project.

---

## 📁 Αρχεία που πρέπει να πάρεις

### 1. **Hook - Custom React Hook**
📄 `hooks/useChristmasSchedule.ts`
- **Τι κάνει**: Custom hook που φέρνει τα active holiday schedules από Firestore
- **Dependencies**: `react`, `firebase/firestore`
- **Exports**: 
  - `HolidaySchedule` interface
  - `ChristmasSchedule` interface (backward compatibility)
  - `useChristmasSchedule()` hook

### 2. **Admin Component**
📄 `components/HolidayScheduleAdmin.tsx`
- **Τι κάνει**: Admin panel για διαχείριση ωραρίων (δημιουργία, επεξεργασία, διαγραφή, ενεργοποίηση)
- **Dependencies**: 
  - `react`, `framer-motion`
  - `firebase/firestore`
  - `lucide-react` (icons)
  - `@/hooks/useChristmasSchedule` (για το interface)
  - `@/lib/firebase` (για το `db`)

### 3. **Components που χρησιμοποιούν τα ωράρια**

#### 📄 `components/Footer.tsx`
- **Τι χρειάζεται**: 
  - Import: `import { useChristmasSchedule } from "@/hooks/useChristmasSchedule";`
  - Χρήση: `const { schedule, isActive, getHoursForDay, getHolidayStyle } = useChristmasSchedule();`
  - Χρησιμοποιείται για να εμφανίζει τα ειδικά ωράρια στο footer

#### 📄 `components/Navigation.tsx`
- **Τι χρειάζεται**: 
  - Import: `import { useChristmasSchedule } from "@/hooks/useChristmasSchedule";`
  - Χρήση: `const { schedule, isActive, getHoursForDay, getHolidayStyle } = useChristmasSchedule();`
  - Χρησιμοποιείται για να εμφανίζει τα ειδικά ωράρια στο mobile navigation

#### 📄 `app/page.tsx` (Home Page)
- **Τι χρειάζεται**: 
  - Import: `import { useChristmasSchedule } from "@/hooks/useChristmasSchedule";`
  - Χρήση: `const { schedule, isActive, getHoursForDay, getHolidayStyle } = useChristmasSchedule();`
  - Χρησιμοποιείται για να εμφανίζει τα ειδικά ωράρια στην home page

### 4. **Admin Page Integration**
📄 `app/admin/page.tsx`
- **Τι χρειάζεται**: 
  - Import: `import HolidayScheduleAdmin from '@/components/HolidayScheduleAdmin';`
  - Χρήση: `<HolidayScheduleAdmin />` μέσα σε tab/panel

---

## 🔥 Firestore Setup

### 1. **Firestore Collection**
- **Collection Name**: `holiday_schedules`
- **Document Structure**:
```typescript
{
  name: string;                    // π.χ. "Χριστουγεννιάτικο Ωράριο 2024"
  type: 'christmas' | 'newyear' | 'easter' | 'other';
  isActive: boolean;                // Ποιο ωράριο είναι ενεργό
  isClosed: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  schedule: {
    monday: string;                 // π.χ. "10:00-18:00"
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  dates: {
    monday: string;                 // ISO date string (προαιρετικό)
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
```

### 2. **Firestore Security Rules**
📄 `firestore.rules`
- **Προσθήκη στο rules file**:
```javascript
// Allow reads for holiday_schedules collection
match /holiday_schedules/{document} {
  allow read: if true;
  // Only allow writes from authenticated admin users
  allow write: if request.auth != null;
}
```

**ΣΗΜΑΝΤΙΚΟ**: Αν δεν έχεις authentication, μπορείς να αλλάξεις το `allow write` σε `allow write: if true;` (για development) ή να χρησιμοποιήσεις Admin SDK.

### 3. **Firebase Configuration**
📄 `lib/firebase.ts`
- **Τι χρειάζεται**: 
  - Firebase initialization με `getFirestore`
  - Export του `db` object

**Παράδειγμα**:
```typescript
import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app);
```

---

## 📦 Dependencies (package.json)

### Required Packages:
```json
{
  "dependencies": {
    "react": "^18.x",
    "firebase": "^10.x",
    "framer-motion": "^10.x",
    "lucide-react": "^0.x"
  }
}
```

**ΣΗΜΑΝΤΙΚΟ**: Βεβαιώσου ότι έχεις:
- `firebase` package installed
- Firebase project configured
- Firestore enabled στο Firebase Console

---

## 🎨 Styling & UI

### Tailwind CSS Classes
Το σύστημα χρησιμοποιεί **Tailwind CSS** για styling. Βεβαιώσου ότι έχεις:
- Tailwind CSS configured
- Dark mode support (optional, αλλά χρησιμοποιείται)

### Dynamic Styling
Το hook `useChristmasSchedule` επιστρέφει `getHolidayStyle()` που περιέχει:
- **Christmas**: Red-Green gradient colors
- **New Year**: Yellow-Amber gradient colors  
- **Easter**: Green-Pink gradient colors
- **Other**: Purple-Indigo gradient colors

---

## 🔧 Integration Steps

### Step 1: Copy Files
1. Αντιγράψε `hooks/useChristmasSchedule.ts` → `your-project/hooks/useChristmasSchedule.ts`
2. Αντιγράψε `components/HolidayScheduleAdmin.tsx` → `your-project/components/HolidayScheduleAdmin.tsx`

### Step 2: Update Imports
Σε όλα τα αρχεία που αντιγράφεις, ενημέρωσε τα imports:
- `@/hooks/useChristmasSchedule` → `./hooks/useChristmasSchedule` (ή το path που χρησιμοποιείς)
- `@/lib/firebase` → `./lib/firebase` (ή το path που χρησιμοποιείς)

### Step 3: Setup Firestore
1. Δημιούργησε το collection `holiday_schedules` στο Firestore
2. Προσθήκη security rules (βλέπε παραπάνω)
3. Βεβαιώσου ότι το `db` export από `lib/firebase.ts` είναι accessible

### Step 4: Integrate in Components
Σε κάθε component που θέλεις να εμφανίζει τα ωράρια:

```typescript
import { useChristmasSchedule } from "@/hooks/useChristmasSchedule";

// Μέσα στο component:
const { schedule, isActive, getHoursForDay, getHolidayStyle } = useChristmasSchedule();
const holidayStyle = getHolidayStyle();

// Χρήση:
// - isActive: boolean (αν υπάρχει active schedule)
// - getHoursForDay('monday', 'el'): string | null (ώρες για συγκεκριμένη μέρα)
// - holidayStyle: object με colors, icon, title (για styling)
```

### Step 5: Add Admin Panel
Στο admin page σου:
```typescript
import HolidayScheduleAdmin from '@/components/HolidayScheduleAdmin';

// Μέσα στο render:
<HolidayScheduleAdmin />
```

---

## 📝 Usage Examples

### Example 1: Display Holiday Hours in Footer
```typescript
const { getHoursForDay, isActive } = useChristmasSchedule();

// Για κάθε μέρα:
const mondayHours = getHoursForDay('monday', language);
// Returns: "10:00-18:00" ή "Κλειστά" ή null (αν δεν υπάρχει active schedule)
```

### Example 2: Apply Holiday Styling
```typescript
const { getHolidayStyle } = useChristmasSchedule();
const holidayStyle = getHolidayStyle();

// Χρήση:
<div className={`${holidayStyle.colors.bg} ${holidayStyle.colors.border}`}>
  <span>{holidayStyle.icon}</span>
  <h2>{holidayStyle.title?.el}</h2>
</div>
```

### Example 3: Check if Holiday Schedule is Active
```typescript
const { isActive } = useChristmasSchedule();

if (isActive) {
  // Εμφάνισε ειδικό styling
} else {
  // Εμφάνισε κανονικό ωράριο
}
```

---

## ⚠️ Important Notes

1. **Firestore Index**: Δεν χρειάζεται composite index γιατί το query είναι απλό (`where('isActive', '==', true)`)

2. **Real-time Updates**: Το hook χρησιμοποιεί `onSnapshot` για real-time updates. Αν δεν θέλεις real-time, μπορείς να αλλάξεις σε `getDocs`.

3. **Authentication**: Το admin component χρειάζεται authenticated user για writes. Αν δεν έχεις auth, μπορείς να αλλάξεις τα security rules.

4. **Language Support**: Το hook υποστηρίζει ελληνικά (`'el'`) και αγγλικά (`'en'`). Αν χρειάζεσαι άλλες γλώσσες, πρόσθεσε τις στο `getHoursForDay`.

5. **Multiple Active Schedules**: Το σύστημα υποστηρίζει μόνο ένα active schedule τη φορά. Όταν ενεργοποιείς ένα, όλα τα άλλα απενεργοποιούνται αυτόματα.

---

## 🚀 Quick Start Checklist

- [ ] Copy `hooks/useChristmasSchedule.ts`
- [ ] Copy `components/HolidayScheduleAdmin.tsx`
- [ ] Update imports σε όλα τα αρχεία
- [ ] Setup Firestore collection `holiday_schedules`
- [ ] Add Firestore security rules
- [ ] Install dependencies (`firebase`, `framer-motion`, `lucide-react`)
- [ ] Integrate hook σε components (Footer, Navigation, Home)
- [ ] Add admin panel component
- [ ] Test create/edit/delete/activate schedules
- [ ] Test display στα frontend components

---

## 📞 Support

Αν έχεις προβλήματα:
1. Έλεγξε ότι το Firebase είναι properly configured
2. Έλεγξε τα Firestore security rules
3. Έλεγξε τα imports και paths
4. Έλεγξε το browser console για errors

---

**Τελευταία ενημέρωση**: 2024



