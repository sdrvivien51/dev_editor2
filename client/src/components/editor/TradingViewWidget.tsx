import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "NASDAQ:AAPL",
      interval: "D",
      timezone: "exchange",
      theme: "light",
      style: "0",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      withdateranges: true,
      save_image: false,
      details: true,
      hotlist: true,
      support_host: "https://www.tradingview.com"
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        const script = container.current.querySelector('script');
        if (script) {
          script.remove();
        }
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "600px", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener noreferrer" target="_blank">
          <span className="text-blue-500">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
