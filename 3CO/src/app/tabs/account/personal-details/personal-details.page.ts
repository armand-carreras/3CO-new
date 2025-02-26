
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ViewWillEnter } from '@ionic/angular';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.page.html',
  styleUrls: ['./personal-details.page.scss'],
})
export class PersonalDetailsPage implements OnInit, ViewWillEnter {

  public user!: User;
  public newEmail: string = '';
  public newPassword: string = '';
  public newName: string = '';
  public gender: string = '';
  public editMode: boolean = false;

  constructor(
    private userServ: UserService,
    private loaderServ: LoadingController,
    private toastService: ToastService,
    private alertService: AlertController,
    private authServ: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.setUser(this.userServ.getUserValue());
  }
  ionViewWillEnter(): void {
    this.setUser(this.userServ.getUserValue());
  }


  get isUserGuest(): boolean {
    return this.authServ.isUserGuest;
  }


  public async edit() {

    if(!this.editMode && !this.authServ.isUserGuest){
      this.editMode = !this.editMode;
    } else if(this.authServ.isUserGuest){ 
      this.toastService.presentAutoDismissToast('As a guest user you cannot edit user information', 'warning', 700);
    }

  }

  public async done() {

    const loader = await this.loaderServ.create({ message:'Updating user' });
    loader.onDidDismiss().then(()=>{this.editMode = !this.editMode;})
    
    await loader.present();
    await this.userServ.updateUserDetails(this.newName, this.newEmail, this.newPassword)
    .finally(()=>{
      loader.dismiss();
      this.user = this.userServ.getUserValue();
    });

  }


  public goBack() {
    this.router.navigate(['/tabs/account']);
  }


  public logout() {
    this.authServ.logoutUser();
    this.router.navigate(['/auth']);
  }
  
  public async deleteAccount() {
    const alert = await this.alertService.create({
      message: 'Are you sure you want to delete your 3CO account?',
      buttons:[
        {text:'Yes',
          handler:(()=>{
            this.deleteUserAccount();
          }
        )},
        {text: 'No', role:'cancel'}
      ],
    });
    await alert.present();

  }


  private async deleteUserAccount() {
    await this.authServ.deleteUser()
      .then(()=>{
        this.authServ.logoutUser();
        this.router.navigateByUrl('/auth', {replaceUrl: true})
      });
  }

  private setUser( user: User ) {
    this.user = user;
    this.newName = user.name;
    this.newEmail = user.email;
    if( user.password ) {
      this.newPassword = user.password;
    }
  }

}
