import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MigrateUserPageRoutingModule } from './migrate-user-routing.module';

import { MigrateUserPage } from './migrate-user.page';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MigrateUserPageRoutingModule,
    TranslatePipe
  ],
  declarations: [MigrateUserPage]
})
export class MigrateUserPageModule {}
