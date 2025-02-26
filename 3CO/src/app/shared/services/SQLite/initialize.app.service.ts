import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { LabelSQLiteHandlerService } from './label-sqlite-handler.service';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root'
})
export class InitializeAppService {

    isAppInit: boolean = false;
    platform!: string;

    constructor(
        private sqliteService: SQLiteService,
        private storageService: LabelSQLiteHandlerService,
        ) {

    }

    async initializeApp() {
        await this.sqliteService.initializePlugin().then(async (ret) => {
            this.platform = this.sqliteService.platform;
            try {
                const DB = 'ecodatabase.db'
                if( this.sqliteService.platform === 'web') {
                    await this.sqliteService.initWebStore();
                    await this.storageService.initializeDatabase(DB);
                    await this.sqliteService.saveToStore(DB);
                } else {
                    await this.storageService.initializeDatabase(DB);
                }
                
                this.isAppInit = true;

            } catch (error) {
                console.log(`initializeAppError: ${error}`);
                await Toast.show({
                text: `initializeAppError: ${error}`,
                duration: 'long'
                });
            }
        });
    }
}
