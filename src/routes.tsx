import { createBrowserRouter, RouteObject } from 'react-router-dom';
import type { ComponentType } from 'react';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import About from './pages/About';
import { ProjectsIcon, ContactIcon } from '@/components/ui/icons';

// Navigation item type
interface NavigationItem {
  path: string;
  icon: ComponentType;
  label: string;
}

// Navigation data with icons
export const navigationItems: NavigationItem[] = [
  {
    path: 'projects',
    icon: ProjectsIcon,
    label: 'Projects',
  },
  {
    path: 'contact',
    icon: ContactIcon,
    label: 'Contact',
  },
];

// Define application routes
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

// Create the browser router instance
export const router = createBrowserRouter(routes); 