import { Component, OnInit } from '@angular/core';

import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: { id: '', name: '' },
    description: '',
  };
  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
    console.log(
      'constructor de ProductsComponent => this.myShoppingCart = this.storeService.getShoppingCart();'
    );
  }

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe((data) => {
      this.products = data;
    });
    console.log(
      'ngOnInit de ProductsComponent => this.productsService.getAllProducts.suscribe'
    );
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
    console.log('onAddToShoppingCart de ProductsComponent');
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.productsService.getProduct(id).subscribe((data) => {
      console.log('onShowDetail ', data);
      this.toggleProductDetail();
      this.productChosen = data;
    });
  }

  createNewProduct() {
    // const product: Product= {
    const product: CreateProductDTO = {
      title: 'New Product',
      description: 'bla bla bla',
      images: [`https:placeimg.com/640/480/any?random=${Math.random()}`],
      price: 1000,
      categoryId: 2,
    };
    this.productsService.create(product).subscribe((data) => {
      console.log('created -> ', data);
      //hay que agregarlo a la vista
      this.products.unshift(data);
    });
  }

  updateProduct() {
    const changes: UpdateProductDTO = { title: 'Nuevo Tílulo más copado' };
    const id = this.productChosen.id;
    this.productsService.update(id, changes).subscribe((data) => {
      console.log('updated producto', data);
      const productIndex = this.products.findIndex(
        (item) => item.id === this.productChosen.id
      );
      this.products[productIndex] = data;
    });
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id).subscribe(() => {
      console.log(`deleted product ${id}`);
      //Hay que actualizar el renderizado de la vista
      const productIndex = this.products.findIndex(
        (item) => item.id === this.productChosen.id
      );
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    });
  }
}
