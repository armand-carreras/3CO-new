import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountValidatorPageRoutingModule } from './account-validator-routing.module';

import { AccountValidatorPage } from './account-validator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AccountValidatorPageRoutingModule
  ],
  declarations: [AccountValidatorPage]
})
export class AccountValidatorPageModule {}
