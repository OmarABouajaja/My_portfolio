import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import { ProjectsIcon, ContactIcon } from '@/components/ui/icons';

// Define application routes and their components
export const routes = [
  {
    path: '/',
    element: <Layout />, // Main layout wrapper
    children: [
      {
        index: true,
        element: <Home />, // Home page
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'projects',
        element: <Projects />, // Projects page
        icon: ProjectsIcon, // Icon for navigation
      },
      {
        path: 'contact',
        element: <Contact />, // Contact page
        icon: ContactIcon, // Icon for navigation
      },
      {
        path: '*',
        element: <NotFound />, // 404 page
      },
    ],
  },
];

// Create the browser router instance
export const router = createBrowserRouter(routes); 