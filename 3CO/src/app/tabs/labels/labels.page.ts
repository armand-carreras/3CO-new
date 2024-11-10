import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, Platform, ViewWillEnter } from '@ionic/angular';
import { firstValueFrom, tap } from 'rxjs';
import { Label } from 'src/app/shared/models/label';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CameraService } from 'src/app/shared/services/camera.service';
import { PhotoHandlingService } from 'src/app/shared/services/photo-handling.service';
import { LabelSQLiteHandlerService } from 'src/app/shared/services/SQLite/label-sqlite-handler.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';




@Component({
  selector: 'app-labels',
  templateUrl: './labels.page.html',
  styleUrls: ['./labels.page.scss'],
})
export class LabelsPage implements OnInit, ViewWillEnter {

  public isLabelSelected = false;
  
  private isModalOpen: boolean;
  private isResultModalOpen: boolean = false;
  private photo!: Photo;
  private base64Image: string = '';
  private receivedBase64Image: string = '';
  private randomLabel!: Label;


  constructor(
    private router: Router,
    private platform: Platform,
    private cameraService: CameraService,
    private photoService: PhotoHandlingService,
    private toastServ: ToastService,
    private labelService: LabelSQLiteHandlerService,
    private authService: AuthService,
    private userService: UserService,
    private loaderCntr: LoadingController
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
    this.setRandomLabel();
  }

  ionViewWillEnter(): void {
    console.log('Entering LabelsPage ViewWillEnter');
  }


  public dismissResultModal() {
    this.isResultModalOpen = false;
  }

  public showMoreLabelInfo() {
    this.isLabelSelected = true;
  }
  public dismissMoreInfo(ev: any) {
    this.isLabelSelected = false;
  }

  public async sendImage() {
    const token = this.authService.token;
    const isGuest = this.authService.isUserGuest;
    let base64String = this.extractBase64String();

    if (!base64String) {
        this.toastServ.presentAutoDismissToast('Image could not be loaded!', 'danger');
        return;
    }

    try {
        // Send the base64 image to the endpoint
        const response = await firstValueFrom(this.photoService.sendBase64ImageToEndpoint(base64String, isGuest, token));
        this.receivedBase64Image = response.result_image;
        
        console.log('Image sent successfully:', response);
        this.toastServ.presentAutoDismissToast('Image sent successfully!', 'success');
        this.isModalOpen = false;
        this.isResultModalOpen = true;
    } catch (error) {
        console.error('Error sending image:', error);
        this.toastServ.presentAutoDismissToast('Error sending image. Please try again.', 'danger');
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
      return base64String ? base64String.replace(/\s/g, '') : ''; // Only call replace if the string is valid
  }



  //modal controller
  public setModal(bool: boolean) {
    this.isModalOpen = bool;
  }

  public seeMoreLabels() {
      this.router.navigate(['/tabs/labels/label-list']);
    }

  public scan() {
    console.log('---------> Scanning image: ',this.platform.platforms())
    if (this.platform.is('mobile')) {
      this.mobileScan();
    } else {
      this.webScan();
    }
  }

  private async mobileScan() {
    const permission = await this.cameraService.checkAndRequestPermissions();
    if (permission.camera !== 'granted' && permission.camera !== 'limited') {
      this.toastServ.presentAutoDismissToast('You should accept to use the camera!', 'warning')
      await this.cameraService.checkAndRequestPermissions();
    } else {
      await this.cameraService
        .getPhoto()
        .then((photo: Photo) => {
          console.log('photo done: ',JSON.stringify(photo));
          this.photo = photo;
          this.setModal(true);
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
        this.setModal(true);
      };
      reader.readAsDataURL(file);
    }
  }


  private setRandomLabel() {
    console.log('-----------> featuredLabel: ', JSON.stringify(this.labelService.featuredLabel[0]));
    this.randomLabel = this.labelService.featuredLabel[0];
    this.featuredLabel.logo = this.featuredLabel?.logo ?? '/assets/databases/No_Image_Available.jpg'
  }

}



  /* public async sendImage() {
    if(this.photo.base64String || this.base64Image!== '') {
      const base64String = this.photo.base64String ? this.photo.base64String.split(',')[1] : this.base64Image.split(',')[1];
      await firstValueFrom(this.photoService.sendBase64ImageToEndpoint(base64String))
       .then(response=>{
        this.receivedBase64Image = response.result_image
        console.log(JSON.stringify(response));
      });
      //loader.dismiss();
      this.toastServ.presentAutoDismissToast('Image sent successfully!','success');
      this.isModalOpen = false;
      this.isResultModalOpen = true;
    } else {
      this.toastServ.presentAutoDismissToast('Image could not be loaded!', 'danger');
    }
  } */