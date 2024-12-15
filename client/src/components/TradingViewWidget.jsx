import React, { useEffect, useRef, memo, useState } from 'react';

const WIDGET_TYPES = {
  STOCK_HEATMAP: {
    script: "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js",
    defaultConfig: {
      exchanges: [],
      dataSource: "SPX500",
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change",
      locale: "en",
      symbolUrl: "",
      colorTheme: "dark",
      hasTopBar: false,
      isDataSetEnabled: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      isMonoSize: false,
      width: "100%",
      height: "700px"
    }
  },
  FOREX_HEATMAP: {
    script: "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js",
    defaultConfig: {
      width: "100%",
      height: "700px",
      currencies: ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD", "CNY"],
      isTransparent: false,
      colorTheme: "dark",
      locale: "en"
    }
  },
  TICKERS: {
    script: "https://s3.tradingview.com/external-embedding/embed-widget-tickers.js",
    defaultConfig: {
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "US 100" },
        { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" }
      ],
      colorTheme: "dark",
      isTransparent: false,
      showSymbolLogo: true,
      locale: "en",
      width: "100%",
      height: "700px"
    }
  },
  CRYPTO_SCREENER: {
    script: "https://s3.tradingview.com/external-embedding/embed-widget-screener.js",
    defaultConfig: {
      width: "100%",
      height: "700px",
      defaultColumn: "overview",
      defaultScreen: "general",
      market: "crypto",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: "dark",
      locale: "en",
      showToolbar: true
    }
  },
  STOCK_SCREENER: {
    script: "https://s3.tradingview.com/external-embedding/embed-widget-screener.js",
    defaultConfig: {
      width: "100%",
      height: "700px",
      defaultColumn: "overview",
      defaultScreen: "most_capitalized",
      market: "us",
      showToolbar: true,
      colorTheme: "dark",
      locale: "en"
    }
  }
};

function TradingViewWidget({ widgetType = 'STOCK_HEATMAP', config = {} }) {
  const container = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!container.current) return;

    // Reset states
    setIsLoading(true);
    setError(null);

    // Clean up previous widget
    while (container.current.firstChild) {
      container.current.removeChild(container.current.firstChild);
    }

    try {
      const widgetConfig = WIDGET_TYPES[widgetType];
      if (!widgetConfig) {
        throw new Error(`Invalid widget type: ${widgetType}`);
      }

      // Create widget container
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "tradingview-widget-container__widget";
      container.current.appendChild(widgetContainer);

      // Create and configure script
      const script = document.createElement("script");
      script.src = widgetConfig.script;
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        ...widgetConfig.defaultConfig,
        ...config
      });

      // Handle script loading
      script.onload = () => setIsLoading(false);
      script.onerror = () => {
        setError("Failed to load TradingView widget");
        setIsLoading(false);
      };

      container.current.appendChild(script);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (container.current) {
        while (container.current.firstChild) {
          container.current.removeChild(container.current.firstChild);
        }
      }
    };
  }, [widgetType, config]);

  return (
    <div className="relative w-full h-[700px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900">
          <p className="text-red-600 dark:text-red-200">{error}</p>
        </div>
      )}
      <div 
        className="tradingview-widget-container w-full h-full" 
        ref={container}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </div>
  );
}

export default memo(TradingViewWidget);