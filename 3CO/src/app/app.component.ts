import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { StorageService } from './shared/services/storage.service';
import { InitializeAppService } from './shared/services/SQLite/initialize.app.service';
import { Platform, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LabelSQLiteHandlerService } from './shared/services/SQLite/label-sqlite-handler.service';
import { SystemBarsService } from './shared/services/system-bars.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  

  private lastBackPress = 0;
  private timePeriodToExit = 2000; 

  private subscription!: Subscription;

  
  constructor(
    private themeServ: ThemeService,
    private storageServ: StorageService,
    private initSQLite: InitializeAppService,
    private labelSQLite: LabelSQLiteHandlerService,
    private platform: Platform,
    private barService: SystemBarsService,
    private location: Location,
    private router: Router,
    private toastController: ToastController,
  ) {
   
    this.initializeApp();
  }
  
  
  
  
  async ngOnInit(){
    
    await this.initSQLite.initializeApp();
    await this.labelSQLite.getRandomLabel();
    await this.labelSQLite.getAll();
    await this.storageServ.init();
    await this.themeServ.initTheme();
  }


  ngOnDestroy(): void {
    this.subscription.closed ?? this.subscription.unsubscribe();
  }






  initializeApp() {
    this.platform.ready().then(() => {
      this.handleBackButton();
    });
  }

  handleBackButton() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, async () => {
      const currentUrl = this.router.url.split('?')[0]; // Strip query params
      const rootTabRoutes = ['/tabs/labels', '/tabs/product', '/tabs/learn', 'tabs/account']; // <- Update these!

      // CASE 1: If there's navigation history → go back
      if (window.history.length > 1 && !rootTabRoutes.includes(currentUrl)) {
        this.location.back();
        return;
      } 
      else {
        const currentTime = new Date().getTime();
        
        if (currentTime - this.lastBackPress < this.timePeriodToExit) {
          console.log('Exiting app...');
          App.minimizeApp();
        } else {
          this.lastBackPress = currentTime;
          const toast = await this.toastController.create({
            message: 'Press back again to exit',
            duration: 2000,
            position: 'top',
            cssClass: 'backtoast'
          });
          await toast.present();
        }
      }
    });


    
  }

  

}
