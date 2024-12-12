import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Badge, BadgeService } from 'src/app/shared/services/badge.service';
import { UserService } from 'src/app/shared/services/user.service';
import { parse, format } from 'date-fns';
import { AuthService } from 'src/app/shared/services/auth.service';

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
    private authServ: AuthService,
    private router: Router ) { }

  ionViewWillEnter(): void {
    console.log('enter to rewards: ', !this.isGuest);
    if(!this.isGuest){
      this.loadBadges();
    }
  }

  ngOnInit() {
    if(!this.isGuest){
      this.userServ.getUserValue();
      this.loadBadges();
    }
  }

  get isGuest() {
    return this.authServ.isUserGuest;
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
      const updatedDateBadge: Badge = {
        badge_category: badge.badge_category,
        badge_type: badge.badge_type,
        unlocked_at: this.convertToLocalTimeWithDateFns(badge.unlocked_at)
      };
      return {badge: updatedDateBadge, imgSRC};
    })
  }
  
  convertToLocalTimeWithDateFns(serverDate: string): string {
    try {
      const trimmedDate = serverDate.split('.')[0] + 'Z';
      const date = parse(trimmedDate, "yyyy-MM-dd'T'HH:mm:ssX", new Date());
      return format(date, "PPpp");
    } catch (error) {
      console.error("Error converting date:", error);
      return "Invalid date";
    }
  }

}
