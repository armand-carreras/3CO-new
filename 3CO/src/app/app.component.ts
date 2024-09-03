import { Component, OnInit } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { StorageService } from './shared/services/storage.service';
import { LabelSQLiteHandlerService } from './shared/services/SQLite/label-sqlite-handler.service';
import { Capacitor } from '@capacitor/core';

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
    
  }
  
  async ngOnInit(){
    
    await this.labelService.initializeApp();
    await this.labelService.getLabels();

    
    await this.storageServ.init();
    await this.themeServ.initTheme();
  }


 
}
