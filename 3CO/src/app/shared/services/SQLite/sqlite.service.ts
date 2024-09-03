import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLitePlugin } from '@capacitor-community/sqlite';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class SQLiteService {
    private isInitialized = false;

    constructor(private sqlite: CapacitorSQLitePlugin, private http: HttpClient) {
      this.initializeWeb();
    }
  
    async initializeWeb() {
      if (Capacitor.getPlatform() === 'web') {
        const jeepSqlite = document.querySelector('jeep-sqlite');
        if (jeepSqlite) {
          await customElements.whenDefined('jeep-sqlite');
          this.isInitialized = true;
          console.log('is Initialized');
        } else {
          console.error('jeep-sqlite element not found in DOM');
        }
      } else {
        this.isInitialized = true;
      }
    }
  
    async copyDatabaseFromAssets(): Promise<void> {
      if (this.isInitialized) {
        try {
            await this.sqlite.copyFromAssets({overwrite: false});
            
            const dbList = await this.sqlite.getDatabaseList();
            console.log(dbList.values);
            console.log('Database copied from assets successfully');
        } catch (err) {
            console.error('Error copying database from assets:', err);
        }
      } else {
        console.error('SQLite service is not initialized.');
      }
    }
  
    async openDatabase(dbName: string) {
      if (!this.isInitialized) {
        console.error('SQLite service is not initialized.');
        return null;
      }
  
      try {
        const db = await this.sqlite.createConnection({
          database: dbName,
          version: 1,
          encrypted: false,
          mode: 'no-encryption',
          readonly: false
        });
  
        await db.open();
        console.log(`Database ${dbName} opened successfully`);
        return db;
      } catch (err) {
        console.error(`Failed to open database ${dbName}:`, err);
        return null;
      }
    }
  
    async closeDatabase(dbName: string) {
      try {
        await this.sqlite.closeConnection({ database: dbName });
        console.log(`Database ${dbName} closed successfully`);
      } catch (err) {
        console.error(`Failed to close database ${dbName}:`, err);
      }
    }

}