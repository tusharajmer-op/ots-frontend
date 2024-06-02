import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Signup from './signup.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
import Test from './test.tsx';
import Login from './login.tsx'
import Dashboard from './dashboard.tsx';
import { UserProvider } from './utils/userContext.tsx';
import Result from './result.tsx';
import MainLayout from './mainLayout.tsx';
import ErrorPage from './error.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement : <ErrorPage />,
    children: [
      { path: "sign-up", element: <Signup /> },
      { path: "log-in", element: <Login /> },
      { path: "Dashboard", element: <Dashboard /> },
      { path: "test", element: <Test /> },
      { path: "results", element: <Result /> },
      
    ],
  },
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
      <Toaster />
    </UserProvider>
  </React.StrictMode>


)
