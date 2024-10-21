import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable} from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { DbnameVersionService } from './dbname-version.service';
import { BehaviorSubject, Observable } from 'rxjs';
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
    private randomLabel: BehaviorSubject<Label[]> = new BehaviorSubject([] as Label[]);

    constructor(private sqliteService: SQLiteService,
                private dbVerService: DbnameVersionService) {
        this.versionUpgrades = this.uUpdStmts.userUpgrades;
        this.loadToVersion = this.versionUpgrades[this.versionUpgrades.length-1].toVersion;
    }


    get featuredLabel() {
      return this.randomLabel.value;
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
        await this.getRandomLabel();
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
      const results = (await this.db.query('SELECT * FROM "data"')).values;
      const labels = results ? this.parseLabels(results) : [];
      console.log('------------- Parsed Labels: ', JSON.stringify(labels));
      this.allList.next(labels);
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

    async getFromNameString(name: string) {
      const query = `SELECT * 
        FROM "data" d 
        WHERE "NAME" LIKE "%${name}%" OR "KEY WORDS" LIKE "%${name}%";
      `;
      const results = ( await this.db.query(query) ).values;
      const labels = results ? this.parseLabels(results) : [];
      return labels;
    }
    private async getRandomLabel() {
      const query = `SELECT * FROM "data" d ORDER BY random() LIMIT 1;`;
      console.log('QUERY;', query);
      const results = ( await this.db?.query(query) )?.values;
      console.log('results:',results);
      const labels = results ? this.parseLabels(results) : [];
      console.log('labels: ',labels);
      this.randomLabel.next(labels);
    }

    async getFilteredLabels(selectedShapes: string[], selectedColours: string[], selectedCategories: string[]) {
      const query = this.generateSQLQuery(selectedShapes, selectedColours, selectedCategories);
      const results = ( await this.db.query(query) ).values;
      const labels = results ? this.parseLabels(results) : [];
      return labels;
    }

    private generateSQLQuery(selectedShapes: string[], selectedColours: string[], selectedCategories: string[]): string {
      let conditions = [];

      // Add shape conditions if any shapes are selected
      if (selectedShapes.length > 0) {
        let shapeConditions = selectedShapes.map(shape => `"SHAPE" LIKE '%${shape}%'`).join(' OR ');
        conditions.push(`(${shapeConditions})`);
      }

      // Add color conditions if any colors are selected
      if (selectedColours.length > 0) {
        let colorConditions = selectedColours.map(color => `"MAIN COLOR" LIKE '%${color}%'`).join(' OR ');
        conditions.push(`(${colorConditions})`);
      }

      // Add category conditions if any categories are selected
      if (selectedCategories.length > 0) {
        let categoryConditions = selectedCategories.map(category => `"CATEGORY" LIKE '%${category}%'`).join(' OR ');
        conditions.push(`(${categoryConditions})`);
      }

      // Construct the final query
      let sqlQuery = `
        SELECT * 
        FROM "data" d 
        WHERE ${conditions.join(' AND ')};
      `;

      return sqlQuery;
    }


    private parseLabels(results: any[]) {
      return results?.map<Label>(res=> {
        const newLabel: Label = {
          logo: res['LOGO'],
          name: res['NAME'],
          establishmentYear: res['YEAR OF EST.'],
          description: res['DESCRIPTION'],
          shortDescription: res['USER-FRIENDLY DESCRIPTION'],
          category: res['CATEGORY'],
          subCategory: res['SUB-CATEGORY'],
          country: res['COUNTRY'],
          keywords: res['KEY WORDS'],
          mainColor: res['MAIN COLOR'],
          shape: res['SHAPE'],
          conformityAssesment: res['CONFORMITY ASSESSMENT'],
          managingOrganization: res['MANAGING ORGANIZATION'],
          website: res['WEBSITE'],
          ranking: `${res['Startseite – Siegelklarheit']};${res['https://label-online.de/ ']};${res['https://www.commonshare.com/ratings/standard-owners-benchmark']}`
        }
        return newLabel;
      });
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