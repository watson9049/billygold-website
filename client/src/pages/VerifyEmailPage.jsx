import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Mail, CheckCircle, AlertCircle, ArrowLeft, Loader } from 'lucide-react'
import { authService } from '../services/authService'

function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setVerificationStatus('error')
      setMessage('無效的驗證連結')
      setLoading(false)
      return
    }

    verifyEmail(token)
  }, [searchParams])

  const verifyEmail = async (token) => {
    try {
      const response = await authService.verifyEmail(token)
      
      if (response.success) {
        setVerificationStatus('success')
        setMessage('Email 驗證成功！')
        
        // 自動登入
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        
        // 3秒後跳轉到首頁
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } else {
        setVerificationStatus('error')
        setMessage(response.error || '驗證失敗')
      }
    } catch (error) {
      setVerificationStatus('error')
      setMessage(error.message || '驗證失敗')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verifying':
        return <Loader className="w-16 h-16 text-yellow-500 animate-spin" />
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'error':
        return <AlertCircle className="w-16 h-16 text-red-500" />
      default:
        return <Mail className="w-16 h-16 text-gray-500" />
    }
  }

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'verifying':
        return '正在驗證...'
      case 'success':
        return '驗證成功！'
      case 'error':
        return '驗證失敗'
      default:
        return 'Email 驗證'
    }
  }

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'verifying':
        return '正在驗證您的 Email 地址，請稍候...'
      case 'success':
        return '您的 Email 已成功驗證！正在為您跳轉到首頁...'
      case 'error':
        return message || '驗證失敗，請檢查您的連結是否正確'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* 返回按鈕 */}
        <Link 
          to="/login" 
          className="absolute -top-16 left-0 flex items-center text-gray-600 hover:text-yellow-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回登入
        </Link>

        {/* 主要卡片 */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* 狀態圖標 */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {getStatusTitle()}
            </h2>
            <p className="text-gray-600">
              {getStatusMessage()}
            </p>
          </div>

          {/* 成功狀態的額外資訊 */}
          {verificationStatus === 'success' && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-800 font-medium">歡迎加入黃金比例系統！</span>
              </div>
              <p className="text-green-700 text-sm">
                您的帳戶已成功驗證，現在可以開始使用所有功能了。
              </p>
            </div>
          )}

          {/* 錯誤狀態的解決方案 */}
          {verificationStatus === 'error' && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-800 font-medium">驗證失敗</span>
              </div>
              <p className="text-red-700 text-sm mb-3">
                {message}
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-red-600">可能的解決方案：</p>
                <ul className="text-red-600 list-disc list-inside space-y-1">
                  <li>檢查 Email 中的驗證連結是否完整</li>
                  <li>確認連結沒有被截斷或修改</li>
                  <li>如果連結已過期，請重新註冊或聯繫客服</li>
                </ul>
              </div>
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="space-y-3">
            {verificationStatus === 'success' && (
              <button
                onClick={() => navigate('/')}
                className="btn-primary w-full"
              >
                立即前往首頁
              </button>
            )}

            {verificationStatus === 'error' && (
              <div className="space-y-3">
                <Link 
                  to="/login" 
                  className="btn-primary w-full text-center"
                >
                  返回登入
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  重新註冊
                </Link>
              </div>
            )}

            {verificationStatus === 'verifying' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">請稍候...</p>
              </div>
            )}
          </div>

          {/* 其他選項 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              需要幫助？{' '}
              <Link to="/contact" className="text-yellow-600 hover:text-yellow-700 font-medium">
                聯繫客服
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage 