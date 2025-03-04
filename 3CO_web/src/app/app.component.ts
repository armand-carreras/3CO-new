import { Component, OnInit } from '@angular/core';
import { StorageService } from './shared/services/storage.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  

  private mode!: 'ion-palette-dark' | 'light';
  
  constructor(private storage: StorageService) {
  }


  async ngOnInit() {
    await this.storage.init();
    
    // Get stored mode or default to 'light'
    this.mode = (await this.storage.get('mode')) || 'light';
  
    //console.log('mode: ', this.mode);
  
    if (this.mode === 'ion-palette-dark') {
      document.documentElement.classList.add('ion-palette-dark');
    }
  }
  


  changeMode() {
    document.documentElement.classList.toggle('ion-palette-dark');
  
    // Update the mode state correctly
    this.mode = document.documentElement.classList.contains('ion-palette-dark') ? 'ion-palette-dark' : 'light';
  
    // Store the new mode
    this.storeModeState(this.mode);
  }
  

  private storeModeState(state: 'ion-palette-dark' | 'light') {
    this.storage.set('mode', state);
  }

  

}
