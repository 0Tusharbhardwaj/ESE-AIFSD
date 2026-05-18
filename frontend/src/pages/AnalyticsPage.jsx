import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Award, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { employeeAPI } from '../api';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeAPI.getAnalytics()
      .then(({ data }) => setAnalytics(data.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const perfDist = analytics?.perfDistribution?.map((d, i) => ({
    range: ['0-20', '21-40', '41-60', '61-80', '81-100'][i] || d._id,
    count: d.count,
    fill: ['#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#10b981'][i],
  })) || [];

  const deptData = analytics?.deptStats?.map((d) => ({
    name: d._id?.slice(0, 6),
    score: Math.round(d.avgScore),
    count: d.count,
  })) || [];

  if (loading) return <div className="flex justify-center h-64 items-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><BarChart2 className="w-6 h-6 text-brand-400" /> Analytics & Insights</h1>
          <p className="page-subtitle">Real-time performance analytics</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: analytics?.total, color: 'bg-brand-500', icon: Users },
          { label: 'Average Score', value: `${analytics?.averageScore}/100`, color: 'bg-emerald-500', icon: TrendingUp },
          { label: 'Promotion Eligible', value: analytics?.promotionEligible, color: 'bg-amber-500', icon: Award },
          { label: 'Needs Training', value: analytics?.needsTraining, color: 'bg-red-500', icon: BarChart2 },
        ].map(({ label, value, color, icon: Icon }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
            <div className={`absolute top-0 right-0 w-20 h-20 ${color} rounded-full blur-2xl opacity-20`} />
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${color} bg-opacity-20 rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-bold text-white">{value ?? 0}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Performance Score Distribution</h3>
          {perfDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={perfDist} barSize={32}>
                <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#171f33', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {perfDist.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-500 text-sm text-center py-12">No data yet</p>}
        </div>

        {/* Department Performance */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Department Average Performance</h3>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptData} layout="vertical" barSize={16}>
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ background: '#171f33', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} fill="url(#deptGrad)" />
                <defs>
                  <linearGradient id="deptGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-500 text-sm text-center py-12">No data yet</p>}
        </div>
      </div>

      {/* Top 10 Rankings Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-slate-200">Top 10 Employee Rankings</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Rank</th><th>Employee</th><th>Department</th><th>Performance</th><th>Experience</th><th>Tier</th></tr>
          </thead>
          <tbody>
            {analytics?.topPerformers?.map((emp, i) => (
              <tr key={emp._id}>
                <td>
                  <span className={`font-bold ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-orange-400' : 'text-slate-500'}`}>
                    #{i + 1}
                  </span>
                </td>
                <td className="font-medium text-white">{emp.name}</td>
                <td><span className="badge-indigo">{emp.department}</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="progress-bar w-20">
                      <div className={`progress-fill ${emp.performanceScore >= 80 ? 'bg-emerald-400' : emp.performanceScore >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${emp.performanceScore}%` }} />
                    </div>
                    <span className={`text-xs font-bold ${emp.performanceScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{emp.performanceScore}</span>
                  </div>
                </td>
                <td className="text-slate-300">{emp.experience} yrs</td>
                <td><span className={emp.performanceScore >= 80 ? 'badge-green' : emp.performanceScore >= 60 ? 'badge-indigo' : 'badge-red'}>{emp.performanceScore >= 80 ? 'Excellent' : emp.performanceScore >= 60 ? 'Good' : 'Needs Work'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!analytics?.topPerformers?.length && <p className="text-center py-12 text-slate-500 text-sm">No employees yet</p>}
      </div>
    </div>
  );
};

export default AnalyticsPage;
