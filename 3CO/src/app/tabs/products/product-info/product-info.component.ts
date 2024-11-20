import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { Product, Review } from 'src/app/shared/models/product';
import { User } from 'src/app/shared/models/user';
import { CameraService } from 'src/app/shared/services/camera.service';
import { ProductHandlerService } from 'src/app/shared/services/product-handler.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent  implements OnInit {

  @Input() product!: Product;
  @Input() currentUser!: User;
  @Output() wannaGoBack = new EventEmitter<boolean>()

  public reviewForm: FormGroup
  public imagePreview: string = '';
  public createdReview: Review = {
    creatorID: '',
    title: '',
    description: '',
    rating: 0
  };
  public isCreateReview: boolean = false;
  

  private photo!: Photo;



  constructor(
    private productServ: ProductHandlerService,
    private userServ: UserService,
    private fb: FormBuilder,
    private platform: Platform,
    private cameraService: CameraService,
    private toastServ: ToastService,
    public router: Router
  ) {
    this.currentUser = this.userServ.getUserValue();

    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      creatorID: [''],
      image: [''],
      description: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]]
    });
   }

  ngOnInit() {
    this.currentUser = this.userServ.getUserValue();
  }

  postReview() {
    this.toastServ.presentAutoDismissToast('Under Development', 'warning', 500);
    /* this.productServ.addProductReview(this.product.id, this.createdReview);
    console.log('working'); */
  }

  goBack() {
    this.wannaGoBack.emit(true);
  }

  public goToProfile(){
    this.router.navigate(['/tabs/account']);
  }
  public goToMainPage() {
    this.router.navigate(['/tabs/products']);
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
          this.reviewForm.patchValue({ image: `data:image/${photo.format};base64,${photo.base64String}` });
          this.imagePreview = `data:image/${photo.format};base64,${photo.base64String}`; // Set the image preview
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
        this.reviewForm.patchValue({ image: base64String });
      };
      reader.readAsDataURL(file);
    }
  }



}
