import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoreInfoComponent } from 'src/app/shared/components/more-info/more-info.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    MoreInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    MoreInfoComponent
  ]
})
export class MoreInfoLabelsModule { }
