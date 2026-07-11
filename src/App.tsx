import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { useAuth } from './contexts/AuthContext';
import LiquidBackground from './components/LiquidBackground';

// Lazy load the route components for code splitting
const LandingPage = lazy(() => import('./components/LandingPage'));
const Dashboard = lazy(() => import('./components/Dashboard'));

export default function App() {
  const { user, isGuest } = useAuth();
  
  return (
    <ReactLenis root>
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[#f8fafc] dark:bg-slate-900 text-gray-500">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="font-medium">Loading Expensify...</p>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={(user || isGuest) ? <Dashboard /> : <Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ReactLenis>
  );
}
