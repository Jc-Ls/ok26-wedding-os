/**
 * Input validation utilities for API routes
 * Prevents data injection and ensures data integrity
 */

export function validateName(name: string | unknown): { valid: boolean; error?: string; value?: string } {
  if (typeof name !== 'string') {
    return { valid: false, error: 'Name must be text' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: 'Name is too long' };
  }
  // Remove any suspicious characters (keep only letters, spaces, hyphens, apostrophes)
  const sanitized = trimmed.replace(/[^a-zA-Z\s\-']/g, '');
  return { valid: true, value: sanitized };
}

export function validatePhone(phone: string | unknown): { valid: boolean; error?: string; value?: string } {
  if (typeof phone !== 'string') {
    return { valid: false, error: 'Phone must be text' };
  }
  const trimmed = phone.trim();
  // Keep only digits, +, -, (), and spaces
  const sanitized = trimmed.replace(/[^\d\+\-\(\)\s]/g, '');
  if (sanitized.length < 10 || sanitized.length > 20) {
    return { valid: false, error: 'Phone number appears invalid' };
  }
  return { valid: true, value: sanitized };
}

export function validateEmail(email: string | unknown): { valid: boolean; error?: string; value?: string } {
  if (typeof email !== 'string') {
    return { valid: false, error: 'Email must be text' };
  }
  const trimmed = email.trim().toLowerCase();
  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed) || trimmed.length > 254) {
    return { valid: false, error: 'Email address is invalid' };
  }
  return { valid: true, value: trimmed };
}

export function validateVipCode(code: string | unknown): { valid: boolean; error?: string; value?: string } {
  if (typeof code !== 'string') {
    return { valid: false, error: 'VIP Code must be text' };
  }
  const trimmed = code.trim().toUpperCase();
  // Accept alphanumeric codes of reasonable length (6-50 chars typical for VIP codes)
  if (!/^[A-Z0-9\-]+$/.test(trimmed)) {
    return { valid: false, error: 'VIP Code format invalid' };
  }
  if (trimmed.length < 6 || trimmed.length > 50) {
    return { valid: false, error: 'VIP Code length invalid' };
  }
  return { valid: true, value: trimmed };
}
