import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'arbol/:id',
    loadComponent: () =>
      import('./features/tree-detail/tree-detail.component').then(
        (m) => m.TreeDetailComponent
      ),
  },
  {
    path: 'viveros',
    loadComponent: () =>
      import('./features/viveros/viveros.component').then(
        (m) => m.ViverosComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
