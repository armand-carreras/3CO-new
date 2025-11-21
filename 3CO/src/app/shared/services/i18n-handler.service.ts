import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class I18nHandlerService {


  constructor(
    private translateServ: TranslateService,
    private storageServ: StorageService
  ) { 
    this.init();
  }


  public init() {
    console.log('initializing i18n Service');
    this.getPreferredLanguage().then((lang)=>{
      this.loadLanguage(lang);
    });

  }



  public setPreferredLanguage(lang: AvailableLangs) {
    this.storageServ.set('preferredLanguage', lang);
  }

  public async getPreferredLanguage() {
    const lang = await this.storageServ.get('preferredLanguage');
    return lang ?? 'es-GB';
  }

  public loadLanguage(lang: AvailableLangs) {
    this.translateServ.use(lang);
  }

}




export type AvailableLangs = 'es-ES' | 'ca-ES' | 'en-GB' | 'fr-FR' | 'de-DE' | 'it-IT';
