import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from '../models/user';
import { Product, Review } from '../models/product';

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
  

}


const userKeys = {
  name: 'userName',
  scans: 'userScans',
  rewards: 'userRewards',
  products: 'product'
}