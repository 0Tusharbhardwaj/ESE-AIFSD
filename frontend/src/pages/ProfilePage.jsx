import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { Brain, Mail, Shield, Calendar } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account settings</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/10">
          <div className="w-20 h-20 bg-gradient-brand rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-brand">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <span className="badge-indigo mt-1">{user?.role}</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { icon: Mail, label: 'Email', value: user?.email },
            { icon: Shield, label: 'Role', value: user?.role },
            { icon: Calendar, label: 'Last Login', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just now' },
            { icon: Brain, label: 'System', value: 'EmpAI v1.0.0' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{label}</p>
                <p className="text-sm text-white font-medium">{value || '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm"
      >
        Sign Out of EmpAI
      </button>
    </div>
  );
};

export default ProfilePage;
