import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

/**
 * Reusable Modal component with backdrop blur and Framer Motion animations.
 * Closes on backdrop click and Escape key.
 *
 * @param {boolean} isOpen - controls visibility
 * @param {Function} onClose - close handler
 * @param {string} title - modal title
 * @param {React.ReactNode} children - modal content
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className={`glass-card w-full ${sizeMap[size]} overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-base font-semibold text-white">{title}</h2>
              <button onClick={onClose} className="btn-icon" aria-label="Close modal">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Body */}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
