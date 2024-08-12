import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  public user: User = {
    name: 'John',
    lastName: 'Doe',
    location: 'Spain',
    email: 'johndoe@3co.com',
    password: '12345',
    avatarImg: '/assets/avatar/male-avatar.png',
    scans: 341,
    rewards: 215
  }

  constructor(private router: Router) { }

  ngOnInit() {
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


}
