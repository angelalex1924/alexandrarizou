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
