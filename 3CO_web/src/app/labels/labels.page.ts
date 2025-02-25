import { Component, OnInit } from '@angular/core';
import { Label } from '../shared/models/label';
import { Router } from '@angular/router';
import { LabelSQLiteHandlerService } from '../shared/services/SQLite/label-sqlite-handler.service';
import { ModalController } from '@ionic/angular';
import { MoreInfoComponent } from '../shared/components/more-info/more-info.component';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.page.html',
  styleUrls: ['./labels.page.scss'],
  standalone: false
})
export class LabelsPage implements OnInit {

  public isLabelSelected = false;
  public detectedLabels: Label[] = [];
  public isScanInfo: boolean = false;
  public selectedLabelForMoreInfo!: Label;
  public unlockedBadgesNow: {badgeCategory: string, badgeType: string, rewardImage: string}[] = [];
  
  private isModalOpen: boolean;
  private isResultModalOpen: boolean = false;
  private base64Image: string = '';
  private receivedBase64Image: string = '';
  private randomLabel!: Label;


  constructor(
    private router: Router,
    private labelService: LabelSQLiteHandlerService,
    private modalController: ModalController
  ) {
    this.isModalOpen = false;
  }

  /**
   * GETTERS & SETTERS
   */
  get resultImage() {
    return `data:image/*;base64,${this.receivedBase64Image}`;
  }
  get resultModalTrigger() {
    return this.isResultModalOpen;
  }
  set setResultModalTrigger(bool: boolean) {
    this.isResultModalOpen = bool;
  }


  get modalIsOpen() {
    return this.isModalOpen;
  }

  get featuredLabel(): Label {
    return this.randomLabel;
  }

  ngOnInit() {
    console.log('Entering LabelsPage NgOnInit');
    try{
      console.log('--------- Labels Page before setting random label');
      this.setRandomLabel();
    } catch(err) {
      console.error(err);
    }
  }

  ionViewWillEnter(): void {
    console.log('Entering LabelsPage ViewWillEnter');
  }


  public scan() {
    this.router.navigate(['tabs/labels/detection']);
  }

  public dismissResultModal() {
    this.isResultModalOpen = false;
  }

  public async showMoreLabelInfo(label: Label) {
      const modal = await this.modalController.create({
        component: MoreInfoComponent,
        componentProps: {
          label: label
        },
        showBackdrop: true,
        backdropDismiss: true
      });
  
      await modal.present();
  }

 /*  public showMoreLabelDetectedInfo(label: Label) {
    this.selectedLabelForMoreInfo = label;
    this.isResultModalOpen = false;
    this.isLabelSelected = true;
    this.isScanInfo = true;
  } */

  public dismissMoreInfo(ev: any) {
    this.isLabelSelected = false;
    console.log('------------- trying to dissmiss modal:',JSON.stringify(ev))
    if(ev.backToScanInfo){
      this.isScanInfo = true;
      this.isResultModalOpen = true;
    } else { 
      this.isScanInfo = false;
    }
  }

  public seeMoreLabels() {
      this.router.navigate(['/tabs/labels/label-list']);
  }


  private setRandomLabel() {
    this.randomLabel = this.labelService.featuredLabel[0];
    this.featuredLabel['logo'] = this.featuredLabel?.logo ?? '/assets/databases/No_Image_Available.jpg'
  }





}
