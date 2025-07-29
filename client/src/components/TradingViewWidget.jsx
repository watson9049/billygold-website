import { useEffect, useRef } from 'react'

function TradingViewWidget({ symbol = 'GOLD', theme = 'light', style = '1', height = 400 }) {
  const container = useRef()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "FOREXCOM:${symbol}",
        "interval": "D",
        "timezone": "Asia/Taipei",
        "theme": "${theme}",
        "style": "${style}",
        "locale": "zh_TW",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`
    
    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [symbol, theme, style])

  return (
    <div className="tradingview-widget-container">
      <div ref={container} style={{ height: `${height}px` }}></div>
    </div>
  )
}

// 簡化的價格顯示小工具
function TradingViewPriceWidget({ symbol = 'GOLD', theme = 'light' }) {
  const container = useRef()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = `
      {
        "symbols": [
          [
            "FOREXCOM:${symbol}|1D"
          ]
        ],
        "chartOnly": false,
        "width": "100%",
        "height": "100%",
        "locale": "zh_TW",
        "colorTheme": "${theme}",
        "autosize": true,
        "showVolume": false,
        "showMA": false,
        "hideDateRanges": false,
        "hideMarketStatus": false,
        "hideSymbolLogo": false,
        "scalePosition": "right",
        "scaleMode": "Normal",
        "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        "fontSize": "10",
        "noTimeScale": false,
        "valuesTracking": "1",
        "changeMode": "price-and-percent",
        "chartType": "area",
        "maLineColor": "#2962FF",
        "maLineWidth": 1,
        "maLength": 9,
        "lineWidth": 2,
        "lineType": 0
      }`
    
    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [symbol, theme])

  return (
    <div className="tradingview-widget-container">
      <div ref={container} style={{ height: '200px' }}></div>
    </div>
  )
}

// 多商品價格小工具
function TradingViewMultiSymbolWidget({ symbols = ['GOLD', 'SILVER'], theme = 'light' }) {
  const container = useRef()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = `
      {
        "colorTheme": "${theme}",
        "dateRange": "12M",
        "showChart": true,
        "locale": "zh_TW",
        "largeChartUrl": "",
        "isTransparent": false,
        "showSymbolLogo": true,
        "showFloatingTooltip": false,
        "width": "100%",
        "height": "100%",
        "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
        "plotLineColorFalling": "rgba(41, 98, 255, 1)",
        "gridLineColor": "rgba(240, 243, 250, 0)",
        "scaleFontColor": "rgba(120, 123, 134, 1)",
        "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
        "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
        "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
        "tabs": [
          {
            "title": "貴金屬",
            "symbols": [
              {
                "s": "FOREXCOM:${symbols[0]}",
                "d": "黃金"
              },
              {
                "s": "FOREXCOM:${symbols[1]}",
                "d": "白銀"
              },
              {
                "s": "FOREXCOM:PLATINUM",
                "d": "鉑金"
              },
              {
                "s": "FOREXCOM:PALLADIUM",
                "d": "鈀金"
              }
            ],
            "originalTitle": "貴金屬"
          }
        ]
      }`
    
    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [symbols, theme])

  return (
    <div className="tradingview-widget-container">
      <div ref={container} style={{ height: '400px' }}></div>
    </div>
  )
}

export { TradingViewWidget, TradingViewPriceWidget, TradingViewMultiSymbolWidget } 