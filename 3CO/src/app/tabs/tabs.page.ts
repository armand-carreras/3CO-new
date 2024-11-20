import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  public route = 'labels';

  constructor(private router: Router,
    private userService: UserService,
    private storage: StorageService
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
    console.log('retrieving Token:', token);
    if(token) {
      this.userService.loadUser(token);
    } else {
      this.router.navigate(['auth']);
    }
  }


}
