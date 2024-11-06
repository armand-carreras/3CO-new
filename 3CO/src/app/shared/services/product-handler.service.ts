import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductHandlerService {

  private productList: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor() { }

  get getProducts() {
    return this.productList.getValue();
  }
  
  public addNewProduct(product: Product) {
    const products = this.getProducts;
    products.push(product);
    this.productList.next(products);
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
