import { apiRequest } from './client';
import type { User, UserListResponse } from '../types';

export const userApi = {
  getProfile: () => apiRequest<User>('/user/profile'),

  getUserList: (page = 1, limit = 10) =>
    apiRequest<UserListResponse>('/user/list', {
      params: { page, limit },
    }),
};
