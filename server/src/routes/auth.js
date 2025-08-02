const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { generateToken, authenticateToken } = require('../middleware/auth');
const verificationService = require('../services/verificationService');

const router = express.Router();

// 註冊新用戶
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // 驗證輸入
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: '缺少必要欄位',
        message: '請填寫所有必要欄位'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: '密碼不匹配',
        message: '確認密碼與密碼不符'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: '密碼太短',
        message: '密碼至少需要6個字符'
      });
    }

    // 檢查用戶名是否已存在
    const existingUsername = await query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsername.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: '用戶名已存在',
        message: '請選擇其他用戶名'
      });
    }

    // 檢查 Email 是否已存在
    const existingEmail = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email 已存在',
        message: '此 Email 已被註冊'
      });
    }

    // 加密密碼
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 驗證密碼強度
    const passwordValidation = verificationService.validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: '密碼強度不足',
        message: '密碼不符合安全要求',
        details: passwordValidation.errors
      });
    }

    // 驗證 Email 格式
    if (!verificationService.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email 格式無效',
        message: '請輸入有效的 Email 地址'
      });
    }

    // 創建新用戶
    const userId = uuidv4();
    await query(
      'INSERT INTO users (id, username, email, password_hash, status) VALUES (?, ?, ?, ?, ?)',
      [userId, username, email, passwordHash, 'pending']
    );

    // 發送 Email 驗證
    const emailVerification = await verificationService.sendEmailVerification(userId, email, username);

    // 記錄安全日誌
    await verificationService.logSecurityEvent(userId, 'register', req.ip, req.get('User-Agent'));

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: userId,
          username,
          email,
          role: 'user',
          status: 'pending'
        }
      },
      message: '註冊成功，請檢查您的 Email 進行驗證',
      emailSent: emailVerification.success
    });

  } catch (error) {
    console.error('註冊失敗:', error);
    res.status(500).json({
      success: false,
      error: '註冊失敗',
      message: error.message
    });
  }
});

// 用戶登入
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 驗證輸入
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: '缺少必要欄位',
        message: '請輸入用戶名和密碼'
      });
    }

    // 查找用戶
    const userResult = await query(
      'SELECT id, username, email, password_hash, role, status FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: '用戶不存在',
        message: '用戶名或密碼錯誤'
      });
    }

    const user = userResult.rows[0];

    // 檢查用戶狀態
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: '帳戶已被停用',
        message: '您的帳戶已被停用，請聯繫管理員'
      });
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: '密碼錯誤',
        message: '用戶名或密碼錯誤'
      });
    }

    // 生成 JWT Token
    const token = generateToken(user.id);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      },
      message: '登入成功'
    });

  } catch (error) {
    console.error('登入失敗:', error);
    res.status(500).json({
      success: false,
      error: '登入失敗',
      message: error.message
    });
  }
});

// 獲取當前用戶資訊
router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('在 /me 端點中的 req.user:', req.user);
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('獲取用戶資訊失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取用戶資訊失敗',
      message: error.message
    });
  }
});

// 更新用戶資料
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    // 檢查用戶名是否已被其他用戶使用
    if (username && username !== req.user.username) {
      const existingUsername = await query(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, userId]
      );

      if (existingUsername.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: '用戶名已存在',
          message: '請選擇其他用戶名'
        });
      }
    }

    // 檢查 Email 是否已被其他用戶使用
    if (email && email !== req.user.email) {
      const existingEmail = await query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );

      if (existingEmail.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Email 已存在',
          message: '此 Email 已被其他用戶使用'
        });
      }
    }

    // 更新用戶資料
    await query(
      'UPDATE users SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [username || req.user.username, email || req.user.email, userId]
    );

    res.json({
      success: true,
      data: {
        user: {
          id: userId,
          username: username || req.user.username,
          email: email || req.user.email,
          role: req.user.role
        }
      },
      message: '資料更新成功'
    });

  } catch (error) {
    console.error('更新用戶資料失敗:', error);
    res.status(500).json({
      success: false,
      error: '更新用戶資料失敗',
      message: error.message
    });
  }
});

// 更改密碼
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: '缺少必要欄位',
        message: '請填寫所有欄位'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: '新密碼不匹配',
        message: '確認密碼與新密碼不符'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: '密碼太短',
        message: '新密碼至少需要6個字符'
      });
    }

    // 獲取當前密碼
    const userResult = await query(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '用戶不存在',
        message: '用戶不存在'
      });
    }

    // 驗證當前密碼
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        error: '當前密碼錯誤',
        message: '當前密碼不正確'
      });
    }

    // 加密新密碼
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // 更新密碼
    await query(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, userId]
    );

    res.json({
      success: true,
      message: '密碼更改成功'
    });

  } catch (error) {
    console.error('更改密碼失敗:', error);
    res.status(500).json({
      success: false,
      error: '更改密碼失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * 忘記密碼 - 發送重置郵件
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: '請提供 Email 地址'
      });
    }
    
    // 檢查用戶是否存在
    const user = await query(
      'SELECT id, username, email FROM users WHERE email = ?',
      [email]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '找不到此 Email 地址的帳戶'
      });
    }
    
    // 生成重置 token (24小時有效)
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    // 儲存重置 token
    await query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [resetToken, resetTokenExpiry, email]
    );
    
    // 在實際環境中，這裡會發送重置郵件
    // 目前先返回重置連結供測試
    const resetLink = `http://localhost:5175/reset-password?token=${resetToken}`;
    
    res.json({
      success: true,
      message: '重置密碼連結已發送到您的 Email',
      data: {
        resetLink, // 僅供測試，實際環境中不會返回
        email: user.rows[0].email
      }
    });
  } catch (error) {
    console.error('忘記密碼處理失敗:', error);
    res.status(500).json({
      success: false,
      error: '處理忘記密碼請求失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/reset-password
 * 重置密碼
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: '請提供重置 token 和新密碼'
      });
    }
    
    // 驗證密碼強度
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: '密碼至少需要 6 個字符'
      });
    }
    
    // 檢查重置 token 是否有效
    const user = await query(
      'SELECT id, username, email, reset_token, reset_token_expiry FROM users WHERE reset_token = ?',
      [token]
    );
    
    if (user.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: '無效的重置連結'
      });
    }
    
    const userData = user.rows[0];
    
    // 檢查 token 是否過期
    if (new Date() > new Date(userData.reset_token_expiry)) {
      return res.status(400).json({
        success: false,
        error: '重置連結已過期，請重新申請'
      });
    }
    
    // 加密新密碼
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // 更新密碼並清除重置 token
    await query(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [passwordHash, userData.id]
    );
    
    res.json({
      success: true,
      message: '密碼重置成功，請使用新密碼登入'
    });
  } catch (error) {
    console.error('重置密碼失敗:', error);
    res.status(500).json({
      success: false,
      error: '重置密碼失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/forgot-username
 * 忘記帳號 - 通過 Email 查詢用戶名
 */
router.post('/forgot-username', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: '請提供 Email 地址'
      });
    }
    
    // 檢查用戶是否存在
    const user = await query(
      'SELECT username, email FROM users WHERE email = ?',
      [email]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '找不到此 Email 地址的帳戶'
      });
    }
    
    // 在實際環境中，這裡會發送包含用戶名的郵件
    // 目前先返回用戶名供測試
    res.json({
      success: true,
      message: '您的用戶名已發送到您的 Email',
      data: {
        username: user.rows[0].username,
        email: user.rows[0].email
      }
    });
  } catch (error) {
    console.error('忘記帳號處理失敗:', error);
    res.status(500).json({
      success: false,
      error: '處理忘記帳號請求失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/verify-email
 * 驗證 Email
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: '缺少驗證 token'
      });
    }
    
    const result = await verificationService.verifyEmailToken(token);
    
    if (result.success) {
      // 生成 JWT Token
      const jwtToken = generateToken(result.data.userId);
      
      res.json({
        success: true,
        message: result.message,
        data: {
          user: result.data,
          token: jwtToken
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.message
      });
    }
  } catch (error) {
    console.error('Email 驗證失敗:', error);
    res.status(500).json({
      success: false,
      error: '驗證失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/send-phone-verification
 * 發送手機驗證碼
 */
router.post('/send-phone-verification', authenticateToken, async (req, res) => {
  try {
    const { phone } = req.body;
    const userId = req.user.id;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: '請提供手機號碼'
      });
    }
    
    // 驗證手機號碼格式
    if (!verificationService.validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        error: '手機號碼格式無效',
        message: '請輸入有效的台灣手機號碼 (09xxxxxxxx)'
      });
    }
    
    // 更新用戶手機號碼
    await query('UPDATE users SET phone = ? WHERE id = ?', [phone, userId]);
    
    // 發送驗證簡訊
    const result = await verificationService.sendPhoneVerification(userId, phone);
    
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('發送手機驗證失敗:', error);
    res.status(500).json({
      success: false,
      error: '發送驗證簡訊失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/verify-phone
 * 驗證手機驗證碼
 */
router.post('/verify-phone', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: '請提供驗證碼'
      });
    }
    
    const result = await verificationService.verifyPhoneCode(userId, code);
    
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('手機驗證失敗:', error);
    res.status(500).json({
      success: false,
      error: '驗證失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/auth/account-status
 * 檢查帳戶狀態
 */
router.get('/account-status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await verificationService.checkAccountStatus(userId);
    
    res.json(result);
  } catch (error) {
    console.error('檢查帳戶狀態失敗:', error);
    res.status(500).json({
      success: false,
      error: '檢查失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/resend-email-verification
 * 重新發送 Email 驗證
 */
router.post('/resend-email-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: '請提供 Email 地址'
      });
    }
    
    const user = await query(
      'SELECT id, username, email_verified FROM users WHERE email = ?',
      [email]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '找不到此 Email 地址的帳戶'
      });
    }
    
    const userData = user.rows[0];
    
    if (userData.email_verified) {
      return res.status(400).json({
        success: false,
        error: 'Email 已驗證',
        message: '此 Email 地址已經驗證過了'
      });
    }
    
    const result = await verificationService.sendEmailVerification(
      userData.id, 
      userData.email, 
      userData.username
    );
    
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('重新發送驗證郵件失敗:', error);
    res.status(500).json({
      success: false,
      error: '發送失敗',
      message: error.message
    });
  }
});

module.exports = router; 