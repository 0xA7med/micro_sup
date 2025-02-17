import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/index';
import NewCustomer from './pages/NewCustomer/index';
import CustomerListNew from './pages/CustomerListNew/index';
import AdminAddAgent from './pages/AdminAddAgent/index';
import AgentList from './pages/AgentList/index';
import RepresentativeList from './pages/RepresentativeList/index';
import AgentCustomers from './pages/AgentCustomers/index';
import MyCustomers from './pages/MyCustomers/index';
import { useAuthStore } from './store/authStore';

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const user = useAuthStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/new-customer" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        
        <Route
          path="/"
          element={
            <PrivateRoute adminOnly>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-customer"
          element={<Navigate to="/new-customer" replace />}
        />

        <Route
          path="/new-customer"
          element={
            <PrivateRoute>
              <NewCustomer />
            </PrivateRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <PrivateRoute adminOnly>
              <CustomerListNew />
            </PrivateRoute>
          }
        />

        <Route
          path="/customers/new"
          element={
            <PrivateRoute>
              <NewCustomer />
            </PrivateRoute>
          }
        />

        <Route
          path="/agents"
          element={
            <PrivateRoute adminOnly>
              <AgentList />
            </PrivateRoute>
          }
        />

        <Route
          path="/representatives"
          element={
            <PrivateRoute adminOnly>
              <RepresentativeList />
            </PrivateRoute>
          }
        />

        <Route
          path="/representatives/add"
          element={
            <PrivateRoute adminOnly>
              <AdminAddAgent />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/add-agent"
          element={
            <PrivateRoute adminOnly>
              <AdminAddAgent />
            </PrivateRoute>
          }
        />

        <Route
          path="/agent-customers"
          element={
            <PrivateRoute>
              <AgentCustomers />
            </PrivateRoute>
          }
        />

        <Route
          path="/agent-customers/:agentId"
          element={
            <PrivateRoute adminOnly>
              <AgentCustomers />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-customers"
          element={
            <PrivateRoute>
              <MyCustomers />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;