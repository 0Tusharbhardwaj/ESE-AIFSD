import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Sparkles, Star, ArrowUpRight,
  Trophy, AlertCircle, CheckCircle2, MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { employeeAPI } from '../api';
import toast from 'react-hot-toast';

// Reusable KPI card
const StatCard = ({ title, value, change, icon: Icon, color, suffix = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="stat-card"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} rounded-full blur-2xl opacity-20`} />
    <div className="flex items-start justify-between relative">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}{suffix}</p>
        {change && (
          <p className={`text-xs mt-1 flex items-center gap-1 ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <ArrowUpRight className={`w-3 h-3 ${change < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(change)}% vs last month
          </p>
        )}
      </div>
      <div className={`w-10 h-10 ${color} bg-opacity-20 rounded-xl flex items-center justify-center`}>
        <Icon className={`w-5 h-5`} />
      </div>
    </div>
  </motion.div>
);

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const getPerformanceColor = (score) => {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
};

const getPerformanceBg = (score) => {
  if (score >= 80) return 'bg-emerald-400';
  if (score >= 60) return 'bg-amber-400';
  return 'bg-red-400';
};

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await employeeAPI.getAnalytics();
      setAnalytics(data.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Mock trend data for charts
  const trendData = [
    { month: 'Jan', score: 72 }, { month: 'Feb', score: 74 },
    { month: 'Mar', score: 71 }, { month: 'Apr', score: 76 },
    { month: 'May', score: 78 }, { month: 'Jun', score: parseFloat(analytics?.averageScore || 78) },
  ];

  const deptData = analytics?.deptStats?.map((d) => ({
    name: d._id,
    score: Math.round(d.avgScore),
    count: d.count,
  })) || [];

  const pieData = analytics?.deptStats?.map((d, i) => ({
    name: d._id,
    value: d.count,
    color: COLORS[i % COLORS.length],
  })) || [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card px-3 py-2 text-xs">
          <p className="text-slate-300">{payload[0]?.payload?.month || payload[0]?.payload?.name}</p>
          <p className="text-brand-400 font-semibold">{payload[0]?.value}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back! Here's your performance summary.</p>
        </div>
        <button onClick={() => navigate('/employees/new')} className="btn-primary flex items-center gap-2">
          <Users className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={analytics?.total || 0} change={12} icon={Users} color="bg-brand-500" />
        <StatCard title="Avg Performance" value={analytics?.averageScore || 0} change={3.2} icon={TrendingUp} color="bg-emerald-500" suffix="/100" />
        <StatCard title="AI Insights" value={34} icon={Sparkles} color="bg-violet-500" />
        <StatCard title="Promotion Ready" value={analytics?.promotionEligible || 0} change={8} icon={Star} color="bg-amber-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="score" stroke="#6366f1" fill="url(#scoreGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Departments</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(val, name) => [val, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {pieData.slice(0, 4).map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-400 truncate max-w-24">{d.name}</span>
                </div>
                <span className="text-slate-300 font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-slate-200">Top Performers</h3>
          <button onClick={() => navigate('/employees')} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th><th>Employee</th><th>Department</th>
              <th>Performance</th><th>Experience</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {analytics?.topPerformers?.slice(0, 5).map((emp, i) => (
              <tr key={emp._id} className="cursor-pointer" onClick={() => navigate(`/employees/${emp._id}`)}>
                <td>
                  <span className={`badge text-xs font-bold ${
                    i === 0 ? 'bg-amber-500/20 text-amber-400' :
                    i === 1 ? 'bg-slate-400/20 text-slate-300' :
                    i === 2 ? 'bg-orange-500/20 text-orange-400' : 'badge-indigo'
                  }`}>
                    #{i + 1}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {emp.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{emp.name}</p>
                    </div>
                  </div>
                </td>
                <td><span className="badge-indigo">{emp.department}</span></td>
                <td>
                  <div className="flex items-center gap-2 w-32">
                    <div className="progress-bar flex-1">
                      <div
                        className={`progress-fill ${getPerformanceBg(emp.performanceScore)}`}
                        style={{ width: `${emp.performanceScore}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${getPerformanceColor(emp.performanceScore)}`}>
                      {emp.performanceScore}
                    </span>
                  </div>
                </td>
                <td><span className="text-slate-300 text-sm">{emp.experience} yrs</span></td>
                <td>
                  <span className={emp.status === 'Active' ? 'badge-green' : 'badge-amber'}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!analytics?.topPerformers?.length && (
          <div className="py-12 text-center text-slate-400 text-sm">
            No employee data yet. <button onClick={() => navigate('/employees/new')} className="text-brand-400">Add your first employee →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
