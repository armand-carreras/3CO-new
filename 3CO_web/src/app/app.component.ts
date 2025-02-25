import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  
  currentPage = 'Labels';

  constructor(private activeRoute: ActivatedRoute) {
    console.log(activeRoute.pathFromRoot);
  }

}
