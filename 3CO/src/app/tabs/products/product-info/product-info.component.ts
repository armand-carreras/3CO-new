import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { AlertController, LoadingController, Platform, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Product, Review } from 'src/app/shared/models/product';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CameraService } from 'src/app/shared/services/camera.service';
import { ProductHandlerService } from 'src/app/shared/services/product-handler.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent  implements OnInit, ViewWillLeave, ViewWillEnter {

  @Input() product!: Product;
  @Input() currentUser!: User;
  @Output() wannaGoBack = new EventEmitter<boolean>()

  public reviewForm: FormGroup
  public imagePreview: string = '';
  public createdReview: Review = {
    title: '',
    description: '',
    rating: 0
  };
  public isCreateReview: boolean = false;
  public productReviews: Review[] = [];
  public reviewsFetched: boolean = false;
  
  private photo!: Photo;
  
  private currentPage: number = 1;
  private totalPages: number = 1;
  private perPage: number = 10;

  constructor(
    private productServ: ProductHandlerService,
    private authService: AuthService,
    private userServ: UserService,
    private fb: FormBuilder,
    private platform: Platform,
    private alertController: AlertController,
    private cameraService: CameraService,
    private toastServ: ToastService,
    private loaderService: LoadingController,
    private router: Router,
  ) {
    this.currentUser = this.userServ.getUserValue();

    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      image: [''],
      description: [''],
      rating: [5, [Validators.required, Validators.min(0), Validators.max(5)]]
    });
   }

  ngOnInit() {
    this.currentUser = this.userServ.getUserValue();
    console.log('loading reviews for productID: ',this.product.id);
    //await this.loadAllReviews();
    this.loadReviews();
  }

  ionViewWillEnter() {
  }
  
  ionViewWillLeave(): void {
    console.log('leaving review page: setting everything to 0');
    this.productReviews = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.reviewsFetched = false;
  }



  public loadMore(event: any) {
    this.loadReviews(event);
  }

  getGoogleSearchUrl(productName: string, productShop: string): string {
    const query = `${productName}; ${productShop}`;
    return `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=shop`;
  }

  async onSubmit() {
    const review: Review = {
      title: this.reviewForm.value.title,
      description: this.reviewForm.value.description,
      rating: this.reviewForm.value.rating,
      image: this.reviewForm.value.image
    }
    const productID = Number(this.product.id);
    const loader = await this.loaderService.create({
      message: 'Posting product...',
      animated: true,
      showBackdrop: true,
    });
    await loader.present();
    try {
      await this.productServ.addProductReview(productID, review);
      await this.loadReviews();
      this.isCreateReview = false;
      //await this.loadAllReviews();
    } catch (error) {
      console.error('Error posting review or loading reviews:', error);
      // Optionally notify the user of the error here
    } finally {
      await loader.dismiss();
    }

  }


  editReview() {
    if(!this.authService.isUserGuest){
      this.isCreateReview = true;
    } else {
      this.presentAlert();
    }
  }
  quitReview() {
    this.isCreateReview = false;
  }

  public goBack() {
    this.wannaGoBack.emit(true);
  }

  public goToProfile(){
    this.router.navigate(['/tabs/account']);
  }
  public goToMainPage() {
    this.router.navigate(['/tabs/product']);
  }

  private goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Become a user?',
      message: 'To benefit of all features from 3CO please register as user.',
      buttons: [{
        text: 'Register',
        handler: (()=>{
          this.goToRegister();
        })
      }],
    });

    await alert.present();
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
    if (permission.camera !== 'granted') {
      this.toastServ.presentAutoDismissToast('You should accept to use the Camera or your Gallery!', 'warning');
      await this.cameraService.checkAndRequestPermissions();
    }
    else if(permission.photos === 'denied') {
      this.toastServ.presentAutoDismissToast('Please check your device Settings and allow 3C0 to use the camera, and gallery.','warning');
    }
    else {
      await this.cameraService
        .getPhoto()
        .then((photo: Photo) => {
          console.log('photo done: ',JSON.stringify(photo));
          this.photo = photo;
          this.reviewForm.patchValue({ image: `data:image/${photo.format};base64,${photo.base64String}` });
          this.imagePreview = `data:image/${photo.format};base64,${photo.base64String}`; // Set the image preview
        })
        .catch((error) => {
          if(error.includes('User Cancelled')){
            this.toastServ.presentAutoDismissToast(error, 'warning')
          }
        });
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










  async loadReviews(event?: any) {
    // Avoid fetching beyond total pages
    if (this.currentPage > this.totalPages) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    try {
      const response: reviewGET = await this.productServ.loadReviewsForProduct(this.product.id, this.currentPage, this.perPage);
      // Append the new reviews to the list
      this.productReviews = [...this.productReviews, ...response.reviews];
      
      if(!this.reviewsFetched) {
        this.reviewsFetched = true;
      }

      if(response.reviews.length===0){
        const toast = await this.toastServ.setAnimatedToast('Be the first reviewing this product!', 'primary', 700);
        toast.present();
      }

      // Update pagination info
      this.totalPages = response.pages;
      this.currentPage++;

      // Complete infinite scroll if applicable
      if (event) {
        event.target.complete();
      }

      // Disable infinite scroll if no more data
      if (this.currentPage > this.totalPages) {
        event.target.disabled = true;
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      if (event) {
        event.target.complete();
      }
    }
  }

 






}


interface reviewGET {
  page: number;
  pages: number;
  per_page: number;
  reviews: Review[];
  total: number;
}