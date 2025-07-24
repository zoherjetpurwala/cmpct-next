export const getVerificationEmailHtml = (verificationUrl, userName) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email - CMPCT</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    /* Body styles */
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-width: 100% !important;
      background-color: #f8fafc !important;
      font-family: Arial, sans-serif !important;
    }
    
    /* Container styles */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    /* Header styles */
    .header-table {
      width: 100%;
      background-color: #ff6b35;
      background-image: linear-gradient(135deg, #ff6b35 0%, #ff8a5c 100%);
    }
    
    .logo-text {
      font-family: 'Times New Roman', serif;
      font-size: 32px;
      font-weight: bold;
      color: #ffffff !important;
      text-decoration: none;
      display: block;
      text-align: center;
      padding: 40px 20px;
      margin: 0;
      line-height: 1.2;
    }
    
    /* Content styles */
    .content-table {
      width: 100%;
      background-color: #ffffff;
    }
    
    .content-cell {
      padding: 40px 30px;
    }
    
    .greeting {
      font-size: 24px;
      font-weight: bold;
      color: #0f172a !important;
      margin: 0 0 20px 0;
      font-family: Arial, sans-serif;
    }
    
    .message-text {
      font-size: 16px;
      color: #475569 !important;
      margin: 0 0 30px 0;
      line-height: 1.6;
      font-family: Arial, sans-serif;
    }
    
    /* Button styles - Using table for better compatibility */
    .button-table {
      margin: 40px auto;
    }
    
    .button-cell {
      background-color: #ff6b35;
      border-radius: 8px;
      text-align: center;
    }
    
    .button-link {
      display: block;
      padding: 16px 32px;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      font-family: Arial, sans-serif;
      border-radius: 8px;
      line-height: 1.2;
    }
    
    /* Fallback link styles */
    .link-fallback {
      background-color: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    
    .fallback-text {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #64748b !important;
      font-family: Arial, sans-serif;
    }
    
    .link-text {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #475569 !important;
      word-break: break-all;
      background-color: #ffffff;
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      margin: 0;
    }
    
    /* Warning box */
    .warning-box {
      background-color: #fef3cd;
      border: 1px solid #fbbf24;
      border-radius: 6px;
      padding: 16px;
      margin: 30px 0;
    }
    
    .warning-text {
      margin: 0;
      color: #92400e !important;
      font-size: 14px;
      font-weight: bold;
      font-family: Arial, sans-serif;
    }
    
    /* Footer styles */
    .footer-table {
      width: 100%;
      background-color: #f8fafc;
    }
    
    .footer-cell {
      padding: 30px;
      text-align: center;
    }
    
    .footer-text {
      margin: 0;
      font-size: 12px;
      color: #64748b !important;
      font-family: Arial, sans-serif;
      line-height: 1.4;
    }
    
    .footer-link {
      color: #ff6b35 !important;
      text-decoration: none;
    }
    
    /* Media queries for mobile */
    @media only screen and (max-width: 600px) {
      .content-cell {
        padding: 30px 20px !important;
      }
      
      .logo-text {
        font-size: 28px !important;
        padding: 30px 20px !important;
      }
      
      .greeting {
        font-size: 22px !important;
      }
      
      .button-link {
        padding: 14px 24px !important;
        font-size: 14px !important;
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .message-text, .fallback-text, .footer-text {
        color: #475569 !important;
      }
      .greeting {
        color: #0f172a !important;
      }
    }
    
    /* Outlook specific fixes */
    <!--[if mso]>
    <style type="text/css">
      .button-link {
        mso-style-priority: 99 !important;
      }
    </style>
    <![endif]-->
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc;">
  
  <!-- Main container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        
        <!-- Email container -->
        <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td>
              <table role="presentation" class="header-table" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <h1 class="logo-text">cmpct.</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td>
              <table role="presentation" class="content-table" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="content-cell">
                    
                    <h2 class="greeting">Hi ${userName}! 👋</h2>
                    
                    <p class="message-text">
                      Thank you for signing up for <strong>CMPCT</strong>! We're excited to have you on board. 
                      To get started, please verify your email address by clicking the button below:
                    </p>
                    
                    <!-- CTA Button -->
                    <table role="presentation" class="button-table" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td class="button-cell" style="background-color: #ff6b35; border-radius: 8px;">
                          <!--[if mso]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:54px;v-text-anchor:middle;width:200px;" arcsize="15%" stroke="f" fillcolor="#ff6b35">
                            <w:anchorlock/>
                            <center style="color:#ffffff;font-family:Arial, sans-serif;font-size:16px;font-weight:bold;">✉️ Verify Email Address</center>
                          </v:roundrect>
                          <![endif]-->
                          <!--[if !mso]><!-->
                          <a href="${verificationUrl}" class="button-link" style="background-color: #ff6b35; color: #ffffff !important; text-decoration: none; padding: 16px 32px; border-radius: 8px; display: block; font-weight: bold; font-size: 16px;">
                            ✉️ Verify Email Address
                          </a>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Fallback link -->
                    <div class="link-fallback">
                      <p class="fallback-text"><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
                      <p class="link-text">${verificationUrl}</p>
                    </div>
                    
                    <!-- Warning -->
                    <div class="warning-box">
                      <p class="warning-text">⏰ This verification link will expire in 24 hours for security reasons.</p>
                    </div>
                    
                    <p class="message-text">
                      If you didn't create an account with us, you can safely ignore this email.
                    </p>
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td>
              <table role="presentation" class="footer-table" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="footer-cell">
                    <p class="footer-text">
                      This email was sent by <strong>CMPCT</strong><br>
                      Need help? Contact us at <a href="mailto:support@cmpct.in" class="footer-link">support@cmpct.in</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
`;

export const getVerificationEmailText = (verificationUrl, userName) => `
Hi ${userName}!

Thank you for signing up for CMPCT! We're excited to have you on board.

To get started, please verify your email address by clicking the link below:
${verificationUrl}

If the link doesn't work, copy and paste it into your browser.

This verification link will expire in 24 hours for security reasons.

If you didn't create an account with us, you can safely ignore this email.

Need help? Contact us at support@cmpct.in

Best regards,
The CMPCT Team
`;

export const getWelcomeEmailHtml = (userName, dashboardUrl) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to CMPCT!</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    /* Body styles */
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-width: 100% !important;
      background-color: #f8fafc !important;
      font-family: Arial, sans-serif !important;
    }
    
    /* Container styles */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    /* Header styles */
    .header-table {
      width: 100%;
      background-color: #ff6b35;
    }
    
    .logo-text {
      font-family: 'Times New Roman', serif;
      font-size: 32px;
      font-weight: bold;
      color: #ffffff !important;
      text-decoration: none;
      display: block;
      text-align: center;
      padding: 30px 20px 10px;
      margin: 0;
      line-height: 1.2;
    }
    
    .header-subtitle {
      color: #ffffff !important;
      font-size: 16px;
      margin: 0;
      text-align: center;
      padding: 0 20px 30px;
      font-family: Arial, sans-serif;
    }
    
    /* Content styles */
    .content-table {
      width: 100%;
      background-color: #ffffff;
    }
    
    .content-cell {
      padding: 40px 30px;
    }
    
    .success-badge {
      background-color: #10b981;
      color: #ffffff !important;
      padding: 12px 24px;
      border-radius: 25px;
      display: inline-block;
      font-weight: bold;
      font-size: 14px;
      margin: 0 0 30px 0;
      font-family: Arial, sans-serif;
      text-align: center;
    }
    
    .greeting {
      font-size: 28px;
      font-weight: bold;
      color: #0f172a !important;
      margin: 0 0 20px 0;
      text-align: center;
      font-family: Arial, sans-serif;
    }
    
    .message-text {
      font-size: 16px;
      color: #475569 !important;
      margin: 0 0 30px 0;
      line-height: 1.6;
      font-family: Arial, sans-serif;
    }
    
    /* Feature grid */
    .features-container {
      margin: 30px 0;
    }
    
    .feature-row {
      margin-bottom: 20px;
    }
    
    .feature-cell {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin-bottom: 15px;
    }
    
    .feature-icon {
      font-size: 32px;
      margin-bottom: 12px;
      display: block;
    }
    
    .feature-title {
      font-weight: bold;
      color: #0f172a !important;
      margin: 0 0 8px 0;
      font-family: Arial, sans-serif;
      font-size: 16px;
    }
    
    .feature-desc {
      font-size: 14px;
      color: #64748b !important;
      margin: 0;
      font-family: Arial, sans-serif;
    }
    
    /* Button styles */
    .button-table {
      margin: 40px auto;
    }
    
    .button-cell {
      background-color: #ff6b35;
      border-radius: 8px;
      text-align: center;
    }
    
    .button-link {
      display: block;
      padding: 16px 32px;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      font-family: Arial, sans-serif;
      border-radius: 8px;
      line-height: 1.2;
    }
    
    /* Footer styles */
    .footer-table {
      width: 100%;
      background-color: #f8fafc;
    }
    
    .footer-cell {
      padding: 30px;
      text-align: center;
    }
    
    .footer-text {
      margin: 0;
      font-size: 12px;
      color: #64748b !important;
      font-family: Arial, sans-serif;
      line-height: 1.4;
    }
    
    .footer-link {
      color: #ff6b35 !important;
      text-decoration: none;
    }
    
    /* Media queries for mobile */
    @media only screen and (max-width: 600px) {
      .content-cell {
        padding: 30px 20px !important;
      }
      
      .logo-text {
        font-size: 28px !important;
      }
      
      .greeting {
        font-size: 24px !important;
      }
      
      .button-link {
        padding: 14px 24px !important;
        font-size: 14px !important;
      }
      
      .feature-cell {
        margin-bottom: 10px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc;">
  
  <!-- Main container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        
        <!-- Email container -->
        <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td>
              <table role="presentation" class="header-table" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <h1 class="logo-text">cmpct.</h1>
                    <p class="header-subtitle">Your URL shortening solution</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td>
              <table role="presentation" class="content-table" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="content-cell">
                    
                    <!-- Success badge -->
                    <div style="text-align: center;">
                      <div class="success-badge">✅ Email Verified Successfully!</div>
                    </div>
                    
                    <h2 class="greeting">Welcome, ${userName}! 🎉</h2>
                    
                    <p class="message-text">
                      Congratulations! Your email has been verified and your CMPCT account is now active. 
                      You're all set to start creating and managing your shortened URLs.
                    </p>
                    
                    <!-- Features -->
                    <div class="features-container">
                      <div class="feature-row">
                        <div class="feature-cell">
                          <span class="feature-icon">🔗</span>
                          <h3 class="feature-title">Create Short Links</h3>
                          <p class="feature-desc">Transform long URLs into short, shareable links</p>
                        </div>
                      </div>
                      
                      <div class="feature-row">
                        <div class="feature-cell">
                          <span class="feature-icon">📊</span>
                          <h3 class="feature-title">Track Analytics</h3>
                          <p class="feature-desc">Monitor clicks, locations, and performance</p>
                        </div>
                      </div>
                      
                      <div class="feature-row">
                        <div class="feature-cell">
                          <span class="feature-icon">⚡</span>
                          <h3 class="feature-title">Lightning Fast</h3>
                          <p class="feature-desc">Instant redirects with 99.9% uptime</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- CTA Button -->
                    <table role="presentation" class="button-table" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td class="button-cell" style="background-color: #ff6b35; border-radius: 8px;">
                          <!--[if mso]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:54px;v-text-anchor:middle;width:200px;" arcsize="15%" stroke="f" fillcolor="#ff6b35">
                            <w:anchorlock/>
                            <center style="color:#ffffff;font-family:Arial, sans-serif;font-size:16px;font-weight:bold;">🚀 Start Creating Links</center>
                          </v:roundrect>
                          <![endif]-->
                          <!--[if !mso]><!-->
                          <a href="${dashboardUrl}" class="button-link" style="background-color: #ff6b35; color: #ffffff !important; text-decoration: none; padding: 16px 32px; border-radius: 8px; display: block; font-weight: bold; font-size: 16px;">
                            🚀 Start Creating Links
                          </a>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>
                    
                    <p class="message-text">
                      If you have any questions or need assistance, don't hesitate to reach out to our support team.
                    </p>
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td>
              <table role="presentation" class="footer-table" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="footer-cell">
                    <p class="footer-text">
                      This email was sent by <strong>CMPCT</strong><br>
                      Need help? Contact us at <a href="mailto:support@cmpct.in" class="footer-link">support@cmpct.in</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
`;

export const getWelcomeEmailText = (userName, dashboardUrl) => `
Welcome to CMPCT, ${userName}!

Congratulations! Your email has been verified and your CMPCT account is now active.

You can now:
• Create and manage short links
• Track analytics and performance  
• Access premium features

Get started: ${dashboardUrl}

If you have any questions, contact us at support@cmpct.in

Best regards,
The CMPCT Team
`;