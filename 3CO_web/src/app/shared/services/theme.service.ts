import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

const STORAGE_KEY_DARK = 'isDark';
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private isDark: boolean = false;

  constructor(private storageServ: StorageService) {
  }

  get theme(): boolean {
    return this.isDark;
  }

  public async initTheme() {
    const theme = await this.getTheme();
    if(theme !== null) {
      document.body.classList.toggle('dark', theme);
      this.isDark = theme;
    } else {
      //set white theme as default if there is no saved value in the localStorage
      this.setDarkTheme(false);
    }
  }

  public setDarkTheme(bool: boolean) {
    this.storageServ.set(STORAGE_KEY_DARK, bool);
    document.body.classList.toggle('dark', bool);
    this.isDark = bool;
  }

  private async getTheme() {
    return await this.storageServ.get(STORAGE_KEY_DARK);
  }
}
