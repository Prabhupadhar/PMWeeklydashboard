
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardData, HealthStatus, Risk, ActionItem, Milestone } from '../types';
import { generateDashboardInsights } from '../services/geminiService';
import { 
  ArrowLeft, Save, Upload, Plus, Trash2, 
  Share2, Sparkles, CheckCircle2, 
  AlertTriangle, ListTodo, Activity, Calendar,
  Target, Users, ShieldAlert, Layers, Zap, Download,
  BarChart, Wallet, Heart, Layout, X, TrendingUp, Users2, Timer
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart as ReBarChart, Bar, XAxis, YAxis, 
  LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts';

interface Props {
  dashboards: DashboardData[];
  onSave: (dashboard: DashboardData) => void;
}

const DashboardEditorPage: React.FC<Props> = ({ dashboards, onSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const existing = dashboards.find(d => d.id === id);
      if (existing) {
        setData(existing);
      }
    }
  }, [id, dashboards]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const insights = await generateDashboardInsights(text);
        setData(insights);
      } catch (err) {
        setError("AI analysis failed. Please check your data source.");
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    if (data) {
      onSave({ ...data, lastUpdated: new Date().toISOString() });
      navigate('/');
    }
  };

  const updateField = <K extends keyof DashboardData>(key: K, value: DashboardData[K]) => {
    if (data) {
      setData({ ...data, [key]: value });
    }
  };

  const toggleWidget = (widgetId: string) => {
    if (!data) return;
    const current = data.activeWidgets || [];
    const updated = current.includes(widgetId)
      ? current.filter(id => id !== widgetId)
      : [...current, widgetId];
    updateField('activeWidgets', updated);
  };

  const isWidgetActive = (widgetId: string) => data?.activeWidgets?.includes(widgetId);

  const handleExportPDF = () => {
    window.print();
  };

  // Helper for widget wrapper style
  const widgetClass = "bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col h-full print:break-inside-avoid print:shadow-none";

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-slate-100 border-t-purple-600 rounded-[24px] animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900">Synchronizing Project Data...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] pb-24">
      {/* Dynamic Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 no-print">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="p-2.5 text-slate-400 hover:text-purple-600 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600">Reporting Studio</span>
              <h1 className="text-xl font-bold text-slate-900">{data ? data.projectName : 'Status Brain'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {data && (
              <>
                <button onClick={() => setIsWidgetModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-purple-600 transition-all shadow-lg shadow-slate-200">
                  <Layout className="w-4 h-4" /> Widgets
                </button>
                <button onClick={handleExportPDF} className="p-3 text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">
                  <Download className="w-5 h-5" />
                </button>
                <button onClick={handleSave} className="px-8 py-3 bg-purple-600 text-white font-black rounded-2xl hover:brightness-110 shadow-xl shadow-purple-100 transition-all">
                  Sync & Save
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-12 print-full">
        {!data ? (
          <div className="max-w-2xl mx-auto py-20 text-center bg-white p-16 rounded-[48px] shadow-2xl border border-slate-100">
            <div className="w-24 h-24 ai-gradient-bg rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl float-anim">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-6">Import Project Workspace</h2>
            <p className="text-slate-500 text-lg mb-10">Upload your Jira CSV or board export to automatically build your weekly dashboard.</p>
            <label className="cursor-pointer inline-flex items-center px-12 py-5 bg-purple-600 text-white font-black text-xl rounded-[24px] shadow-2xl shadow-purple-100 hover:-translate-y-1 transition-all">
              <Zap className="mr-3 h-6 w-6" /> Identify & Generate
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
            {error && <div className="mt-8 p-4 text-red-500 bg-red-50 rounded-2xl font-bold border border-red-100">{error}</div>}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Header / Summary Card */}
            <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 relative overflow-hidden print:border-slate-200">
                <div className={`absolute top-0 left-0 right-0 h-2 ${data.overallStatus.includes('On Track') ? 'bg-green-500' : data.overallStatus.includes('At Risk') ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                        data.overallStatus.includes('On Track') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>Status: {data.overallStatus}</span>
                    </div>
                    <input value={data.projectName} onChange={(e) => updateField('projectName', e.target.value)} className="text-5xl font-black text-slate-900 bg-transparent border-none focus:ring-0 p-0 mb-4 w-full outline-none" />
                    <div className="flex items-center gap-4 text-slate-400 font-bold uppercase text-xs tracking-widest">
                      <Calendar className="w-4 h-4" />
                      <input value={data.reportingPeriod} onChange={(e) => updateField('reportingPeriod', e.target.value)} className="bg-transparent border-none focus:ring-0 p-0 outline-none" />
                    </div>
                  </div>
                  <div className="lg:w-1/3 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Executive Highlight
                    </h4>
                    <textarea value={data.executiveSummary} onChange={(e) => updateField('executiveSummary', e.target.value)} className="w-full bg-transparent border-none focus:ring-0 p-0 text-base font-semibold text-slate-700 h-32 leading-relaxed resize-none outline-none" />
                  </div>
                </div>
            </div>

            {/* Grid for Medium Widgets - Auto Fitting for Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              
              {/* Widget: Velocity Allocation (Pie) */}
              {isWidgetActive('progress') && (
                <div className={widgetClass}>
                  <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3"><Target className="w-5 h-5 text-purple-600" /> Velocity Allocation</h3>
                  <div className="h-64 relative flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Done', value: data.progress.completed, color: '#8b5cf6' },
                            { name: 'Doing', value: data.progress.inProgress, color: '#c084fc' },
                            { name: 'Todo', value: data.progress.todo, color: '#f1f5f9' },
                            { name: 'Blocked', value: data.progress.blocked, color: '#ef4444' }
                          ]}
                          innerRadius={65} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none"
                        >
                          <Cell fill="#8b5cf6" /><Cell fill="#c084fc" /><Cell fill="#e2e8f0" /><Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      {/* Fix: Directly access progress properties to avoid TypeScript errors with Object.values and reduce on line 208 */}
                      <span className="text-3xl font-black text-slate-900">
                        {Math.round((data.progress.completed / ((data.progress.completed + data.progress.inProgress + data.progress.todo + data.progress.blocked) || 1)) * 100)}%
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Success Rate</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Widget: Highlights (List) */}
              {isWidgetActive('highlights') && (
                <div className={widgetClass}>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-3"><Sparkles className="w-5 h-5 text-amber-500" /> Key Achievements</h3>
                    <button onClick={() => updateField('achievements', [...data.achievements, 'New critical win'])} className="no-print p-2 bg-slate-50 hover:bg-purple-50 rounded-full text-slate-400 hover:text-purple-600 transition-all"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-4 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                    {data.achievements.map((a, i) => (
                      <div key={i} className="flex gap-4 group">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <input value={a} onChange={(e) => {
                          const arr = [...data.achievements]; arr[i] = e.target.value; updateField('achievements', arr);
                        }} className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-slate-700 outline-none" />
                        <button onClick={() => updateField('achievements', data.achievements.filter((_, idx) => idx !== i))} className="no-print opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NEW Widget: Burn-down Trend (Area Chart) */}
              {isWidgetActive('trend') && data.burnTrend && (
                <div className={widgetClass}>
                  <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3"><TrendingUp className="w-5 h-5 text-blue-500" /> Velocity Trend</h3>
                  <div className="h-64 flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.burnTrend}>
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* NEW Widget: Workload Distribution (Bar) */}
              {isWidgetActive('workload') && data.workloadDistribution && (
                <div className={widgetClass}>
                  <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3"><Users2 className="w-5 h-5 text-indigo-500" /> Team Capacity</h3>
                  <div className="h-64 flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart layout="vertical" data={data.workloadDistribution}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 11, fontWeight: 700 }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={20} />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* NEW Widget: Phase Progress (Gauges/Bars) */}
              {isWidgetActive('phases') && data.phaseProgress && (
                <div className={widgetClass}>
                  <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3"><Timer className="w-5 h-5 text-emerald-500" /> Phase Readiness</h3>
                  <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                    {data.phaseProgress.map((p, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                          <span>{p.phase}</span>
                          <span className="text-slate-900">{p.percent}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${p.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Widget: Pulse Check (Sidebar Style integrated) */}
              <div className="bg-slate-900 p-10 rounded-[40px] shadow-xl text-white flex flex-col">
                  <h3 className="text-lg font-black mb-10 flex items-center gap-3 text-purple-400"><Activity className="w-6 h-6" /> Health Index</h3>
                  <div className="space-y-8 flex-1">
                    {[
                      { label: 'Schedule', key: 'scheduleHealth' as const, icon: Calendar },
                      { label: 'Scope', key: 'scopeHealth' as const, icon: Layers },
                      { label: 'Quality', key: 'qualityHealth' as const, icon: Target },
                      { label: 'Personnel', key: 'resourceHealth' as const, icon: Users },
                    ].map((item) => (
                      <div key={item.key} className="flex justify-between items-center">
                        <div className="flex items-center gap-3 text-slate-400 group">
                          <item.icon className="w-5 h-5" />
                          <span className="font-bold text-sm text-slate-300">{item.label}</span>
                        </div>
                        <select
                          value={data[item.key]}
                          onChange={(e) => updateField(item.key, e.target.value as HealthStatus)}
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer bg-transparent appearance-none text-center ${
                            data[item.key].includes('On Track') ? 'border-green-500 text-green-400' : 'border-amber-500 text-amber-400'
                          }`}
                        >
                          <option value={HealthStatus.ON_TRACK}>On Track</option>
                          <option value={HealthStatus.AT_RISK}>At Risk</option>
                          <option value={HealthStatus.OFF_TRACK}>Off Track</option>
                        </select>
                      </div>
                    ))}
                  </div>
              </div>
            </div>

            {/* Wide Section: Risks & Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {/* Risks Widget */}
              {isWidgetActive('risks') && (
                <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-red-500" /> Critical Impediments</h3>
                    <button onClick={() => updateField('risks', [...data.risks, { id: Math.random().toString(), description: 'New risk identified', impact: 'Medium', mitigation: 'TBD' }])} className="no-print text-sm font-bold text-purple-600">+ Log Risk</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.risks.map((r, i) => (
                      <div key={r.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                        <div className={`text-[9px] font-black uppercase tracking-tighter mb-2 ${r.impact === 'High' ? 'text-red-600' : 'text-amber-600'}`}>{r.impact} Impact</div>
                        <input value={r.description} onChange={(e) => {
                          const arr = [...data.risks]; arr[i].description = e.target.value; updateField('risks', arr);
                        }} className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-slate-900 outline-none" />
                        <button onClick={() => updateField('risks', data.risks.filter(risk => risk.id !== r.id))} className="no-print absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Widget */}
              {isWidgetActive('actions') && (
                <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><ListTodo className="w-8 h-8 text-purple-600" /> Operational Actions</h3>
                    <button onClick={() => updateField('actionItems', [...data.actionItems, { id: Math.random().toString(), task: 'New action item', owner: 'Unassigned', dueDate: 'TBD', status: 'Open' }])} className="no-print p-3 bg-slate-900 text-white rounded-2xl"><Plus className="w-5 h-5" /></button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
                        <tr><th className="pb-6 text-left">Task</th><th className="pb-6 text-left">Owner</th><th className="pb-6 text-left">Due</th><th className="pb-6 text-right no-print"></th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {data.actionItems.map((ai, i) => (
                          <tr key={ai.id} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-5 font-bold text-slate-900 text-sm"><input value={ai.task} onChange={(e) => {
                              const arr = [...data.actionItems]; arr[i].task = e.target.value; updateField('actionItems', arr);
                            }} className="w-full bg-transparent border-none focus:ring-0 p-0 outline-none" /></td>
                            <td className="py-5 text-slate-600 text-sm font-bold uppercase tracking-tighter">{ai.owner}</td>
                            <td className="py-5 text-slate-400 text-xs font-bold">{ai.dueDate}</td>
                            <td className="py-5 text-right no-print"><button onClick={() => updateField('actionItems', data.actionItems.filter(item => item.id !== ai.id))} className="opacity-0 group-hover:opacity-100 text-slate-200 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Widget Modal */}
      {isWidgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6 no-print">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900">Insight Library</h2>
              <button onClick={() => setIsWidgetModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-500" /></button>
            </div>
            <div className="p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {[
                { id: 'progress', label: 'Velocity Pie', icon: Target, desc: 'Completion breakdown' },
                { id: 'highlights', label: 'Highlights', icon: Sparkles, desc: 'Key achievements list' },
                { id: 'trend', label: 'Progress Trend', icon: TrendingUp, desc: 'Daily activity area chart' },
                { id: 'workload', label: 'Team Workload', icon: Users2, desc: 'Capacity bar chart' },
                { id: 'phases', label: 'Phase Progress', icon: Timer, desc: 'Linear phase tracking' },
                { id: 'risks', label: 'Risk Registry', icon: ShieldAlert, desc: 'Threat cards' },
                { id: 'actions', label: 'Operational Actions', icon: ListTodo, desc: 'Task table' },
                { id: 'budget', label: 'Finance Health', icon: Wallet, desc: 'Budget utilization' },
                { id: 'sentiment', label: 'Morale Pulse', icon: Heart, desc: 'Team happiness level' },
              ].map(w => (
                <button
                  key={w.id}
                  onClick={() => toggleWidget(w.id)}
                  className={`p-6 rounded-3xl border-2 text-left transition-all group ${
                    isWidgetActive(w.id) 
                      ? 'border-purple-600 bg-purple-50 ring-4 ring-purple-100' 
                      : 'border-slate-100 hover:border-purple-200 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    isWidgetActive(w.id) ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-500'
                  }`}><w.icon className="w-6 h-6" /></div>
                  <div className="font-black text-slate-900 text-sm mb-1">{w.label}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{w.desc}</div>
                </button>
              ))}
            </div>
            <div className="p-8 border-t border-slate-100 text-center bg-slate-50/50">
              <button onClick={() => setIsWidgetModalOpen(false)} className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-purple-600 transition-all">Close Library</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Snapshot Action */}
      <div className="fixed bottom-10 right-10 no-print">
        <button
          onClick={() => {
            if (!data) return;
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `brain-dump-${Date.now()}.json`;
            a.click();
          }}
          className="bg-white text-slate-900 border border-slate-200 p-5 rounded-[24px] shadow-2xl hover:bg-slate-50 transition-all group"
          title="Backup Workspace"
        >
          <Share2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default DashboardEditorPage;
