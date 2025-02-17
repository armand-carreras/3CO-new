import { CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StorageService } from './shared/services/storage.service';
import { ThemeService } from './shared/services/theme.service';
import { SQLiteService } from './shared/services/SQLite/sqlite.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideHttpClient} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StorageService,
    ThemeService,
    SQLiteService,
    provideHttpClient(),
    { 
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {

}
