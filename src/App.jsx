import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { JobMatches } from './pages/JobMatches';
import { CareerRoadmap } from './pages/CareerRoadmap';
import { HRDashboard } from './pages/HRDashboard';
import { PostJob } from './pages/PostJob';
import { AdminDashboard } from './pages/AdminDashboard';
import { SupportTickets } from './pages/SupportTickets';
import { Assessments } from './pages/Assessments';
import { MyApplications } from './pages/MyApplications';
import { InterviewPrep } from './pages/InterviewPrep';
import { Landing } from './pages/Landing';
import { ApplierDashboard } from './pages/ApplierDashboard';
import { Register } from './pages/Register';
import { AllUsers } from './pages/AllUsers';
import { Appliers } from './pages/Appliers';

// Placeholder Pages for initial wiring
const Dashboard = ({ role }) => (
    <div className="card">
        <h2>{role} Dashboard</h2>
        <p>Welcome to the {role.toLowerCase()} portal.</p>
    </div>
);

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Applier Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute allowedRoles={['APPLIER']}>
                                <ApplierDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute allowedRoles={['APPLIER']}>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="/jobs" element={
                            <ProtectedRoute allowedRoles={['APPLIER']}>
                                <JobMatches />
                            </ProtectedRoute>
                        } />
                        <Route path="/roadmap" element={
                            <ProtectedRoute allowedRoles={['APPLIER']}>
                                <CareerRoadmap />
                            </ProtectedRoute>
                        } />
                        <Route path="/my-applications" element={
                            <ProtectedRoute allowedRoles={['APPLIER']}>
                                <MyApplications />
                            </ProtectedRoute>
                        } />
                        <Route path="/interview-prep" element={
                            <ProtectedRoute allowedRoles={['APPLIER']}>
                                <InterviewPrep />
                            </ProtectedRoute>
                        } />

                        {/* HR Routes */}
                        <Route path="/hr-dashboard" element={
                            <ProtectedRoute allowedRoles={['HR']}>
                                <HRDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/post-job" element={
                            <ProtectedRoute allowedRoles={['HR']}>
                                <PostJob />
                            </ProtectedRoute>
                        } />
                        <Route path="/appliers" element={
                            <ProtectedRoute allowedRoles={['HR']}>
                                <Appliers />
                            </ProtectedRoute>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin-dashboard" element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/all-users" element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AllUsers />
                            </ProtectedRoute>
                        } />
                        <Route path="/tickets" element={
                            <ProtectedRoute allowedRoles={['APPLIER', 'ADMIN', 'HR']}>
                                <SupportTickets />
                            </ProtectedRoute>
                        } />
                        <Route path="/assessments" element={
                            <ProtectedRoute allowedRoles={['APPLIER', 'HR', 'ADMIN']}>
                                <Assessments />
                            </ProtectedRoute>
                        } />

                        {/* Global Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/unauthorized" element={<div>Access Denied</div>} />
                    </Routes>
                </Layout>
            </Router>

            <style>{`
        .card {
          background: var(--bg-card);
          padding: 2rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-md);
        }
        .loading-screen {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--primary);
        }
      `}</style>
        </AuthProvider>
    );
};

export default App;
