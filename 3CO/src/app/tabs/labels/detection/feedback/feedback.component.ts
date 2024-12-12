import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { MoreInfoComponent } from 'src/app/shared/components/more-info/more-info.component';
import { Label } from 'src/app/shared/models/label';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent  implements OnInit, ViewWillEnter {

  @Input() feedback!: { labels: any[]; resultImage: string; badges: {badgeCategory: string, badgeType: string, rewardImage: string}[] };
  @Output() scanAgain = new EventEmitter<void>();


  constructor(
    private modalController: ModalController,
    private router: Router,
    private authServ: AuthService
  ) { }

  ngOnInit() {
    
  }
  
  ionViewWillEnter(): void {
    console.log('feedback Badges: ',this.feedback.badges);
  }

  get isGuest() {
    return this.authServ.isUserGuest;
  }

  get resultImg() {
    return `data:image/*;base64,${this.feedback.resultImage}` 
  }

  public scan() {
    this.scanAgain.emit();
  }

  public backToLabels() {
    this.router.navigate(['/tabs/labels']);
  }

  async showMoreLabelDetectedInfo(label: Label) {
    const modal = await this.modalController.create({
      component: MoreInfoComponent,
      componentProps: {
        label: label
      },
      showBackdrop: true,
      backdropDismiss: true
    });

    return await modal.present();
  }

}
