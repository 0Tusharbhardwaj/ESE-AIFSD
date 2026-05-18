/**
 * Custom React hooks for EmpAI application.
 * Encapsulates common data fetching and UI logic patterns.
 */

import { useState, useEffect, useCallback } from 'react';
import { employeeAPI } from '../api';
import toast from 'react-hot-toast';

/**
 * Hook to fetch and manage employee list with filters.
 * @param {Object} initialFilters
 * @returns {{ employees, loading, total, pages, page, setPage, filters, setFilters, refetch }}
 */
export const useEmployees = (initialFilters = {}) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ limit: 8, sort: '-performanceScore', ...initialFilters });

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, page };
      // Remove empty filter values
      Object.keys(params).forEach((k) => { if (!params[k] || params[k] === 'All') delete params[k]; });
      const { data } = await employeeAPI.getAll(params);
      setEmployees(data.data);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  return { employees, loading, total, pages, page, setPage, filters, setFilters, refetch: fetchEmployees };
};

/**
 * Hook to fetch a single employee by ID.
 * @param {string} id - Employee MongoDB ObjectId
 */
export const useEmployee = (id) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    employeeAPI.getById(id)
      .then(({ data }) => setEmployee(data.data))
      .catch((err) => { setError(err.response?.data?.message || 'Employee not found'); toast.error('Failed to load employee'); })
      .finally(() => setLoading(false));
  }, [id]);

  return { employee, loading, error };
};

/**
 * Hook to fetch analytics data.
 */
export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeAPI.getAnalytics()
      .then(({ data }) => setAnalytics(data.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  return { analytics, loading };
};

/**
 * Hook to manage local disclosure (open/close) state.
 * @param {boolean} initialState
 */
export const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((s) => !s), []);
  return { isOpen, open, close, toggle };
};
