import { Component, OnInit } from '@angular/core';
import { LabelSQLiteHandlerService } from './shared/services/SQLite/label-sqlite-handler.service';
import { ViewWillEnter } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  
  constructor(private labelService: LabelSQLiteHandlerService) {
  }


  ngOnInit() {
    /* console.log('initializing DB values');
    try {
      await this.labelService.initializeDatabase();
    } catch(err) {
      console.error(err);
    } */
  }

}
