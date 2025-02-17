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
  private randomLabel: BehaviorSubject<Label[]> = new BehaviorSubject<Label[]>([]);
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


    get featuredLabel() {
      return this.randomLabel.getValue();
    }
    // Labels Observable
    get allLabels(): Label[] {
        return this.allList.getValue();
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
    
    

  async loadAll() {
    const results = (await this.db.query('SELECT * FROM labelsBase64')).values;
    const labels = results ? await this.parseLabels(results) : [];
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
  }
  async deleteUserById(id: string) {
      const sql = `DELETE FROM users WHERE id=${id}`;
      await this.db.run(sql);
  }

  async getImageById(id: number) {
    const query = `SELECT LOGO FROM labelsBase64 WHERE ID = ${id}`;
    const result =  ( await this.db.query(query) ).values;
    if (result && result?.length > 0) {
      console.log('retrieved Image: ', result);
      return `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(result[0])))}`;
    }
    return null;
  }

    async getFromNameString(name: string) {
      const query = `SELECT * 
        FROM "labelsBase64" d 
        WHERE "NAME" LIKE "%${name}%" OR "KEY WORDS" LIKE "%${name}%";
      `;
      const results = ( await this.db.query(query) ).values;
      const labels = results ? this.parseLabels(results) : [];
      return labels;
    }

    async getFromNamesArray(names: string[]) {
      // Build the query with multiple LIKE conditions for "NAME" only
      const conditions = names.map(() => `"NAME" LIKE ?`).join(' OR ');
  
      // Construct the final query
      const query = `SELECT * FROM "labelsBase64" WHERE ${conditions}`;
  
      // Prepare parameters: each name needs one entry in the array (for NAME)
      const params = names.map(name => `%${name}%`);
  
      // Execute the query
      const results = (await this.db.query(query, params)).values;
  
      // Parse the results
      const labels = results ? this.parseLabels(results) : [];
      return labels;
  }
  
  
  


    private async getRandomLabel() {
      const query = `SELECT * FROM "labelsBase64" d ORDER BY random() LIMIT 1;`;
      console.log('QUERY;', query);
      const results = ( await this.db?.query(query) )?.values;
      const labels = results ? await this.parseLabels(results) : [];
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
      if (selectedShapes?.length > 0) {
        let shapeConditions = selectedShapes.map(shape => `"SHAPE" LIKE '%${shape}%'`).join(' OR ');
        conditions.push(`(${shapeConditions})`);
      }

      // Add color conditions if any colors are selected
      if (selectedColours?.length > 0) {
        let colorConditions = selectedColours.map(color => `"MAIN COLOR" LIKE '%${color}%'`).join(' OR ');
        conditions.push(`(${colorConditions})`);
      }

      // Add category conditions if any categories are selected
      if (selectedCategories?.length > 0) {
        let categoryConditions = selectedCategories.map(category => `"CATEGORY" LIKE '%${category}%'`).join(' OR ');
        conditions.push(`(${categoryConditions})`);
      }

      // Construct the final query
      let sqlQuery = `
        SELECT * 
        FROM "labelsBase64" d 
        WHERE ${conditions.join(' AND ')};
      `;

      return sqlQuery;
    }


    private async parseLabels(results: any[]): Promise<Label[]> {
      const labels = await Promise.all(results?.map(async (res) => {
        const base64Data = res['LOGO'];
        //const base64Logo = logoBlob ? await this.byteArrayToBase64(logoBlob) : 'assets/databases/No_Image_Available.jpg';
        const base64Logo = `data:image/*;base64,${base64Data}`;
        // Very good choice,Credibility 3/3,Environment 3/3,Socio-Economic 0/3
        let evaluation = 'N/A;N/A;N/A';
        if(res['Siegelklarheit'] && res['Siegelklarheit'] !== 'Not assessed') {
          const splitedRanking = res['Siegelklarheit'].split('\n');
          evaluation = `${splitedRanking[1].split(' ')[1]};${splitedRanking[2].split(' ')[1]};${splitedRanking[3].split(' ')[1]}`;
        }
        console.log('---------> Evaluation: ', evaluation);
        
        const newLabel: Label = {
          logo: base64Logo,
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
          ranking: evaluation
        };
        return newLabel;
      }));
      return labels;
    }
    
    /* private async byteArrayToBase64(byteArray: number[]): Promise<string> {
      const blob = new Blob([new Uint8Array(byteArray)], { type: 'image/jpeg' });
      return this.blobToBase64(blob);
    }

    // Helper to convert BLOB to base64
    private blobToBase64(blob: Blob): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }); 
    }
    */


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

    this.conn = await this._sqlite.('ecodatabase.db',false );
    if(this.conn) { this.connected=true; }
 
  }


  // Function to copy the SQLite database file
  async getDatabaseFile() {
    const sourcePath = 'assets/3COLabelDatabase/ecodatabase.db'; // Path to your existing SQLite database file

    try {
        return await Filesystem.getUri({path: sourcePath, directory: Directory.Data});
    } catch (error) {
        console.error('Error getting database file uri:', error);
        return -1;
    }
  }

  async getLabels() {
    const sqliteValues = this._sqlite.sqliteConnection..query('SELECT * FROM "labelsBase64" d');
    console.log(sqliteValues.values);
  }


}
 */