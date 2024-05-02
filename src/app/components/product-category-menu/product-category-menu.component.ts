import {Component, OnInit} from '@angular/core';
import {ProductCategory} from "../../common/product-category";
import {ProductService} from "../../services/product.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-product-category-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgForOf
  ],
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.scss'
})
export class ProductCategoryMenuComponent implements OnInit{
  productCategories: ProductCategory[] =[];

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.listProductCategories();
  }

  private listProductCategories() {
    this.productService.getProductCategories().subscribe(data => {
      this.productCategories = data;
    })
  }
}
