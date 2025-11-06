import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartScreenPageRoutingModule } from './start-screen-routing.module';

import { StartScreenPage } from './start-screen.page';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartScreenPageRoutingModule,
    TranslatePipe
  ],
  declarations: [StartScreenPage]
})
export class StartScreenPageModule {}
