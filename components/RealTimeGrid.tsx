
import React from 'react';
import { GridData } from '../types';

interface RealTimeGridProps {
  data: GridData[];
}

const RealTimeGrid: React.FC<RealTimeGridProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'text-green-400 bg-green-400/10';
      case 'Warning': return 'text-amber-400 bg-amber-400/10';
      case 'Critical': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Active Substation Telemetry</h2>
        <div className="flex space-x-2">
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
            LIVE UPDATES
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Region / Substation</th>
              <th className="px-6 py-3 font-medium text-center">Load Status</th>
              <th className="px-6 py-3 font-medium">Consumption</th>
              <th className="px-6 py-3 font-medium">Capacity Util.</th>
              <th className="px-6 py-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((row, idx) => {
              const util = Math.round((row.consumption / row.capacity) * 100);
              return (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{row.substation}</div>
                    <div className="text-xs text-slate-500">{row.region}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full max-w-[120px] bg-slate-800 rounded-full h-1.5 mx-auto">
                      <div 
                        className={`h-1.5 rounded-full ${util > 90 ? 'bg-red-500' : util > 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${util}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-blue-400">
                    {row.consumption} <span className="text-slate-500 text-xs">MW</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">{util}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealTimeGrid;
