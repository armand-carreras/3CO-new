import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabelsPage } from './labels.page';
import { LabelsListComponent } from './labels-list/labels-list.component';

const routes: Routes = [
  {
    path: '',
    component: LabelsPage
  },
  {
    path: 'label-list',
    component: LabelsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabelsPageRoutingModule {}
