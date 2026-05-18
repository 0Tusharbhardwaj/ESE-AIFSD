import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Reusable debounced search input component.
 * Calls onSearch after the specified delay once user stops typing.
 *
 * @param {Function} onSearch - callback with search string
 * @param {number} delay - debounce delay in ms (default: 400)
 * @param {string} placeholder - input placeholder
 * @param {string} className - additional CSS classes
 */
const SearchInput = ({
  onSearch,
  delay = 400,
  placeholder = 'Search...',
  className = '',
  defaultValue = '',
}) => {
  const [value, setValue] = useState(defaultValue);
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear previous timer on each keystroke
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [value, delay]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="form-input pl-9 pr-9 py-2 w-full"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
