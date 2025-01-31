import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductHandlerService } from 'src/app/shared/services/product-handler.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  public wantMoreInfo: boolean = false;
  public selectedProduct!: Product;
  public user!: User;
  public categories = [
    { name: 'Electronics', icon: 'hardware-chip-outline' },
    { name: 'Cosmetics', icon: 'nuclear-outline' },
    { name: 'Industry', icon: 'construct-outline' },
    { name: 'Building', icon: 'business-outline' },
    { name: 'Matresses', icon: 'bed-outline' },
    { name: 'Global', icon: 'globe-outline' },
    { name: 'Food', icon: 'fast-food-outline' },
    { name: 'Textile', icon: 'shirt-outline'},
    { name: 'Chemicals', icon: 'flask-outline' },
    { name: 'Energy', icon: 'flash-outline' },
    { name: 'Other', icon: 'balloon-outline'}
  ];


  public productsLoaded: boolean = false;


  public groupedProducts: {
    [key: string]: Product[]
  } = {
    'Electronics': [],
    'Cosmetics': [],
    'Industry': [],
    'Building': [],
    'Matresses': [],
    'Global': [],
    'Food': [],
    'Textile': [],
    'Chemicals': [],
    'Energy': [],
    'Other': []
  };

  public isModalOpen: boolean = false;
  public selectedCategories: string[] = [];

  public originalGroupedProducts: { [key: string]: Product[] } = { ...this.groupedProducts };

  private subscriptions: Subscription[] = [];



  constructor(private router: Router,
    private userService: UserService,
    private productServ: ProductHandlerService,
    private toastServ: ToastService,
    private alertController: AlertController,
    private authServ: AuthService,
    private changeDetectorRef: ChangeDetectorRef) {
  
  }

  ngOnInit() { 
    this.user=this.userService.getUserValue();
    this.setToZero();
  }

  async ionViewWillEnter() {
    this.user=this.userService.getUserValue();
    this.setToZero();
    await this.productServ.loadProducts();
    this.productsLoaded = true;
    this.orderByCategory(this.productServ.getProducts);
    this.storeOriginalProducts();
  }

  ionViewWillLeave(): void {
    this.destroySubscriptions()
  }

  //Filter Dismissing
  onWillDismiss(event: Event) {
    this.isModalOpen = false;
    console.log('dismissing filter', JSON.stringify(event));
  }


  //Filter select product categories
  public applyFilters() {
    if (this.selectedCategories.length > 0) {
      const filteredProducts: { [key: string]: Product[] } = {};
      for (const category of this.selectedCategories) {
        if (this.originalGroupedProducts[category]) {
          filteredProducts[category] = [...this.originalGroupedProducts[category]];
        }
      }
      this.groupedProducts = filteredProducts;
    } else {
      this.resetProducts();
    }
    this.isModalOpen = false;
    this.changeDetectorRef.detectChanges();

  }
  
  public toggleFilter() {
    this.isModalOpen = !this.isModalOpen;
  }

  public clearFilters() {
    this.selectedCategories = [];
  }

  // Toggle selection of items
  public toggleSelection(item: string) {
    const index = this.selectedCategories.indexOf(item);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(item);
    }
  }


  get isThereAnyProduct() {
    return Object.values(this.groupedProducts).some(products => products.length > 0);
  }


  public isGroupCategoryEmpty(category: string) {
    return (this.groupedProducts && this.groupedProducts[category]?.length>0) ? true : false;
  }

  public goToProfile(){
    this.router.navigate(['/tabs/account']);
  }
  public goToMainPage() {
    this.router.navigate(['/tabs/product']);
  }
  public closeMoreInfo() {
    this.wantMoreInfo = false;
  }
  public postNewProduct() {
    if(!this.authServ.isUserGuest) {
      this.router.navigate(['/tabs/product/add-product']);
    } else {
      this.presentAlert();
    }
  }

  public handleSearchBarInput(ev: any) {
    const query = ev.detail.value.trim().toLowerCase();
    
    if (query !== '') {
      // Filter the products based on the search query
      this.filterProducts(query);
    } else {
      // If the search input is cleared, reset to the original grouped products
      this.resetProducts();
    }
}

  public showProductInfo(product: Product) {
    this.selectedProduct = product;
    this.wantMoreInfo = true;
  }


  public stillInDevelopment() {
    this.toastServ.presentAutoDismissToast('This feature is under development', 'warning');
  }

  private filterProducts(query: string) {
    // Create a copy of the groupedProducts to filter
    const filteredProducts: { [key: string]: Product[] } = {};

    // Filter products within each category based on the search query
    for (const category in this.originalGroupedProducts) {
      filteredProducts[category] = this.originalGroupedProducts[category].filter(product =>
        product.name.toLowerCase().includes(query)
      );
    }

    // Update groupedProducts with the filtered results
    this.groupedProducts = filteredProducts;
}

  private resetProducts() {
      // Reset the groupedProducts to the original values
      this.groupedProducts = this.originalGroupedProducts;
  }


  private orderByCategory(products: Product[]) {
    products.forEach(product => {
      if (product.categories?.length) {
        const category = product.categories[0];
        if (this.groupedProducts[category]) {
          this.groupedProducts[category].push(product);
        }
      }
    });
  }

  private destroySubscriptions() {
    this.subscriptions.forEach((sub)=>sub.unsubscribe());
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


  private storeOriginalProducts() {
    this.originalGroupedProducts = this.groupedProducts;
  }



  private setToZero() {
    this.groupedProducts = {
      'Electronics': [],
      'Cosmetics':[],
      'Industry':[],
      'Building':[],
      'Matresses': [],
      'Global': [],
      'Food': [],
      'Textile': [],
      'Chemicals': [],
      'Energy': [],
      'Other': []
    };
  }




}
