// Email template HTML generator (doesn't require nodemailer)
export const generateTemplateEmailHTML = (message: string, templateName: string, colors?: { primary?: string; secondary?: string; accent?: string; background?: string; text?: string }, baseTemplateId?: string) => {
  // Default colors (Alexandra Rizou Green)
  const primaryColor = colors?.primary || '#6B9A7A'
  const secondaryColor = colors?.secondary || '#5a8a6a'
  const accentColor = colors?.accent || '#4a7c59'
  const backgroundColor = colors?.background || '#f5f7fa'
  const textColor = colors?.text || '#1a202c'

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Determine header background based on template type (holiday/seasonal templates)
  const getHeaderBackground = (): string => {
    const templateId = baseTemplateId || ''
    const name = templateName.toLowerCase()
    
    // Christmas - Red gradient
    if (templateId === 'christmas' || name.includes('christmas') || name.includes('χριστούγεννα')) {
      return 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)'
    }
    
    // New Year - Gold/Yellow gradient
    if (templateId === 'newyear' || name.includes('new year') || name.includes('πρωτοχρονιά') || name.includes('νέο έτος')) {
      return 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #fbbf24 100%)'
    }
    
    // Easter - Yellow/Orange gradient
    if (templateId === 'easter' || name.includes('easter') || name.includes('πάσχα')) {
      return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
    }
    
    // Summer - Blue gradient
    if (templateId === 'summer' || name.includes('summer') || name.includes('καλοκαίρι')) {
      return 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)'
    }
    
    // Autumn - Orange gradient
    if (templateId === 'autumn' || name.includes('autumn') || name.includes('φθινόπωρο')) {
      return 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)'
    }
    
    // Default - Green gradient (Alexandra Rizou brand color)
    return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
  }

  const headerBackground = getHeaderBackground()
  
  return `
    <!DOCTYPE html>
    <html lang="el">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${templateName} - Alexandra Rizou</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.7;
                color: ${textColor};
                background: ${backgroundColor};
                padding: 30px 15px;
                margin: 0;
            }
            .email-wrapper {
                max-width: 580px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            }
            .header {
                background: ${headerBackground};
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            .header-content {
                position: relative;
                z-index: 1;
            }
            .header-image {
                max-width: 280px;
                width: 100%;
                height: auto;
                margin: 0 auto 20px auto;
                display: block;
                border-radius: 8px;
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
                margin: 0 0 8px 0;
            }
            .template-badge {
                display: inline-block;
                background: ${hexToRgba(primaryColor, 0.2)};
                color: #ffffff;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                margin-top: 12px;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                border: 1px solid ${hexToRgba(primaryColor, 0.3)};
            }
            .content {
                padding: 35px 30px;
            }
            .message-content {
                font-size: 15px;
                line-height: 1.75;
                color: ${textColor};
            }
            .message-content h1, .message-content h2, .message-content h3 {
                color: ${textColor};
                margin-top: 24px;
                margin-bottom: 12px;
                font-weight: 600;
                line-height: 1.3;
            }
            .message-content h1 {
                font-size: 24px;
            }
            .message-content h2 {
                font-size: 20px;
                color: ${primaryColor};
            }
            .message-content h3 {
                font-size: 18px;
            }
            .message-content p {
                margin-bottom: 14px;
            }
            .message-content ul, .message-content ol {
                margin: 16px 0;
                padding-left: 24px;
            }
            .message-content li {
                margin-bottom: 8px;
                line-height: 1.7;
            }
            .message-content strong {
                color: ${textColor};
                font-weight: 600;
            }
            /* Ensure inline styles from editor are respected */
            .message-content div, .message-content h1, .message-content h2, .message-content h3, 
            .message-content p, .message-content ul, .message-content ol, .message-content li, 
            .message-content strong, .message-content em, .message-content u, .message-content s {
                all: unset;
                display: block;
            }
            .message-content strong { font-weight: bold; }
            .message-content em { font-style: italic; }
            .message-content u { text-decoration: underline; }
            .message-content s { text-decoration: line-through; }
            .message-content h1 { font-size: 24px; font-weight: bold; }
            .message-content h2 { font-size: 20px; font-weight: bold; }
            .message-content h3 { font-size: 18px; font-weight: bold; }
            .message-content p { margin-bottom: 14px; }
            .message-content ul, .message-content ol { margin: 16px 0; padding-left: 24px; }
            .message-content li { margin-bottom: 8px; line-height: 1.7; }
            /* Specific styles for schedule blocks to ensure they render correctly */
            .message-content div[style*="background: linear-gradient"] {
                all: unset;
                display: block;
                background: var(--schedule-bg, linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.5)));
                border: var(--schedule-border, 2px solid #ccc);
                border-radius: var(--schedule-radius, 12px);
                padding: var(--schedule-padding, 20px);
                margin: var(--schedule-margin, 20px 0);
            }
            .message-content div[style*="background: linear-gradient"] h2 {
                all: unset;
                display: block;
                color: var(--schedule-accent, #333);
                margin: 0 0 16px 0;
                font-size: 20px;
                font-weight: 600;
            }
            .message-content div[style*="background: linear-gradient"] ul {
                all: unset;
                display: block;
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .message-content div[style*="background: linear-gradient"] li {
                all: unset;
                display: block;
                padding: 8px 0;
                border-bottom: 1px solid var(--schedule-item-border, #eee);
                line-height: 1.7;
            }
            .message-content div[style*="background: linear-gradient"] li:last-child {
                border-bottom: none;
            }
            .message-content div[style*="background: linear-gradient"] strong {
                all: unset;
                display: inline;
                color: var(--schedule-accent, #333);
                font-weight: bold;
            }
            .message-content div[style*="background: linear-gradient"] p {
                all: unset;
                display: block;
                margin-top: 12px;
                font-size: 13px;
                color: var(--schedule-text, #333);
                opacity: 0.8;
            }
            .divider {
                height: 1px;
                background: linear-gradient(to right, transparent, #e2e8f0, transparent);
                margin: 28px 0;
            }
            .contact-section {
                background: linear-gradient(135deg, ${hexToRgba(primaryColor, 0.1)} 0%, ${hexToRgba(secondaryColor, 0.15)} 100%);
                border: 2px solid ${primaryColor};
                border-radius: 12px;
                padding: 24px;
                margin: 28px 0;
            }
            .contact-title {
                font-size: 13px;
                font-weight: 600;
                color: ${accentColor};
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
                color: ${primaryColor};
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
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="header">
                <div class="header-content">
                    <img src="https://alexandra-rizou.vercel.app/assets/rizou_logo_white.png" alt="Alexandra Rizou" class="header-image">
                    <div class="template-badge">${templateName}</div>
                </div>
            </div>
            
            <div class="content">
                <div class="message-content">
                    ${message}
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
            </div>
            
            <div class="footer">
                <p class="footer-text">Ευχαριστούμε για την εμπιστοσύνη σας</p>
                <p class="footer-brand">Alexandra Rizou hair-beauty & health services</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

