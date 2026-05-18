import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import AIRecommendationsPage from './pages/AIRecommendationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Wake up the Render backend immediately when the frontend loads.
 * Render free-tier web services sleep after 15 min of inactivity.
 * This silent ping runs BEFORE the user even clicks login, so by
 * the time they submit credentials the backend is already warm.
 */
const useBackendWakeUp = () => {
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const healthUrl = `${apiUrl}/health`;

    // Silent fetch — we don't show any UI for this
    fetch(healthUrl, { method: 'GET', signal: AbortSignal.timeout(30000) })
      .then((res) => {
        if (res.ok) console.log('✅ Backend is awake and ready');
      })
      .catch(() => {
        // Silently ignore — backend might just be waking up
        console.log('⏳ Backend warming up...');
      });
  }, []); // Run once on app mount
};

function App() {
  // Wake up the Render backend on every page load
  useBackendWakeUp();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#171f33', color: '#dae2fd', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem' },
          success: { iconTheme: { primary: '#10b981', secondary: '#0b1326' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0b1326' } },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected dashboard routes */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="employees" element={<EmployeeListPage />} />
          <Route path="employees/new" element={<EmployeeFormPage />} />
          <Route path="employees/:id" element={<EmployeeDetailPage />} />
          <Route path="employees/:id/edit" element={<EmployeeFormPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="ai-recommendations" element={<AIRecommendationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
