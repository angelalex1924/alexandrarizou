export const emailTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Welcome new subscribers to the newsletter',
    subject: {
      el: 'Καλώς ήρθατε στο Alexandra Rizou hair-beauty & health services!',
      en: 'Welcome to Alexandra Rizou hair-beauty & health services!'
    },
    content: {
      el: `
        <h2 style="color: #6B9A7A; margin-bottom: 20px;">Καλώς ήρθατε στο Alexandra Rizou hair-beauty & health services!</h2>
        <p>Ευχαριστούμε που εγγραφήκατε στο newsletter μας! Θα λαμβάνετε τα τελευταία νέα, προσφορές και ενημερώσεις από το Alexandra Rizou hair-beauty & health services.</p>
        <p>Μείνετε συντονισμένοι για:</p>
        <ul>
          <li>Εξclusive προσφορές και εκπτώσεις</li>
          <li>Νέες υπηρεσίες και τεχνικές</li>
          <li>Ειδικά events και εκδηλώσεις</li>
          <li>Tips για την περιποίηση του μαλλιού</li>
        </ul>
        <p>Ευχαριστούμε για την εμπιστοσύνη σας!</p>
      `,
      en: `
        <h2 style="color: #6B9A7A; margin-bottom: 20px;">Welcome to Alexandra Rizou hair-beauty & health services!</h2>
        <p>Thank you for subscribing to our newsletter! You'll receive the latest news, offers, and updates from Alexandra Rizou hair-beauty & health services.</p>
        <p>Stay tuned for:</p>
        <ul>
          <li>Exclusive offers and discounts</li>
          <li>New services and techniques</li>
          <li>Special events and occasions</li>
          <li>Hair care tips and advice</li>
        </ul>
        <p>Thank you for your trust!</p>
      `
    }
  },
  {
    id: 'promotion',
    name: 'Promotion Email',
    description: 'Promotional offers and discounts',
    subject: {
      el: 'Εξclusive Προσφορά - Alexandra Rizou hair-beauty & health services',
      en: 'Exclusive Offer - Alexandra Rizou hair-beauty & health services'
    },
    content: {
      el: `
        <h2 style="color: #6B9A7A; margin-bottom: 20px;">Εξclusive Προσφορά!</h2>
        <p>Αποκτήστε το κλασικό look σας με την νέα προσφορά μας!</p>
        <div style="background: linear-gradient(135deg, #f0f7f4, #e8f0ec); padding: 20px; border-radius: 12px; margin: 20px 0; border: 2px solid rgba(107, 154, 122, 0.2);">
          <h3 style="color: #6B9A7A; margin-top: 0; font-weight: 600;">Τι περιλαμβάνει η προσφορά:</h3>
          <ul>
            <li>Κούρεμα + styling</li>
            <li>Πλύσιμο και περιποίηση</li>
            <li>Συμβουλές για το σπίτι</li>
          </ul>
        </div>
        <p><strong>Κλείστε το ραντεβού σας τώρα!</strong></p>
      `,
      en: `
        <h2 style="color: #6B9A7A; margin-bottom: 20px;">Exclusive Offer!</h2>
        <p>Get your classic look with our new offer!</p>
        <div style="background: linear-gradient(135deg, #f0f7f4, #e8f0ec); padding: 20px; border-radius: 12px; margin: 20px 0; border: 2px solid rgba(107, 154, 122, 0.2);">
          <h3 style="color: #6B9A7A; margin-top: 0; font-weight: 600;">What the offer includes:</h3>
          <ul>
            <li>Haircut + styling</li>
            <li>Wash and care</li>
            <li>Home care tips</li>
          </ul>
        </div>
        <p><strong>Book your appointment now!</strong></p>
      `
    }
  },
  {
    id: 'event',
    name: 'Event Email',
    description: 'Special events and occasions',
    subject: {
      el: 'Ειδική Εκδήλωση - Alexandra Rizou hair-beauty & health services',
      en: 'Special Event - Alexandra Rizou hair-beauty & health services'
    },
    content: {
      el: `
        <h2 style="color: #6B9A7A; margin-bottom: 20px;">Ειδική Εκδήλωση!</h2>
        <p>Σας προσκαλούμε σε μια μοναδική εκδήλωση στο Alexandra Rizou hair-beauty & health services!</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #6B9A7A; margin-top: 0;">Λεπτομέρειες:</h3>
          <p><strong>Ημερομηνία:</strong> [Ημερομηνία]</p>
          <p><strong>Ώρα:</strong> [Ώρα]</p>
          <p><strong>Τοποθεσία:</strong> Alexandra Rizou hair-beauty & health services, Ανδρέα Παπανδρέου 52, Χαλάνδρι 152 32</p>
        </div>
        <p>Κλείστε το ραντεβού σας για να συμμετάσχετε!</p>
      `,
      en: `
        <h2 style="color: #6B9A7A; margin-bottom: 20px;">Special Event!</h2>
        <p>We invite you to a unique event at Alexandra Rizou hair-beauty & health services!</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #6B9A7A; margin-top: 0;">Details:</h3>
          <p><strong>Date:</strong> [Date]</p>
          <p><strong>Time:</strong> [Time]</p>
          <p><strong>Location:</strong> Alexandra Rizou hair-beauty & health services, Andrea Papandreou 52, Chalandri 152 32</p>
        </div>
        <p>Book your appointment to participate!</p>
      `
    }
  },
  {
    id: 'review',
    name: 'Review Request',
    description: 'Request customer reviews',
    subject: {
      el: 'Αξιολογήστε μας - Alexandra Rizou hair-beauty & health services',
      en: 'Review Us - Alexandra Rizou hair-beauty & health services'
    },
    content: {
      el: `
        <h2 style="color: #6B9A7A; margin-bottom: 20px;">Αξιολογήστε μας!</h2>
        <p>Ευχαριστούμε που επισκεφτήκατε το Alexandra Rizou hair-beauty & health services!</p>
        <p>Θα μας ενθουσίαζε να ακούσουμε την εμπειρία σας. Παρακαλούμε αφήστε μας μια αξιολόγηση!</p>
      `,
      en: `
        <h2 style="color: #6B9A7A; margin-bottom: 20px;">Review Us!</h2>
        <p>Thank you for visiting Alexandra Rizou hair-beauty & health services!</p>
        <p>We would love to hear about your experience. Please leave us a review!</p>
      `
    }
  },
  {
    id: 'christmas',
    name: 'Christmas Email',
    description: 'Christmas greetings and special offers',
    subject: {
      el: 'Καλά Χριστούγεννα από το Alexandra Rizou hair-beauty & health services!',
      en: 'Merry Christmas from Alexandra Rizou hair-beauty & health services!'
    },
    content: {
      el: `
        <h2>Καλά Χριστούγεννα!</h2>
        <p>Η ομάδα του Alexandra Rizou hair-beauty & health services σας εύχεται Καλά Χριστούγεννα και ευτυχισμένο το νέο έτος!</p>
        <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border: 2px solid #dc2626; color: #dc2626; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: #991b1b; margin: 0 0 15px 0; font-size: 22px;">🎄 Χριστουγεννιάτικες Προσφορές 🎄</h3>
          <p style="color: #7f1d1d; font-size: 16px; margin: 0;">Ανακαλύψτε τις ειδικές μας προσφορές για τις γιορτές!</p>
        </div>
        <p>Ευχαριστούμε για την εμπιστοσύνη σας και σας περιμένουμε!</p>
      `,
      en: `
        <h2>Merry Christmas!</h2>
        <p>The Alexandra Rizou hair-beauty & health services team wishes you a Merry Christmas and a Happy New Year!</p>
        <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border: 2px solid #dc2626; color: #dc2626; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: #991b1b; margin: 0 0 15px 0; font-size: 22px;">🎄 Christmas Offers 🎄</h3>
          <p style="color: #7f1d1d; font-size: 16px; margin: 0;">Discover our special holiday offers!</p>
        </div>
        <p>Thank you for your trust and we look forward to seeing you!</p>
      `
    }
  },
  {
    id: 'newyear',
    name: 'New Year Email',
    description: 'New Year greetings and special offers',
    subject: {
      el: 'Καλή Πρωτοχρονιά από το Alexandra Rizou hair-beauty & health services!',
      en: 'Happy New Year from Alexandra Rizou hair-beauty & health services!'
    },
    content: {
      el: `
        <h2>Καλή Πρωτοχρονιά!</h2>
        <p>Η ομάδα του Alexandra Rizou hair-beauty & health services σας εύχεται Καλή Πρωτοχρονιά!</p>
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #d4af37; color: #d4af37; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: #b8941f; margin: 0 0 15px 0; font-size: 22px;">🎉 Πρωτοχρονιάτικες Προσφορές 🎉</h3>
          <p style="color: #856404; font-size: 16px; margin: 0;">Ξεκινήστε το νέο έτος με το καλύτερο look!</p>
        </div>
        <p>Ευχαριστούμε για την εμπιστοσύνη σας και σας περιμένουμε!</p>
      `,
      en: `
        <h2>Happy New Year!</h2>
        <p>The Alexandra Rizou hair-beauty & health services team wishes you a Happy New Year!</p>
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #d4af37; color: #d4af37; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: #b8941f; margin: 0 0 15px 0; font-size: 22px;">🎉 New Year Offers 🎉</h3>
          <p style="color: #856404; font-size: 16px; margin: 0;">Start the new year with the best look!</p>
        </div>
        <p>Thank you for your trust and we look forward to seeing you!</p>
      `
    }
  },
  {
    id: 'easter',
    name: 'Easter Email',
    description: 'Easter greetings and special offers',
    subject: {
      el: 'Καλό Πάσχα από το Alexandra Rizou hair-beauty & health services!',
      en: 'Happy Easter from Alexandra Rizou hair-beauty & health services!'
    },
    content: {
      el: `
        <h2>Καλό Πάσχα!</h2>
        <p>Η ομάδα του Alexandra Rizou hair-beauty & health services σας εύχεται Καλό Πάσχα και Καλή Ανάσταση!</p>
        <div style="background: linear-gradient(135deg, #fef9e7 0%, #fcf3cf 100%); border: 2px solid #f59e0b; color: #f59e0b; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: #d97706; margin: 0 0 15px 0; font-size: 22px;">🐰 Πασχαλινές Προσφορές 🐰</h3>
          <p style="color: #b45309; font-size: 16px; margin: 0;">Ανακαλύψτε τις ειδικές μας προσφορές για το Πάσχα!</p>
        </div>
        <p>Ευχαριστούμε για την εμπιστοσύνη σας και σας περιμένουμε!</p>
      `,
      en: `
        <h2>Happy Easter!</h2>
        <p>The Alexandra Rizou hair-beauty & health services team wishes you a Happy Easter!</p>
        <div style="background: linear-gradient(135deg, #fef9e7 0%, #fcf3cf 100%); border: 2px solid #f59e0b; color: #f59e0b; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: #d97706; margin: 0 0 15px 0; font-size: 22px;">🐰 Easter Offers 🐰</h3>
          <p style="color: #b45309; font-size: 16px; margin: 0;">Discover our special Easter offers!</p>
        </div>
        <p>Thank you for your trust and we look forward to seeing you!</p>
      `
    }
  },
  {
    id: 'summer',
    name: 'Summer Email',
    description: 'Summer greetings and special offers',
    subject: {
      el: 'Καλό Καλοκαίρι από το Alexandra Rizou hair-beauty & health services!',
      en: 'Happy Summer from Alexandra Rizou hair-beauty & health services!'
    },
    content: {
      el: `
        <h2>Καλό Καλοκαίρι!</h2>
        <p>Η ομάδα του Alexandra Rizou hair-beauty & health services σας εύχεται ένα υπέροχο και δροσερό καλοκαίρι!</p>
        <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%); border: 2px solid #0ea5e9; color: #0ea5e9; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: #0284c7; margin: 0 0 15px 0; font-size: 22px;">☀️ Καλοκαιρινές Προσφορές ☀️</h3>
          <p style="color: #0369a1; font-size: 16px; margin: 0;">Ανανεώστε το look σας για το καλοκαίρι με τις ειδικές μας προσφορές!</p>
        </div>
        <p>Επισκεφθείτε μας για το τέλειο καλοκαιρινό look!</p>
      `,
      en: `
        <h2>Happy Summer!</h2>
        <p>The Alexandra Rizou hair-beauty & health services team wishes you a wonderful and cool summer!</p>
        <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%); border: 2px solid #0ea5e9; color: #0ea5e9; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: #0284c7; margin: 0 0 15px 0; font-size: 22px;">☀️ Summer Offers ☀️</h3>
          <p style="color: #0369a1; font-size: 16px; margin: 0;">Refresh your look for summer with our special offers!</p>
        </div>
        <p>Visit us for the perfect summer look!</p>
      `
    }
  },
  {
    id: 'autumn',
    name: 'Autumn Email',
    description: 'Autumn greetings and special offers',
    subject: {
      el: 'Καλό Φθινόπωρο από το Alexandra Rizou hair-beauty & health services!',
      en: 'Happy Autumn from Alexandra Rizou hair-beauty & health services!'
    },
    content: {
      el: `
        <h2>Καλό Φθινόπωρο!</h2>
        <p>Η ομάδα του Alexandra Rizou hair-beauty & health services σας εύχεται ένα όμορφο φθινόπωρο!</p>
        <div style="background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%); border: 2px solid #f97316; color: #f97316; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: #ea580c; margin: 0 0 15px 0; font-size: 22px;">🍂 Φθινοπωρινές Προσφορές 🍂</h3>
          <p style="color: #c2410c; font-size: 16px; margin: 0;">Ετοιμαστείτε για το φθινόπωρο με τις ειδικές μας προσφορές!</p>
        </div>
        <p>Επισκεφθείτε μας για ένα φρέσκο φθινοπωρινό look!</p>
      `,
      en: `
        <h2>Happy Autumn!</h2>
        <p>The Alexandra Rizou hair-beauty & health services team wishes you a beautiful autumn!</p>
        <div style="background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%); border: 2px solid #f97316; color: #f97316; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: #ea580c; margin: 0 0 15px 0; font-size: 22px;">🍂 Autumn Offers 🍂</h3>
          <p style="color: #c2410c; font-size: 16px; margin: 0;">Get ready for autumn with our special offers!</p>
        </div>
        <p>Visit us for a fresh autumn look!</p>
      `
    }
  }
]

export const getTemplateContent = (templateId: string, language: string) => {
  const template = emailTemplates.find(t => t.id === templateId)
  if (!template) return null
  
  return {
    subject: template.subject[language as keyof typeof template.subject] || template.subject.el,
    content: template.content[language as keyof typeof template.content] || template.content.el
  }
}
