import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ErrorPage from './components/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/admin/Login';
import ManagePosts from './pages/admin/ManagePosts';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: '/projects', element: <Projects /> },
      { path: '/about', element: <About /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:slug', element: <BlogPost /> },
    ],
  },
  // ── Panel de administración ("oculto") ──────────────────────────────────
  // No están enlazadas desde el Navbar público ni desde ninguna vista. Viven
  // fuera del layout de <App /> a propósito: no queremos el Navbar/SearchModal
  // públicos encima del panel de admin. La seguridad real la da el backend
  // (JWT + bcrypt), no el hecho de que la URL no aparezca en ningún link.
  {
    path: '/admin/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [{ path: '/admin/posts', element: <ManagePosts /> }],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);