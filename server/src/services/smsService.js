const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  async sendVerificationCode(phoneNumber, code) {
    try {
      const message = await this.client.messages.create({
        body: `您的黃金比例系統驗證碼是：${code}。此驗證碼將在 5 分鐘後過期。`,
        from: this.fromNumber,
        to: phoneNumber
      });

      console.log(`簡訊發送成功，SID: ${message.sid}`);
      return true;
    } catch (error) {
      console.error('簡訊發送失敗:', error);
      return false;
    }
  }

  async sendWelcomeSMS(phoneNumber, username) {
    try {
      const message = await this.client.messages.create({
        body: `歡迎 ${username} 加入黃金比例系統！您的帳戶已成功驗證，現在可以開始使用所有功能。`,
        from: this.fromNumber,
        to: phoneNumber
      });

      console.log(`歡迎簡訊發送成功，SID: ${message.sid}`);
      return true;
    } catch (error) {
      console.error('歡迎簡訊發送失敗:', error);
      return false;
    }
  }

  async sendSecurityAlert(phoneNumber, action, location) {
    try {
      const message = await this.client.messages.create({
        body: `安全提醒：檢測到您的帳戶在 ${location} 進行了 ${action} 操作。如非本人操作，請立即聯繫客服。`,
        from: this.fromNumber,
        to: phoneNumber
      });

      console.log(`安全提醒簡訊發送成功，SID: ${message.sid}`);
      return true;
    } catch (error) {
      console.error('安全提醒簡訊發送失敗:', error);
      return false;
    }
  }
}

module.exports = new SMSService(); 