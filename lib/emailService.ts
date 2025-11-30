import nodemailer from 'nodemailer';
import path from 'path';
import { generateTemplateEmailHTML } from './emailTemplateGenerator';

// Gmail SMTP Configuration for customer emails and newsletters
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ar.hairbeauty.healthservices@gmail.com',
    pass: 'gmsaftgbiqbbgfst'
  }
});

// Gmail SMTP Configuration for admin emails (reviews, templates, shop notifications)
const adminGmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alexandrarizoucoiffure@gmail.com',
    pass: 'xgsi lpct tble mpog'
  }
});

export interface AppointmentData {
  customerName: string;
  customerEmail: string;
  service: string;
  price: string;
  date: string;
  time: string;
  phone?: string;
  appointmentId?: string;
  notes?: string | null;
  employeeNames?: string[] | null;
}

export const sendAppointmentConfirmation = async (appointmentData: AppointmentData) => {
  try {
    // Verify connection configuration
    await gmailTransporter.verify();
    console.log("Gmail SMTP server is ready to take our messages");

    const mailOptions = {
      from: '"Alexandra Rizou hair-beauty & health services" <ar.hairbeauty.healthservices@gmail.com>',
      to: appointmentData.customerEmail,
      subject: `Επιβεβαίωση Ραντεβού - ${appointmentData.service}`,
      html: generateAppointmentEmailHTML(appointmentData),
      text: generateAppointmentEmailText(appointmentData)
    };

    const info = await gmailTransporter.sendMail(mailOptions);
    console.log("Appointment confirmation email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending appointment confirmation email:", error);
    return { success: false, error: error };
  }
};

export const sendAppointmentNotificationToShop = async (appointmentData: AppointmentData) => {
  try {
    await adminGmailTransporter.verify();

    const logoPath = path.join(process.cwd(), 'public', 'ACRONFLOW-FULL.png');
    const copyrightPath = path.join(process.cwd(), 'public', 'acronweb-copyright.png');

    const mailOptions = {
      from: '"AcronFlow CRM" <alexandrarizoucoiffure@gmail.com>',
      to: 'ar.hairbeauty.healthservices@gmail.com',
      subject: `Νέο επιβεβαιωμένο ραντεβού - ${appointmentData.customerName}`,
      html: generateShopNotificationHTML(appointmentData),
      text: generateShopNotificationText(appointmentData),
      attachments: [
        {
          filename: 'ACRONFLOW-FULL.png',
          path: logoPath,
          cid: 'acronflowLogo'
        },
        {
          filename: 'acronweb-copyright.png',
          path: copyrightPath,
          cid: 'acronwebCopyright'
        }
      ]
    };

    const info = await adminGmailTransporter.sendMail(mailOptions);
    console.log('Appointment notification email sent to shop:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending appointment notification email to shop:', error);
    return { success: false, error: error };
  }
};

export interface ReviewEmailData {
  emails: string[];
  subject: string;
  message: string;
}

export interface TemplateEmailData {
  emails: string[];
  templateId: string;
  customSubject?: string;
  customMessage?: string;
  customization?: any;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

import { emailTemplates } from './email-templates'

export const sendReviewRequest = async (reviewData: ReviewEmailData) => {
  try {
    // Verify connection configuration (optional - continue even if verify fails)
    try {
      await adminGmailTransporter.verify();
      console.log("Gmail SMTP server is ready to take our messages");
    } catch (verifyError) {
      console.warn("Gmail SMTP verification failed, but continuing:", verifyError);
      // Continue anyway - sometimes verify fails but sending still works
    }

    const results = [];
    const errors = [];

    // Send emails to each recipient
    for (const email of reviewData.emails) {
      try {
        const mailOptions = {
          from: '"Alexandra Rizou hair-beauty & health services" <alexandrarizoucoiffure@gmail.com>',
          to: email,
          subject: reviewData.subject,
          html: generateReviewEmailHTML(reviewData.message),
          text: reviewData.message
        };

        const info = await adminGmailTransporter.sendMail(mailOptions);
        console.log(`Review request email sent to ${email}:`, info.messageId);
        results.push({ email, messageId: info.messageId, success: true });
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ email, error: errorMessage });
      }
    }

    // Return success if at least one email was sent
    if (results.length > 0) {
    return {
      success: true,
      sent: results.length,
      errors: errors.length,
      results
    };
    } else {
      return {
        success: false,
        error: `Failed to send all emails. Errors: ${errors.map(e => e.error).join(', ')}`,
        sent: results.length,
        errors: errors.length,
        results
      };
    }

  } catch (error) {
    console.error("Error in sendReviewRequest:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

export const sendTemplateEmail = async (templateData: TemplateEmailData) => {
  try {
    // Verify connection configuration (optional - continue even if verify fails)
    try {
      await adminGmailTransporter.verify();
      console.log("Gmail SMTP server is ready to take our messages");
    } catch (verifyError) {
      console.warn("Gmail SMTP verification failed, but continuing:", verifyError);
      // Continue anyway - sometimes verify fails but sending still works
    }

    // Find the template
    const template = emailTemplates.find(t => t.id === templateData.templateId);
    if (!template) {
      return { 
        success: false, 
        error: `Template with id ${templateData.templateId} not found` 
      };
    }

    const results = [];
    const errors = [];

    // Send emails to each recipient
    for (const email of templateData.emails) {
      try {
        // Handle subject (can be string or object with el/en)
        let subject = templateData.customSubject
        if (!subject) {
          if (typeof template.subject === 'string') {
            subject = template.subject
          } else if (typeof template.subject === 'object' && template.subject.el) {
            subject = template.subject.el
          } else if (typeof template.subject === 'object' && template.subject.en) {
            subject = template.subject.en
          } else {
            subject = 'Email from Alexandra Rizou'
          }
        }

        // Handle message/content (can be string or object with el/en, or use customMessage)
        let message = templateData.customMessage
        if (!message) {
          if (typeof template.content === 'string') {
            message = template.content
          } else if (typeof template.content === 'object' && template.content.el) {
            message = template.content.el
          } else if (typeof template.content === 'object' && template.content.en) {
            message = template.content.en
          } else {
            message = ''
          }
        }

        // Get colors and baseTemplateId from customization if available
        const colors = templateData.customization?.colors || {}
        const baseTemplateId = templateData.templateId || template.id

        const mailOptions = {
          from: '"Alexandra Rizou hair-beauty & health services" <alexandrarizoucoiffure@gmail.com>',
          to: email,
          subject: subject,
          html: generateTemplateEmailHTML(message, template.name, colors, baseTemplateId),
          text: message
        };

        const info = await adminGmailTransporter.sendMail(mailOptions);
        console.log(`Template email sent to ${email}:`, info.messageId);
        results.push({ email, messageId: info.messageId, success: true });
      } catch (error) {
        console.error(`Error sending template email to ${email}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ email, error: errorMessage });
      }
    }

    // Return success if at least one email was sent, or if there were no errors
    if (results.length > 0 || errors.length === 0) {
    return {
      success: true,
      sent: results.length,
      errors: errors.length,
      results,
      template: template.name
    };
    } else {
      return {
        success: false,
        error: `Failed to send all emails. Errors: ${errors.map(e => e.error).join(', ')}`,
        sent: results.length,
        errors: errors.length,
        results
      };
    }

  } catch (error) {
    console.error("Error in sendTemplateEmail:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

export const sendContactFormEmail = async (contactData: ContactFormData) => {
  try {
    await adminGmailTransporter.verify();
    console.log("Gmail SMTP server is ready to take our messages");

    const subjectLabels: { [key: string]: string } = {
      'appointment': 'Κλείσιμο Ραντεβού',
      'services': 'Ερώτηση για Υπηρεσίες',
      'pricing': 'Ερώτηση για Τιμές',
      'hours': 'Ερώτηση για Ωράριο',
      'location': 'Ερώτηση για Τοποθεσία',
      'complaint': 'Παράπονο',
      'compliment': 'Επαίνος',
      'other': 'Άλλο'
    };

    const subjectLabelsEN: { [key: string]: string } = {
      'appointment': 'Book Appointment',
      'services': 'Question about Services',
      'pricing': 'Question about Prices',
      'hours': 'Question about Hours',
      'location': 'Question about Location',
      'complaint': 'Complaint',
      'compliment': 'Compliment',
      'other': 'Other'
    };

    const subjectLabel = subjectLabels[contactData.subject] || subjectLabelsEN[contactData.subject] || contactData.subject;

    const mailOptions = {
      from: '"Alexandra Rizou hair-beauty & health services Contact Form" <alexandrarizoucoiffure@gmail.com>',
      to: 'alexandrarizoucoiffure@gmail.com',
      replyTo: contactData.email,
      subject: `Νέο μήνυμα επικοινωνίας: ${subjectLabel} - ${contactData.name}`,
      html: generateContactFormHTML(contactData, subjectLabel),
      text: generateContactFormText(contactData, subjectLabel)
    };

    const info = await adminGmailTransporter.sendMail(mailOptions);
    console.log("Contact form email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending contact form email:", error);
    return { success: false, error: error };
  }
};

const generateContactFormHTML = (data: ContactFormData, subjectLabel: string) => {
  return `
    <!DOCTYPE html>
    <html lang="el">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Νέο Μήνυμα Επικοινωνίας</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #1f2933;
                max-width: 640px;
                margin: 0 auto;
                padding: 32px 16px;
                background-color: #f4f4f4;
            }
            .card {
                background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
                border-radius: 18px;
                padding: 36px;
                box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
                border: 2px solid #6B9A7A;
            }
            .header {
                text-align: center;
                margin-bottom: 28px;
                padding-bottom: 20px;
                border-bottom: 3px solid #6B9A7A;
            }
            .header h1 {
                color: #6B9A7A;
                font-size: 28px;
                margin: 0 0 10px 0;
                font-weight: 700;
            }
            .badge {
                display: inline-block;
                background: rgba(212, 175, 55, 0.15);
                color: #5a7a6a;
                border: 1px solid #6B9A7A;
                padding: 6px 14px;
                border-radius: 999px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                margin-bottom: 18px;
            }
            .details {
                background: rgba(248, 249, 250, 0.8);
                border-radius: 16px;
                padding: 28px;
                border: 1px solid #e9ecef;
                margin-bottom: 30px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 14px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                color: #495057;
                font-weight: 600;
                font-size: 15px;
                min-width: 120px;
            }
            .detail-value {
                color: #212529;
                font-size: 15px;
                font-weight: 500;
                flex: 1;
                text-align: right;
            }
            .message-box {
                background: #ffffff;
                border: 2px solid #6B9A7A;
                border-radius: 12px;
                padding: 20px;
                margin-top: 20px;
            }
            .message-box h3 {
                color: #6B9A7A;
                margin-top: 0;
                margin-bottom: 15px;
                font-size: 18px;
            }
            .message-content {
                color: #212529;
                font-size: 15px;
                line-height: 1.8;
                white-space: pre-wrap;
            }
            .footer {
                margin-top: 36px;
                text-align: center;
                color: #6c757d;
                font-size: 13px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
            }
            .reply-button {
                display: inline-block;
                background: linear-gradient(135deg, #6B9A7A, #f0c24c);
                color: #1f2933;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                margin-top: 20px;
            }
            @media (max-width: 500px) {
                body {
                    padding: 24px 12px;
                }
                .card {
                    padding: 28px 20px;
                }
                .detail-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 6px;
                }
                .detail-value {
                    text-align: left;
                }
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <div class="badge">Νέο μήνυμα επικοινωνίας</div>
                <h1>Μήνυμα από τη φόρμα επικοινωνίας</h1>
            </div>

            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Όνομα:</span>
                    <span class="detail-value">${data.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value"><a href="mailto:${data.email}" style="color: #6B9A7A; text-decoration: none;">${data.email}</a></span>
                </div>
                ${data.phone ? `
                <div class="detail-row">
                    <span class="detail-label">Τηλέφωνο:</span>
                    <span class="detail-value"><a href="tel:${data.phone}" style="color: #6B9A7A; text-decoration: none;">${data.phone}</a></span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Θέμα:</span>
                    <span class="detail-value">${subjectLabel}</span>
                </div>
            </div>

            <div class="message-box">
                <h3>📝 Μήνυμα:</h3>
                <div class="message-content">${data.message.replace(/\n/g, '<br>')}</div>
            </div>

            <div class="footer">
                <p>Αυτό το μήνυμα στάλθηκε από τη φόρμα επικοινωνίας του Alexandra Rizou hair-beauty & health services.</p>
                <p>Μπορείτε να απαντήσετε απευθείας σε αυτό το email για να επικοινωνήσετε με τον πελάτη.</p>
                <a href="mailto:${data.email}?subject=Re: ${subjectLabel}" class="reply-button">Απάντηση στον πελάτη</a>
            </div>
        </div>
    </body>
    </html>
  `;
};

const generateContactFormText = (data: ContactFormData, subjectLabel: string) => {
  return `
Νέο μήνυμα επικοινωνίας από τη φόρμα Alexandra Rizou hair-beauty & health services

Όνομα: ${data.name}
Email: ${data.email}
${data.phone ? `Τηλέφωνο: ${data.phone}` : ''}
Θέμα: ${subjectLabel}

Μήνυμα:
${data.message}

---
Αυτό το μήνυμα στάλθηκε από τη φόρμα επικοινωνίας.
Μπορείτε να απαντήσετε απευθείας σε αυτό το email.
  `;
};

const generateAppointmentEmailHTML = (data: AppointmentData) => {
  return `
    <!DOCTYPE html>
    <html lang="el">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Επιβεβαίωση Ραντεβού</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #6B9A7A;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #6B9A7A;
                font-size: 28px;
                margin: 0;
            }
            .appointment-details {
                background: linear-gradient(135deg, #f0f7f4 0%, #e8f0ec 100%);
                padding: 25px;
                border-radius: 12px;
                margin: 25px 0;
                border: 2px solid rgba(107, 154, 122, 0.2);
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: bold;
                color: #495057;
            }
            .detail-value {
                color: #212529;
            }
            .price {
                font-size: 18px;
                font-weight: bold;
                color: #6B9A7A;
            }
            .footer {
                text-align: center;
                margin-top: 35px;
                padding-top: 25px;
                border-top: 2px solid rgba(107, 154, 122, 0.2);
                color: #5a7a6a;
            }
            .contact-info {
                background: linear-gradient(135deg, #f0f7f4 0%, #e8f0ec 100%);
                padding: 20px;
                border-radius: 12px;
                margin: 25px 0;
                border: 2px solid rgba(107, 154, 122, 0.3);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1><img src="https://alexandra-rizou.vercel.app/assets/rizou_logo_white.png" alt="Alexandra Rizou hair-beauty & health services" style="height: 80px; vertical-align: middle; margin-right: 10px;">Alexandra Rizou hair-beauty & health services</h1>
                <p>Επιβεβαίωση Ραντεβού</p>
            </div>
            
            <p>Αγαπητέ/ή <strong>${data.customerName}</strong>,</p>
            
            <p>Σας ευχαριστούμε που επιλέξατε το Alexandra Rizou hair-beauty & health services! Το ραντεβού σας έχει επιβεβαιωθεί με επιτυχία.</p>
            
            <div class="appointment-details">
                <h3 style="margin-top: 0; color: #6B9A7A;">📅 Λεπτομέρειες Ραντεβού</h3>
                <div class="detail-row">
                    <span class="detail-label">👤 Όνομα:</span>
                    <span class="detail-value">${data.customerName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">✂️ Υπηρεσία:</span>
                    <span class="detail-value">${data.service}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">💰 Τιμή:</span>
                    <span class="detail-value price">${data.price}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📅 Ημερομηνία:</span>
                    <span class="detail-value">${data.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🕐 Ώρα:</span>
                    <span class="detail-value">${data.time}</span>
                </div>
                ${data.phone ? `
                <div class="detail-row">
                    <span class="detail-label">📞 Τηλέφωνο:</span>
                    <span class="detail-value">${data.phone}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="contact-info" style="background-color: #f0f7f4; border: 2px solid #e8f0ec; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                <h4 style="color: #5a7a6a; margin-top: 0; font-size: 18px;">📞 Επικοινωνία</h4>
                <p style="color: #5a7a6a; font-weight: bold; font-size: 16px; margin: 15px 0;">Αν επιθυμείτε αλλαγή ή ακύρωση ραντεβού, καλέστε στο +30 210 6818 011</p>
                <div style="background-color: #fff; border: 1px solid #e8f0ec; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <p style="margin: 8px 0; font-size: 16px;"><strong>📞 Τηλέφωνο:</strong> +30 210 6818 011</p>
                    <p style="margin: 8px 0; font-size: 16px;"><strong>📧 Email:</strong> ar.hairbeauty.healthservices@gmail.com</p>
                </div>
            </div>
            
            <div class="hours-info" style="background-color: #f8f9fa; border: 2px solid #6B9A7A; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #6B9A7A; margin-top: 0; text-align: center; font-size: 20px;">🕐 Ωράριο Λειτουργίας</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; font-weight: bold; color: #6B9A7A; width: 30%;">Δευτέρα</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; text-align: right; color: #666;">10:00-18:00</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; font-weight: bold; color: #6B9A7A;">Τρίτη</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; text-align: right; color: #666;">10:00-20:00</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; font-weight: bold; color: #6B9A7A;">Τετάρτη</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; text-align: right; color: #666;">10:00-18:00</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; font-weight: bold; color: #6B9A7A;">Πέμπτη</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; text-align: right; color: #666;">10:00-20:00</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; font-weight: bold; color: #6B9A7A;">Παρασκευή</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; text-align: right; color: #666;">10:00-20:00</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; font-weight: bold; color: #6B9A7A;">Σάββατο</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #6B9A7A; font-size: 14px; text-align: right; color: #666;">10:00-19:00</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; font-size: 14px; font-weight: bold; color: #6B9A7A;">Κυριακή</td>
                        <td style="padding: 8px 12px; font-size: 14px; text-align: right; color: #666;">Κλειστά</td>
                    </tr>
                </table>
            </div>
            
            <p><strong>Σημαντικό:</strong> Παρακαλούμε να είστε στην ώρα σας. Σε περίπτωση καθυστέρησης άνω των 15 λεπτών, το ραντεβού μπορεί να ακυρωθεί.</p>
            
            <div class="footer">
                <p>Ευχαριστούμε για την εμπιστοσύνη σας!</p>
                <p><strong>Alexandra Rizou hair-beauty & health services Team</strong></p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const generateAppointmentEmailText = (data: AppointmentData) => {
  return `
Επιβεβαίωση Ραντεβού - Alexandra Rizou hair-beauty & health services

Αγαπητέ/ή ${data.customerName},

Σας ευχαριστούμε που επιλέξατε το Alexandra Rizou hair-beauty & health services! Το ραντεβού σας έχει επιβεβαιωθεί με επιτυχία.

ΛΕΠΤΟΜΕΡΕΙΕΣ ΡΑΝΤΕΒΟΥ:
- Όνομα: ${data.customerName}
- Υπηρεσία: ${data.service}
- Τιμή: ${data.price}
- Ημερομηνία: ${data.date}
- Ώρα: ${data.time}
${data.phone ? `- Τηλέφωνο: ${data.phone}` : ''}

ΕΠΙΚΟΙΝΩΝΊΑ:
ΑΝ ΕΠΙΘΥΜΕΙΤΕ ΑΛΛΑΓΗ Η ΑΚΎΡΩΣΗ ΡΑΝΤΕΒΟΥ ΚΑΛΈΣΤΕ ΣΤΟ +30 210 6818 011

📞 Τηλέφωνο: +30 210 6818 011
📧 Email: ar.hairbeauty.healthservices@gmail.com

ΩΡΆΡΙΟ ΛΕΙΤΟΥΡΓΊΑΣ:
Δευτέρα: Κλειστά
Τρίτη: 10:00-20:00
Τετάρτη: 10:00-16:00
Πέμπτη: 10:00-20:00
Παρασκευή: 10:00-20:00
Σάββατο: 10:00-16:00
Κυριακή: Κλειστά

ΣΗΜΑΝΤΙΚΟ: Παρακαλούμε να είστε στην ώρα σας. Σε περίπτωση καθυστέρησης άνω των 15 λεπτών, το ραντεβού μπορεί να ακυρωθεί.

Ευχαριστούμε για την εμπιστοσύνη σας!

Alexandra Rizou hair-beauty & health services Team
  `;
};

const generateShopNotificationHTML = (data: AppointmentData) => {
  return `
    <!DOCTYPE html>
    <html lang="el">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Νέο Επιβεβαιωμένο Ραντεβού</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #1f2933;
                max-width: 640px;
                margin: 0 auto;
                padding: 32px 16px;
                background-color: #0f172a;
            }
            .card {
                background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
                border-radius: 18px;
                padding: 36px;
                box-shadow: 0 25px 45px rgba(15, 23, 42, 0.45);
                border: 1px solid rgba(148, 163, 184, 0.12);
            }
            .header {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
                margin-bottom: 28px;
            }
            .header img {
                height: 48px;
            }
            .badge {
                display: inline-block;
                background: rgba(94, 234, 212, 0.15);
                color: #5eead4;
                border: 1px solid rgba(45, 212, 191, 0.35);
                padding: 6px 14px;
                border-radius: 999px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                margin-bottom: 18px;
            }
            .title {
                font-size: 28px;
                color: #e2e8f0;
                margin: 0 0 12px;
                text-align: center;
                font-weight: 700;
            }
            .subtitle {
                color: #94a3b8;
                font-size: 16px;
                text-align: center;
                margin-bottom: 32px;
            }
            .details {
                background: rgba(15, 23, 42, 0.65);
                border-radius: 16px;
                padding: 28px;
                border: 1px solid rgba(148, 163, 184, 0.14);
                margin-bottom: 30px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 0;
                border-bottom: 1px solid rgba(148, 163, 184, 0.12);
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                color: #cbd5f5;
                font-weight: 600;
                font-size: 15px;
            }
            .detail-value {
                color: #e2e8f0;
                font-size: 15px;
                font-weight: 500;
            }
            .cta {
                text-align: center;
                margin-top: 24px;
            }
            .cta a {
                display: inline-block;
                background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
                color: #0f172a;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 999px;
                font-size: 15px;
                font-weight: 700;
                letter-spacing: 0.02em;
                box-shadow: 0 16px 30px rgba(0, 114, 255, 0.35);
                transition: all 0.3s ease;
            }
            .cta a:hover {
                box-shadow: 0 22px 38px rgba(0, 114, 255, 0.45);
                transform: translateY(-2px);
            }
            .footer {
                margin-top: 36px;
                text-align: center;
                color: #64748b;
                font-size: 13px;
            }
            .copyright {
                margin-top: 24px;
                padding-top: 20px;
                border-top: 1px solid rgba(148, 163, 184, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                flex-wrap: wrap;
            }
            .copyright-text {
                color: #64748b;
                font-size: 12px;
            }
            .copyright img {
                height: 16px;
                vertical-align: middle;
                max-width: 120px;
            }
            .highlight {
                color: #5eead4;
            }
            @media (max-width: 500px) {
                body {
                    padding: 24px 12px;
                }
                .card {
                    padding: 28px 20px;
                }
                .detail-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 6px;
                }
                .cta a {
                    width: 100%;
                    text-align: center;
                }
                .copyright {
                    gap: 4px;
                }
                .copyright img {
                    height: 10px;
                    max-width: 80px;
                }
                .copyright-text {
                    font-size: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <img src="cid:acronflowLogo" alt="AcronFlow CRM" />
            </div>
            <div class="badge">Νέα ειδοποίηση ραντεβού</div>
            <h1 class="title">Επιβεβαιωμένο ραντεβού πελάτη</h1>
            <p class="subtitle">Ο πελάτης <strong class="highlight">${data.customerName}</strong> μόλις ολοκλήρωσε την κράτησή του μέσω του AcronFlow CRM.</p>

            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Όνομα πελάτη:</span>
                    <span class="detail-value">${data.customerName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Υπηρεσία:</span>
                    <span class="detail-value">${data.service}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ημερομηνία:</span>
                    <span class="detail-value">${data.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ώρα:</span>
                    <span class="detail-value">${data.time}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Επικοινωνία:</span>
                    <span class="detail-value">${data.phone || '—'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email πελάτη:</span>
                    <span class="detail-value">${data.customerEmail}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Κόστος:</span>
                    <span class="detail-value">${data.price}</span>
                </div>
                ${data.employeeNames && data.employeeNames.length ? `
                <div class="detail-row">
                    <span class="detail-label">Υπάλληλος:</span>
                    <span class="detail-value">${data.employeeNames.join(', ')}</span>
                </div>
                ` : ''}
                ${data.notes ? `
                <div class="detail-row">
                    <span class="detail-label">Σημειώσεις πελάτη:</span>
                    <span class="detail-value">${data.notes}</span>
                </div>
                ` : ''}
                ${data.appointmentId ? `
                <div class="detail-row">
                    <span class="detail-label">Κωδικός ραντεβού:</span>
                    <span class="detail-value">${data.appointmentId}</span>
                </div>
                ` : ''}
            </div>

            <div class="cta">
                <a href="https://www.crm.acronweb.com/dashboard/appointments" target="_blank" rel="noopener noreferrer">Δείτε το ραντεβού στο AcronFlow</a>
            </div>

            <div class="footer">
                <p>Αυτό το μήνυμα στάλθηκε αυτόματα από το AcronFlow CRM για την επιτυχημένη κράτηση ραντεβού.</p>
                <p>Ενημερώστε άμεσα την ομάδα σας για τυχόν αλλαγές ή ακυρώσεις.</p>
            </div>

            <div class="copyright">
                <span class="copyright-text">© ${new Date().getFullYear()}</span>
                <img src="cid:acronwebCopyright" alt="AcronWeb" />
                <span class="copyright-text">. All Rights Reserved.</span>
            </div>
        </div>
    </body>
    </html>
  `;
};

const generateShopNotificationText = (data: AppointmentData) => {
  return `
Νέο επιβεβαιωμένο ραντεβού μέσω AcronFlow CRM

Πελάτης: ${data.customerName}
Υπηρεσία: ${data.service}
Ημερομηνία: ${data.date}
Ώρα: ${data.time}
Τηλέφωνο: ${data.phone || '—'}
Email: ${data.customerEmail}
Κόστος: ${data.price}
${data.employeeNames && data.employeeNames.length ? `Υπάλληλος: ${data.employeeNames.join(', ')}
` : ''}${data.notes ? `Σημειώσεις: ${data.notes}
` : ''}${data.appointmentId ? `Κωδικός Ραντεβού: ${data.appointmentId}
` : ''}

Δείτε όλες τις λεπτομέρειες: https://www.crm.acronweb.com/dashboard/appointments

Αυτό το μήνυμα στάλθηκε αυτόματα από το AcronFlow CRM.
  `;
};

const generateReviewEmailHTML = (message: string) => {
  return `
    <!DOCTYPE html>
    <html lang="el">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Αξιολογήστε το Alexandra Rizou</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.7;
                color: #1a202c;
                background: #f5f7fa;
                padding: 30px 15px;
                margin: 0;
            }
            .email-wrapper {
                max-width: 580px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            }
            .header {
                background: linear-gradient(135deg, #6B9A7A 0%, #5a8a6a 100%);
                padding: 35px 30px;
                text-align: center;
                position: relative;
            }
            .header-content {
                position: relative;
                z-index: 1;
            }
            .logo {
                height: 90px;
                margin-bottom: 16px;
            }
            .header-title {
                color: #ffffff;
                font-size: 24px;
                font-weight: 600;
                letter-spacing: 0.5px;
                margin: 0 0 10px 0;
            }
            .header-subtitle {
                color: rgba(255, 255, 255, 0.95);
                font-size: 14px;
                font-weight: 400;
            }
            .content {
                padding: 35px 30px;
            }
            .review-section {
                background: linear-gradient(135deg, #fffbf5 0%, #ffffff 100%);
                border: 2px solid #f0e6d2;
                border-radius: 12px;
                padding: 28px;
                margin: 28px 0;
                text-align: center;
                box-shadow: 0 4px 16px rgba(107, 154, 122, 0.08);
            }
            .review-title {
                color: #1a202c;
                font-size: 22px;
                font-weight: 600;
                margin-bottom: 16px;
            }
            .stars {
                color: #fbbf24;
                font-size: 36px;
                letter-spacing: 6px;
                margin: 16px 0;
            }
            .review-subtitle {
                color: #4a5568;
                font-size: 14px;
                font-weight: 500;
            }
            .message-content {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-left: 4px solid #6B9A7A;
                border-radius: 10px;
                padding: 24px;
                margin: 28px 0;
                font-size: 15px;
                line-height: 1.75;
                color: #2d3748;
                white-space: pre-line;
            }
            .cta-section {
                text-align: center;
                margin: 32px 0;
            }
            .review-button {
                display: inline-block;
                background: linear-gradient(135deg, #6B9A7A 0%, #5a8a6a 100%);
                color: #ffffff;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 600;
                font-size: 15px;
                letter-spacing: 0.5px;
                box-shadow: 0 4px 16px rgba(107, 154, 122, 0.3);
            }
            .review-button:hover {
                box-shadow: 0 6px 20px rgba(107, 154, 122, 0.4);
            }
            .info-box {
                background: #f8f9fa;
                border: 1px solid #e2e8f0;
                border-left: 4px solid #6B9A7A;
                border-radius: 10px;
                padding: 24px;
                margin: 28px 0;
            }
            .info-title {
                color: #6B9A7A;
                font-size: 17px;
                font-weight: 600;
                margin-bottom: 12px;
            }
            .info-text {
                color: #4a5568;
                font-size: 14px;
                line-height: 1.7;
            }
            .divider {
                height: 1px;
                background: linear-gradient(to right, transparent, #e2e8f0, transparent);
                margin: 28px 0;
            }
            .contact-section {
                background: #f8f9fa;
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                padding: 24px;
                margin: 28px 0;
            }
            .contact-title {
                font-size: 13px;
                font-weight: 600;
                color: #6B9A7A;
                margin-bottom: 16px;
                text-align: center;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .contact-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
            }
            .contact-item {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                color: #4a5568;
                padding: 10px;
            }
            .contact-icon {
                width: 18px;
                height: 18px;
                flex-shrink: 0;
                color: #6B9A7A;
            }
            .contact-item strong {
                color: #2d3748;
                font-weight: 600;
            }
            .hours-section {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                padding: 24px;
                margin: 28px 0;
            }
            .hours-title {
                color: #6B9A7A;
                font-size: 17px;
                font-weight: 600;
                text-align: center;
                margin-bottom: 20px;
            }
            .hours-table {
                width: 100%;
                border-collapse: collapse;
            }
            .hours-table tr {
                border-bottom: 1px solid #e2e8f0;
            }
            .hours-table tr:last-child {
                border-bottom: none;
            }
            .hours-table td {
                padding: 10px 0;
                font-size: 14px;
            }
            .hours-table td:first-child {
                font-weight: 600;
                color: #6B9A7A;
                width: 40%;
            }
            .hours-table td:last-child {
                text-align: right;
                color: #4a5568;
            }
            .footer {
                background: #f8f9fa;
                padding: 28px 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .footer-text {
                font-size: 13px;
                color: #64748b;
                margin-bottom: 8px;
                line-height: 1.6;
            }
            .footer-brand {
                font-size: 15px;
                font-weight: 600;
                color: #6B9A7A;
                margin-top: 12px;
            }
            @media only screen and (max-width: 600px) {
                body {
                    padding: 20px 10px;
                }
                .header {
                    padding: 30px 25px;
                }
                .content {
                    padding: 30px 25px;
                }
                .header-title {
                font-size: 20px;
                }
                .logo {
                    height: 80px;
            }
                .review-section {
                    padding: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="header">
                <div class="header-content">
                    <img src="https://alexandra-rizou.vercel.app/assets/rizou_logo_white.png" alt="Alexandra Rizou" class="logo">
                    <h1 class="header-title">Alexandra Rizou</h1>
                    <p class="header-subtitle">Η γνώμη σας είναι πολύ σημαντική για εμάς</p>
                </div>
            </div>
            
            <div class="content">
                <div class="review-section">
                    <h2 class="review-title">Αξιολογήστε την Εμπειρία σας</h2>
                    <div class="stars">★★★★★</div>
                    <p class="review-subtitle">Η γνώμη σας μας βοηθά να βελτιώσουμε τις υπηρεσίες μας</p>
            </div>
            
            <div class="message-content">
                ${message}
            </div>
            
                <div class="cta-section">
                    <a href="https://share.google/NTHvLOlobEIU7Ajm4" class="review-button">
                        Αφήστε την Κριτική σας
                </a>
            </div>
            
                <div class="info-box">
                    <h3 class="info-title">Γιατί η Κριτική σας είναι Σημαντική</h3>
                    <p class="info-text">Η γνώμη σας μας βοηθά να προσφέρουμε καλύτερες υπηρεσίες και να φτάσουμε σε περισσότερους πελάτες που χρειάζονται την εξειδικευμένη φροντίδα μας.</p>
            </div>
            
                <div class="divider"></div>
                
                <div class="contact-section">
                    <div class="contact-title">Επικοινωνία</div>
                    <div class="contact-grid">
                        <div class="contact-item">
                            <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <span><strong>Τηλέφωνο:</strong> +30 210 6818 011</span>
                        </div>
                        <div class="contact-item">
                            <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span><strong>Email:</strong> ar.hairbeauty.healthservices@gmail.com</span>
                        </div>
                        <div class="contact-item">
                            <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span><strong>Διεύθυνση:</strong> Ανδρέα Παπανδρέου 52, Χαλάνδρι 152 32</span>
                        </div>
                </div>
            </div>
            
                <div class="hours-section">
                    <h3 class="hours-title">Ωράριο Λειτουργίας</h3>
                <table class="hours-table">
                    <tr>
                        <td>Δευτέρα</td>
                        <td>Κλειστά</td>
                    </tr>
                    <tr>
                        <td>Τρίτη</td>
                        <td>10:00-20:00</td>
                    </tr>
                    <tr>
                        <td>Τετάρτη</td>
                        <td>10:00-16:00</td>
                    </tr>
                    <tr>
                        <td>Πέμπτη</td>
                        <td>10:00-20:00</td>
                    </tr>
                    <tr>
                        <td>Παρασκευή</td>
                        <td>10:00-20:00</td>
                    </tr>
                    <tr>
                        <td>Σάββατο</td>
                        <td>10:00-16:00</td>
                    </tr>
                    <tr>
                        <td>Κυριακή</td>
                        <td>Κλειστά</td>
                    </tr>
                </table>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">Ευχαριστούμε για την εμπιστοσύνη σας</p>
                <p class="footer-brand">Alexandra Rizou hair-beauty & health services</p>
                <p class="footer-text" style="margin-top: 16px; font-size: 14px;">Αν έχετε οποιαδήποτε ερώτηση, μη διστάσετε να επικοινωνήσετε μαζί μας</p>
            </div>
        </div>
    </body>
    </html>
  `
};

// generateTemplateEmailHTML is now imported from emailTemplateGenerator.ts
