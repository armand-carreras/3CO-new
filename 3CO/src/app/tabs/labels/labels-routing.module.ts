import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabelsPage } from './labels.page';

const routes: Routes = [
  {
    path: '',
    component: LabelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabelsPageRoutingModule {}
