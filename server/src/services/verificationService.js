const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const emailService = require('./emailService');
const smsService = require('./smsService');

class VerificationService {
  // 生成驗證碼
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 生成驗證 token
  generateToken() {
    return uuidv4();
  }

  // 驗證 Email 格式
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 驗證手機號碼格式 (台灣)
  validatePhone(phone) {
    const phoneRegex = /^09\d{8}$/;
    return phoneRegex.test(phone);
  }

  // 驗證密碼強度
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        length: password.length < minLength ? `密碼至少需要 ${minLength} 個字符` : null,
        uppercase: !hasUpperCase ? '密碼需要包含大寫字母' : null,
        lowercase: !hasLowerCase ? '密碼需要包含小寫字母' : null,
        numbers: !hasNumbers ? '密碼需要包含數字' : null,
        special: !hasSpecialChar ? '密碼需要包含特殊字符' : null
      }
    };
  }

  // 發送 Email 驗證
  async sendEmailVerification(userId, email, username) {
    try {
      const token = this.generateToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // 儲存驗證 token
      await query(
        'UPDATE users SET verification_token = ?, verification_token_expiry = ? WHERE id = ?',
        [token, expiresAt, userId]
      );

      // 發送驗證郵件
      const emailSent = await emailService.sendVerificationEmail(email, token, username);
      
      return {
        success: emailSent,
        message: emailSent ? '驗證郵件已發送' : '驗證郵件發送失敗'
      };
    } catch (error) {
      console.error('Email 驗證發送失敗:', error);
      return {
        success: false,
        message: '驗證郵件發送失敗'
      };
    }
  }

  // 發送手機驗證碼
  async sendPhoneVerification(userId, phoneNumber) {
    try {
      const code = this.generateCode();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5分鐘過期

      // 儲存驗證碼
      await query(
        'INSERT INTO verification_codes (id, user_id, code, type, expires_at) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), userId, code, 'phone', expiresAt]
      );

      // 發送簡訊
      const smsSent = await smsService.sendVerificationCode(phoneNumber, code);
      
      return {
        success: smsSent,
        message: smsSent ? '驗證簡訊已發送' : '驗證簡訊發送失敗'
      };
    } catch (error) {
      console.error('手機驗證發送失敗:', error);
      return {
        success: false,
        message: '驗證簡訊發送失敗'
      };
    }
  }

  // 驗證 Email token
  async verifyEmailToken(token) {
    try {
      const user = await query(
        'SELECT id, username, email, verification_token, verification_token_expiry FROM users WHERE verification_token = ?',
        [token]
      );

      if (user.rows.length === 0) {
        return { success: false, message: '無效的驗證連結' };
      }

      const userData = user.rows[0];

      // 檢查是否已過期
      if (new Date() > new Date(userData.verification_token_expiry)) {
        return { success: false, message: '驗證連結已過期' };
      }

      // 更新用戶狀態
      await query(
        'UPDATE users SET email_verified = TRUE, status = CASE WHEN phone_verified = TRUE THEN "active" ELSE "pending" END, verification_token = NULL, verification_token_expiry = NULL WHERE id = ?',
        [userData.id]
      );

      // 發送歡迎郵件
      await emailService.sendWelcomeEmail(userData.email, userData.username);

      return {
        success: true,
        message: 'Email 驗證成功',
        data: {
          userId: userData.id,
          email: userData.email,
          username: userData.username
        }
      };
    } catch (error) {
      console.error('Email 驗證失敗:', error);
      return { success: false, message: '驗證失敗' };
    }
  }

  // 驗證手機驗證碼
  async verifyPhoneCode(userId, code) {
    try {
      const verification = await query(
        'SELECT * FROM verification_codes WHERE user_id = ? AND code = ? AND type = "phone" AND used = FALSE AND expires_at > datetime("now") ORDER BY created_at DESC LIMIT 1',
        [userId, code]
      );

      if (verification.rows.length === 0) {
        return { success: false, message: '驗證碼無效或已過期' };
      }

      // 標記驗證碼為已使用
      await query(
        'UPDATE verification_codes SET used = TRUE WHERE id = ?',
        [verification.rows[0].id]
      );

      // 更新用戶狀態
      await query(
        'UPDATE users SET phone_verified = TRUE, status = CASE WHEN email_verified = TRUE THEN "active" ELSE "pending" END WHERE id = ?',
        [userId]
      );

      // 獲取用戶資訊
      const user = await query('SELECT username, phone FROM users WHERE id = ?', [userId]);
      if (user.rows.length > 0) {
        await smsService.sendWelcomeSMS(user.rows[0].phone, user.rows[0].username);
      }

      return {
        success: true,
        message: '手機驗證成功'
      };
    } catch (error) {
      console.error('手機驗證失敗:', error);
      return { success: false, message: '驗證失敗' };
    }
  }

  // 檢查帳戶狀態
  async checkAccountStatus(userId) {
    try {
      const user = await query(
        'SELECT email_verified, phone_verified, status FROM users WHERE id = ?',
        [userId]
      );

      if (user.rows.length === 0) {
        return { success: false, message: '用戶不存在' };
      }

      const userData = user.rows[0];
      return {
        success: true,
        data: {
          emailVerified: userData.email_verified,
          phoneVerified: userData.phone_verified,
          status: userData.status,
          isFullyVerified: userData.email_verified && userData.phone_verified
        }
      };
    } catch (error) {
      console.error('檢查帳戶狀態失敗:', error);
      return { success: false, message: '檢查失敗' };
    }
  }

  // 記錄安全日誌
  async logSecurityEvent(userId, action, ipAddress, userAgent, details = null) {
    try {
      await query(
        'INSERT INTO security_logs (id, user_id, action, ip_address, user_agent, details) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), userId, action, ipAddress, userAgent, details]
      );
    } catch (error) {
      console.error('記錄安全日誌失敗:', error);
    }
  }

  // 檢查登入嘗試次數
  async checkLoginAttempts(email) {
    try {
      const user = await query(
        'SELECT login_attempts, locked_until FROM users WHERE email = ?',
        [email]
      );

      if (user.rows.length === 0) {
        return { canLogin: true };
      }

      const userData = user.rows[0];
      
      // 檢查是否被鎖定
      if (userData.locked_until && new Date() < new Date(userData.locked_until)) {
        return {
          canLogin: false,
          message: '帳戶已被鎖定，請稍後再試',
          lockedUntil: userData.locked_until
        };
      }

      // 如果鎖定時間已過，重置嘗試次數
      if (userData.locked_until && new Date() > new Date(userData.locked_until)) {
        await query(
          'UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = ?',
          [email]
        );
      }

      return { canLogin: true };
    } catch (error) {
      console.error('檢查登入嘗試失敗:', error);
      return { canLogin: true };
    }
  }

  // 更新登入嘗試次數
  async updateLoginAttempts(email, success) {
    try {
      if (success) {
        // 登入成功，重置嘗試次數
        await query(
          'UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = ?',
          [email]
        );
      } else {
        // 登入失敗，增加嘗試次數
        const user = await query(
          'SELECT login_attempts FROM users WHERE email = ?',
          [email]
        );

        if (user.rows.length > 0) {
          const attempts = user.rows[0].login_attempts + 1;
          let lockedUntil = null;

          // 如果嘗試次數達到 5 次，鎖定帳戶 30 分鐘
          if (attempts >= 5) {
            lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
          }

          await query(
            'UPDATE users SET login_attempts = ?, locked_until = ? WHERE email = ?',
            [attempts, lockedUntil, email]
          );
        }
      }
    } catch (error) {
      console.error('更新登入嘗試失敗:', error);
    }
  }
}

module.exports = new VerificationService(); 