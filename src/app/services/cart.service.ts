import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantiy: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    // check if we alreade have the item in the cart

    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {

      //for (let tempCartItem of this.cartItems) {
      //  if (tempCartItem.id === theCartItem.id) {
            //       existingCartItem = tempCartItem;
          //break;
        //}
      //}

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  } 
  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantiyValue: number = 0;

    for (let currentCarItem of this.cartItems) {

      totalPriceValue += currentCarItem.quantity * currentCarItem.unitPrice;
      totalQuantiyValue += currentCarItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantiy.next(totalQuantiyValue);

    this.logCartData(totalPriceValue, totalQuantiyValue);
  }
  logCartData(totalPriceValue: number, totalQuantiyValue: number) {
    
    console.log("Contents of the Cart");
    for (let tempCartItem of this.cartItems ){
      const sunTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;

      console.log(`name :${tempCartItem.name} , quantity:${tempCartItem.quantity},
       unitPrice:${tempCartItem.unitPrice}, sunTotalPrice:${sunTotalPrice}`);
       console.log(`totalPrice :${totalPriceValue.toFixed(2)} , totalQuantiy:${totalQuantiyValue}`);
       console.log('----');
    }
  }

  decrementQuantity(theCartItem: CartItem) {

    theCartItem.quantity --;
    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    
    const itemIndex =this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }
}
