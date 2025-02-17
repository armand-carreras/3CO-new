import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { Platform, ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { Label } from 'src/app/shared/models/label';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BadgeService } from 'src/app/shared/services/badge.service';
import { CameraService } from 'src/app/shared/services/camera.service';
import { PhotoHandlingService } from 'src/app/shared/services/photo-handling.service';
import { LabelSQLiteHandlerService } from 'src/app/shared/services/SQLite/label-sqlite-handler.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-detection',
  templateUrl: './detection.page.html',
  styleUrls: ['./detection.page.scss'],
})
export class DetectionPage implements OnInit {

  public timeToScan: boolean = true;
  public timeToCheckData: boolean = false;

  public detectedLabels: Label[] = [];
  public unlockedBadgesNow: {badgeCategory: string, badgeType: string, rewardImage: string}[] = [];
  public selectedLabelForMoreInfo!: Label;
  public currentState: 'scan' | 'sendImage' | 'feedback' = 'scan'; // Default state
  public imgEncodedPhotoBase64: string = '';
  public resultImage: string = '';


  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }


  get isGuest() {
    return this.authService.isUserGuest;
  }

  changeState(state: 'scan' | 'sendImage' | 'feedback') {
    this.currentState = state;
  }

  handleScanCompleted(photoBase64: string) {
    this.imgEncodedPhotoBase64 = photoBase64;
    this.changeState('sendImage');
  }

  handleFeedbackReceived(feedback: any) {
    this.detectedLabels = feedback.labels;
    this.resultImage = feedback.resultImage;
    this.unlockedBadgesNow = feedback.badges || [];
    this.changeState('feedback');
  }





  public backToLabels() {
    this.router.navigate(['tabs/labels']);
  }

  public showMoreLabelDetectedInfo(label: Label) {
    console.log(label);
  }

  public backToScan() {
    console.log('backToScan');
  }

  scanAgain() {
    console.log('scanning Again');
  }




}
