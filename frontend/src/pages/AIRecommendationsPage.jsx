import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Loader2, Trophy, BookOpen, TrendingUp, Star, RefreshCw, Users } from 'lucide-react';
import { employeeAPI, aiAPI } from '../api';
import toast from 'react-hot-toast';

const TABS = ['All', 'Promotion Ready', 'Needs Training', 'High Performer', 'At Risk'];

const getRecommendationBadge = (score) => {
  if (score >= 80) return { label: '🚀 Promotion Ready', cls: 'badge-green' };
  if (score >= 60) return { label: '📈 On Track', cls: 'badge-indigo' };
  return { label: '📚 Training Needed', cls: 'badge-amber' };
};

const AIRecommendationsPage = () => {
  const [employees, setEmployees] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [rankings, setRankings] = useState([]);
  const [rankLoading, setRankLoading] = useState(false);
  const [tab, setTab] = useState('All');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    employeeAPI.getAll({ limit: 20, sort: '-performanceScore' })
      .then(({ data }) => setEmployees(data.data))
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setInitialLoad(false));
  }, []);

  const generateForEmployee = async (emp) => {
    setLoadingMap((prev) => ({ ...prev, [emp._id]: true }));
    try {
      const { data } = await aiAPI.recommend({ employeeId: emp._id });
      setRecommendations((prev) => ({ ...prev, [emp._id]: data.data.recommendation }));
      toast.success(`AI generated for ${emp.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI service error');
    } finally {
      setLoadingMap((prev) => ({ ...prev, [emp._id]: false }));
    }
  };

  const generateRankings = async () => {
    setRankLoading(true);
    try {
      const { data } = await aiAPI.rank({});
      setRankings(data.data.rankings || []);
      toast.success('AI rankings generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rankings failed');
    } finally { setRankLoading(false); }
  };

  const filterEmployees = () => {
    if (tab === 'All') return employees;
    if (tab === 'Promotion Ready') return employees.filter((e) => e.performanceScore >= 80 && e.experience >= 2);
    if (tab === 'Needs Training') return employees.filter((e) => e.performanceScore < 60);
    if (tab === 'High Performer') return employees.filter((e) => e.performanceScore >= 75);
    if (tab === 'At Risk') return employees.filter((e) => e.performanceScore < 50);
    return employees;
  };

  if (initialLoad) return <div className="flex justify-center h-64 items-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;

  const filtered = filterEmployees();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><Sparkles className="w-6 h-6 text-violet-400" /> AI Recommendations</h1>
          <p className="page-subtitle">Powered by Meta LLaMA 3.1 via OpenRouter</p>
        </div>
        <button onClick={generateRankings} disabled={rankLoading} className="btn-primary flex items-center gap-2 bg-violet-600 hover:bg-violet-500">
          {rankLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
          {rankLoading ? 'Ranking...' : 'AI Rank All'}
        </button>
      </div>

      {/* AI Rankings Card */}
      {rankings.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 border-violet-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">AI-Generated Employee Rankings</h3>
          </div>
          <div className="space-y-2">
            {rankings.slice(0, 10).map((r, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-slate-400/20 text-slate-300' : i === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-slate-400'}`}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.justification}</p>
                </div>
                <span className={r.recommendation === 'Promotion' ? 'badge-green' : r.recommendation === 'Retain' ? 'badge-indigo' : 'badge-amber'}>
                  {r.recommendation}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-gradient-brand text-white shadow-brand' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>
            {t}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} employees</span>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filtered.map((emp, i) => {
            const rec = recommendations[emp._id];
            const badge = getRecommendationBadge(emp.performanceScore);
            const isLoading = loadingMap[emp._id];
            return (
              <motion.div
                key={emp._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 border-l-2 border-brand-500/40 hover:border-brand-500/70 transition-all"
              >
                {/* Employee Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {emp.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{emp.name}</p>
                      <p className="text-xs text-slate-400">{emp.department} · {emp.experience} yrs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${emp.performanceScore >= 80 ? 'text-emerald-400' : emp.performanceScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {emp.performanceScore}<span className="text-xs text-slate-500">/100</span>
                    </p>
                    <span className={badge.cls}>{badge.label}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {emp.skills?.slice(0, 4).map((s) => <span key={s} className="skill-chip text-xs">{s}</span>)}
                  {emp.skills?.length > 4 && <span className="text-xs text-slate-500">+{emp.skills.length - 4}</span>}
                </div>

                {/* AI Output */}
                {rec ? (
                  <div className="bg-brand-500/5 border border-brand-500/15 rounded-lg p-3 mb-3">
                    <p className="text-xs text-slate-300 leading-relaxed">{rec.aiSummary || 'AI analysis complete.'}</p>
                    {rec.trainingRecommendations?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {rec.trainingRecommendations.map((t) => (
                          <span key={t} className="badge-amber text-xs">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/3 rounded-lg p-3 mb-3 text-xs text-slate-500 flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5" /> Click "Generate" to get AI insights for this employee
                  </div>
                )}

                <button
                  onClick={() => generateForEmployee(emp)}
                  disabled={isLoading}
                  className="w-full btn-secondary text-xs flex items-center justify-center gap-2 py-2"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-violet-400" />}
                  {isLoading ? 'Generating...' : rec ? 'Regenerate AI' : 'Generate AI Insight'}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="glass-card py-16 text-center">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No employees match this filter</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationsPage;
