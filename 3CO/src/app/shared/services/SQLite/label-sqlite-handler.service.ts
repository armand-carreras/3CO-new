import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { SQLiteService } from './sqlite.service';
import { Platform } from '@ionic/angular';

const DB_LABELS = 'assets/3COLabelDatabase/chinool.db';

@Injectable({
  providedIn: 'root'
})
export class LabelSQLiteHandlerService {


  private initPlugin!: boolean;
  private conn!: SQLiteDBConnection;
  private connected = false;


  constructor(private _sqlite: SQLiteService,
    private platform: Platform,
    ) { }


  get isConnected(): boolean {
    return this.connected;
  }

  get dbConnection(): SQLiteDBConnection {
    return this.conn;
  }

  async initializeApp() {
    await this.platform.ready().then(async () => {
      await this._sqlite.initializePlugin().then(async ret => {
        this.initPlugin = ret;
        console.log('>>>> in App  this.initPlugin ' + this.initPlugin);
        await this.connectToDBFile();
      });
    });
    await this._sqlite.initWebStore();
  }

  async connectToDBFile() {

    this.conn = await this._sqlite.retrieveConnection('ecolabel',false );
    if(this.conn) { this.connected=true; }
 
  }


  // Function to copy the SQLite database file
  async getDatabaseFile() {
    const sourcePath = 'assets/3COLabelDatabase/ecolabel.db'; // Path to your existing SQLite database file

    try {
        return await Filesystem.getUri({path: sourcePath, directory: Directory.Data});
    } catch (error) {
        console.error('Error getting database file uri:', error);
        return -1;
    }
  }

  async getLabels() {
    const sqliteValues = this._sqlite.sqliteConnection..query('SELECT * FROM "data" d');
    console.log(sqliteValues.values);
  }


}
