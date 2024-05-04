import {Component, OnInit} from '@angular/core';
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CurrencyPipe} from "@angular/common";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
  product!: Product;

  constructor(private productService: ProductService,
              private cartService:CartService,
              private router: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.router.paramMap.subscribe(() =>{
      this.handleProductDetails()
    })
  }

  private handleProductDetails() {
    // get the id param string convert to number using + symbol
    const theProductId: number = +this.router.snapshot.paramMap.get('id')!;
    this.productService.getProduct(theProductId).subscribe(data => {
      this.product = data
    })

  }

  addToCart() {
      console.log(`Adding to cart ${this.product.name}, ${this.product.unitPrice}`)
    const theCartItem = new CartItem(this.product);
      this.cartService.addToCart(theCartItem);
  }
}
