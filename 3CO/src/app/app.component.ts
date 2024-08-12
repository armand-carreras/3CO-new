import { Component, OnInit } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { StorageService } from './shared/services/storage.service';
import { LabelSQLiteHandlerService } from './shared/services/SQLite/label-sqlite-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  
  constructor(private themeServ: ThemeService,
    private storageServ: StorageService,
    private labelService: LabelSQLiteHandlerService
  ) { 
    this.labelService.initializeApp();
   }

  async ngOnInit(){

    if (document.querySelector('jeep-sqlite') === null) {
      const jeepSqlite = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepSqlite);
    }
    
    await this.storageServ.init();
    await this.themeServ.initTheme();
  }
}
