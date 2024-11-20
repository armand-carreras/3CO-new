import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Badge, BadgeService } from 'src/app/shared/services/badge.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss'],
})
export class RewardsComponent  implements OnInit, ViewWillEnter {
  
  userBadges: { badge: Badge, imgSRC: string }[] = [];

  constructor(
    private userServ: UserService,
    private badgeServ: BadgeService,
  private router: Router ) { }

  ionViewWillEnter(): void {
    console.log(this.userServ.getUserBadges());
    this.loadBadges();
  }

  ngOnInit() {
    this.userServ.getUserValue();
    this.loadBadges();
  }

  goBack() {
    this.router.navigate(['tabs/account']);
  }

  public getBadgeImg(badge: Badge) {
    return this.badgeServ.getBadgeImage(badge.badge_category, badge.badge_type);
  }

  private loadBadges() {
    const badges = this.userServ.getUserBadges();
    this.userBadges = badges.map((badge)=>{
      const imgSRC = this.getBadgeImg(badge);
      return {badge, imgSRC};
    })
  }

}
