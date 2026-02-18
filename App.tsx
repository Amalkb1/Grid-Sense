
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import GridStatCard from './components/GridStatCard';
import RealTimeGrid from './components/RealTimeGrid';
import { ViewMode, GridData, Alert, DemandForecast } from './types';
import { INITIAL_GRID_DATA, INITIAL_ALERTS } from './constants';
import { getAIForecast, getSmartInsight } from './services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [gridData, setGridData] = useState<GridData[]>(INITIAL_GRID_DATA);
  const [alerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [forecast, setForecast] = useState<DemandForecast[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("Initializing SmartGrid AI Engine...");
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  // Simulation: Small fluctuations in grid data
  useEffect(() => {
    const interval = setInterval(() => {
      setGridData(prev => prev.map(item => ({
        ...item,
        consumption: Math.max(0, item.consumption + (Math.random() - 0.5) * 10),
        status: (item.consumption / item.capacity) > 0.9 ? 'Critical' : (item.consumption / item.capacity) > 0.75 ? 'Warning' : 'Normal'
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchForecast = useCallback(async () => {
    setIsLoadingForecast(true);
    const data = await getAIForecast(gridData);
    setForecast(data);
    setIsLoadingForecast(false);
  }, [gridData]);

  const updateInsight = useCallback(async () => {
    const insight = await getSmartInsight(gridData);
    setAiInsight(insight);
  }, [gridData]);

  useEffect(() => {
    fetchForecast();
    updateInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalConsumption = gridData.reduce((acc, curr) => acc + curr.consumption, 0).toFixed(1);
  const avgLoad = Math.round((gridData.reduce((acc, curr) => acc + (curr.consumption / curr.capacity), 0) / gridData.length) * 100);

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GridStatCard title="Total Grid Load" value={totalConsumption} unit="MW" trend={2.4} icon="fa-bolt" color="blue" />
        <GridStatCard title="Avg Capacity Utilization" value={avgLoad} unit="%" trend={-1.2} icon="fa-chart-pie" color="emerald" />
        <GridStatCard title="Active Substations" value={gridData.length} trend={0} icon="fa-plug" color="indigo" />
        <GridStatCard title="Pending Alerts" value={alerts.length} icon="fa-bell" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RealTimeGrid data={gridData} />
        </div>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fas fa-brain"></i>
              </div>
              <h3 className="font-semibold">AI Assistant Insight</h3>
            </div>
            <p className="text-blue-50 font-medium leading-relaxed italic">
              "{aiInsight}"
            </p>
            <button 
              onClick={updateInsight}
              className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm font-semibold border border-white/20"
            >
              Recalculate Insight
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Urgent Alerts</h3>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${alert.severity === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">{alert.region} • {alert.time}</div>
                    <div className="text-sm text-slate-200 leading-snug">{alert.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderForecast = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Demand Forecasting</h2>
            <p className="text-slate-400">Powered by Gemini AI Predictive Engine</p>
          </div>
          <button 
            onClick={fetchForecast}
            disabled={isLoadingForecast}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoadingForecast ? 'Updating Model...' : 'Refresh Forecast'}
          </button>
        </div>
        
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="MW" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area type="monotone" dataKey="predicted" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPredicted)" name="AI Prediction" strokeWidth={3} />
              <Area type="monotone" dataKey="historical" stroke="#10b981" fillOpacity={1} fill="url(#colorHistorical)" name="Historical Baseline" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl">
          <div className="text-blue-500 mb-2"><i className="fas fa-clock text-2xl"></i></div>
          <h4 className="font-semibold text-white mb-1">Peak Demand Prediction</h4>
          <p className="text-sm text-slate-400">Model predicts peak load between 18:00 - 21:00 reaching up to 620 MW.</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl">
          <div className="text-emerald-500 mb-2"><i className="fas fa-leaf text-2xl"></i></div>
          <h4 className="font-semibold text-white mb-1">Renewable Availability</h4>
          <p className="text-sm text-slate-400">Optimal solar input expected from 10:00 to 15:00. Recommend charging storage units.</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl">
          <div className="text-amber-500 mb-2"><i className="fas fa-shield-alt text-2xl"></i></div>
          <h4 className="font-semibold text-white mb-1">Stability Outlook</h4>
          <p className="text-sm text-slate-400">98.5% confidence in grid stability for next 24h based on current trends.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={view} onViewChange={setView} />
      
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {view === ViewMode.DASHBOARD && 'Operational Dashboard'}
              {view === ViewMode.FORECAST && 'Demand Forecast Analytics'}
              {view === ViewMode.ALERTS && 'Security & Alerts Center'}
              {view === ViewMode.REPORTS && 'Grid Performance Reports'}
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back, Chief Grid Engineer • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
              <i className="fas fa-bell"></i>
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-800"></div>
            <div className="flex items-center space-x-3 pl-2">
              <img src="https://picsum.photos/seed/user/40/40" alt="Avatar" className="w-10 h-10 rounded-full border border-slate-700" />
              <div className="hidden lg:block text-left">
                <div className="text-sm font-semibold text-white">Officer Admin</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">HQ-Level Access</div>
              </div>
            </div>
          </div>
        </header>

        {view === ViewMode.DASHBOARD && renderDashboard()}
        {view === ViewMode.FORECAST && renderForecast()}
        {view === ViewMode.ALERTS && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <i className="fas fa-shield-halved text-6xl text-slate-700 mb-6"></i>
            <h2 className="text-xl font-bold text-white mb-2">Alert Center Management</h2>
            <p className="text-slate-400 max-w-md mx-auto">Access real-time security threats, equipment failures, and overload warnings for all grid sectors.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {alerts.map(a => (
                <div key={a.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-left">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${a.severity === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                    {a.severity} SEVERITY
                  </span>
                  <p className="text-white text-sm mt-2">{a.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {view === ViewMode.REPORTS && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <i className="fas fa-file-pdf text-6xl text-slate-700 mb-6"></i>
            <h2 className="text-xl font-bold text-white mb-2">Compliance & Performance Reports</h2>
            <p className="text-slate-400 max-w-md mx-auto">Generate certified monthly consumption audits and efficiency benchmarks for government stakeholders.</p>
            <div className="mt-8 flex justify-center space-x-4">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all">
                Export Monthly Audit (.PDF)
              </button>
              <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all">
                Dataset Export (.CSV)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
