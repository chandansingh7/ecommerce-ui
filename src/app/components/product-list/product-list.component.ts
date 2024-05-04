import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    NgIf,
    RouterLink,
    NgbPagination
  ],
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  product: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string = "";
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElement: number = 0;

  previousKeyword: string = "";

  constructor(private productService: ProductService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts()
    })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts()
    }

  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //when keyword different from previous one than setPageNumber to 1
    if (this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber${this.thePageNumber}`)

    //now search for the product using keyword
    this.productService.searchProductsPaginate(this.thePageNumber-1,
      this.thePageSize,theKeyword).subscribe(this.processResult())


  }

  handleListProducts() {
    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')

    if (hasCategoryId) {
      //get the id from param and convert to number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      //not category id available default category id to 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    //check if we have a different category than previous one
    //angular will reuse a component if it is currently being viewed
    //if we have different category id then set the page number back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1
    }
    this.previousCategoryId = this.currentCategoryId
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)
    //get the products with category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(data => {
      this.product = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElement = data.page.totalElements;
    })
  }

  updatePageSize(value: string) {
    this.thePageSize = +value;
    this.thePageNumber =1;
    this.listProducts();
  }

  private processResult() {
    return(data:any) => {
      this.product = data._embedded.products;
      this.thePageNumber = data.page.number+1;
      this.thePageSize = data.page.size;
      this.theTotalElement = data.page.totalElements;
    }
  }


  // addToCart(tempProducts: Product) {
  //
  // }
}
