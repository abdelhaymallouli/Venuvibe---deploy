import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { EventList } from './pages/events/EventList';
import { EventForm } from './pages/events/EventForm';
import { EventDetails } from './pages/events/EventDetails';
import { VendorList } from './pages/vendors/VendorList';
import { GuestList } from './pages/guests/GuestList';
import { GuestForm } from './pages/guests/GuestForm';
import { BudgetTracker } from './pages/budget/BudgetTracker';
import { BudgetForm } from './pages/budget/BudgetForm';
import { TaskList } from './pages/tasks/TaskList';
import { TaskForm } from './pages/tasks/TaskForm';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/events/new" element={<EventForm />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/vendors" element={<VendorList />} />
      <Route path="/guests" element={<GuestList />} />
      <Route path="/guests/new" element={<GuestForm />} />
      <Route path="/budget" element={<BudgetTracker />} />
      <Route path="/budget/new" element={<BudgetForm />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/tasks/new" element={<TaskForm />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="min-h-screen">
          <AppRoutes />
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
            },
            success: {
              style: {
                border: '1px solid #22c55e',
              },
            },
            error: {
              style: {
                border: '1px solid #ef4444',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;