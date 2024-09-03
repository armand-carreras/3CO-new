import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { Capacitor } from '@capacitor/core';

import { defineCustomElements as pwaElements} from '@ionic/pwa-elements/loader';
import { defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';
// Call the element loader before the bootstrapModule/bootstrapApplication call


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// --> Below only required if you want to use a web platform
const platform = Capacitor.getPlatform();
if(platform === "web") {
    // Web platform
    // required for toast component in Browser
    pwaElements(window);

    // required for jeep-sqlite Stencil component
    // to use a SQLite database in Browser
    jeepSqlite(window);

    window.addEventListener('DOMContentLoaded', async () => {
        const jeepEl = document.createElement("jeep-sqlite");
        document.body.appendChild(jeepEl);
        await customElements.whenDefined('jeep-sqlite');
        jeepEl.autoSave = true;

    });
}