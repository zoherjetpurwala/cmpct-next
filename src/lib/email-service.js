import { transporter } from './nodemailer';
import { 
  getVerificationEmailHtml, 
  getVerificationEmailText,
  getWelcomeEmailHtml,
  getWelcomeEmailText 
} from './email-templates';

export const sendVerificationEmail = async (to, userName, verificationUrl) => {
  try {
    const mailOptions = {
      from: {
        name: 'CMPCT',
        address: 'support@cmpct.in'
      },
      to: to,
      subject: '✉️ Verify Your Email Address - CMPCT',
      text: getVerificationEmailText(verificationUrl, userName),
      html: getVerificationEmailHtml(verificationUrl, userName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (to, userName) => {
  try {
    const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;
    
    const mailOptions = {
      from: {
        name: 'CMPCT',
        address: 'support@cmpct.in'
      },
      to: to,
      subject: '🎉 Welcome to CMPCT - You\'re All Set!',
      text: getWelcomeEmailText(userName, dashboardUrl),
      html: getWelcomeEmailHtml(userName, dashboardUrl),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};