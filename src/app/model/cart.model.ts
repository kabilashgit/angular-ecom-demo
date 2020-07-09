import {ProductModelServer} from './product.model';

export interface CartModelApp {
  total: number;
  data: [{
    product: ProductModelServer,
    numInCart: number
  }]
}

export interface CartModelPublic {
  total: number,
  prodData: [
    {
      id: number,
      inCart: number
    }
  ]
}
