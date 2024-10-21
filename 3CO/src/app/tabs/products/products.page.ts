import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription, firstValueFrom, tap } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  public user!: User;
  public categories = [
    { name: 'Electronics', icon: 'hardware-chip-outline' },
    { name: 'Cosmetics', icon: 'nuclear-outline' },
    { name: 'Industry', icon: 'construct-outline' },
    { name: 'Building', icon: 'business-outline' },
    { name: 'Matresses', icon: 'bed-outline' },
    { name: 'Global', icon: 'globe-outline' },
    { name: 'Food', icon: 'fast-food-outline' },
    { name: 'Chemicals', icon: 'flask-outline' },
    { name: 'Energy', icon: 'flash-outline' }
  ];

  groupedProducts: {
    [key: string]: {name:string, url:string}[]
  } = {};

  private subscriptions: Subscription[] = [];



  constructor(private router: Router, private userService: UserService, private sanitizer: DomSanitizer) { }

  async ngOnInit() {  
    await firstValueFrom(this.userService.getUser().pipe(tap(user=>this.user=user)));
  }

  ionViewWillEnter() {
    this.subscribeToUser();
  }
  ionViewWillLeave(): void {
    this.destroySubscriptions()
  }

  public sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Example of setting sanitized URLs
  public setIframeUrl(url: string) {
    return this.sanitizeUrl(url);
  }

  public isGroupCategoryEmpty(category: string) {
    if(this.groupedProducts[category].length>0) {
      return false;
    }
    else return true;

  }
  public goToProfile(){
    this.router.navigate(['/tabs/account']);
  }
  public goToMainPage() {
    this.router.navigate(['/tabs/labels']);
  }

  public async handleSearchBarInput(ev: any) {
    if(ev!==''){
      console.log('Trying to search for:', ev.target);
    } else {
    }

  }



  private async subscribeToUser() {
    await this.userService.getUser().pipe(tap(user=>this.user=user)).subscribe();
  }

  private destroySubscriptions() {
    this.subscriptions.forEach((sub)=>sub.unsubscribe());
  }



}
