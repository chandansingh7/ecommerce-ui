import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItem: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() { }
  addToCart(theCartItem: CartItem){
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean;
    let existingCartItem: CartItem | undefined;
    if(this.cartItem.length > 0){
    //find the item in the cart based on item id
      existingCartItem = this.cartItem.find(tempCartItem => tempCartItem.id === theCartItem.id)
    }
    //check if we found it
    alreadyExistsInCart = (existingCartItem != undefined)
    if(alreadyExistsInCart){
      //increment the quantity
      existingCartItem!.quantity++;
    }else {
      //add item to array
      this.cartItem.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals()
  }

  private computeCartTotals() {
    let totalPriceValue :number = 0;
    let totalQuantityValue: number = 0 ;
    for (let currentCartItem of this.cartItem) {
      totalPriceValue += currentCartItem.quantity* currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new value ... all subscriber will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue)
  }


  private logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("content of the cart")
    for(let tempCartItem of this.cartItem){
      const subTotalPrice = tempCartItem.quantity*tempCartItem.unitPrice;
      console.log(`name ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`)
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('-------')
  }
}
