import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {ProductModelServer, ServerResponse} from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private api_url = environment.api_url;

  constructor(private http: HttpClient) {
  }

  /* Fetch all products from the server */
  getAllProducts(numberOfItems: number = 10) : Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.api_url + 'products', {
      params: {
        limit: numberOfItems.toString()
      }
    });
  }


  /* Get single product from server */
  getSingleProduct(productId:number) : Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.api_url + 'products/' + productId);
  }


  /* Get products from single category */
  getProductsFromCategory(categoryName: string) : Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.api_url + 'products/catgeory' + categoryName);
  }

}
