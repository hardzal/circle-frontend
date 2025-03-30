import AppLayout from '@/components/layouts/app-layout';
import AuthLayout from '@/components/layouts/auth-layout';
import HomePage from '@/routes/home';
import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from './404';
import FollowsPage from './follows';
import ForgotPasswordPage from './forgot-password';
import LoginPage from './login';
import ProfilePage from './profile';
import RegisterPage from './register';
import ResetPasswordPage from './reset-password';
import SearchUsers from './search-users';
import ThreadDetailPage from './thread-detail';
import CounterPage from './counter';
import ProfieDetailPage from './profile-detail';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/search',
        element: <SearchUsers />,
      },
      {
        path: '/follows/:username',
        element: <FollowsPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/profile/:username',
        element: <ProfieDetailPage />,
      },
      {
        path: '/thread/:threadId',
        element: <ThreadDetailPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: '/testing',
        element: <CounterPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
