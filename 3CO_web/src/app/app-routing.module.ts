import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'labels',
    pathMatch: 'full'
  },
  {
    path: 'labels',
    loadChildren: () => import('./labels/labels.module').then( m => m.LabelsPageModule)
  },
  {
    path: 'learn',
    loadChildren: () => import('./learn/learn.module').then( m => m.LearnPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
