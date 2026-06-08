import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import RegisterPage from '../pages/Auth/RegisterPage';

// Tambahkan baris import ini di atas:
import PublicLayout from '../layouts/PublicLayout'; 
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';

const router = createBrowserRouter([
  {
    element: <PublicLayout />, // Sekarang ini nggak bakal error lagi
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage/>,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}