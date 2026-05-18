import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

/**
 * Zustand auth store with localStorage persistence.
 * Manages: user session, login/logout, and loading state.
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      /**
       * Login action — calls API, stores token and user in state + localStorage.
       */
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.login({ email, password });
          localStorage.setItem('empai_token', data.token);
          localStorage.setItem('empai_user', JSON.stringify(data.user));
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
          toast.success(`Welcome back, ${data.user.name}! 👋`);
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const msg = error.response?.data?.message || 'Login failed. Please try again.';
          toast.error(msg);
          return { success: false, message: msg };
        }
      },

      /**
       * Register action — creates account and auto-logs in.
       */
      register: async (name, email, password, role) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.register({ name, email, password, role });
          localStorage.setItem('empai_token', data.token);
          localStorage.setItem('empai_user', JSON.stringify(data.user));
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
          toast.success('Account created successfully! 🎉');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const msg = error.response?.data?.message || 'Registration failed.';
          toast.error(msg);
          return { success: false, message: msg };
        }
      },

      /**
       * Logout — clears all auth state and localStorage.
       */
      logout: () => {
        localStorage.removeItem('empai_token');
        localStorage.removeItem('empai_user');
        set({ user: null, token: null, isAuthenticated: false });
        toast.success('Logged out successfully.');
      },
    }),
    {
      name: 'empai_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
