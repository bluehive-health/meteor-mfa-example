import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { LoginForm } from './LoginForm.jsx';
import { SignupForm } from './SignupForm.jsx';
import { Dashboard } from './Dashboard.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { PublicRoute } from './PublicRoute.jsx';

export const App = () => {
  const user = useTracker(() => Meteor.user(), []);
  const isLoggedIn = !!user;

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>🔐 Secure Login App</h1>
          {isLoggedIn && (
            <div className="user-info">
              Welcome, {user?.username || user?.emails?.[0]?.address}
            </div>
          )}
        </header>
        
        <main className="app-main">
          <Routes>
            {/* Public routes - only accessible when not logged in */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } />
            
            <Route path="/signup" element={
              <PublicRoute>
                <SignupForm />
              </PublicRoute>
            } />
            
            {/* Protected routes - only accessible when logged in */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Default redirects */}
            <Route path="/" element={
              !!Meteor.userId() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } />
            
            {/* Catch all route */}
            <Route path="*" element={
              !!Meteor.userId() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>Powered by Meteor + accounts-2fa</p>
        </footer>
      </div>
    </Router>
  );
};