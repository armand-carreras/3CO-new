import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetectionPageRoutingModule } from './detection-routing.module';

import { DetectionPage } from './detection.page';
import { MoreInfoLabelsModule } from 'src/app/shared/modules/more-info-labels.module';
import { FeedbackComponent } from './feedback/feedback.component';
import { ScanComponent } from './scan/scan.component';
import { SendImageComponent } from './send-image/send-image.component';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetectionPageRoutingModule,
    MoreInfoLabelsModule,
    TranslatePipe
  ],
  declarations: [DetectionPage, FeedbackComponent, ScanComponent, SendImageComponent]
})
export class DetectionPageModule {}
