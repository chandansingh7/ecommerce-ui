import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {
  }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean;
    let existingCartItem: CartItem | undefined;
    if (this.cartItems.length > 0) {
      //find the item in the cart based on item id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)
    }
    //check if we found it
    alreadyExistsInCart = (existingCartItem != undefined)
    if (alreadyExistsInCart) {
      //increment the quantity
      existingCartItem!.quantity++;
    } else {
      //add item to array
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals()
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
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
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`)
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('-------')
  }

  decrementQuantity(tempCartItems: CartItem) {
    tempCartItems.quantity--;
    if(tempCartItems.quantity === 0){
      this.remove(tempCartItems);
    }else {
      this.computeCartTotals();
    }
  }

  remove(tempCartItems: CartItem) {


    //get index of items in the array
    const itemIndex = this.cartItems.findIndex(tempCartItems1 => tempCartItems1.id === tempCartItems.id);

    //if found, remove the item from the array at the index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
