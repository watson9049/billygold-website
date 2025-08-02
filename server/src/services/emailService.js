const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendVerificationEmail(email, token, username) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: `"黃金比例系統" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '驗證您的黃金比例帳戶',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 30px; border-radius: 15px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">歡迎加入黃金比例系統</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 15px 15px;">
            <h2 style="color: #333; margin-bottom: 20px;">您好 ${username}，</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              感謝您註冊黃金比例系統！為了確保您的帳戶安全，請點擊下方按鈕驗證您的 Email 地址。
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #fbbf24, #f59e0b); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;">
                驗證 Email 地址
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 25px;">
              如果按鈕無法點擊，請複製以下連結到瀏覽器：<br>
              <a href="${verificationUrl}" style="color: #f59e0b;">${verificationUrl}</a>
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                此驗證連結將在 24 小時後過期。<br>
                如果您沒有註冊此帳戶，請忽略此郵件。
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('發送驗證郵件失敗:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email, username) {
    const mailOptions = {
      from: `"黃金比例系統" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '歡迎來到黃金比例系統！',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 15px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 驗證成功！</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 15px 15px;">
            <h2 style="color: #333; margin-bottom: 20px;">恭喜您，${username}！</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              您的 Email 地址已成功驗證，現在可以開始使用黃金比例系統的所有功能了！
            </p>
            
            <div style="background: #e0f2fe; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #0277bd; margin-top: 0;">系統特色功能：</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>📊 即時金價查詢與分析</li>
                <li>🤖 AI 智慧客服</li>
                <li>📝 專業部落格內容</li>
                <li>👥 客戶管理系統 (管理員)</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}" 
                 style="background: linear-gradient(135deg, #10b981, #059669); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;">
                開始使用系統
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                如有任何問題，請隨時聯繫我們的客服團隊。
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('發送歡迎郵件失敗:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email, resetLink, username) {
    const mailOptions = {
      from: `"黃金比例系統" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '重置您的密碼',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; border-radius: 15px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 密碼重置請求</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 15px 15px;">
            <h2 style="color: #333; margin-bottom: 20px;">您好 ${username}，</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              我們收到了您的密碼重置請求。請點擊下方按鈕設置新密碼。
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(135deg, #ef4444, #dc2626); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;">
                重置密碼
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                ⚠️ 安全提醒：此連結將在 1 小時後過期。如果您沒有請求重置密碼，請忽略此郵件。
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                為保護您的帳戶安全，請勿將此連結分享給他人。
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('發送密碼重置郵件失敗:', error);
      return false;
    }
  }
}

module.exports = new EmailService(); 