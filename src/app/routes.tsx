import { createBrowserRouter } from 'react-router';
import Root from './components/layout/Root';
import Home from './pages/Home';
import EventProfile from './pages/EventProfile';
import PlaceProfile from './pages/PlaceProfile';
import ContributorProfile from './pages/ContributorProfile';
import Messages from './pages/Messages';
import Community from './pages/Community';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'event/:id', Component: EventProfile },
      { path: 'place/:id', Component: PlaceProfile },
      { path: 'profile/:id', Component: ContributorProfile },
      { path: 'messages', Component: Messages },
      { path: 'messages/:convId', Component: Messages },
      { path: 'community', Component: Community },
      { path: 'dashboard', Component: Dashboard },
      { path: 'admin', Component: AdminDashboard },
      { path: 'settings', Component: Settings },
      { path: 'notifications', Component: Notifications },
    ],
  },
]);
