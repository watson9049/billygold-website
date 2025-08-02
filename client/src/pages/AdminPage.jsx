import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, TrendingUp, Clock, DollarSign, Save, Plus, Package, Users, BarChart3 } from 'lucide-react'

function AdminPage() {
  const navigate = useNavigate();
  const [priceSettings, setPriceSettings] = useState({
    updateInterval: 900000, // 15分鐘
    minInterval: 900000,
    maxInterval: 86400000,
    exchangeRate: 31.5,
    workmanshipFee: 500
  })

  const [currentGoldPrice, setCurrentGoldPrice] = useState(2050.50)

  const updateIntervals = [
    { label: '15分鐘', value: 900000 },
    { label: '30分鐘', value: 1800000 },
    { label: '1小時', value: 3600000 },
    { label: '4小時', value: 14400000 },
    { label: '8小時', value: 28800000 },
    { label: '24小時', value: 86400000 }
  ]

  const handleSave = () => {
    // 這裡會調用API保存設定
    console.log('保存設定:', priceSettings)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">管理後台</h1>
          <p className="text-gray-600">管理商品、價格設定和系統功能</p>
        </div>

        {/* 快速操作卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/product-upload')}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">商品上架</h3>
                <p className="text-sm text-gray-600">新增商品到系統</p>
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/product-management')}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">商品管理</h3>
                <p className="text-sm text-gray-600">查看和編輯商品</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">客戶管理</h3>
                <p className="text-sm text-gray-600">管理客戶資料</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">銷售報表</h3>
                <p className="text-sm text-gray-600">查看銷售數據</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Status */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                即時金價狀態
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gold-50 rounded-lg">
                  <div className="text-2xl font-bold text-gold-600">
                    ${currentGoldPrice}
                  </div>
                  <div className="text-sm text-gray-600">國際金價 (USD/oz)</div>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {priceSettings.exchangeRate}
                  </div>
                  <div className="text-sm text-gray-600">匯率 (TWD/USD)</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    NT$ {Math.round(currentGoldPrice * priceSettings.exchangeRate * 0.83)}
                  </div>
                  <div className="text-sm text-gray-600">台錢價格 (NT$/台錢)</div>
                </div>
              </div>
            </div>

            {/* Price History Chart */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">價格走勢圖</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">價格走勢圖將在這裡顯示</p>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Update Interval Settings */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-600" />
                更新頻率設定
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    價格更新間隔
                  </label>
                  <select
                    value={priceSettings.updateInterval}
                    onChange={(e) => setPriceSettings({
                      ...priceSettings,
                      updateInterval: parseInt(e.target.value)
                    })}
                    className="input-field"
                  >
                    {updateIntervals.map((interval) => (
                      <option key={interval.value} value={interval.value}>
                        {interval.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  <p>最小間隔: 15分鐘</p>
                  <p>最大間隔: 24小時</p>
                </div>
              </div>
            </div>

            {/* Exchange Rate Settings */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                匯率設定
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    美元兌台幣匯率
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceSettings.exchangeRate}
                    onChange={(e) => setPriceSettings({
                      ...priceSettings,
                      exchangeRate: parseFloat(e.target.value)
                    })}
                    className="input-field"
                  />
                </div>
                <button className="btn-secondary w-full">
                  自動更新匯率
                </button>
              </div>
            </div>

            {/* Workmanship Fee Settings */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                工錢設定
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    預設工錢 (NT$/台錢)
                  </label>
                  <input
                    type="number"
                    value={priceSettings.workmanshipFee}
                    onChange={(e) => setPriceSettings({
                      ...priceSettings,
                      workmanshipFee: parseInt(e.target.value)
                    })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>保存設定</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage 