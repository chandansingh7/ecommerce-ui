import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {CurrencyPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf
  ],
  //templateUrl: './product-list.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit{

  product: Product[] = [];
  constructor(private productService: ProductService) {
  }

  ngOnInit(){
    this.listProducts()
  }

  listProducts(){
    this.productService.getProductList().subscribe(data => {
      this.product = data
    })
  }
}
