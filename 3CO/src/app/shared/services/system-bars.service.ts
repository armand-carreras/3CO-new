import { Injectable } from '@angular/core';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { StatusBar, Style } from '@capacitor/status-bar';

@Injectable({ providedIn: 'root' })
export class SystemBarsService {
  private readonly mql = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    // initial paint
    this.apply(this.mql.matches);

    // live updates when the user changes the system theme
    if (this.mql.addEventListener) {
      this.mql.addEventListener('change', ev => this.apply(ev.matches));
    } else {
      this.mql.addListener(ev => this.apply(ev.matches));
    }
  }

  private async apply(isDark: boolean) {
    const raw = getComputedStyle(document.documentElement)
                  .getPropertyValue('--system-bars-bg')
                  .trim();

    await EdgeToEdge.setBackgroundColor({ color: raw });
    await StatusBar.setStyle({ style: isDark ? Style.Light : Style.Dark });
  }
}
