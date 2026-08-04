import { apiRequest } from './client';
import type { AuthResponse, LoginPayload, SignupPayload, SignupResponse } from '../types';

export const authApi = {
  signIn: (payload: LoginPayload) =>
    apiRequest<AuthResponse>('/auth/sign-in', {
      method: 'POST',
      body: payload,
    }),

  signUp: (payload: SignupPayload) =>
    apiRequest<SignupResponse>('/auth/sign-up', {
      method: 'POST',
      body: payload,
    }),
};
