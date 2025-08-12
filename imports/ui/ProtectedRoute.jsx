import React from 'react';
import { Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

export const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!Meteor.userId();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};