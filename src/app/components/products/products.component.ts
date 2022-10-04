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
  limit: number = 10;
  offset: number = 0;

  statusDetail: 'init' | 'error' | 'loading' | 'success' = 'init';

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
    // this.productsService.getAllProducts().subscribe((data) => {
    //   this.products = data;
    // });
    // console.log(
    //   'ngOnInit de ProductsComponent => this.productsService.getAllProducts.suscribe'
    // );

    //Con paginación
    this.productsService.getProductsByPage(10, 0).subscribe((data) => {
      this.products = data;
    });
    console.log(
      'ngOnInit de ProductsComponent => this.productsService.getProductsByPage(10,0).suscribe'
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
    this.statusDetail = 'loading';
    this.productsService.getProduct(id).subscribe(
      (data) => {
        console.log('onShowDetail ', data);
        this.toggleProductDetail();
        this.productChosen = data;
        this.statusDetail = 'success';
      },
      (errorMsg) => {
        // console.error(response.error.message);
        console.error(errorMsg); //acá está manejado por el service
        window.alert(errorMsg);
        this.statusDetail = 'error';
      }
    );
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

  loadMore() {
    this.productsService
      .getProductsByPage(this.limit, this.offset)
      .subscribe((data) => {
        //los voy agregando para no pisar los ya renderizados
        this.products = this.products.concat(data);
        this.offset += this.limit;
      });
  }
}
