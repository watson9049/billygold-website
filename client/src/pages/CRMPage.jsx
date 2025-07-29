import { useState, useEffect } from 'react'
import { Users, Search, Plus, Mail, Phone, Calendar, Filter } from 'lucide-react'

function CRMPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  })

  // 模擬客戶資料
  const mockCustomers = [
    {
      id: '1',
      name: '張小明',
      email: 'zhang@example.com',
      phone: '0912-345-678',
      status: 'active',
      lastVisit: '2024-01-15',
      totalSpent: 125000,
      orders: 3,
      preferences: ['戒指', '項鍊']
    },
    {
      id: '2',
      name: '李小華',
      email: 'li@example.com',
      phone: '0923-456-789',
      status: 'active',
      lastVisit: '2024-01-12',
      totalSpent: 89000,
      orders: 2,
      preferences: ['手鍊', '耳環']
    },
    {
      id: '3',
      name: '王小美',
      email: 'wang@example.com',
      phone: '0934-567-890',
      status: 'inactive',
      lastVisit: '2023-12-20',
      totalSpent: 45000,
      orders: 1,
      preferences: ['項鍊']
    },
    {
      id: '4',
      name: '陳小強',
      email: 'chen@example.com',
      phone: '0945-678-901',
      status: 'active',
      lastVisit: '2024-01-10',
      totalSpent: 210000,
      orders: 5,
      preferences: ['戒指', '手鍊', '項鍊']
    }
  ]

  useEffect(() => {
    // 模擬API調用
    setTimeout(() => {
      setCustomers(mockCustomers)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return '活躍'
      case 'inactive':
        return '非活躍'
      default:
        return '未知'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入客戶資料中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">客戶管理</h1>
          <p className="text-gray-600">管理客戶資料、追蹤購買記錄與偏好設定</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-2">
              {customers.length}
            </div>
            <div className="text-gray-600">總客戶數</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {customers.filter(c => c.status === 'active').length}
            </div>
            <div className="text-gray-600">活躍客戶</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {customers.reduce((sum, c) => sum + c.orders, 0)}
            </div>
            <div className="text-gray-600">總訂單數</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gold-600 mb-2">
              NT$ {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">總營業額</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜尋客戶姓名或Email..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="input-field"
              >
                <option value="">所有狀態</option>
                <option value="active">活躍</option>
                <option value="inactive">非活躍</option>
              </select>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>新增客戶</span>
              </button>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    客戶資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最後造訪
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    訂單數
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    總消費
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    偏好
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <Mail className="w-3 h-3" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <Phone className="w-3 h-3" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {getStatusText(customer.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{customer.lastVisit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      NT$ {customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {customer.preferences.map((pref, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        編輯
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        查看詳情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CRMPage 