import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Brain, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

// Floating particle for hero animation
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full bg-brand-500/20"
    style={style}
    animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
  />
);

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) navigate('/dashboard');
  };

  const particles = Array.from({ length: 12 }, (_, i) => ({
    width: `${8 + i * 6}px`,
    height: `${8 + i * 6}px`,
    left: `${5 + i * 8}%`,
    top: `${10 + (i % 4) * 22}%`,
  }));

  return (
    <div className="min-h-screen flex bg-navy-900">
      {/* Left Panel — Hero */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center bg-navy-950"
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Gradient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl" />

        {/* Floating particles */}
        {particles.map((p, i) => <Particle key={i} style={p} />)}

        {/* AI Network Visualization */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 600">
          {[[100,150],[300,80],[500,180],[700,100],[200,300],[400,250],[600,320],[150,450],[350,400],[550,480]].map(([x,y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#6366f1" />
              {i < 8 && <line x1={x} y1={y} x2={[300,80][0] || 300} y2={[300,80][1] || 80} stroke="#6366f1" strokeWidth="0.5" />}
            </g>
          ))}
        </svg>

        <div className="relative z-10 text-center px-12 max-w-lg">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-brand"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold text-white tracking-tight mb-4"
          >
            Emp<span className="text-gradient">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400 text-lg leading-relaxed mb-10"
          >
            Intelligent Performance Analytics<br />Powered by AI
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-6 text-center"
          >
            {[['247+', 'Employees'], ['91%', 'Accuracy'], ['34', 'AI Insights']].map(([val, label]) => (
              <div key={label} className="glass-card p-4">
                <div className="text-2xl font-bold text-gradient">{val}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel — Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center px-8 py-12 min-h-screen"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-brand">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">EmpAI</span>
          </div>

          <div className="glass-card p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-slate-400 text-sm mt-1">Sign in to your EmpAI account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label className="form-label">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  className={`form-input ${errors.email ? 'border-red-500/50' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                  })}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`form-input pr-11 ${errors.password ? 'border-red-500/50' : ''}`}
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="glass-card p-4 mt-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">Demo Credentials</p>
            <p>Admin: <span className="text-brand-400">admin@empai.com</span> / Admin@123</p>
            <p>HR: <span className="text-brand-400">hr@empai.com</span> / Hr@12345</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
