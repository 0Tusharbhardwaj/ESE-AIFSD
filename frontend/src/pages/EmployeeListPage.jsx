import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Eye, Edit3, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { employeeAPI } from '../api';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const DEPARTMENTS = ['All', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Operations'];
const STATUSES = ['All', 'Active', 'On Leave', 'Remote', 'Terminated'];

const getInitialsColor = (name) => {
  const colors = ['bg-brand-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[idx];
};

const getScoreColor = (score) => {
  if (score >= 80) return 'text-emerald-400 bg-emerald-500/10';
  if (score >= 60) return 'text-amber-400 bg-amber-500/10';
  return 'text-red-400 bg-red-500/10';
};

const getScoreBg = (score) => {
  if (score >= 80) return 'bg-emerald-400';
  if (score >= 60) return 'bg-amber-400';
  return 'bg-red-400';
};

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department, status]);

  useEffect(() => {
    fetchEmployees();
  }, [debouncedSearch, department, status, page]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8, sort: '-performanceScore' };
      if (debouncedSearch) params.search = debouncedSearch;
      if (department !== 'All') params.department = department;
      if (status !== 'All') params.status = status;

      const { data } = await employeeAPI.getAll(params);
      setEmployees(data.data);
      setPages(data.pages);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await employeeAPI.delete(id);
      toast.success('Employee deleted successfully');
      setDeleteId(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const canDelete = user?.role === 'Admin' || user?.role === 'HR';

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Management</h1>
          <p className="page-subtitle">{total} total employees in the system</p>
        </div>
        <button onClick={() => navigate('/employees/new')} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="employee-search"
            type="text"
            placeholder="Search name, email, department, skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9 py-2"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Department Filter */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="form-input w-auto py-2 text-sm"
        >
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="form-input w-auto py-2 text-sm"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Active filters */}
        <div className="flex gap-2 flex-wrap">
          {department !== 'All' && (
            <span className="badge-indigo flex items-center gap-1 cursor-pointer" onClick={() => setDepartment('All')}>
              {department} <X className="w-3 h-3" />
            </span>
          )}
          {status !== 'All' && (
            <span className="badge-violet flex items-center gap-1 cursor-pointer" onClick={() => setStatus('All')}>
              {status} <X className="w-3 h-3" />
            </span>
          )}
        </div>

        <span className="text-xs text-slate-400 ml-auto">Showing {employees.length} of {total}</span>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 animate-pulse">
                <div className="w-9 h-9 bg-white/10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-32" />
                  <div className="h-2 bg-white/5 rounded w-20" />
                </div>
                <div className="h-3 bg-white/10 rounded w-24" />
                <div className="h-3 bg-white/10 rounded w-20" />
                <div className="h-3 bg-white/10 rounded w-16" />
              </div>
            ))}
          </div>
        ) : employees.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">No employees found</p>
            <button onClick={() => navigate('/employees/new')} className="btn-primary mt-4 text-sm">
              Add First Employee
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Employee</th><th>Department</th>
                  <th>Skills</th><th>Performance</th><th>Exp.</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {employees.map((emp, i) => (
                    <motion.tr
                      key={emp._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <td><span className="text-slate-500 text-xs">{(page - 1) * 8 + i + 1}</span></td>

                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 ${getInitialsColor(emp.name)} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                            {emp.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{emp.name}</p>
                            <p className="text-xs text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      <td><span className="badge-indigo">{emp.department}</span></td>

                      <td>
                        <div className="flex gap-1 flex-wrap max-w-48">
                          {emp.skills?.slice(0, 3).map((s) => (
                            <span key={s} className="skill-chip">{s}</span>
                          ))}
                          {emp.skills?.length > 3 && (
                            <span className="text-xs text-slate-500">+{emp.skills.length - 3}</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="flex items-center gap-2 min-w-28">
                          <div className="progress-bar flex-1">
                            <div className={`progress-fill ${getScoreBg(emp.performanceScore)}`} style={{ width: `${emp.performanceScore}%` }} />
                          </div>
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getScoreColor(emp.performanceScore)}`}>
                            {emp.performanceScore}
                          </span>
                        </div>
                      </td>

                      <td><span className="text-slate-300 text-sm">{emp.experience} yrs</span></td>

                      <td>
                        <span className={
                          emp.status === 'Active' ? 'badge-green' :
                          emp.status === 'On Leave' ? 'badge-amber' : 'badge-red'
                        }>
                          {emp.status}
                        </span>
                      </td>

                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => navigate(`/employees/${emp._id}`)} className="btn-icon text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => navigate(`/employees/${emp._id}/edit`)} className="btn-icon text-brand-400 hover:text-brand-300 hover:bg-brand-500/10">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {canDelete && (
                            <button onClick={() => setDeleteId(emp._id)} className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-500/10">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
            <span className="text-xs text-slate-400">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(5, pages))].map((_, i) => {
                const pg = i + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`py-1.5 px-3 rounded-lg text-sm font-medium transition-all ${pg === page ? 'bg-gradient-brand text-white' : 'btn-secondary'}`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 max-w-sm w-full"
            >
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Delete Employee?</h3>
              <p className="text-sm text-slate-400 text-center mb-6">This action cannot be undone. All employee data will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeListPage;
