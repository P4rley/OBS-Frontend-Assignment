import api from './HttpService';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  profilePicture?: string | null;
}

export const userApi = {
  getUsers: () => api.get<User[]>('/users'),
};
