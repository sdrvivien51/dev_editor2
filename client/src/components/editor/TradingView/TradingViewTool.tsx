
import { createRoot } from 'react-dom/client';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { TradingViewConfig, TradingViewConstructorOptions, WIDGET_TYPES } from './types';

export default class TradingViewTool {
  static get toolbox() {
    return {
      title: 'TradingView',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13.6493C3 16.6044 5.41766 19 8.4 19C10.2744 19 11.9346 18.0492 12.9699 16.5839C13.8145 18.0492 15.6946 19 17.6 19C20.5823 19 23 16.6044 23 13.6493C23 9.91464 19.4324 5 13 5C6.56761 5 3 9.91464 3 13.6493Z" stroke="currentColor" stroke-width="2"/></svg>'
    };
  }

  private data: TradingViewConfig;
  private container: HTMLDivElement | null = null;
  private modalRoot: HTMLDivElement | null = null;
  private modalContainer: any = null;

  constructor({ data, config }: TradingViewConstructorOptions) {
    const defaultType = 'ADVANCED_CHART';
    this.data = {
      widgetType: data?.widgetType || defaultType,
      theme: data?.theme || 'light',
      width: data?.width || '100%',
      height: data?.height || '400',
      settings: {
        ...WIDGET_TYPES[defaultType].defaults,
        ...(data?.settings || {})
      }
    };
  }

  private TradingViewModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [config, setConfig] = useState(this.data);

    const handleWidgetTypeChange = (type: string) => {
      setConfig({
        ...config,
        widgetType: type as keyof typeof WIDGET_TYPES,
        settings: { ...WIDGET_TYPES[type as keyof typeof WIDGET_TYPES].defaults }
      });
    };

    const handleSave = () => {
      this.data = config;
      this.renderWidget();
      onClose();
    };

    const widgetType = WIDGET_TYPES[config.widgetType];

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>TradingView Widget Configuration</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-4">
              <label className="w-24">Widget Type:</label>
              <select
                value={config.widgetType}
                onChange={(e) => handleWidgetTypeChange(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                {Object.entries(WIDGET_TYPES).map(([key, value]) => (
                  <option key={key} value={key}>{value.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24">Theme:</label>
              <select 
                value={config.theme}
                onChange={(e) => setConfig({ ...config, theme: e.target.value as 'light' | 'dark' })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {widgetType.configFields.map(field => (
              <div key={field} className="flex items-center space-x-4">
                <label className="w-24">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <Input
                  value={config.settings[field]}
                  onChange={(e) => setConfig({
                    ...config,
                    settings: { ...config.settings, [field]: e.target.value }
                  })}
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save Widget</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  private renderModal(isOpen: boolean) {
    if (!this.modalRoot) {
      this.modalRoot = document.createElement('div');
      document.body.appendChild(this.modalRoot);
      this.modalContainer = createRoot(this.modalRoot);
    }

    const handleClose = () => {
      if (this.modalContainer) {
        this.modalContainer.render(
          <this.TradingViewModal isOpen={false} onClose={handleClose} />
        );
      }
    };

    this.modalContainer.render(
      <this.TradingViewModal isOpen={isOpen} onClose={handleClose} />
    );
  }

  private renderWidget() {
    if (!this.container) return;

    const widgetContainer = this.container.querySelector('.tradingview-widget-container');
    if (widgetContainer) {
      widgetContainer.innerHTML = '';
    }

    const div = document.createElement('div');
    div.className = 'tradingview-widget-container';
    
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = this.data.height || '400px';
    const widgetId = 'tradingview_' + Math.random().toString(36).substring(7);
    widgetDiv.id = widgetId;
    
    div.appendChild(widgetDiv);
    
    if (!widgetContainer) {
      this.container.appendChild(div);
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;

    const scriptConfig = {
      ...this.data.settings,
      width: this.data.width,
      height: this.data.height,
      theme: this.data.theme,
      container_id: widgetId
    };

    switch (this.data.widgetType) {
      case 'ADVANCED_CHART':
        script.src = 'https://s3.tradingview.com/tv.js';
        script.onload = () => {
          // @ts-ignore
          new TradingView.widget(scriptConfig);
        };
        break;

      case 'STOCK_HEATMAP':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
        script.innerHTML = JSON.stringify(scriptConfig);
        break;

      case 'FOREX_HEATMAP':
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js';
        script.innerHTML = JSON.stringify(scriptConfig);
        break;
    }

    div.appendChild(script);
  }

  render() {
    this.container = document.createElement('div');
    this.container.classList.add('tradingview-tool-container');
    
    const configButton = document.createElement('div');
    const buttonRoot = createRoot(configButton);
    buttonRoot.render(
      <Button
        variant="outline"
        size="sm"
        onClick={() => this.renderModal(true)}
        className="w-full mb-2"
      >
        <Settings2 className="h-4 w-4 mr-2" />
        Configure TradingView Widget
      </Button>
    );

    this.container.appendChild(configButton);
    setTimeout(() => this.renderWidget(), 100);

    return this.container;
  }

  save() {
    return this.data;
  }

  static get sanitize() {
    return {
      widgetType: true,
      theme: true,
      width: true,
      height: true,
      settings: true
    };
  }

  destroy() {
    if (this.modalRoot && document.body.contains(this.modalRoot)) {
      document.body.removeChild(this.modalRoot);
    }
    this.modalRoot = null;
    this.modalContainer = null;
  }
}
