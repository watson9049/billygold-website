import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Search, Plus, Mail, Phone, Calendar, Filter, Edit, Trash2, Eye, AlertCircle, Shield } from 'lucide-react'
import { crmService } from '../services/crmService'
import { authService } from '../services/authService'
import CustomerForm from '../components/CustomerForm'

function CRMPage() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [editingCustomer, setEditingCustomer] = useState(null)

  // 載入客戶數據
  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {}
      if (filters.search) params.search = filters.search
      if (filters.status) params.status = filters.status
      
      const response = await crmService.getCustomers(params)
      setCustomers(response.data.customers)
    } catch (err) {
      setError(err.message)
      console.error('載入客戶失敗:', err)
    } finally {
      setLoading(false)
    }
  }

  // 載入統計數據
  const loadStats = async () => {
    try {
      const response = await crmService.getCustomerStats()
      setStats(response.data)
    } catch (err) {
      console.error('載入統計失敗:', err)
    }
  }

  // 搜尋客戶
  const handleSearch = (e) => {
    const value = e.target.value
    setFilters(prev => ({ ...prev, search: value }))
  }

  // 狀態篩選
  const handleStatusFilter = (e) => {
    const value = e.target.value
    setFilters(prev => ({ ...prev, status: value }))
  }

  // 刪除客戶
  const handleDeleteCustomer = async (customerId, customerName) => {
    if (!window.confirm(`確定要刪除客戶 "${customerName}" 嗎？此操作無法復原。`)) {
      return
    }

    try {
      await crmService.deleteCustomer(customerId)
      // 重新載入數據
      await loadCustomers()
      await loadStats()
    } catch (err) {
      alert(`刪除失敗: ${err.message}`)
    }
  }

  // 查看客戶詳情
  const handleViewCustomer = async (customerId) => {
    try {
      const response = await crmService.getCustomer(customerId)
      setSelectedCustomer(response.data)
    } catch (err) {
      alert(`獲取客戶詳情失敗: ${err.message}`)
    }
  }

  // 編輯客戶
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setShowEditModal(true)
  }

  // 新增客戶
  const handleCreateCustomer = () => {
    setShowCreateModal(true)
  }

  // 保存客戶
  const handleSaveCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        // 更新客戶
        await crmService.updateCustomer(editingCustomer.id, customerData)
        alert('客戶資料更新成功！')
      } else {
        // 新增客戶
        await crmService.createCustomer(customerData)
        alert('客戶新增成功！')
      }
      
      // 重新載入數據
      await loadCustomers()
      await loadStats()
      
      // 關閉模態框
      setShowCreateModal(false)
      setShowEditModal(false)
      setEditingCustomer(null)
    } catch (err) {
      alert(`保存失敗: ${err.message}`)
      throw err
    }
  }

  // 權限檢查
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated()
      const currentUser = authService.getCurrentUserFromStorage()
      
      if (!isAuthenticated) {
        navigate('/login')
        return
      }
      
      if (currentUser?.role !== 'admin') {
        navigate('/')
        return
      }
    }
    
    checkAuth()
  }, [navigate])

  // 當篩選條件改變時重新載入
  useEffect(() => {
    loadCustomers()
  }, [filters])

  // 初始載入
  useEffect(() => {
    loadCustomers()
    loadStats()
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

  if (loading && customers.length === 0) {
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

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-2">
              {stats.totalCustomers}
            </div>
            <div className="text-gray-600">總客戶數</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {stats.activeCustomers}
            </div>
            <div className="text-gray-600">活躍客戶</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {stats.totalOrders}
            </div>
            <div className="text-gray-600">總訂單數</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gold-600 mb-2">
              NT$ {stats.totalRevenue?.toLocaleString() || '0'}
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
                  onChange={handleSearch}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filters.status}
                onChange={handleStatusFilter}
                className="input-field"
              >
                <option value="">所有狀態</option>
                <option value="active">活躍</option>
                <option value="inactive">非活躍</option>
              </select>
              <button 
                className="btn-primary flex items-center space-x-2"
                onClick={handleCreateCustomer}
              >
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
                    最後訂單
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
                        <span>{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('zh-TW') : '無訂單'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.orderCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      NT$ {(customer.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {customer.preferences?.map((pref, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {pref}
                          </span>
                        )) || <span className="text-gray-400 text-xs">無偏好</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleViewCustomer(customer.id)}
                          title="查看詳情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-primary-600 hover:text-primary-900"
                          onClick={() => handleEditCustomer(customer)}
                          title="編輯客戶"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                          title="刪除客戶"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {customers.length === 0 && !loading && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">沒有找到客戶資料</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">客戶詳情</h2>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedCustomer.name}</h3>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  <p className="text-gray-600">{selectedCustomer.phone}</p>
                  {selectedCustomer.address && (
                    <p className="text-gray-600">{selectedCustomer.address}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">偏好設定</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.preferences?.map((pref, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {pref}
                      </span>
                    )) || <span className="text-gray-500">無偏好設定</span>}
                  </div>
                </div>
                
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">訂單歷史</h4>
                    <div className="space-y-2">
                      {selectedCustomer.orders.map((order, index) => (
                        <div key={index} className="border-l-4 border-primary-500 pl-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">訂單 #{order.id.slice(0, 8)}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString('zh-TW')}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            NT$ {order.total_amount?.toLocaleString()} - {order.status}
                          </div>
                          {order.notes && (
                            <div className="text-xs text-gray-500 mt-1">{order.notes}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新增客戶表單 */}
      {showCreateModal && (
        <CustomerForm
          onSave={handleSaveCustomer}
          onCancel={() => setShowCreateModal(false)}
          isEdit={false}
        />
      )}

      {/* 編輯客戶表單 */}
      {showEditModal && editingCustomer && (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onCancel={() => {
            setShowEditModal(false)
            setEditingCustomer(null)
          }}
          isEdit={true}
        />
      )}
    </div>
  )
}

export default CRMPage 