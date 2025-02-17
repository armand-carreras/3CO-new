import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { tabsDeactivateGuard } from './shared/guards/tabs-deactivate.guard';
import { authGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path:'',
    loadChildren: () => import('./start-screen/start-screen.module').then(m => m.StartScreenPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'auth',
    canActivate: [authGuard],
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
            m => m.PasswordRecoveryPageModule),
      },
      {
        path: 'account-validator',
        loadChildren: () => 
          import('./auth/account-validator/account-validator.module').then(
            m => m.AccountValidatorPageModule)
      },
      {
        path: 'migrate-user',
        loadChildren: () => 
          import('./auth/migrate-user/migrate-user.module').then(
            m => m.MigrateUserPageModule)
      }
    ],

  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
