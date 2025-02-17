import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { MoreInfoLabelsModule } from 'src/app/shared/modules/more-info-labels.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    MoreInfoLabelsModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
