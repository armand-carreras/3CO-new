import { Injectable } from '@angular/core';
import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite.mjs';
import * as SQLite from 'wa-sqlite';

@Injectable()

export class SQLiteService {
    private sqlite3: any;
  private db: any;

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    // Wait for the SQLite Emscripten module to be ready.
    const module = await SQLiteESMFactory();

    // Use the module to build the SQLite API instance.
    this.sqlite3 = SQLite.Factory(module);

    // Open the database asynchronously.
    try {
      this.db = await this.sqlite3.open_v2('assets/databases/ecodatabase.db');
      console.log('Database opened successfully!');
    } catch (error) {
      console.error('Failed to open database:', error);
    }
  }

  public async queryDatabase(query: string, params: any[] = []) {
    try {
      // Create a statement using the query
      const stmt = await this.db.prepare(query);

      // Bind parameters to the statement if necessary
      params.forEach((param, index) => {
        stmt.bind(index + 1, param);
      });

      // Execute the statement and get the result
      const result = await stmt.step();
      let rows: any = [];

      // Extract rows from the result
      for (let i = 0; i < result.length; i++) {
        rows.push(result.row(i));  // Assuming each row is an object
      }

      // Finalize the statement to release resources
      await stmt.finalize();
      
      return rows;
    } catch (error) {
      console.error('Query failed:', error);
      throw error;
    }
  }

  public async closeDatabase() {
    try {
      await this.sqlite3.close(this.db);
      console.log('Database closed successfully!');
    } catch (error) {
      console.error('Failed to close database:', error);
    }
  }

}