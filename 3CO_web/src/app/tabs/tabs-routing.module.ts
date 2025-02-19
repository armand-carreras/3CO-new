import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'labels',
        loadChildren: () => import('./labels/labels.module').then(m => m.LabelsPageModule)
      },
      {
        path: 'learn',
        loadChildren: () => import('./learn/learn.module').then(m => m.LearnPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/labels',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
