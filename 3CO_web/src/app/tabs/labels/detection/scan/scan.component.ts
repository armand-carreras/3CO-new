import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { CameraService } from 'src/app/shared/services/camera.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
})
export class ScanComponent  implements OnInit {

  @Output() scanCompleted = new EventEmitter<string>(); // Emits the photo base64 string

  private photo!: Photo;
  private base64Image: string = '';  

  constructor(
    private platform: Platform,
    private cameraService: CameraService,
    private toastServ: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.scan();
  }



  get imgEncodedPhotoBase64() {
    return this.photo?.base64String ? `data:image/*;base64,${this.photo?.base64String}`: this.base64Image;
  }

  public backToLabels() {
    this.router.navigate(['/tabs/labels'])
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
          this.emitPhoto('data:image/*;base64,'+photo.base64String);
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
        console.log('onFileInput: ', base64String);
        this.emitPhoto(this.imgEncodedPhotoBase64);
      };
      reader.readAsDataURL(file);
    }
  }


  private emitPhoto(base64: string) {
    this.scanCompleted.emit(base64);
  }


}
