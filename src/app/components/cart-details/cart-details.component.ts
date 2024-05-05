import {Component, OnInit} from '@angular/core';
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [
    NgForOf,
    CurrencyPipe,
    NgIf,
    RouterLink
  ],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.scss'
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.listCartDetails();
  }

  private listCartDetails() {
    //get a  handle to the cart items
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart totalPrice and totalQuantity
    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data;
    })
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    })
    //compute cart total price and quantity
    this.cartService.computeCartTotals();
  }

  incrementQuantity(tempCartItems: CartItem) {
    this.cartService.addToCart(tempCartItems);

  }

  decrementQuantity(tempCartItems: CartItem) {
    this.cartService.decrementQuantity(tempCartItems);
  }

  remove(tempCartItems1: CartItem) {
    this.cartService.remove(tempCartItems1)
  }
}
