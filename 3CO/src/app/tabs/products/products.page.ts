import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { User } from 'src/app/shared/models/user';
import { ProductHandlerService } from 'src/app/shared/services/product-handler.service';
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

  private subscriptions: Subscription[] = [];



  constructor(private router: Router,
    private userService: UserService,
    private productServ: ProductHandlerService,
    private sanitizer: DomSanitizer) {
  
  }

  ngOnInit() { 
    this.user=this.userService.getUserValue();
  }

  async ionViewWillEnter() {
    this.user=this.userService.getUserValue();
    this.setToZero()
    await this.productServ.loadProducts();
    this.orderByCategory(this.productServ.getProducts);
  }
  ionViewWillLeave(): void {
    this.destroySubscriptions()
  }

  public isGroupCategoryEmpty(category: string) {
    return (this.groupedProducts && this.groupedProducts[category]?.length>0) ? true : false;
  }

  public goToProfile(){
    this.router.navigate(['/tabs/account']);
  }
  public goToMainPage() {
    this.router.navigate(['/tabs/products']);
  }
  public closeMoreInfo() {
    this.wantMoreInfo = false;
  }

  public async handleSearchBarInput(ev: any) {
    if(ev!==''){
      console.log('Trying to search for:', ev.target);
    } else {
    }
  }

  public showProductInfo(product: Product) {
    this.selectedProduct = product;
    this.wantMoreInfo = true;
  }

  private orderByCategory(products: Product[]) {
    products.forEach(product => {
      const category = product.categories;
      if (this.groupedProducts[category]) {
        this.groupedProducts[category].push(product);
      }
    });
  }

  private destroySubscriptions() {
    this.subscriptions.forEach((sub)=>sub.unsubscribe());
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
