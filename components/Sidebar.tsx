
import React from 'react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: ViewMode.DASHBOARD, label: 'Real-time Grid', icon: 'fa-bolt' },
    { id: ViewMode.FORECAST, label: 'Demand Forecast', icon: 'fa-chart-line' },
    { id: ViewMode.ALERTS, label: 'Grid Alerts', icon: 'fa-triangle-exclamation' },
    { id: ViewMode.REPORTS, label: 'Reports & Export', icon: 'fa-file-invoice' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3 text-blue-500">
          <i className="fas fa-microchip text-3xl"></i>
          <span className="text-xl font-bold tracking-tight text-white">SmartGrid AI</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>AI ENGINE ACTIVE</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Connected to Gemini 3 for predictive analytics & anomaly detection.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
