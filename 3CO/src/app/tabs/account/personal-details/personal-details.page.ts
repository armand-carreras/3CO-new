import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.page.html',
  styleUrls: ['./personal-details.page.scss'],
})
export class PersonalDetailsPage implements OnInit {

  public user!: User;
  public newEmail: string = '';
  public newPassword: string = '';
  public newName: string = '';
  public editMode: boolean = false;

  constructor(public userServ: UserService, private loaderServ: LoadingController) { }

  ngOnInit() {
    this.userServ.getUser().subscribe(user=>this.setUser(user));
  }

  public async edit() {

    if(!this.editMode){
      this.editMode = !this.editMode;
    } else { 
      //TODO modify user info in server
      const loader = await this.loaderServ.create({
        message:'Updating user information',
        duration:1000
        
      });
      loader.onDidDismiss().then(()=>{this.editMode = !this.editMode;})
      await loader.present();
      let newUserInfo: User = {
        avatarImg: this.user.avatarImg,
        email: this.newEmail,
        name: this.newName,
        password: this.newPassword,
        rewards: this.user.rewards,
        scans: this.user.scans,
      }
      this.userServ.updateUser(newUserInfo);
      this.user = await firstValueFrom(this.userServ.getUser())
    }

  }
  public logout() {
    
  }
  public delete() {

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
