import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable} from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { DbnameVersionService } from './dbname-version.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user';
import { UserUpgradeStatements } from './user.upgrade.statements';
import { Label } from '../../models/label';

@Injectable({
  providedIn: 'root'
})

export class LabelSQLiteHandlerService {
    public allList: BehaviorSubject<Label[]> =
                                new BehaviorSubject<Label[]>([]);
    private databaseName: string = "";
    private uUpdStmts: UserUpgradeStatements = new UserUpgradeStatements();
    private versionUpgrades;
    private loadToVersion;
    private db!: SQLiteDBConnection;
    private isAllReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private sqliteService: SQLiteService,
                private dbVerService: DbnameVersionService) {
        this.versionUpgrades = this.uUpdStmts.userUpgrades;
        this.loadToVersion = this.versionUpgrades[this.versionUpgrades.length-1].toVersion;
    }
    async initializeDatabase(dbName: string) {
        this.databaseName = dbName;
        // create upgrade statements
       /*  await this.sqliteService
        .addUpgradeStatement({  database: this.databaseName,
                                upgrade: this.versionUpgrades}); */
        // create and/or open the database
        this.db = await this.sqliteService.openDatabase(
                                            this.databaseName,
                                            false,
                                            'no-encryption',
                                            this.loadToVersion,
                                            false
        );
        this.dbVerService.set(this.databaseName,this.loadToVersion);
        await this.getAll();
    }
    
    // Is Labels Get already done?
    allState() {
        return this.isAllReady.asObservable();
    }
    
    // Labels Observable
    fetchAll(): Observable<Label[]> {
        return this.allList.asObservable();
    }

    //Query all Data
    async loadAll() {
      const results = (await this.db.query('SELECT * FROM "data"')).values as Label[];
      this.allList.next(results);
    }

    // CRUD Operations
    async getAll() {
        await this.loadAll();
        this.isAllReady.next(true);
    }

    async updateUserById(id: string, active: number) {
        const sql = `UPDATE users SET active=${active} WHERE id=${id}`;
        await this.db.run(sql);
        await this.getAll();
    }
    async deleteUserById(id: string) {
        const sql = `DELETE FROM users WHERE id=${id}`;
        await this.db.run(sql);
        await this.getAll();
    }
}




























  /* private initPlugin!: boolean;
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

    this.conn = await this._sqlite.('ecolabel.db',false );
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
 */