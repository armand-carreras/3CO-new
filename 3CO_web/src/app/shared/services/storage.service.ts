import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
  }

  get storageWorking() {
    return this._storage ? true : false;
  }

  async init() {
    
    const storage = await this.storage.create();
    this._storage = storage;
    
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }
  public get(key: string) {
    return this._storage?.get(key);
  }

}

