import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabelsPageRoutingModule } from './labels-routing.module';

import { LabelsPage } from './labels.page';
import { MoreInfoLabelsModule } from '../shared/modules/more-info-labels.module';
import { LabelsListComponent } from './labels-list/labels-list.component';
import { LabelSQLiteHandlerService } from '../shared/services/SQLite/label-sqlite-handler.service';
import { SQLiteService } from '../shared/services/SQLite/sqlite.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabelsPageRoutingModule,
    MoreInfoLabelsModule
  ],
  providers: [LabelSQLiteHandlerService, SQLiteService],
  declarations: [LabelsPage, LabelsListComponent],
  schemas: []
})
export class LabelsPageModule {}
