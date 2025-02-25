import { api } from '@/libs/api';
import { useAuthStore } from '@/stores/auth';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toaster } from '../ui/toaster';
import { isAxiosError } from 'axios';
import Cookies from 'js-cookie';

export default function AuthLayout() {
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function checkAuth() {
    try {
      // const token = localStorage.getItem('token');
      const token = Cookies.get('token');
      const response = await api.post(
        '/auth/check',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.data);
      setIsLoading(false);
    } catch (error) {
      // localStorage.removeItem('token');
      Cookies.remove('token');

      if (isAxiosError(error)) {
        return toaster.create({
          title: error.response?.data.message,
          type: 'error',
        });
      }

      toaster.create({
        title: 'Something went wrong!',
        type: 'error',
      });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // const token = localStorage.getItem('token');
    const token = Cookies.get('token');
    if (token) checkAuth();
  }, []);

  const { user } = useAuthStore();

  if (!isLoading && user) return <Navigate to={'/'} />;

  return <Outlet />;
}
