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

  private receivedBase64Image: string = '';
  private photo!: Photo;
  private base64Image: string = '';

  constructor(
    private router: Router,
    private platform: Platform,
    private cameraService: CameraService,
    private toastServ: ToastService,
    private labelService: LabelSQLiteHandlerService,
    private authService: AuthService,
    private badgeService: BadgeService,
    private photoService: PhotoHandlingService) { }

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
    this.unlockedBadgesNow = feedback.unlockedBadges || [];
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

  public async sendImage() {
    const token = this.authService.token;
    const isGuest = this.authService.isUserGuest;
    const base64String = this.extractBase64String();
  
    if (!base64String) {
      this.toastServ.presentAutoDismissToast('Image could not be loaded!', 'danger');
      return;
    }
  
    let response: any = null;
  
    try {
      // Send the base64 image to the endpoint
      response = await this.photoService.sendBase64ImageToEndpoint(base64String, isGuest, token);
      console.log('----------Labels page response from photo service: ', response);
  
      // Process the response if successful
      if (response) {
        this.receivedBase64Image = response?.result_image ?? '';
        const detectedNameLabels: string[] = response?.labels?.map((res: string) =>
          res.split('_').join(' ')
        );
        console.log('---------- NON sanitized labels: ', JSON.stringify(detectedNameLabels));
        
        let sanitizedLabelNames = detectedNameLabels;
        if (detectedNameLabels) {
          sanitizedLabelNames = this.sanitizeDetectionLabels(detectedNameLabels);
          console.log('---------- sanitized labels: ', JSON.stringify(sanitizedLabelNames));
          this.detectedLabels = await this.labelService.getFromNamesArray(sanitizedLabelNames);
        }
  
        if (response.badges && response.badges?.length > 0) {
          this.unlockedBadgesNow = response.badges.map((badge: { [x: string]: any }) => {
            const badgeImagePath = this.badgeService.getBadgeImage(badge['badge_category'], badge['badge_type']);
            return {
              badgeCategory: badge['badge_category'],
              badgeType: badge['badge_type'],
              rewardImage: badgeImagePath,
            };
          });
          console.log('Unlocked badges', JSON.stringify(this.unlockedBadgesNow));
        }
      }
    } catch (error: any) {
      console.error('Error sending image:', error);
  
      // Extract error message for the toast
      const errorMessage = error.message || 'An unexpected error occurred';
      this.toastServ.presentAutoDismissToast(`${errorMessage}`, 'danger');
    }
  }
  

  public scan() {
    //how do modal behave now???
    
    if (this.platform.is('mobile')) {
      this.mobileScan();
    } else {
      this.webScan();
    }
  }

  private async mobileScan() {
    const permission = await this.cameraService.checkAndRequestPermissions();
    if (permission.camera !== 'granted' && permission.camera !== 'limited') {
      this.toastServ.presentAutoDismissToast('Please allow camera usage.', 'warning')
      await this.cameraService.checkAndRequestPermissions();
    } else {
      await this.cameraService
        .getPhoto()
        .then((photo: Photo) => {
          console.log('photo done: ',JSON.stringify(photo));
          this.photo = photo;
        })
        .catch((error) =>
          this.toastServ.presentAutoDismissToast(`Error when getting photo:  ${error}`, 'warning')
        );
    }
  }

  private webScan() {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.addEventListener('change', (event) => this.onFileSelected(event));
    inputElement.click();
  }

  // Handle file selection
  private onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.base64Image = base64String;
      };
      reader.readAsDataURL(file);
    }
  }



  /**
   * Extracts the base64 string from available image sources and sanitizes it.
   * @returns The sanitized base64 string if available, or undefined.
   */
  private extractBase64String(): string | undefined {
    const base64String = this.photo?.base64String || this.base64Image;
    
    // If a valid base64 string is found, sanitize and return it
    if (base64String) {
        return this.sanitizeBase64(base64String.includes(',') ? base64String.split(',')[1] : base64String);
    }
    return undefined;
  }
  // Helper to clean up Base64 string
  private sanitizeBase64(base64String: string): string {
    return base64String ? base64String?.replace(/\s/g, '') : ''; // Only call replace if the string is valid
  }
  private sanitizeDetectionLabels(labelNames: string[]): string[] {
    const possibilitiesMap = new Map([
        ["aiab italian association for organic agriculture", "aiab"],
        ["bluesign product chemicals", "bluesign"],
        ["carbon trust carbon reduction label", "Carbon Reduction Label"],
        ["carbon trust standard", "Carbon Trust Standard"],
        ["cradle to cradle certified cm products program", "Cradle to Cradle Certified"],
        ["din gepruft biobased din certco", "DIN-Geprüft"],
        ["cruelty free international", "leaping bunny"],
        ["eco cert", "ecocert"],
        ["eu organic agriculture", "EU organic"],
        ["fairtrade international trader", "fairtrade"],
        ["gots global organic textile standard", "global organic textile standard"],
        ["iscc plus international sustainability and carbon certification", "iscc"],
        ["nordic swan ecolabel", "nordic ecolabel"],
        ["oeko tex made in green", "oeko"],
        ["oekocontrol", "Ökocontrol"],
        ["programme for the endorsement of forestry certification pefc", "pefc"],
        ["rain forest alliance", "rainforest"],
        ["tuv austria ok biobased", "ok biobased"],
        ["tuv austria ok compost home", "ok compost home"]
    ]);

    return labelNames.map(label => possibilitiesMap.get(label.toLowerCase()) || label);
  }



}
