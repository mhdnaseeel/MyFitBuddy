import { Routes } from '@angular/router';
import { OnboardingComponent } from './modules/onboarding/onboarding.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'onboarding', component: OnboardingComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'active', loadComponent: () => import('./modules/workout/components/active-workout/active-workout.component').then(m => m.ActiveWorkoutComponent) }
];
