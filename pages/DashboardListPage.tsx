
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, DashboardData } from '../types';
import { Plus, Folder, Calendar, Trash2, LogOut, ChevronRight, BarChart3, Clock, Sparkles } from 'lucide-react';

interface Props {
  user: User;
  dashboards: DashboardData[];
  onLogout: () => void;
  onDelete: (id: string) => void;
}

const DashboardListPage: React.FC<Props> = ({ user, dashboards, onLogout, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 ai-gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-slate-900 tracking-tight">Status<span className="text-purple-600">Brain</span></span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full hidden sm:flex">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm font-semibold text-slate-800">{user.name}</div>
              </div>
              <button
                onClick={onLogout}
                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600">Reporting Workspace</span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Project Dashboard Folders</h2>
          </div>
          <button
            onClick={() => navigate('/editor')}
            className="group flex items-center px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-purple-700 transition-all hover:-translate-y-1 active:translate-y-0"
          >
            <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
            Generate New Report
          </button>
        </div>

        {dashboards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-[40px] border border-slate-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
              <Folder className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Your reporting hub is empty</h3>
            <p className="mt-3 text-slate-500 max-w-sm text-lg">
              Upload your Jira CSV or project tracking data to build beautiful executive-ready reports in seconds.
            </p>
            <button
              onClick={() => navigate('/editor')}
              className="mt-10 px-8 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
            >
              Get Started Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {dashboards.sort((a,b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).map((dash) => (
              <div
                key={dash.id}
                className="group relative bg-white rounded-[32px] shadow-sm hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all border border-slate-100 overflow-hidden flex flex-col"
              >
                <div className="h-2 ai-gradient-bg w-full"></div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      dash.overallStatus.includes('Track') ? 'bg-green-100 text-green-700' : 
                      dash.overallStatus.includes('Risk') ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {dash.overallStatus}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(dash.id);
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors leading-tight">
                    {dash.projectName}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 items-center text-sm text-slate-400 mb-6 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {new Date(dash.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Updated just now
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm line-clamp-2 mb-8 flex-1 leading-relaxed">
                    {dash.executiveSummary}
                  </p>

                  <Link
                    to={`/editor/${dash.id}`}
                    className="flex items-center justify-between w-full p-4 bg-slate-50 group-hover:bg-purple-600 text-slate-700 group-hover:text-white font-bold rounded-2xl transition-all"
                  >
                    View Report Insights
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardListPage;
