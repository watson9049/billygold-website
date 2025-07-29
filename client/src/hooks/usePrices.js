import { useState, useEffect, useCallback } from 'react'
import priceService from '../services/priceService'

export function usePrices() {
  const [prices, setPrices] = useState({
    gold: { price: 3311.96, change: '+12.45', changePercent: '+0.38%' },
    silver: { price: 38.11, change: '-0.23', changePercent: '-0.60%' },
    platinum: { price: 1408.63, change: '+8.92', changePercent: '+0.64%' },
    palladium: { price: 1274.46, change: '-15.30', changePercent: '-1.19%' }
  })
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchAllPrices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await priceService.getAllMetalPrices()
      if (data) {
        setPrices(data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('獲取價格失敗:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllPrices()
  }, [fetchAllPrices])

  // 每15分鐘自動更新價格
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllPrices()
    }, 15 * 60 * 1000) // 15分鐘

    return () => clearInterval(interval)
  }, [fetchAllPrices])

  return {
    prices,
    loading,
    lastUpdate,
    fetchAllPrices
  }
}

export function usePriceStatus() {
  const [status, setStatus] = useState({ status: 'ok', message: '系統正常' })

  const checkStatus = async () => {
    try {
      const response = await priceService.getPriceStatus()
      setStatus(response)
    } catch (error) {
      setStatus({ status: 'error', message: '系統異常' })
    }
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 15 * 60 * 1000) // 15分鐘檢查一次
    return () => clearInterval(interval)
  }, [])

  return { status }
} 