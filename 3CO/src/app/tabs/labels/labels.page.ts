import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, Platform } from '@ionic/angular';
import { firstValueFrom, tap } from 'rxjs';
import { Label } from 'src/app/shared/models/label';
import { CameraService } from 'src/app/shared/services/camera.service';
import { PhotoHandlingService } from 'src/app/shared/services/photo-handling.service';
import { LabelSQLiteHandlerService } from 'src/app/shared/services/SQLite/label-sqlite-handler.service';
import { ToastService } from 'src/app/shared/services/toast.service';




@Component({
  selector: 'app-labels',
  templateUrl: './labels.page.html',
  styleUrls: ['./labels.page.scss'],
})
export class LabelsPage implements OnInit {
  
  private isModalOpen: boolean;
  private isResultModalOpen: boolean = false;
  private photo!: Photo;
  private base64Image: string = '';
  private receivedBase64Image: string = '';
  private randomLabels: Label[] = [];


  constructor(
    private router: Router,
    private platform: Platform,
    private cameraService: CameraService,
    private photoService: PhotoHandlingService,
    private toastServ: ToastService,
    private labelService: LabelSQLiteHandlerService,
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

  get fiveRandomLabels() {
    return this.randomLabels;
  }

  async ngOnInit() {
    console.log('Working Home component');
    this.getRandomLabels();
  }


  public dismissResultModal() {
    this.isResultModalOpen = false;
  }

  public async sendImage() {
    if(this.photo.base64String || this.base64Image!== '') {
      const loader = await this.loaderCntr.create({message:'Sending image...'});
      loader.present();
      await firstValueFrom(this.photoService.sendBase64ImageToEndpoint(this.photo.base64String ? this.photo.base64String.split(',')[1] : this.base64Image.split(',')[1])
        .pipe(tap(response=>this.receivedBase64Image = response.result_image)));
      loader.dismiss();
      this.toastServ.presentAutoDismissToast('Image sent successfully!','success');
      this.isModalOpen = false;
      this.isResultModalOpen = true;
    } else {
      this.toastServ.presentAutoDismissToast('Image could not be loaded!', 'danger');
    }
  }

  //modal controller
  public setModal(bool: boolean) {
    this.isModalOpen = bool;
  }


  public scan() {
    console.log(this.platform.platforms())
    if (this.platform.is('mobile')) {
      this.mobileScan();
    } else {
      this.webScan();
    }
  }

  public seeMoreLabels() {
    this.router.navigate(['/tabs/labels/label-list']);
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
          console.log('photo done: ',photo);
          this.photo = photo;
          this.setModal(true);
        })
        .catch((error) =>
          this.toastServ.presentAutoDismissToast(`Error when getting photo:  ${error}`, 'danger')
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

  private async getRandomLabels() {
    const labels= await this.labelService.getRandomLabels();
    this.randomLabels = labels;
  }




  

}
