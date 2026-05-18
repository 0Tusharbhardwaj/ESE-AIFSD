import { Loader2 } from 'lucide-react';

/**
 * Loading Skeleton component for tables and lists.
 * Shows animated placeholder rows while data is being fetched.
 * @param {number} rows - number of skeleton rows to show
 * @param {number} cols - number of columns per row
 */
export const TableSkeleton = ({ rows = 5, cols = 6 }) => (
  <div className="animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-white/5">
        <div className="w-9 h-9 bg-white/10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-white/10 rounded w-32" />
          <div className="h-2 bg-white/5 rounded w-20" />
        </div>
        {Array.from({ length: cols - 2 }).map((_, j) => (
          <div key={j} className="h-3 bg-white/10 rounded" style={{ width: `${48 + j * 16}px` }} />
        ))}
      </div>
    ))}
  </div>
);

/**
 * Card skeleton for dashboard stat cards.
 * @param {number} count - number of cards
 */
export const CardSkeleton = ({ count = 4 }) => (
  <div className={`grid grid-cols-2 lg:grid-cols-${count} gap-4 animate-pulse`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-28 bg-white/5 rounded-xl border border-white/5" />
    ))}
  </div>
);

/**
 * Full page loading spinner.
 */
export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center h-64 gap-3">
    <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
    <p className="text-sm text-slate-400">{message}</p>
  </div>
);

/**
 * Empty state component.
 * @param {React.ReactNode} icon - icon to display
 * @param {string} title
 * @param {string} description
 * @param {React.ReactNode} action - optional CTA button
 */
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
      {icon}
    </div>
    <h3 className="text-base font-semibold text-slate-300 mb-1">{title}</h3>
    {description && <p className="text-sm text-slate-500 mb-6 max-w-xs">{description}</p>}
    {action}
  </div>
);
