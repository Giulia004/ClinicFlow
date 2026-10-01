import { Routes } from '@angular/router';
import { AuthLayout } from '../layout/auth-layout/auth-layout.page';
import { MainLayout } from '../layout/main-layout/main-layout.page';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  //Pagina iniziale pubblica
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },

  //Reindirizzamento iniziale
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  //Rotte pubbliche racchiuse nell'AuthLayout (Login e Registrazione)
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage)
      }
    ]
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'dashboard/appointments',
        loadComponent: () => import('./pages/appointments/appointments.page').then((m) => m.AppointmentsPage),
      },
      {
        path: 'dashboard/slots',
        loadComponent: () => import('./pages/slot/slot.page').then((m) => m.SlotPage),
        canActivate: [roleGuard(['admin'])]
      },
      {
        path: 'dashboard/reports',
        loadComponent: () => import('./pages/report/report.page').then((m) => m.ReportPage)
      },
      {
        path: 'dashboard/feedbacks',
        loadComponent: () => import('./pages/feedback/feedback.page').then((m) => m.FeedbackPage)
      },
      {
        path: 'dashboard/profile',
        loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage)
      },
      {
        path: 'dashboard/users',
        loadComponent: () => import('./pages/users/users.page').then((m) => m.UsersPage)
      },
    ]
  },
  //Gestione delle rotte non trovate
  {
    path: '**',
    redirectTo: 'home'
  }
];
