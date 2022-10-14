import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';

import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from './../models/product.model';

import { environment } from '../../environments/environment';

import { checkTime } from '../interceptors/time.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  //Usamos la variable en entorno, si es desarrollo viene vacía, sino apunta a la de producción
  private apiUrl = `${environment.API_URL}/api/products`;

  //Cambiamos al apiURL puenteada en el PROXY por tema de CORS
  // private apiUrl = '/api/products';
  // private apiUrl = 'https://young-sands-07814.herokuapp.com/api/products';
  //Para abrir el Swagger --> https://young-sands-07814.herokuapp.com/docs/#/

  constructor(private http: HttpClient) {}

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', limit);
    }
    return this.http
      .get<Product[]>(this.apiUrl, { params, context: checkTime() })
      .pipe(
        retry(3),
        map((products) =>
          products.map((item) => {
            return {
              ...item,
              taxes: 0.19 * item.price,
            };
          })
        )
      );
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError('Algo está fallando en el server, error 500');
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError('El producto no existe, error 404');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError('No estás autorizado, error 401');
        }
        return throwError('Ups algo salió mal');
      })
    );
  }

  // create(data: Product) {
  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  //normalmente la edición funciona como un get
  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    //No todas las APIs te respndenden con el objeto Product, algunas sólo responden con boolean como esta API
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  //Para técnica de paginación
  //limit --> cantidad registros a traer de API
  //offset --> cuantos quiero escapar desde la posición cero
  getProductsByPage(limit: number, offset: number) {
    return this.http
      .get<Product[]>(`${this.apiUrl}`, {
        params: { limit, offset },
      })
      .pipe(retry(3));
  }

  fetchAndUpdate(id: string, dto: UpdateProductDTO) {
    //Para hacerlo con Promese.all() usamos zip de rxjs, acá no hay dependencia, queremos correr todo en paralelo.
    //la posición del array que se crea es el orden de la respuesta en el observable
    return zip(this.getProduct(id), this.update(id, dto));
  }
}
