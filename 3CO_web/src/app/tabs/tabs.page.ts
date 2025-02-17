import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { StorageService } from '../shared/services/storage.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  public route = 'labels';

  constructor(private router: Router,
    private userService: UserService,
    private storage: StorageService,
    private authServ: AuthService
  ) {
    this.router.events.pipe(map(ev=>{if(ev.type===1)return ev;else {return;}})).subscribe(ev=>{
      if(ev !== undefined) {
        console.log(ev.urlAfterRedirects.split('/')[2])
        this.route = ev.urlAfterRedirects.split('/')[2];
      }
    })

    //this.router.setUpLocationChangeListener();
  }

  async ngOnInit() {
    if(!this.storage.storageWorking) {
      await this.storage.init();
    }
    const token = await this.storage.getToken();
    const wantsTo = await this.checkIfUserWantsToBeLoggedInAutomatically();

    if(token && wantsTo && this.authServ.isUserGuest) {
      this.userService.loadUser(token);
    } else if(this.authServ.isUserGuest) {
      console.info('Guest USer');
    } else {
      this.router.navigate(['auth']);
    }
  }


  private async checkIfUserWantsToBeLoggedInAutomatically() {
    const keepMeSignedIn = (await this.storage.getKeepMeLogged()) ?? false;
    const isGuest = this.authServ.isUserGuest;
    const token = await this.storage.getToken();
    if (isGuest && keepMeSignedIn && token) {
      try{
        await this.authServ.autoLoginKeepMeSignedInUser(token);
        this.authServ.setAsRegularUser();
        return true
      } catch(error) {
        return false;
      }
    } else if(keepMeSignedIn && !token) {
      //this.toastServ.presentAutoDismissToast('No token was found, log in with your credentials', 'danger');
      return false;
    } else {
      return false;
    }
  }
}
