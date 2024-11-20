import { identifierName } from '@angular/compiler';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { CameraService } from 'src/app/shared/services/camera.service';
import { ProductHandlerService } from 'src/app/shared/services/product-handler.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  //@Output() addProduct = new EventEmitter<any>(); // Event emitter to send the product data back to parent component
  productForm: FormGroup;
  possibleCategories = [
    'Electronics', 'Cosmetics', 'Industry', 'Building', 'Textile',
    'Mattresses', 'Global', 'Food', 'Chemicals', 'Energy', 'Other'
  ];
  imagePreview: string | undefined;
  
  private base64Image: string = '';
  private photo!: Photo;

  constructor(
    private fb: FormBuilder,
    private platform: Platform,
    private cameraService: CameraService,
    private toastServ: ToastService,
    private productService: ProductHandlerService,
    private userService: UserService,
    private router: Router,
    private storageServ: StorageService
  ) {
    // Initialize the form
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      creatorID: [''],
      image: ['', Validators.required],
      shopName: ['', Validators.required],
      shopLocation: ['', Validators.required],
      categories: ['', Validators.required],
      description: [''],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  async onSubmit() {
    const userID = this.userService.getUserValue();
    if (this.productForm.valid) {
      const newProduct = {
        id: crypto.randomUUID(),
        name: this.productForm.value.name,
        creatorID: userID.name,
        image: this.productForm.value.image,
        shopName: this.productForm.value.shopName,
        shopLocation: this.productForm.value.shopLocation,
        categories: this.productForm.value.categories,
        description: this.productForm.value.description,
        rating: this.productForm.value.rating
      };
      this.productService.addNewProduct(newProduct);
      this.productForm.reset(); // Reset form after submission
      this.goToMainPage();
    }
  }

  public goToMainPage() {
    this.router.navigate(['tabs', 'product'])
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
          this.productForm.patchValue({ image: `data:image/${photo.format};base64,${photo.base64String}` });
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
        this.productForm.patchValue({ image: base64String });
      };
      reader.readAsDataURL(file);
    }
  }
}
