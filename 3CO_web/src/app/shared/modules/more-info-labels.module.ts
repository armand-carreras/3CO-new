import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MoreInfoComponent } from '../components/more-info/more-info.component';
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
