import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, tap, throwError } from 'rxjs';
import { Product, ProductPost, Review } from '../models/product';
import { StorageService } from './storage.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductHandlerService {

  private productList: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor(
    private storage: StorageService,
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService
  ) { }

  get getProducts() {
    return this.productList.getValue();
  }



  public cleanList() {
    this.productList.next([]);
  }




  public async loadProducts() {
    try {
      const products = await this.fetchProducts();
      this.productList.next(products.products);
    } catch (error) {
      throwError(()=>new Error('Error loading products'));
    }
  }



  public loadReviewsForProduct(product: string, page?: number, per_page?: number) {
    return this.fetchReviews(product, page, per_page);
  }



  public async addNewProduct(product: ProductPost) {
    await this.pushNewProduct(product);
  }



  public async addProductReview(prodId: number, productReview: Review) {
    await this.pushNewReview(prodId, productReview);
  }





  
  /**
   * The function `fetchProducts` asynchronously fetches products from an API, handles different HTTP
   * error statuses, and returns the response.
   * @returns The `fetchProducts` function is returning the response from the HTTP GET request made to
   * fetch products from an API.
   */
  private async fetchProducts() {
    //ToDo fetch products from API
    //ToDo add result to productList
    const response = await firstValueFrom(
      this.http.get<productGET>(`${environment.paths.base_api}${environment.paths.products}?per_page=150`).pipe(
        tap((res) => {
          console.log(res);
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.toastService.presentAutoDismissToast('Unauthorized access. Please log in again.', 'danger');
          } else if (error.status === 500) {
            this.toastService.presentAutoDismissToast('Internal server error. Please try again later.', 'danger');
          } else {
            this.toastService.presentAutoDismissToast('An unexpected error occurred.', 'danger');
          }
          // Re-throw the error so it can still be handled by other parts of the code, if necessary.
          return throwError(() => new Error(error.error.message));
        })
      )
    );
    return response;
  }




 /**
  * The function `fetchReviews` asynchronously fetches reviews for a specific product from an API,
  * handling potential errors and returning the response.
  * @param {string} productID - The `productID` parameter is a string that represents the unique
  * identifier of the product for which you want to fetch reviews.
  * @param {number} [page=1] - By default, it is set to 1, meaning that if no page number is provided
  * when calling the function, it will fetch the reviews from the first page.
  * @param {number} [per_page=10] - By default, it is set to 10, meaning that the
  * function will fetch 10 reviews per page unless a different value is provided when calling the
  * function.
  * @returns The `fetchReviews` function is returning a Promise that resolves to the response from the
  * HTTP GET request made to the API endpoint for fetching reviews of a specific product. The response
  * is of type `reviewGET`, which is the expected data structure for reviews.
  */
  private async fetchReviews(productID: string, page: number = 1, per_page: number = 10) {
    if(page*per_page) {

    }
    const response = await firstValueFrom(
      this.http.get<reviewGET>(`${environment.paths.base_api}${environment.paths.reviews}/${productID}?page=${page}`).pipe(
        tap((res) => {
          console.log('requesting reviews: ',res);
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.toastService.presentAutoDismissToast('Unauthorized access. Please log in again.', 'danger');
          } else if (error.status === 500) {
            this.toastService.presentAutoDismissToast('Internal server error. Please try again later.', 'danger');
          } else {
            this.toastService.presentAutoDismissToast('An unexpected error occurred.', 'danger');
          }
          // Re-throw the error so it can still be handled by other parts of the code, if necessary.
          return throwError(() => new Error(error.error.message));
        })
      )
    );
    return response;
  }




  /**
   * The function `pushNewProduct` asynchronously sends a POST request to add a new product with proper
   * authorization handling and error messages.
   * @param {ProductPost} product - The `pushNewProduct` function is an asynchronous method that sends
   * a POST request to add a new product to the server. Here's a breakdown of the function:
   */
  private async pushNewProduct(product: ProductPost) {
    const token = await this.storage.getToken();
    if(token && token !== '') {
      const heads: HttpHeaders = new HttpHeaders()
        .append('Content-type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
      await firstValueFrom(
        this.http.post(
          `${environment.paths.base_api}${environment.paths.products}`,
          JSON.stringify(product),
          {headers: heads}
        ).pipe(
          tap((res) => {
            console.log(res);
            this.toastService.presentAutoDismissToast('New product added', 'success');
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.toastService.presentAutoDismissToast('Unauthorized access. Please log in again.', 'danger');
            } else if (error.status === 500) {
              this.toastService.presentAutoDismissToast('Internal server error. Please try again later.', 'danger');
            } else {
              this.toastService.presentAutoDismissToast('An unexpected error occurred.', 'danger');
            }
            // Re-throw the error so it can still be handled by other parts of the code, if necessary.
            return throwError(() => new Error(error.error.message));
          })
        )
      );
    }
  }




  /**
   * The `pushNewReview` function asynchronously sends a new review for a product to the server with
   * proper error handling and toast notifications.
   * @param {number} productID - The `productID` parameter in the `pushNewReview` function represents
   * the unique identifier of the product for which the review is being added. It is used to specify
   * the endpoint to which the review will be posted in the API.
   * @param {Review} review - The `review` parameter in the `pushNewReview` function is an object that
   * represents a review for a product. It likely contains properties such as `title`, `rating`,
   * `description`, `author`, `date`, etc., depending on the structure of your `Review` interface or
   * class.
   */
  private async pushNewReview(productID: number, review: Review) {
    const token = await this.storage.getToken();
    if(token && token !== '') {
      const heads: HttpHeaders = new HttpHeaders()
        .append('Content-type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
      await firstValueFrom(
        this.http.post(
          `${environment.paths.base_api}${environment.paths.reviews}/${productID}`,
          JSON.stringify(review),
          {headers: heads}
        ).pipe(
          tap((res) => {
            console.log(res);
            this.toastService.presentAutoDismissToast('New review added', 'success');
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.toastService.presentAutoDismissToast('Unauthorized access. Please log in again.', 'danger');
            } else if (error.status === 500) {
              this.toastService.presentAutoDismissToast('Internal server error. Please try again later.', 'danger');
            } else {
              this.toastService.presentAutoDismissToast('An unexpected error occurred.', 'danger');
            }
            // Re-throw the error so it can still be handled by other parts of the code, if necessary.
            return throwError(() => new Error(error.error.message));
          })
        )
      );
    }
  }



}




interface productGET {
  page: number;
  pages: number;
  per_page: number;
  products: Product[];
  total: number;
}

interface reviewGET {
  page: number;
  pages: number;
  per_page: number;
  reviews: Review[];
  total: number;
}