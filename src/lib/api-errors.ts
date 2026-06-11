/**
 * API Error Handling Utilities
 * Standardized error handling for all API routes
 */

import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

export function handleApiError(error: unknown, context: string = 'API'): NextResponse {
  const message = getErrorMessage(error);
  
  // Log all errors for debugging
  console.error(`[${context}] Error:`, message, error);

  // Don't expose internal error details to client
  const userMessage = 
    error instanceof ApiError 
      ? error.message 
      : 'Server error. Please try again.';

  const statusCode = 
    error instanceof ApiError 
      ? error.statusCode 
      : 500;

  return NextResponse.json({ error: userMessage }, { status: statusCode });
}

export function validateEnvVar(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    throw new ApiError(500, `Missing environment variable: ${varName}`);
  }
  return value;
}
