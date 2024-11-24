import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { tabsDeactivateGuard } from './shared/guards/tabs-deactivate.guard';

const routes: Routes = [
  {
    path:'',
    loadChildren: () => import('./start-screen/start-screen.module').then(m => m.StartScreenPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canDeactivate: [tabsDeactivateGuard]
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./auth/login/login.module').then(m => m.LoginPageModule),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./auth/register/register.module').then(m => m.RegisterPageModule),
      },
      {
        path: 'password-recovery',
        loadChildren: () =>
          import('./auth/password-recovery/password-recovery.module').then(
            m => m.PasswordRecoveryPageModule,
          ),
      },
    ],

  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
