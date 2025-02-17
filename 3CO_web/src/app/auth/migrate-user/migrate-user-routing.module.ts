import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MigrateUserPage } from './migrate-user.page';

const routes: Routes = [
  {
    path: '',
    component: MigrateUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MigrateUserPageRoutingModule {}
