import { Link } from 'react-router-dom'
import { Crown, Clock, Phone, Mail, MapPin, Users } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* 主要內容區域 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 公司資訊 */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">黃金比例</div>
                <div className="text-sm text-gray-400">billygold.com</div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              專業的<span className="whitespace-nowrap align-baseline">黃金</span>投資平台，提供高純度<span className="whitespace-nowrap align-baseline">黃金</span>條塊、即時金價資訊、專業投資建議，讓您的財富穩健成長。
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">10,000+ 客戶信賴</span>
              </div>
            </div>
          </div>

          {/* 產品服務 */}
          <div>
            <h4 className="text-lg font-bold mb-6">產品服務</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  黃金條塊
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  白銀商品
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  收藏幣
                </Link>
              </li>
              <li>
                <Link to="/recycling" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  貴金屬回收
                </Link>
              </li>
              <li>
                <Link to="/price-chart" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  價格走勢
                </Link>
              </li>
            </ul>
          </div>

          {/* 客戶服務 */}
          <div>
            <h4 className="text-lg font-bold mb-6">客戶服務</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/chat" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  比例先生諮詢
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  投資知識
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  線上預約
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  客服中心
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  常見問題
                </Link>
              </li>
            </ul>
          </div>

          {/* 聯絡資訊 */}
          <div>
            <h4 className="text-lg font-bold mb-6">聯絡資訊</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-yellow-400" />
                <div>
                  <div className="font-medium">客服專線</div>
                  <div className="text-sm">04-8332600</div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-yellow-400" />
                <div>
                  <div className="font-medium">營業時間</div>
                  <div className="text-sm">週一至週五 09:00-18:00</div>
                  <div className="text-sm">週六 09:00-17:00</div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-yellow-400" />
                <div>
                  <div className="font-medium">客服信箱</div>
                  <div className="text-sm">service@billygold.com</div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <div>
                  <div className="font-medium">公司地址</div>
                  <div className="text-sm">彰化縣員林市黎明里</div>
                  <div className="text-sm">黎明巷6號</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 版權宣告 */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* 專業版權資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left mb-8">
            {/* 聯絡資訊 */}
            <div className="space-y-3">
              <h4 className="text-yellow-400 font-semibold text-sm">聯絡資訊</h4>
              <div className="text-gray-400 text-xs space-y-2">
                <p>金成美銀樓</p>
                <p>彰化縣員林市黎明里黎明巷6號</p>
                <p>04-8332600</p>
              </div>
            </div>
            
            {/* 行銷團隊 */}
            <div className="space-y-3">
              <h4 className="text-yellow-400 font-semibold text-sm">行銷團隊</h4>
              <div className="text-gray-400 text-xs space-y-2">
                <p>enscon.co來電司康</p>
                <p>TSFF台灣永續影展</p>
                <p>04-8366759</p>

              </div>
            </div>
            
            {/* 風險聲明 */}
            <div className="space-y-3">
              <h4 className="text-yellow-400 font-semibold text-sm">投資風險聲明</h4>
              <div className="text-gray-400 text-xs">
                <p><span className="whitespace-nowrap align-baseline">黃金</span>投資具有價格波動風險，投資人應審慎評估自身財務狀況及風險承受能力。本網站提供的資訊僅供參考，不構成投資建議。</p>
              </div>
            </div>
          </div>
          
          {/* 版權資訊與連結 */}
          <div className="pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              {/* 版權聲明 - 左側 */}
              <div className="text-gray-400 text-xs text-center md:text-left">
                <p>© 2025 黃金比例 billygold.com. 版權所有.</p>
                <p>本網站所有內容均受中華民國著作權法及國際著作權法律的保護</p>
              </div>
              
              {/* 頁腳連結 - 右側 */}
              <div className="flex flex-wrap justify-center md:justify-end gap-6 text-gray-400 text-xs">
                <a href="#" className="hover:text-yellow-400 transition-colors">隱私權政策</a>
                <a href="#" className="hover:text-yellow-400 transition-colors">使用條款</a>
                <a href="#" className="hover:text-yellow-400 transition-colors">免責聲明</a>
                <a href="#" className="hover:text-yellow-400 transition-colors">網站地圖</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 