import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordRecoveryPageRoutingModule } from './password-recovery-routing.module';

import { PasswordRecoveryPage } from './password-recovery.page';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordRecoveryPageRoutingModule,
    TranslatePipe
  ],
  declarations: [PasswordRecoveryPage]
})
export class PasswordRecoveryPageModule {}
