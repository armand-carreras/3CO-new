import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, Platform, ViewWillEnter } from '@ionic/angular';
import { firstValueFrom, tap } from 'rxjs';
import { Label } from 'src/app/shared/models/label';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BadgeService } from 'src/app/shared/services/badge.service';
import { CameraService } from 'src/app/shared/services/camera.service';
import { PhotoHandlingService } from 'src/app/shared/services/photo-handling.service';
import { LabelSQLiteHandlerService } from 'src/app/shared/services/SQLite/label-sqlite-handler.service';
import { ToastService } from 'src/app/shared/services/toast.service';





@Component({
  selector: 'app-labels',
  templateUrl: './labels.page.html',
  styleUrls: ['./labels.page.scss'],
})
export class LabelsPage implements OnInit, ViewWillEnter {

  public isLabelSelected = false;
  public detectedLabels: Label[] = [];
  public isScanInfo: boolean = false;
  public selectedLabelForMoreInfo!: Label;
  public unlockedBadgesNow: {badgeCategory: string, badgeType: string, rewardImage: string}[] = [];
  
  private isModalOpen: boolean;
  private isResultModalOpen: boolean = false;
  private photo!: Photo;
  private base64Image: string = '';
  private receivedBase64Image: string = '';
  private randomLabel!: Label;


  constructor(
    private router: Router,
    private labelService: LabelSQLiteHandlerService,
    private authService: AuthService,
  ) {
    this.isModalOpen = false;
    this.photo = {format:'', saved:false};
  }

  /**
   * GETTERS & SETTERS
   */
  get cannotSend() {
    return  this.photo.base64String === '';
  }

  get webpath(){
    return this.photo.webPath;
  }
  get resultImage() {
    return `data:image/*;base64,${this.receivedBase64Image}`;
  }
  get resultModalTrigger() {
    return this.isResultModalOpen;
  }
  set setResultModalTrigger(bool: boolean) {
    this.isResultModalOpen = bool;
  }

  get isGuest() {
    return this.authService.isUserGuest;
  }

  get modalIsOpen() {
    return this.isModalOpen;
  }

  get imgEncodedPhotoBase64() {
    const result =  this.photo.base64String ? `data:image/*;base64,${this.photo.base64String}`: this.base64Image;
    return result;
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

  public showMoreLabelInfo(label: Label) {
    this.selectedLabelForMoreInfo = label;
    this.isLabelSelected = true;
  }

  public showMoreLabelDetectedInfo(label: Label) {
    this.selectedLabelForMoreInfo = label;
    this.isResultModalOpen = false;
    this.isLabelSelected = true;
    this.isScanInfo = true;
  }

  public dismissMoreInfo(ev: any) {
    this.isLabelSelected = false;
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

