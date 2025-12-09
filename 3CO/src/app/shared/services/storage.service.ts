import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Product, Review } from '../models/product';
import { Device } from '@capacitor/device';
import { AvailableLangs } from './i18n-handler.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;
  private readyPromise: Promise<void>;
  private readyResolve: () => void = () => { };

  constructor(private storage: Storage) {
    this.readyPromise = new Promise((resolve) => {
      this.readyResolve = resolve;
    });
  }

  get storageWorking() {
    return this._storage ? true : false;
  }


  public async getPreferredLanguage(): Promise<AvailableLangs> {
    const lang = await this.storage.get('preferredLanguage');
    return lang ?? 'es-GB';
  }

  async init() {

    const storage = await this.storage.create();
    this._storage = storage;
    const isGuestStablished = await this.getGuestID();
    if (!isGuestStablished) {
      await this.storeGuestID();
    }
    this.readyResolve();
  }

  public async ensureReady(): Promise<void> {
    return this.readyPromise;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
  public get(key: string) {
    return this._storage?.get(key);
  }


  public storeToken(token: string) {
    this._storage?.set('token', token);
  }

  public getToken() {
    return this._storage?.get('token');
  }

  public storeKeepMeLoggedIn(keepMeLogged: boolean) {
    this._storage?.set('keepMeLoggedIn', keepMeLogged);
  }
  public getKeepMeLogged() {
    return this._storage?.get('keepMeLoggedIn');
  }

  public async setProductToStore(product: Product) {
    console.log('Setting up new product to store', product);
    const prods = await this.getStoredProducts();
    this._storage?.set('products', [...(prods || []), product]);
  }

  public getStoredProducts() {
    return this._storage?.get('products');
  }

  public async addReviewToProduct(prodId: string, review: Review): Promise<void> {
    const products = await this._storage?.get('products') as Product[];
    if (products) {
      // Find the product by ID
      const productIndex = products.findIndex(p => p.id === prodId);
      if (productIndex !== -1) {
        // Add the review to the product's reviews array
        const product = products[productIndex];
        if (!product.reviews) {
          product.reviews = []; // Initialize reviews array if it doesn't exist
        }
        product.reviews.push(review);

        // Save the updated products array back into storage
        await this._storage?.set('products', products);
        console.log(`Review added to product with ID: ${prodId}`);
      } else {
        console.warn(`Product with ID ${prodId} not found.`);
      }
    } else {
      console.warn('No products found in storage.');
    }
  }




  public async getGuestID() {
    const guestID = await this._storage?.get(userKeys.guestID);
    return guestID;
  }

  public async isGuestInServer() {
    const guestID = await this._storage?.get(userKeys.guestInServer);
    return guestID;
  }

  public async setGuestInServer() {
    this._storage?.set(userKeys.guestInServer, true);
  }

  //Generate and store GuestID
  public async storeGuestID() {
    const id = await this.generateGuestID();
    await this._storage?.set(userKeys.guestID, id);
  }

  private async generateGuestID() {
    const deviceId = await Device.getId();
    return 'Guest' + deviceId.identifier;

  }

}


const userKeys = {
  name: 'userName',
  scans: 'userScans',
  rewards: 'userRewards',
  products: 'product',
  guestInServer: 'guestStablished',
  guestRegistered: 'guestRegistered',
  guestID: 'guestID',
}