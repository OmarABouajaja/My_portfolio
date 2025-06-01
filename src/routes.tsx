import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Projects from '@/pages/Projects';
import Certifications from '@/pages/Certifications';
import Resume from '@/pages/Resume';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import { ProjectsIcon, ContactIcon } from '@/components/ui/icons';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'projects',
        element: <Projects />,
        icon: ProjectsIcon,
      },
      {
        path: 'certifications',
        element: <Certifications />,
      },
      {
        path: 'resume',
        element: <Resume />,
      },
      {
        path: 'contact',
        element: <Contact />,
        icon: ContactIcon,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes); 