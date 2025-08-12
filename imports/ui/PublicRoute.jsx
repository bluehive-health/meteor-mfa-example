import React from 'react';
import { Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

export const PublicRoute = ({ children }) => {
  const isLoggedIn = !!Meteor.userId();
  
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};