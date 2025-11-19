import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabelsPageRoutingModule } from './labels-routing.module';

import { LabelsPage } from './labels.page';
import { LabelsListComponent } from './labels-list/labels-list.component';
import { MoreInfoLabelsModule } from 'src/app/shared/modules/more-info-labels.module';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabelsPageRoutingModule,
    MoreInfoLabelsModule,
    TranslatePipe
  ],
  declarations: [LabelsPage, LabelsListComponent],
  schemas: []
})
export class LabelsPageModule {}
