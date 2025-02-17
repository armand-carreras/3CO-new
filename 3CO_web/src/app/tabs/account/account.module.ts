import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';
import { RewardsComponent } from './rewards/rewards.component';
import { VersionComponent } from './version/version.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule
  ],
  declarations: [AccountPage, RewardsComponent, VersionComponent]
})
export class AccountPageModule {}
