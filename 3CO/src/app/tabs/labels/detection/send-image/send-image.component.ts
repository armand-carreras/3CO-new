import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Label } from 'src/app/shared/models/label';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Badge, BadgeService } from 'src/app/shared/services/badge.service';
import { PhotoHandlingService } from 'src/app/shared/services/photo-handling.service';
import { LabelSQLiteHandlerService } from 'src/app/shared/services/SQLite/label-sqlite-handler.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-send-image',
  templateUrl: './send-image.component.html',
  styleUrls: ['./send-image.component.scss'],
})
export class SendImageComponent  implements OnInit {

  @Input() base64String!: string;
  @Output() feedbackFromDetection = new EventEmitter<{labels: Label[], feedbackImg: string, unlockedBadges: Badge[]}>();
  @Output() back = new EventEmitter<void>();
  
  public unlockedBadgesNow: {badgeCategory: string, badgeType: string, rewardImage: string}[] = [];
  
  private detectedLabels: Label[] = [];
  private receivedBase64Image: string = '';
  private unlockedBadges: Badge[] = [];

  constructor(
    private authService: AuthService,
    private toastServ: ToastService,
    private photoService: PhotoHandlingService,
    private badgeService: BadgeService,
    private labelService: LabelSQLiteHandlerService
  ) { }

  ngOnInit() {}

  get imgEncodedPhotoBase64() {
    return this.base64String;
  }


  public backToScan() {
    this.back.emit();
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
        this.feedbackFromDetection.emit({labels: this.detectedLabels, feedbackImg: this.receivedBase64Image, unlockedBadges: this.unlockedBadges})
      }

    } catch (error: any) {
      console.error('Error sending image:', error);
  
      // Extract error message for the toast
      const errorMessage = error.message || 'An unexpected error occurred';
      this.toastServ.presentAutoDismissToast(`${errorMessage}`, 'danger');
    }
  }

  /**
   * Extracts the base64 string from available image sources and sanitizes it.
   * @returns The sanitized base64 string if available, or undefined.
   */
  private extractBase64String(): string {
    // If a valid base64 string is found, sanitize and return it
    if (this.base64String) {
        return this.sanitizeBase64(this.base64String.includes(',') ? this.base64String.split(',')[1] : this.base64String);
    }
    return '';
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
