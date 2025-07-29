import React from 'react'

function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <h1 className="text-6xl font-bold text-yellow-600 mb-6">
            🎉 新設計測試成功！
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            如果您看到這個頁面，表示新設計已經正常運作
          </p>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-xl text-xl font-bold inline-block">
            黃金比例 billygold.com
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage 