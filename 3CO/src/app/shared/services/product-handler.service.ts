import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, Review } from '../models/product';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductHandlerService {

  private productList: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor(private storage: StorageService) { }

  get getProducts() {
    return this.productList.getValue();
  }

  public async loadProducts() {
    const products = await this.storage.getStoredProducts();
    console.log('------- product-handler - products: ', products);
    if(products) this.productList.next(products);
  }
  
  public async addNewProduct(product: Product) {
    const products = this.getProducts;
    products.push(product);
    await this.storage.setProductToStore(product);
    this.productList.next(products);
  }

  public async addProductReview(prodId: string, productReview: Review) {

    await this.storage.addReviewToProduct(prodId, productReview);
    // Update the BehaviorSubject with the modified product list
    const updatedProducts = this.getProducts.map(product => {
      if (product.id === prodId) {
        return {
          ...product,
          reviews: [...(product.reviews || []), productReview]
        };
      }
      return product;
    });
    this.productList.next(updatedProducts);
  }

  private fetchProducts() {
    //ToDo fetch products from API
    //ToDo add result to productList
  }

  private pushNewProduct() {
    //ToDo POST new product to the API
    //ToDo Fetch ALL products now
  }

}
