import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountPage } from './account.page';
import { RewardsComponent } from './rewards/rewards.component';
import { SettingsComponent } from './settings/settings.component';
import { VersionComponent } from './version/version.component';

const routes: Routes = [
  {
    path: '',
    component: AccountPage
  },
  {
    path: 'rewards',
    component: RewardsComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'version',
    component: VersionComponent
  },
  {
    path: 'personal-details',
    loadChildren: () => import('./personal-details/personal-details.module').then( m => m.PersonalDetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
