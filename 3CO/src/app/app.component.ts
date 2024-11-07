import { Component, OnInit } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { StorageService } from './shared/services/storage.service';
import { InitializeAppService } from './shared/services/SQLite/initialize.app.service';
import { LabelSQLiteHandlerService } from './shared/services/SQLite/label-sqlite-handler.service';
import { tap } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(private themeServ: ThemeService,
    private storageServ: StorageService,
    private initStorage: InitializeAppService,
    private labelsService: LabelSQLiteHandlerService
  ) { 
    
  }
  
  async ngOnInit(){
    
    console.log('Initializing app.page, NgOnInit');
    /* await this.initStorage.initializeApp();
    
    await this.storageServ.init(); */
    await this.themeServ.initTheme();
  }




}
