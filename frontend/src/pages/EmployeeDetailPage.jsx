import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Edit3, Trash2, Sparkles, Loader2, Star, Clock, Trophy } from 'lucide-react';
import { employeeAPI, aiAPI } from '../api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const getScoreColor = (s) => s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-400' : 'text-red-400';
const getScoreBg = (s) => s >= 80 ? 'bg-emerald-400' : s >= 60 ? 'bg-amber-400' : 'bg-red-400';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    employeeAPI.getById(id)
      .then(({ data }) => setEmployee(data.data))
      .catch(() => { toast.error('Employee not found'); navigate('/employees'); })
      .finally(() => setLoading(false));
  }, [id]);

  const generateAI = async () => {
    setAiLoading(true);
    try {
      const { data } = await aiAPI.recommend({ employeeId: id });
      setAiData(data.data.recommendation);
      toast.success('AI recommendation generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI service error');
    } finally { setAiLoading(false); }
  };

  const mockTrend = [
    { m: 'Jan', v: Math.max(0, (employee?.performanceScore || 70) - 19) },
    { m: 'Feb', v: Math.max(0, (employee?.performanceScore || 70) - 14) },
    { m: 'Mar', v: Math.max(0, (employee?.performanceScore || 70) - 11) },
    { m: 'Apr', v: Math.max(0, (employee?.performanceScore || 70) - 8) },
    { m: 'May', v: Math.max(0, (employee?.performanceScore || 70) - 3) },
    { m: 'Jun', v: employee?.performanceScore || 70 },
  ];

  if (loading) return <div className="flex justify-center h-64 items-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;
  if (!employee) return null;

  const tier = employee.performanceScore >= 80 ? 'Excellent' : employee.performanceScore >= 60 ? 'Good' : 'Needs Improvement';

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Employees
      </button>

      {/* Hero Card */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 bg-gradient-brand rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-brand shrink-0">
            {employee.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{employee.name}</h1>
              <span className={employee.status === 'Active' ? 'badge-green' : 'badge-amber'}>{employee.status}</span>
            </div>
            <p className="text-slate-400 text-sm mb-3">{employee.email} · {employee.role || 'Employee'}</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge-indigo">{employee.department}</span>
              <span className={`badge ${getScoreColor(employee.performanceScore)} ${employee.performanceScore >= 80 ? 'bg-emerald-500/10' : employee.performanceScore >= 60 ? 'bg-amber-500/10' : 'bg-red-500/10'} border-none`}>
                Score: {employee.performanceScore}/100
              </span>
              <span className="badge-violet">{employee.experience} yrs exp</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => navigate(`/employees/${id}/edit`)} className="btn-primary flex items-center gap-1.5 text-sm"><Edit3 className="w-4 h-4" /> Edit</button>
            <button onClick={generateAI} disabled={aiLoading} className="btn-secondary flex items-center gap-1.5 text-sm">
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-violet-400" />} AI Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Skills */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {employee.skills?.map((s) => <span key={s} className="skill-chip">{s}</span>)}
            </div>
          </div>

          {/* Performance Trend */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Performance Trend</h3>
              <span className="text-xs text-emerald-400">+{Math.round((employee.performanceScore / mockTrend[0].v - 1) * 100)}% improvement</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={mockTrend}>
                <defs>
                  <linearGradient id="empGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip formatter={(val) => [val, 'Score']} contentStyle={{ background: '#171f33', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Area type="monotone" dataKey="v" stroke="#6366f1" fill="url(#empGrad)" strokeWidth={2} dot={{ fill: '#6366f1', strokeWidth: 0, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Quick Stats */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Quick Stats</h3>
            {[
              { label: 'Performance Score', value: `${employee.performanceScore}/100`, icon: Star },
              { label: 'Experience', value: `${employee.experience} years`, icon: Clock },
              { label: 'Performance Tier', value: tier, icon: Trophy },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2 text-slate-400 text-xs"><Icon className="w-3.5 h-3.5" />{label}</div>
                <span className="text-sm font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* AI Recommendation */}
          <div className="glass-card p-5 border-brand-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-semibold text-brand-300">AI Recommendation</h3>
            </div>
            {aiData ? (
              <div className="space-y-3">
                {aiData.promotionEligible !== undefined && (
                  <span className={aiData.promotionEligible ? 'badge-green' : 'badge-amber'}>
                    {aiData.promotionEligible ? '🚀 Promotion Ready' : '📈 Keep Growing'}
                  </span>
                )}
                <p className="text-xs text-slate-300 leading-relaxed">{aiData.aiSummary || JSON.stringify(aiData).slice(0, 300)}</p>
                {aiData.trainingRecommendations?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Training Suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {aiData.trainingRecommendations.map((t) => <span key={t} className="badge-amber text-xs">{t}</span>)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-slate-500 mb-3">Click "AI Report" to generate insights</p>
                <button onClick={generateAI} disabled={aiLoading} className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 mx-auto">
                  {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Generate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
