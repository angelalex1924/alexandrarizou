# ✅ Checklist Αρχείων για Μεταφορά Συστήματος Ωραρίων

## 📋 Αρχεία που ΠΡΕΠΕΙ να πάρεις:

### 🔧 Core Files (Υποχρεωτικά)
1. ✅ `hooks/useChristmasSchedule.ts` - Custom hook για τα ωράρια
2. ✅ `components/HolidayScheduleAdmin.tsx` - Admin panel component

### 🔐 Admin Panel Files (Επιλογικά - αν θέλεις authentication)
3. ⚠️ `contexts/AuthContext.tsx` - Firebase Authentication context
4. ⚠️ `components/ui/admin-sign-in.tsx` - Sign-in component
5. ⚠️ `app/admin/page.tsx` - Admin page (ή μόνο το κομμάτι για τα ωράρια)

**ΣΗΜΑΝΤΙΚΟ**: Μπορείς να δημιουργήσεις ένα **απλό standalone admin page** χωρίς authentication (δες `ADMIN-PANEL-SETUP-GUIDE.md`)

### 🎨 Frontend Components (Επιλογικά - μόνο αν θέλεις να εμφανίζονται)
6. ⚠️ `components/Footer.tsx` - Αν θέλεις ωράρια στο footer
7. ⚠️ `components/Navigation.tsx` - Αν θέλεις ωράρια στο mobile nav
8. ⚠️ `app/page.tsx` - Αν θέλεις ωράρια στην home page

### 🔥 Firebase Configuration
9. ✅ `lib/firebase.ts` - Firebase initialization (ή το δικό σου)
10. ✅ `firestore.rules` - Security rules (μόνο το κομμάτι για `holiday_schedules`)

### 📝 Documentation
11. 📖 `HOLIDAY-SCHEDULES-MIGRATION-GUIDE.md` - Πλήρης οδηγός
12. 📖 `ADMIN-PANEL-SETUP-GUIDE.md` - Οδηγός για admin panel setup

---

## 🚀 Quick Copy Commands

### Αν χρησιμοποιείς Git:
```bash
# Copy core files
cp hooks/useChristmasSchedule.ts /path/to/new-project/hooks/
cp components/HolidayScheduleAdmin.tsx /path/to/new-project/components/
```

### Αν χρησιμοποιείς File Explorer:
Αντιγράψε τα αρχεία:
- `hooks/useChristmasSchedule.ts`
- `components/HolidayScheduleAdmin.tsx`

---

## 📦 Dependencies που χρειάζονται:

```json
{
  "firebase": "^10.x",
  "framer-motion": "^10.x",
  "lucide-react": "^0.x"
}
```

---

## 🔥 Firestore Setup:

1. **Collection**: `holiday_schedules`
2. **Security Rules**: Δες `firestore.rules` (γραμμές 24-29)
3. **Index**: Δεν χρειάζεται composite index

---

## ⚡ Quick Integration:

### Minimal Setup (Standalone Admin):
1. Αντιγράψε τα 2 core files (`useChristmasSchedule.ts`, `HolidayScheduleAdmin.tsx`)
2. Δημιούργησε απλό admin page (δες `ADMIN-PANEL-SETUP-GUIDE.md` - Option 1)
3. Update imports (paths)
4. Setup Firestore collection + rules
5. Install dependencies
6. Test!

### With Authentication:
1. Αντιγράψε τα core files + admin files (`AuthContext.tsx`, `admin-sign-in.tsx`)
2. Δημιούργησε admin page με auth (δες `ADMIN-PANEL-SETUP-GUIDE.md` - Option 2)
3. Setup Firebase Authentication
4. Create admin user
5. Setup Firestore collection + rules
6. Test!

### Full Integration (Frontend + Admin):
1. Αντιγράψε όλα τα files
2. Integrate hook σε components (Footer, Navigation, Home)
3. Add admin panel (standalone ή σε existing admin)
4. Setup Firestore + Authentication
5. Test!

**Δες τα guides για λεπτομέρειες:**
- `HOLIDAY-SCHEDULES-MIGRATION-GUIDE.md` - Γενικός οδηγός
- `ADMIN-PANEL-SETUP-GUIDE.md` - Admin panel setup

