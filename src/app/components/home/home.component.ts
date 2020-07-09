import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Router} from '@angular/router';
import {ProductModelServer, ServerResponse} from '../../model/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products:ProductModelServer[];

  constructor(private ProductService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.ProductService.getAllProducts().subscribe((prod:ServerResponse) => {
      this.products = prod.products;
      console.log(this.products)
    })
  }

  gotoThisProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }
}
