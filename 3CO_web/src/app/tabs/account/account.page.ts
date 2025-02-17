import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, ViewWillEnter {

  public user: User = {
    name: 'Guest User',
    email: 'guest@3co.com',
    avatarImg: 'assets/avatar/unisex_avatar.png',
    scans: 0,
    rewards: 0
  }

  constructor(private router: Router,
    private authServ: AuthService,
    private userServ: UserService
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(): void {
    this.updateUser();
  }

  public checkPersonalInfo() {
    this.router.navigate(['tabs/account/personal-details']);
  }

  public checkRewards() {
    this.router.navigate(['tabs/account/rewards']);
  }

  public checkSettings() {
    this.router.navigate(['tabs/account/settings']);
  }

  public checkVersion() {
    this.router.navigate(['tabs/account/version']);
  }

  private async updateUser() {
    if(!this.authServ.isUserGuest) {
      await this.userServ.fetchUser();
      this.user = this.userServ.getUserValue();
      console.log('------------ User from account: ', JSON.stringify(this.user));
    }
  }


}
