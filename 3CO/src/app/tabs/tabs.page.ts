import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public route = 'labels';

  constructor(private router: Router) {
    this.router.events.pipe(map(ev=>{if(ev.type===1)return ev;else {return;}})).subscribe(ev=>{
      if(ev !== undefined) {
        this.route = ev.urlAfterRedirects.split('/')[2];
      }
    })
  }

}
