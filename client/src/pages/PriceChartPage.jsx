import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Crown, TrendingUp, ArrowLeft } from 'lucide-react'
import { TradingViewWidget } from '../components/TradingViewWidget'

function PriceChartPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('GOLD')
  const [selectedInterval, setSelectedInterval] = useState('1D')
  const [selectedTheme, setSelectedTheme] = useState('light')

  const symbols = [
    { value: 'GOLD', label: '黃金', icon: '🥇' },
    { value: 'SILVER', label: '白銀', icon: '🥈' },
    { value: 'PLATINUM', label: '鉑金', icon: '💎' },
    { value: 'PALLADIUM', label: '鈀金', icon: '🔶' }
  ]

  const intervals = [
    { value: '1', label: '1分鐘' },
    { value: '5', label: '5分鐘' },
    { value: '15', label: '15分鐘' },
    { value: '30', label: '30分鐘' },
    { value: '60', label: '1小時' },
    { value: '1D', label: '1天' },
    { value: '1W', label: '1週' },
    { value: '1M', label: '1月' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首頁
              </Link>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
                <h1 className="text-2xl font-bold text-gray-900">價格走勢圖</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 控制面板 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 商品選擇 */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">商品:</span>
              <div className="flex space-x-2">
                {symbols.map((symbol) => (
                  <button
                    key={symbol.value}
                    onClick={() => setSelectedSymbol(symbol.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedSymbol === symbol.value
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{symbol.icon}</span>
                    {symbol.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 時間間隔選擇 */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">時間間隔:</span>
              <select
                value={selectedInterval}
                onChange={(e) => setSelectedInterval(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                {intervals.map((interval) => (
                  <option key={interval.value} value={interval.value}>
                    {interval.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 主題選擇 */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">主題:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTheme('light')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTheme === 'light'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  淺色
                </button>
                <button
                  onClick={() => setSelectedTheme('dark')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTheme === 'dark'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  深色
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 圖表區域 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {symbols.find(s => s.value === selectedSymbol)?.label} 價格走勢
            </h2>
            <p className="text-gray-600">
              即時價格數據，專業技術分析工具
            </p>
          </div>
          
          <div className="h-[600px]">
            <TradingViewWidget 
              symbol={selectedSymbol} 
              theme={selectedTheme} 
              height={600}
              interval={selectedInterval}
            />
          </div>
        </div>

        {/* 市場資訊 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">市場概況</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">開盤價</span>
                <span className="font-semibold">$3,350.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">最高價</span>
                <span className="font-semibold text-green-600">$3,365.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">最低價</span>
                <span className="font-semibold text-red-600">$3,340.20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">成交量</span>
                <span className="font-semibold">1,234,567</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">技術指標</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">RSI</span>
                <span className="font-semibold">65.4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">MACD</span>
                <span className="font-semibold text-green-600">+12.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">布林帶</span>
                <span className="font-semibold">中軌</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">移動平均</span>
                <span className="font-semibold">$3,355.80</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">市場情緒</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">買入信號</span>
                <span className="font-semibold text-green-600">強烈</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">賣出信號</span>
                <span className="font-semibold text-red-600">弱</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">支撐位</span>
                <span className="font-semibold">$3,340</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">阻力位</span>
                <span className="font-semibold">$3,370</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceChartPage 