import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountValidatorPage } from './account-validator.page';

const routes: Routes = [
  {
    path: '',
    component: AccountValidatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountValidatorPageRoutingModule {}
