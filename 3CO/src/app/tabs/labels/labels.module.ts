import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabelsPageRoutingModule } from './labels-routing.module';

import { LabelsPage } from './labels.page';
import { LabelsListComponent } from './labels-list/labels-list.component';
import { MoreInfoComponent } from './more-info/more-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabelsPageRoutingModule
  ],
  declarations: [LabelsPage, LabelsListComponent, MoreInfoComponent],
  schemas: []
})
export class LabelsPageModule {}
