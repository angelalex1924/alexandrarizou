// Email template HTML generator (doesn't require nodemailer)
export const generateTemplateEmailHTML = (message: string, templateName: string) => {
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
                margin: 0 0 8px 0;
            }
            .template-badge {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 5px 14px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 500;
                margin-top: 8px;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .content {
                padding: 35px 30px;
            }
            .message-content {
                font-size: 15px;
                line-height: 1.75;
                color: #2d3748;
                white-space: pre-line;
            }
            .message-content h1, .message-content h2, .message-content h3 {
                color: #1a202c;
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
                color: #6B9A7A;
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
                color: #1a202c;
                font-weight: 600;
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
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="header">
                <div class="header-content">
                    <img src="https://alexandra-rizou.vercel.app/assets/rizou_logo_white.png" alt="Alexandra Rizou" class="logo">
                    <h1 class="header-title">Alexandra Rizou</h1>
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

