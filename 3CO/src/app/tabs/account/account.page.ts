import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  public user: User = {
    name: 'John Doe',
    email: 'johndoe@3co.com',
    password: '12345',
    avatarImg: '/assets/avatar/male-avatar.png',
    scans: 0,
    rewards: 0
  }

  constructor(private router: Router,
    private userServ: UserService
  ) { }

  ngOnInit() {
    this.updateUser()
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

  private updateUser() {
    this.userServ.getUser().subscribe(user =>
      {
        console.log(user);
        this.user = user
      }
    );
  }


}
