import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
};

const colorMap = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
  warning: 'border-amber-500/30 bg-amber-500/10',
};

/**
 * Alert component for inline messages.
 * @param {'success'|'error'|'info'|'warning'} type
 * @param {string} message
 * @param {Function} onClose - optional close handler
 */
const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={`flex items-start gap-3 p-4 rounded-xl border ${colorMap[type]}`}
        role="alert"
      >
        <div className="shrink-0 mt-0.5">{icons[type]}</div>
        <p className="text-sm text-slate-200 flex-1">{message}</p>
        {onClose && (
          <button onClick={onClose} className="shrink-0 text-slate-400 hover:text-white transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
