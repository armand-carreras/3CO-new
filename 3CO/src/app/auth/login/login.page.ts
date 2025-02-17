
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ViewDidEnter } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, ViewDidEnter {

  public email: string = '';
  public password: string = '';
  public keepMeSignedIn: boolean = false;
  private isLogout: boolean = false;

  constructor(
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private loaderContl: LoadingController,
    private alertCntrl: AlertController,
    private storage: StorageService,
    private toastServ: ToastService,
    private router: Router,
  ) {
    
}


  async ngOnInit() {
    if(!this.storage.storageWorking) {
      await this.storage.init();
    }
    //await this.checkActivatedRoute();
  }
  
  async ionViewDidEnter() {
    if(!this.storage.storageWorking) {
      await this.storage.init();
    }
    await this.checkActivatedRoute();
        
  }


  public async login() {
    //Create and present loader
    const loader = await this.loaderContl.create({message:'Logging in'});
    loader.present();

    //Get token from user
    let token = '';
    try {
      token = await firstValueFrom(this.authService.login(this.email, this.password)).finally(()=>loader.dismiss());
      console.log('------------ Keep me signed in: ',this.keepMeSignedIn);
      this.storage.storeKeepMeLoggedIn(this.keepMeSignedIn);
    } catch(error: any) {
      console.log(error.message, error.error);
      if(error.message.includes('not verified')) {
        console.log('alert To Validate');
        await this.alertToValidate(this.email);
      } else {
        //await this.toastServ.presentAutoDismissToast(error.message, 'danger');
        console.error('Error while loggin in', error.message);
      }
      throw new Error(error);
    }
    
    //Navigate to home
    if ( token ) {
      this.authService.setAsLoggedIn();
      this.router.navigateByUrl('/tabs', { replaceUrl: true });

    }
  }




  public async startAsGuest() {

    const loader = await this.loaderContl.create({message:'Preparing environment...'});
    await loader.present();
    try {
      await this.authService.setAsGuest();
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
      loader.dismiss();
    } catch(error) {
      loader.dismiss();
      console.error('Something went wrong while setting up Guest');
    }
  }

  public checkBoxChanges(ev: any) {
    this.keepMeSignedIn = ev.detail.checked;
  }



  private async checkIfUserWantsToBeLoggedInAutomatically() {
    
    this.keepMeSignedIn = (await this.storage.getKeepMeLogged()) ?? false;
    
    const token = await this.storage.getToken();
    
    if (this.keepMeSignedIn && token) {
      try{
        await this.authService.autoLoginKeepMeSignedInUser(token);
        this.authService.setAsRegularUser();
        return true
      } catch(error) {
        return false;
      }
    } else if(this.keepMeSignedIn && !token) {
      this.toastServ.presentAutoDismissToast('No token was found, log in with your credentials', 'danger');
      return false;
    } else {
      return false;
    }
  }

  private async openModalAndAskIfUserWantsToRememberTheLogin() {
    const alert = await this.alertCntrl.create({
      header: 'Keep logged in?',
      message: 'Do you want to keep your user logged in?',
      buttons:[
        {
          text: 'No',
          role: 'cancel',
          handler: (()=> this.keepMeSignedIn=false )
        },
        {
          text: 'Yes',
          handler: (()=> this.keepMeSignedIn=true )
        },
      ],
      
    });
    await alert.present();
    return alert;
  }

  private async checkActivatedRoute() {
    this.activeRoute.queryParams.subscribe(async params => {
      console.log('------- ACTIVATED ROUTE SUBSCRIPTION -------');
      if (params['logout']) {
        console.log('------- ACTIVATED ROUTE LOGOUT -------');
        this.isLogout = true;
        this.authService.setAsGuest();
        this.toastServ.presentAutoDismissToast('Successfully logged out!','success');
      } else if (params['email'] && params['password']){
        console.log('------- ACTIVATED ROUTE REGISTER -------');
        const email = this.activeRoute.snapshot.queryParamMap.get('email');
        const password = this.activeRoute.snapshot.queryParamMap.get('password');
        if (email && password) {
          this.email = email;
          this.password = password;
          //const alert = await this.openModalAndAskIfUserWantsToRememberTheLogin();
          //await alert.onDidDismiss();
          await this.login();
        }
      } else {
        console.log('-------- ACTIVATED ROUTE OTHERS ----------');
        let wantsAndCanBeAutomaticallyLoggedIn = await this.checkIfUserWantsToBeLoggedInAutomatically();
        console.log('-------- After wants to be auto logged --------', wantsAndCanBeAutomaticallyLoggedIn);
        if(wantsAndCanBeAutomaticallyLoggedIn && !this.isLogout){
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        } else if (this.keepMeSignedIn && !this.isLogout){
          this.toastServ.presentAutoDismissToast('Your token may have expired','danger');
        } else {
          console.error('------ Not the desired behaviour -------', wantsAndCanBeAutomaticallyLoggedIn, !this.isLogout, this.keepMeSignedIn)
        }
      }
    });
    /* const email = this.activeRoute.snapshot.queryParamMap.get('email');
    const password = this.activeRoute.snapshot.queryParamMap.get('password');
    if (email && password) {
      this.email = email;
      this.password = password;
      const alert = await this.openModalAndAskIfUserWantsToRememberTheLogin();
      await alert.onDidDismiss();
      await this.login();
    } */
  }

private async alertToValidate(email: string) {
    //ToDo validate email
    const alert = await this.alertCntrl.create({
      message: 'Your account should be validated before accessing it',
      buttons: [
        {
          text:'Validate',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['auth/account-validator'], {
              queryParams: { email: email }
            });
          }
        },
        {
          text:'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel Validation');
          }
        }
      ]
    });
    alert.present();
  }
  

}
