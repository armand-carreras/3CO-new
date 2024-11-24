import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController, ViewDidEnter } from '@ionic/angular';
import { MoreInfoComponent } from 'src/app/shared/components/more-info/more-info.component';
import { Label } from 'src/app/shared/models/label';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent  implements OnInit, ViewDidEnter {

  @Input() isGuest!: boolean;
  @Input() feedback!: { labels: any[]; resultImage: string; badges: {badgeCategory: string, badgeType: string, rewardImage: string}[] };
  @Output() scanAgain = new EventEmitter<void>();

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  ionViewDidEnter(): void {
    
  }

  public scan() {
    this.scanAgain.emit();
  }

  public backToLabels() {
    
  }

  async showMoreLabelDetectedInfo(label: Label) {
    const modal = await this.modalController.create({
      component: MoreInfoComponent,
      componentProps: {
        label: label
      },
    });

    return await modal.present();
  }

}
