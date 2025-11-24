import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AvailableLangs, I18nHandlerService } from 'src/app/shared/services/i18n-handler.service';
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

  public preferredLanguage: LangOption = {value: 'en-GB', name: 'English'};
  public selectorValues: LangOption[] = [
    {value: 'en-GB', name: 'English'},
    {value: 'es-ES', name: 'Español'},
    {value: 'ca-ES', name: 'Català'},
    {value: 'de-DE', name: 'Deutsch'},
    {value: 'it-IT', name: 'Italiano'},
    {value: 'fr-FR', name: 'Français'},
  ];

  constructor(private router: Router,
    private loader: LoadingController,
    private authServ: AuthService,
    private userServ: UserService,
    private i18n: I18nHandlerService,
    private change: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }
  async ionViewWillEnter() {
    const loader = await this.loader.create({message:'Loading...'});
    await loader.present();
    await this.updateUser();
    const lang = await this.i18n.getPreferredLanguage();
    this.preferredLanguage = this.selectorValues.find(el=>el.value===lang)??{value: 'en-GB', name: 'English'};
    this.change.detectChanges();
    loader.dismiss();
  }



  public changeSelectorValue(event: CustomEvent) {
    //console.log('Event from Selector: ', event.detail.value);
    this.i18n.setPreferredLanguage(event.detail.value);
    this.preferredLanguage = this.selectorValues.find(el=>el.value===event.detail.value)??{value: 'en-GB', name: 'English'};
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
    } else {
      this.userServ.setAsGuest();
      this.user = this.userServ.getUserValue();
    }
  }


}

export interface LangOption {
  value: AvailableLangs;
  name: string;
}