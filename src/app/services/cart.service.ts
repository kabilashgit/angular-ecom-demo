import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductService} from './product.service';
import {OrderService} from './order.service';
import {environment} from '../../environments/environment';
import {CartModelPublic, CartModelApp} from '../model/cart.model';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {ProductModelServer} from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private api_url = environment.api_url;

  /* Data variable to store the cart information in the clients browser localstorage  */
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
      id: 0,
      inCart: 0
    }]
  };

  /* Data variable to store the cart information in the App */
  private cartDataApp: CartModelApp = {
    total: 0,
    data: [{
      numInCart: 0,
      product: undefined
    }]
  };

  /* Observables for the components to subscribe */
  cartTotalObs$ = new BehaviorSubject<number>(0);
  cartDataObs$ = new BehaviorSubject<CartModelApp>(this.cartDataApp);

  constructor(private http: HttpClient,
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router) {

    this.cartTotalObs$.next(this.cartDataApp.total);
    this.cartDataObs$.next(this.cartDataApp);

    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    /* Check if the info variable is null or has some data on it */

    if (info !== null && info !== undefined && info.prodData[0].inCart !== 0) {

      //  Localstorage is not empty
      this.cartDataClient = info;

      //  Loop through each entry and put it in the cartDataApp object

      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
          if(this.cartDataApp.data[0].numInCart === 0) {
            this.cartDataApp.data[0].numInCart = p.inCart;
            this.cartDataApp.data[0].product = actualProductInfo;
          //  TODO: create calculation function
            this.cartDataClient.total = this.cartDataApp.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
          //  CartDataApp already has some entry on it
            this.cartDataApp.data.push({
              numInCart: p.inCart,
              product: actualProductInfo
            });
          //  TODO: create calculation function
            this.cartDataClient.total = this.cartDataApp.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
          }
          this.cartDataObs$.next({...this.cartDataApp});
        });
      });
    }


  }
}
