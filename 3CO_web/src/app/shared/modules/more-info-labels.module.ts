import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoreInfoComponent } from 'src/app/shared/components/more-info/more-info.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TermsAndConditionsComponent } from '../components/terms-and-conditions/terms-and-conditions.component';



@NgModule({
  declarations: [
    MoreInfoComponent,
    TermsAndConditionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    MoreInfoComponent,
    TermsAndConditionsComponent
  ]
})
export class MoreInfoLabelsModule { }
