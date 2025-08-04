// Input validation and sanitization utilities

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>"']/g, '');
};

export const validateEmail = (email) => {
  const sanitized = sanitizeInput(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized);
};

export const validateUsername = (username) => {
  const sanitized = sanitizeInput(username);
  return sanitized.length >= 3 && sanitized.length <= 30 && /^[a-zA-Z0-9_]+$/.test(sanitized);
};

export const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const validateTwoFactorCode = (code) => {
  const sanitized = sanitizeInput(code);
  return /^\d{6}$/.test(sanitized);
};