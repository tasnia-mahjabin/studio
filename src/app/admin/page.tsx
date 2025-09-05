'use client';

import { useState } from 'react';
import AdminDashboard from '@/components/admin/admin-dashboard';
import LoginForm from '@/components/admin/login-form';
import Header from '@/components/layout/header';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {isAuthenticated ? (
          <AdminDashboard />
        ) : (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        )}
      </main>
    </div>
  );
}
