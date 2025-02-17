import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonalDetailsPageRoutingModule } from './personal-details-routing.module';

import { PersonalDetailsPage } from './personal-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonalDetailsPageRoutingModule
  ],
  declarations: [PersonalDetailsPage]
})
export class PersonalDetailsPageModule {}
