import { request } from './client';
import type { User } from '../types/user';

export const getMe = () => request<User>('/me');
export const logout = () => request<null>('/logout', { method: 'POST' });