import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, X, Plus, Loader2, ArrowLeft, Brain } from 'lucide-react';
import { employeeAPI } from '../api';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Operations', 'Legal'];
const STATUSES = ['Active', 'On Leave', 'Remote', 'Terminated'];
const SKILL_SUGGESTIONS = ['React', 'Node.js', 'Python', 'Machine Learning', 'MongoDB', 'AWS', 'Docker', 'TypeScript', 'PostgreSQL', 'GraphQL', 'Figma', 'TensorFlow'];

const getScoreColor = (s) => s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-400' : 'text-red-400';

const EmployeeFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: { performanceScore: 70, experience: 1, status: 'Active', department: 'Engineering' },
  });

  const performanceScore = watch('performanceScore', 70);
  const tier = performanceScore >= 80 ? 'Excellent' : performanceScore >= 60 ? 'Good' : 'Needs Improvement';

  useEffect(() => {
    if (isEdit) {
      employeeAPI.getById(id)
        .then(({ data }) => {
          const emp = data.data;
          reset({ name: emp.name, email: emp.email, department: emp.department, performanceScore: emp.performanceScore, experience: emp.experience, status: emp.status, role: emp.role });
          setSkills(emp.skills || []);
        })
        .catch(() => toast.error('Failed to load employee'))
        .finally(() => setInitialLoading(false));
    }
  }, [id]);

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 20) setSkills([...skills, trimmed]);
    setSkillInput('');
  };

  const onSubmit = async (data) => {
    if (skills.length === 0) { toast.error('Add at least one skill'); return; }
    setLoading(true);
    try {
      const payload = { ...data, skills, performanceScore: Number(data.performanceScore), experience: Number(data.experience) };
      if (isEdit) { await employeeAPI.update(id, payload); toast.success('Employee updated!'); }
      else { await employeeAPI.create(payload); toast.success('Employee added!'); }
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  if (initialLoading) return <div className="flex justify-center h-64 items-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Employees
      </button>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-brand-500/10 to-violet-500/5">
            <h1 className="text-xl font-bold text-white">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h1>
            <p className="text-slate-400 text-sm mt-0.5">Fill in the employee's details below</p>
          </div>
          <div className="p-6 space-y-8">
            {/* Personal Info */}
            <section>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="form-label">Full Name *</label>
                  <input id="emp-name" type="text" placeholder="Aman Verma" className={`form-input ${errors.name ? 'border-red-500/50' : ''}`}
                    {...register('name', { required: 'Name is required' })} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Email Address *</label>
                  <input id="emp-email" type="email" placeholder="aman@company.com" className={`form-input ${errors.email ? 'border-red-500/50' : ''}`}
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="form-label">Role / Position</label>
                  <input id="emp-role" type="text" placeholder="Full Stack Developer" className="form-input" {...register('role')} />
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select id="emp-status" className="form-input" {...register('status')}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Professional Details */}
            <section>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Professional Details</h2>
              <div className="space-y-5">
                <div>
                  <label className="form-label">Department *</label>
                  <select id="emp-dept" className="form-input" {...register('department', { required: 'Department required' })}>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="form-label mb-0">Performance Score *</label>
                    <span className={`text-lg font-bold ${getScoreColor(Number(performanceScore))}`}>{performanceScore}/100
                      <span className={`ml-2 badge text-xs ${Number(performanceScore) >= 80 ? 'badge-green' : Number(performanceScore) >= 60 ? 'badge-amber' : 'badge-red'}`}>{tier}</span>
                    </span>
                  </div>
                  <input id="emp-score" type="range" min="0" max="100" step="1" className="w-full cursor-pointer"
                    {...register('performanceScore')} />
                </div>
                <div>
                  <label className="form-label">Years of Experience *</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setValue('experience', Math.max(0, Number(watch('experience')) - 1))} className="btn-secondary w-10 h-10 flex items-center justify-center text-lg">−</button>
                    <input id="emp-exp" type="number" min="0" max="50" className="form-input text-center font-bold" {...register('experience', { required: true })} />
                    <button type="button" onClick={() => setValue('experience', Math.min(50, Number(watch('experience')) + 1))} className="btn-secondary w-10 h-10 flex items-center justify-center text-lg">+</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Skills ({skills.length}/20)</h2>
              <div className="flex gap-2 mb-3">
                <input id="skill-input" type="text" placeholder="Type skill + Enter..." value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                  className="form-input flex-1" />
                <button type="button" onClick={() => addSkill(skillInput)} className="btn-secondary px-4"><Plus className="w-4 h-4" /></button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white/3 rounded-lg border border-white/5">
                  {skills.map((s) => (
                    <span key={s} className="skill-chip flex items-center gap-1.5 cursor-pointer" onClick={() => setSkills(skills.filter(sk => sk !== s))}>
                      {s} <X className="w-3 h-3" />
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                  <button key={s} type="button" onClick={() => addSkill(s)} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10 hover:bg-brand-500/10 hover:text-brand-400 transition-all">+ {s}</button>
                ))}
              </div>
            </section>

            {/* AI Preview */}
            <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-4 flex items-start gap-3">
              <Brain className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-brand-300">AI Analysis Preview</p>
                <p className="text-xs text-slate-400 mt-0.5">Score: <span className={`font-semibold ${getScoreColor(Number(performanceScore))}`}>{performanceScore}/100</span> · Tier: <span className="text-white">{tier}</span> · Skills: <span className="text-white">{skills.length}</span> · AI recommendation generated on save.</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/employees')} className="btn-secondary flex items-center gap-2"><X className="w-4 h-4" /> Cancel</button>
            <button id="emp-form-submit" type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Add Employee'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeFormPage;
