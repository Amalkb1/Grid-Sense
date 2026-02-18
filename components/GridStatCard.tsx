
import React from 'react';

interface GridStatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon: string;
  color: string;
}

const GridStatCard: React.FC<GridStatCardProps> = ({ title, value, unit, trend, icon, color }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-500 text-xl`}>
          <i className={`fas ${icon}`}></i>
        </div>
        {trend !== undefined && (
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}% <i className={`fas fa-arrow-${trend >= 0 ? 'up' : 'down'} ml-1`}></i>
          </span>
        )}
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline space-x-1">
        <span className="text-3xl font-bold text-white">{value}</span>
        {unit && <span className="text-slate-500 text-sm font-semibold">{unit}</span>}
      </div>
    </div>
  );
};

export default GridStatCard;
